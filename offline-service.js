// src/services/offlineService.js
import localforage from 'localforage';

// Configure offline storage
localforage.config({
  name: 'SoulSync',
  storeName: 'offlineData'
});

// Queue for storing actions to sync when back online
const actionQueue = localforage.createInstance({
  name: 'SoulSync',
  storeName: 'actionQueue'
});

// Cache for storing API responses
const apiCache = localforage.createInstance({
  name: 'SoulSync',
  storeName: 'apiCache'
});

const offlineService = {
  // Check if we're online
  isOnline: () => navigator.onLine,
  
  // Store data in cache
  cacheData: async (key, data, ttl = 3600000) => { // Default TTL: 1 hour
    await apiCache.setItem(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  },
  
  // Get data from cache
  getCachedData: async (key) => {
    const cacheEntry = await apiCache.getItem(key);
    
    // Return null if no cache entry exists
    if (!cacheEntry) return null;
    
    // Check if cache is expired
    const isExpired = Date.now() > cacheEntry.timestamp + cacheEntry.ttl;
    if (isExpired) {
      await apiCache.removeItem(key);
      return null;
    }
    
    return cacheEntry.data;
  },
  
  // Save journal entry locally when offline
  saveJournalEntry: async (entry) => {
    // Generate temporary ID
    const tempId = `temp_${Date.now()}`;
    
    // Add to queue for syncing later
    await actionQueue.setItem(`journal_${tempId}`, {
      action: 'saveJournalEntry',
      data: entry,
      timestamp: Date.now()
    });
    
    // Return the temp ID so the UI can update
    return { id: tempId, ...entry };
  },
  
  // Queue any action for later sync
  queueAction: async (actionType, actionData) => {
    const actionId = `${actionType}_${Date.now()}`;
    await actionQueue.setItem(actionId, {
      action: actionType,
      data: actionData,
      timestamp: Date.now()
    });
  },
  
  // Sync all queued actions when online
  syncQueuedActions: async (apiServices) => {
    if (!navigator.onLine) return { success: false, message: 'Still offline' };
    
    // Get all queued actions
    const actions = [];
    await actionQueue.iterate((value, key) => {
      actions.push({ key, ...value });
    });
    
    // Sort by timestamp (oldest first)
    actions.sort((a, b) => a.timestamp - b.timestamp);
    
    let successCount = 0;
    let failCount = 0;
    
    // Process each action
    for (const action of actions) {
      try {
        switch (action.action) {
          case 'saveJournalEntry':
            await apiServices.journalService.saveEntry(action.data);
            break;
          // Add other action types as needed
          default:
            console.warn('Unknown action type:', action.action);
        }
        
        // Remove from queue on success
        await actionQueue.removeItem(action.key);
        successCount++;
      } catch (error) {
        console.error('Failed to sync action:', action, error);
        failCount++;
      }
    }
    
    return { 
      success: true, 
      synced: successCount, 
      failed: failCount 
    };
  },
  
  // Initialize listeners for online/offline events
  init: (store) => {
    // When app comes back online
    window.addEventListener('online', () => {
      store.dispatch({ type: 'app/setOnline', payload: true });
      // Attempt to sync data
      offlineService.syncQueuedActions();
    });
    
    // When app goes offline
    window.addEventListener('offline', () => {
      store.dispatch({ type: 'app/setOnline', payload: false });
    });
  }
};

export default offlineService;
