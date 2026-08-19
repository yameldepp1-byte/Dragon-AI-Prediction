// src/services/apiService.js
import { ref, push, set, onValue } from "firebase/database";
import { db } from "./firebase";

const API_BASE = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json";

export const fetchLiveResults = async () => {
  try {
    const response = await fetch(`${API_BASE}?t=${Date.now()}`);
    const data = await response.json();
    
    if (data.code === 0) {
      const list = data.data.list;
      const latest = list[0];
      
      // Push to Firebase Realtime Database
      const historyRef = ref(db, 'history');
      push(historyRef, {
        issueNumber: latest.issueNumber,
        number: latest.number,
        time: new Date().toISOString(),
        isBig: parseInt(latest.number) >= 5
      });

      return { 
        currentPeriod: latest.issueNumber, 
        latestNumber: latest.number,
        history: list 
      };
    }
  } catch (error) {
    console.error("API Error:", error);
  }
  return null;
};

export const listenToHistory = (callback) => {
  const historyRef = ref(db, 'history');
  onValue(historyRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const historyArray = Object.values(data).sort((a, b) => 
        parseInt(a.issueNumber) - parseInt(b.issueNumber)
      );
      callback(historyArray);
    }
  });
};
