// Firebase Cloud Messaging (FCM)
importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-messaging.js');

firebase.initializeApp({
  messagingSenderId: '123906343916',
});

const messaging = firebase.messaging();
