// Firebase Cloud Messaging (FCM)
importScripts('https://www.gstatic.com/firebasejs/7.19.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/7.19.0/firebase-messaging.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyC_kCwexrh2qMjiZVPbNiATy-MrkXOBdHk',
  authDomain: 'cryptomkt-bot.firebaseapp.com',
  databaseURL: 'https://cryptomkt-bot.firebaseio.com',
  projectId: 'cryptomkt-bot',
  storageBucket: 'cryptomkt-bot.appspot.com',
  messagingSenderId: '123906343916',
  appId: '1:123906343916:web:7ea15d7f67c729bd',
});

const messaging = firebase.messaging();
