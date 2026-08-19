```javascript
// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCbPZZ994J0vwLOCnaWRHI9UJ51UzzeDbA",
  authDomain: "dragon-ai-prediction.firebaseapp.com",
  databaseURL: "https://dragon-ai-prediction-default-rtdb.firebasedatabase.app",
  projectId: "dragon-ai-prediction",
  storageBucket: "dragon-ai-prediction.firebasestorage.app",
  messagingSenderId: "778136454169",
  appId: "1:778136454169:web:55795ad3adcc8df1901688",
  measurementId: "G-S5KN78613R"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export { db, analytics };
```

