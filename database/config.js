const firebase = require('firebase/app')
require('firebase/firestore')

// const dbConnection = async () => {
// }
const firebaseConfig = {
    apiKey: process.env.NODE_ENV == 'test' ? process.env.APIKEY_TEST : process.env.APIKEY,
    authDomain: process.env.NODE_ENV == 'test' ? process.env.AUTH_DOMAIN_TEST : process.env.AUTH_DOMAIN,
    projectId: process.env.NODE_ENV == 'test' ? process.env.PROJECT_ID_TEST : process.env.PROJECT_ID,
    storageBucket: process.env.NODE_ENV == 'test' ? process.env.STORAGE_BUCKET_TEST : process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.NODE_ENV == 'test' ? process.env.MESSAGING_SENDER_ID_TEST : process.env.MESSAGING_SENDER_ID,
    appId: process.env.NODE_ENV == 'test' ? process.env.APP_ID_TEST : process.env.APP_ID
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log('firebase configurado')
const db = firebase.firestore()


module.exports = db