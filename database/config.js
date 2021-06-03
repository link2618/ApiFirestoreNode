const firebase = require('firebase/app')
require('firebase/firestore')

// const dbConnection = async () => {
// }
const firebaseConfig = {
    apiKey: process.env.APIKEY ,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log('firebase configurado')
const db = firebase.firestore()


module.exports = db