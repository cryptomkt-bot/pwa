import firebase from 'firebase/app';
import 'firebase/messaging';
import injector from 'vue-inject';
import { Toast } from 'buefy/dist/components/toast';

import StorageHelper from './helpers/StorageHelper';

const FCM_TOKEN_KEY = 'fcmToken';

let stopTokenRefresh = null;
let unsuscribeToNotifications = null;
let messaging = null;

const initFirebase = () => {
  firebase.initializeApp({
    messagingSenderId: '123906343916',
  });
  messaging = firebase.messaging();
};

const getAndSaveToken = async messaging => {
  const apiService = injector.get('apiService');
  const newToken = await messaging.getToken();
  apiService.addFcmToken(newToken).then(() => {
    StorageHelper.set(FCM_TOKEN_KEY, newToken);
    const currentToken = StorageHelper.get(FCM_TOKEN_KEY);
    if (currentToken !== null) {
      // The token has changed, remove the old one.
      apiService.removeFcmToken(currentToken);
    }
  });
};

const requestNotificationPermission = () => {
  return new Promise((resolve, reject) => {
    Notification.requestPermission().then(result => {
      if (result === 'granted') {
        resolve();
      } else {
        reject();
      }
    });
  });
};

const handleNotification = payload => {
  const { body } = payload.notification;
  Toast.open({ message: body, type: 'is-info', duration: 5000 });
};

export const enableNotifications = () => {
  requestNotificationPermission(messaging)
    .then(async () => {
      await getAndSaveToken(messaging);
      stopTokenRefresh = messaging.onTokenRefresh(getAndSaveToken);
      unsuscribeToNotifications = messaging.onMessage(handleNotification);
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
  stopTokenRefresh();
  unsuscribeToNotifications();
};
