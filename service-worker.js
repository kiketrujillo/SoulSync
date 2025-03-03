// This file should be provided to the frontend for offline capability
// public/service-worker.js

const CACHE_NAME = 'soulsync-cache-v1';
const API_CACHE_NAME = 'soulsync-api-cache-v1';

// Assets to cache immediately on service worker install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.js', // Update with actual bundle names
  '/static/css/main.css',
  '/static/media/logo.svg',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html' // Fallback page when offline
];

// API routes to cache as they're accessed
const API_ROUTES = [
  '/api/content/tarot/cards',
  '/api/content/rituals',
  '/api/astro/transits'
];

// Routes that should be synced later (not served from cache)
const SYNC_ROUTES = [
  '/api/journal',
  '/api/altar',
  '/api/soul-guide/response'
];

// Routes that should always go to the network
const NETWORK_ONLY_ROUTES = [
  '/api/auth/login',
  '/api/auth/register'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SoulSync Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => {
          return name.startsWith('soulsync-') && 
                 name !== CACHE_NAME &&
                 name !== API_CACHE_NAME;
        }).map((name) => {
          console.log('SoulSync Service Worker: Deleting old cache', name);
          return caches.delete(name);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper to handle API responses that should be cached
const cacheApiResponse = (request, response) => {
  // Clone the response as it can only be consumed once
  const responseToCache = response.clone();
  
  return caches.open(API_CACHE_NAME)
    .then((cache) => {
      // Only cache successful responses
      if (response.status === 200) {
        cache.put(request, responseToCache);
      }
      return response;
    });
};

// Helper to check if URL matches any pattern in a list
const matchesPattern = (url, patterns) => {
  return patterns.some(pattern => {
    // Check if the URL contains the pattern or matches exactly
    return url.includes(pattern);
  });
};

// Helper to store failed requests for later sync
const storeForSync = async (request) => {
  // Clone the request as it can only be consumed once
  const requestClone = request.clone();
  
  try {
    // Get the request body if it exists
    const body = await requestClone.json();
    
    // Store the request in IndexedDB for later sync
    await storeInIndexedDB('syncQueue', {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body,
      timestamp: Date.now()
    });
    
    // Return a mock response to keep the app functioning
    return new Response(JSON.stringify({
      success: true,
      message: 'Your changes will be synced when you're back online.',
      offline: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Failed to store request for sync:', error);
    
    // Return an error response
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to process your request offline.',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// IndexedDB functions for offline storage
const dbPromise = (() => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SoulSync', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create a store for sync queue
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
      }
      
      // Create a store for offline data
      if (!db.objectStoreNames.contains('offlineData')) {
        db.createObjectStore('offlineData', { keyPath: 'key' });
      }
    };
    
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
})();

// Store data in IndexedDB
const storeInIndexedDB = async (storeName, data) => {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(data);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests for cache-only strategy
  if (request.method !== 'GET' && !matchesPattern(url.pathname, SYNC_ROUTES)) {
    return;
  }
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    // Network-only routes should always try the network
    if (matchesPattern(url.pathname, NETWORK_ONLY_ROUTES)) {
      event.respondWith(
        fetch(request)
          .catch(() => {
            // If network fails, return offline response
            return caches.match('/offline.html');
          })
      );
      return;
    }
    
    // For sync routes when offline, store for later sync
    if (matchesPattern(url.pathname, SYNC_ROUTES) && request.method !== 'GET') {
      event.respondWith(
        fetch(request)
          .then(response => response)
          .catch(() => storeForSync(request))
      );
      return;
    }
    
    // For API routes that can be cached
    if (matchesPattern(url.pathname, API_ROUTES)) {
      event.respondWith(
        // Try the network first
        fetch(request)
          .then(response => cacheApiResponse(request, response))
          .catch(() => {
            // If network fails, try the cache
            return caches.match(request)
              .then(cachedResponse => {
                if (cachedResponse) {
                  return cachedResponse;
                }
                // If not in cache, return offline JSON response
                return new Response(JSON.stringify({
                  success: false,
                  message: 'You are offline. Some content may not be available.',
                  offline: true
                }), {
                  status: 503,
                  headers: { 'Content-Type': 'application/json' }
                });
              });
          })
      );
      return;
    }
  }
  
  // Default strategy for static assets: Cache first, falling back to network
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Not in cache, get from network
        return fetch(request)
          .then(response => {
            // Cache static assets as they're requested
            if (request.url.match(/\.(js|css|png|jpg|jpeg|svg|gif|ico)$/)) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(request, responseToCache));
            }
            return response;
          })
          .catch(() => {
            // Network failed, serve offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            // Return empty response for other requests
            return new Response('', { status: 408, statusText: 'Request timed out.' });
          });
      })
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-requests') {
    event.waitUntil(syncPendingRequests());
  }
});

// Function to process the sync queue
const syncPendingRequests = async () => {
  try {
    const db = await dbPromise;
    
    // Get all pending requests from the queue
    const transaction = db.transaction('syncQueue', 'readwrite');
    const store = transaction.objectStore('syncQueue');
    const requests = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    // Process each request
    const syncResults = await Promise.allSettled(
      requests.map(async (request) => {
        try {
          // Attempt to send the request
          const response = await fetch(request.url, {
            method: request.method,
            headers: request.headers,
            body: JSON.stringify(request.body)
          });
          
          if (response.ok) {
            // Remove from queue if successful
            await new Promise((resolve, reject) => {
              const deleteRequest = store.delete(request.id);
              deleteRequest.onsuccess = () => resolve();
              deleteRequest.onerror = () => reject(deleteRequest.error);
            });
            return { success: true, id: request.id };
          }
          
          return { 
            success: false, 
            id: request.id, 
            status: response.status,
            statusText: response.statusText
          };
        } catch (error) {
          return { success: false, id: request.id, error: error.message };
        }
      })
    );
    
    // Notify the app if available
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'sync-complete',
        results: syncResults
      });
    });
    
    return syncResults;
  } catch (error) {
    console.error('Sync failed:', error);
    return [];
  }
};

// Listen for messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      caches.delete(API_CACHE_NAME).then(() => {
        event.ports[0].postMessage({ result: 'Cache cleared successfully' });
      });
    });
  }
});
