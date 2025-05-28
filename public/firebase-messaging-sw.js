/* eslint-disable no-undef */
/* global importScripts, firebase */

importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDNczkrum3lvYZqxwg2lX4FeKT4tTaCF7I",
  authDomain: "schoolmate-caebf.firebaseapp.com",
  projectId: "schoolmate-caebf",
  storageBucket: "schoolmate-caebf.firebasestorage.app",
  messagingSenderId: "1000399188424",
  appId: "1:1000399188424:web:54ecb32632a45e2dd210fd"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/schoolmate-icon.png' // optional icon path
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
