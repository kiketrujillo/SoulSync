// public/service-worker.js
const CACHE_NAME = 'soulsync-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/js/bundle.js',
  '/manifest.json',
  '/assets/ritual-default.jpg',
  '/assets/tarot-back.jpg',
  '/assets/altar-bg-nature.jpg',
  '/assets/altar-bg-cosmos.jpg',
  '/assets/altar-bg-temple.jpg',
];

// Cache static assets during installation
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch strategy - Cache First, falling back to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip browser extensions
  if (!(event.request.url.startsWith('http'))) return;
  
  event.respondWith(
    fromCache(event.request)
      .then(response => {
        // If found in cache, return the cached version
        if (response) {
          return response;
        }
        
        // Not in cache, get from network
        return fetch(event.request).then(networkResponse => {
          // If valid response, add it to cache for future
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // If both cache and network fail, return the offline page
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/offline.html');
        }
      })
  );
});

// Helper function to check cache
function fromCache(request) {
  return caches.open(CACHE_NAME).then(cache => {
    return cache.match(request);
  });
}

// Sync journal entries when coming back online
self.addEventListener('sync', event => {
  if (event.tag === 'sync-journal') {
    event.waitUntil(syncJournalEntries());
  } else if (event.tag === 'sync-quest-progress') {
    event.waitUntil(syncQuestProgress());
  }
});

// Function to sync journal entries
async function syncJournalEntries() {
  // This would retrieve queued journal entries from IndexedDB 
  // and send them to the server
  const entries = await getQueuedEntriesFromIndexedDB();
  
  for (const entry of entries) {
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
      
      if (response.ok) {
        // Remove from queue if successfully synced
        await removeEntryFromQueue(entry.id);
      }
    } catch (error) {
      console.error('Failed to sync entry:', error);
    }
  }
}

// Mock function to get entries from IndexedDB (would be implemented with real IndexedDB in production)
function getQueuedEntriesFromIndexedDB() {
  return Promise.resolve([]);
}

// Mock function to remove entry from queue (would be implemented with real IndexedDB in production)
function removeEntryFromQueue(id) {
  return Promise.resolve();
}

// Function to sync quest progress
async function syncQuestProgress() {
  // Similar implementation to journal syncing
  // Would retrieve quest progress from IndexedDB and send to server
}

// Listen for push notifications
self.addEventListener('push', event => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/assets/notification-icon.png',
    badge: '/assets/notification-badge.png',
    data: {
      url: data.url
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});