import firebase from 'firebase/app';
import 'firebase/messaging';
import injector from 'vue-inject';
import { ToastProgrammatic as Toast } from 'buefy';

import StorageHelper from './helpers/StorageHelper';

const FCM_TOKEN_KEY = 'fcmToken';

let stopTokenRefresh = null;
let unsubscribeFromNotifications = null;
let messaging = null;
let initialized = false;

const initFirebase = () => {
  if (initialized) {
    // Already initialized
    return;
  }

  firebase.initializeApp({
    apiKey: 'AIzaSyC_kCwexrh2qMjiZVPbNiATy-MrkXOBdHk',
    authDomain: 'cryptomkt-bot.firebaseapp.com',
    databaseURL: 'https://cryptomkt-bot.firebaseio.com',
    projectId: 'cryptomkt-bot',
    storageBucket: 'cryptomkt-bot.appspot.com',
    messagingSenderId: '123906343916',
    appId: '1:123906343916:web:7ea15d7f67c729bd',
  });
  messaging = firebase.messaging();
  initialized = true;
};

const getAndSaveToken = async (messaging) => {
  const apiService = injector.get('apiService');
  const token = await messaging.getToken();
  apiService.addFcmToken(token).then(() => {
    StorageHelper.set(FCM_TOKEN_KEY, token);
  });
};

const requestNotificationPermission = () => {
  return new Promise((resolve, reject) => {
    Notification.requestPermission().then((result) => {
      if (result === 'granted') {
        resolve();
      } else {
        reject();
      }
    });
  });
};

const handleNotification = (payload) => {
  const { body } = payload.notification;
  Toast.open({ message: body, type: 'is-info', duration: 5000 });
};

export const enableNotifications = () => {
  requestNotificationPermission(messaging)
    .then(async () => {
      await getAndSaveToken(messaging);
      stopTokenRefresh = messaging.onTokenRefresh(getAndSaveToken);
      unsubscribeFromNotifications = messaging.onMessage(handleNotification);
    })
    .catch(() => {
      // Failed to enable notifications
    });
};

export const startPushNotifications = () => {
  initFirebase();
  enableNotifications();
};

export const stopPushNotifications = () => {
  const apiService = injector.get('apiService');
  const currentToken = StorageHelper.get(FCM_TOKEN_KEY);
  apiService.removeFcmToken(currentToken);
  stopTokenRefresh && stopTokenRefresh();
  unsubscribeFromNotifications && unsubscribeFromNotifications();
};
