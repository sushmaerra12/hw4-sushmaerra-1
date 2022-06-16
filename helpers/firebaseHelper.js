// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, push } from 'firebase/database';
import { firebaseConfig } from "./firebaseCreds";

export function initializeFirebase() {
    initializeApp(firebaseConfig);
}

export function writeGeoData(data) {
    const db = getDatabase();
    const reference = ref(db, `geoData/`);
    push(reference, data);
}

export function setupGeoListener(updateFunc) {
    console.log("setupDataListener called")
    const db = getDatabase();
    const reference = ref(db, `geoData/`);
    onValue(reference, (snapshot) => {
        console.log("geo data listener fires up with: ", snapshot);
        if (snapshot?.val()) {
            const fbObject = snapshot.val();
            const newArr = [];
            Object.keys(fbObject).map((key, index) => {
                newArr.push({...fbObject[key], key})
            })
            updateFunc(newArr);
        } else {
            updateFunc([]);
        }
    });
}