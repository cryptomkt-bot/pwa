import { register } from 'register-service-worker';

import store from './store';

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    updated(reg) {
      // New content is available, replacing service worker and refreshing.
      store.commit('setIsUpdating', true);
      reg.waiting.postMessage('skipWaiting');
    },
  });
}

if ('serviceWorker' in navigator) {
  let refreshing = false;
  // This is triggered when a new service worker take over
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;

    window.location.reload();
  });
}
