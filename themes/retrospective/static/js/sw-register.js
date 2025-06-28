/**
 * Service Worker Registration and Management
 * Handles registration, updates, and communication with the service worker
 */

(function() {
  'use strict';

  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers not supported');
    return;
  }

  // Configuration
  const SW_PATH = '/theme/js/sw.js';
  const SW_SCOPE = '/';
  const UPDATE_CHECK_INTERVAL = 1000 * 60 * 60; // 1 hour

  let registration = null;
  let isUpdateAvailable = false;

  // Register service worker when page loads
  window.addEventListener('load', async () => {
    try {
      registration = await navigator.serviceWorker.register(SW_PATH, {
        scope: SW_SCOPE,
        updateViaCache: 'none' // Always check for updates
      });

      console.log('Service Worker registered successfully:', registration);

      // Set up update handling
      setupUpdateHandling(registration);

      // Check for updates periodically
      setInterval(checkForUpdates, UPDATE_CHECK_INTERVAL);

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });

  // Set up service worker update handling
  function setupUpdateHandling(registration) {
    // Handle waiting service worker
    if (registration.waiting) {
      showUpdateNotification();
    }

    // Handle installing service worker
    if (registration.installing) {
      trackInstalling(registration.installing);
    }

    // Listen for new service worker
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        trackInstalling(newWorker);
      }
    });

    // Listen for controller changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Reload the page to get the latest content
      if (!isUpdateAvailable) {
        window.location.reload();
      }
    });
  }

  // Track installing service worker
  function trackInstalling(worker) {
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        // New content is available
        isUpdateAvailable = true;
        showUpdateNotification();
      }
    });
  }

  // Show update notification to user
  function showUpdateNotification() {
    // Create update notification
    const notification = document.createElement('div');
    notification.id = 'sw-update-notification';
    notification.className = 'position-fixed top-0 start-50 translate-middle-x mt-3';
    notification.style.zIndex = '1050';
    notification.innerHTML = `
      <div class="alert alert-info alert-dismissible fade show" role="alert">
        <strong>Update Available!</strong> 
        New content is ready. 
        <button type="button" class="btn btn-sm btn-outline-primary ms-2" onclick="applyUpdate()">
          Update Now
        </button>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;

    // Add to page if not already present
    if (!document.getElementById('sw-update-notification')) {
      document.body.appendChild(notification);
    }
  }

  // Apply service worker update
  window.applyUpdate = function() {
    if (registration && registration.waiting) {
      // Tell the waiting service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  // Check for service worker updates
  async function checkForUpdates() {
    if (registration) {
      try {
        await registration.update();
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    }
  }

  // Handle online/offline status
  window.addEventListener('online', () => {
    console.log('Network connection restored');
    
    // Notify service worker that we're online
    if (registration && registration.active) {
      registration.active.postMessage({ type: 'NETWORK_STATUS', online: true });
    }
    
    // Check for updates when coming back online
    checkForUpdates();
  });

  window.addEventListener('offline', () => {
    console.log('Network connection lost');
    
    // Notify service worker that we're offline
    if (registration && registration.active) {
      registration.active.postMessage({ type: 'NETWORK_STATUS', online: false });
    }
  });

  // Listen for messages from service worker
  navigator.serviceWorker.addEventListener('message', event => {
    const { data } = event;
    
    switch (data.type) {
      case 'CACHE_UPDATED':
        console.log('Cache updated by service worker');
        break;
        
      case 'OFFLINE_READY':
        console.log('App is ready for offline use');
        showOfflineReadyNotification();
        break;
        
      case 'ERROR':
        console.error('Service worker error:', data.error);
        break;
        
      default:
        console.log('Unknown message from service worker:', data);
    }
  });

  // Show offline ready notification
  function showOfflineReadyNotification() {
    const notification = document.createElement('div');
    notification.className = 'position-fixed bottom-0 end-0 me-3 mb-3';
    notification.style.zIndex = '1040';
    notification.innerHTML = `
      <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header bg-success text-white">
          <strong class="me-auto">Offline Ready</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          This site is now available offline!
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  // Expose registration for debugging
  window.swRegistration = registration;

  // Pre-cache critical resources
  function precacheCriticalResources() {
    if (registration && registration.active) {
      const criticalResources = [
        '/',
        '/theme/css/theme.css',
        '/theme/css/modern-features.css',
        '/manifest.json'
      ];

      registration.active.postMessage({
        type: 'PRECACHE_RESOURCES',
        resources: criticalResources
      });
    }
  }

  // Pre-cache when service worker is ready
  if (registration && registration.active) {
    precacheCriticalResources();
  } else {
    navigator.serviceWorker.ready.then(() => {
      precacheCriticalResources();
    });
  }

})();