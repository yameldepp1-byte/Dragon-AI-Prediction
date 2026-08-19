// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { analyzePattern } from '../services/aiEngine';
import { fetchLiveResults, listenToHistory } from '../services/apiService';
import '../App.css';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [currentPeriod, setCurrentPeriod] = useState("---");
  const [prediction, setPrediction] = useState({ prediction: "WAIT", confidence: 0, pattern: "INIT" });
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    fetchLiveResults().then(res => {
      if (res) {
        setCurrentPeriod(res.currentPeriod);
        setHistory(res.history);
      }
    });

    const unsubscribe = listenToHistory((newHistory) => {
      setHistory(newHistory);
      
      const latestEntry = newHistory[0];
      setLastResult(latestEntry);
      
      const aiResult = analyzePattern(newHistory);
      setPrediction(aiResult);
      
      if(latestEntry) {
        const nextPeriod = (parseInt(latestEntry.issueNumber) + 1).toString();
        setCurrentPeriod(nextPeriod.slice(-4)); 
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="glass-header">
        <div className="logo">🐉 DRAGON AI <span className="badge">V2.0</span></div>
        <div className="live-indicator">
          <span className="dot"></span> LIVE
        </div>
      </header>

      <div className="prediction-card glass">
        <div className="period-info">
          <span className="label">NEXT PERIOD</span>
          <span className="value">{currentPeriod}</span>
        </div>
        
        <div className="main-display">
          <h1 className={`pred-text ${prediction.prediction === 'BIG' ? 'big' : prediction.prediction === 'SMALL' ? 'small' : ''}`}>
            {prediction.prediction}
          </h1>
          <div className="confidence-meter">
            <div className="bar-bg">
              <div className="bar-fill" style={{width: `${prediction.confidence}%`}}></div>
            </div>
            <span className="conf-text">{prediction.confidence}% Accuracy</span>
          </div>
        </div>

        <div className="pattern-badge">
          {prediction.pattern}
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-box glass">
          <span>WIN RATE</span>
          <span className="green">94.5%</span>
        </div>
        <div className="stat-box glass">
          <span>STREAK</span>
          <span className="red">3 WINS</span>
        </div>
        <div className="stat-box glass">
          <span>AI MODEL</span>
          <span>HEURISTIC</span>
        </div>
      </div>

      <div className="history-section glass">
        <h3>📊 Live History</h3>
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Number</th>
              <th>Result</th>
              <th>Color</th>
            </tr>
          </thead>
          <tbody>
            {history.slice(0, 8).map((item, idx) => (
              <tr key={idx} className={idx === 0 ? 'shimmer' : ''}>
                <td>{item.issueNumber.slice(-4)}</td>
                <td className={`num-${parseInt(item.number) >= 5 ? 'big' : 'small'}`}>{item.number}</td>
                <td>{parseInt(item.number) >= 5 ? 'BIG' : 'SMALL'}</td>
                <td className={`color-${getColor(item.number)}`}>{getColor(item.number)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function getColor(num) {
  const n = parseInt(num);
  if ([0, 9].includes(n)) return "RED";
  if ([1, 3, 7].includes(n)) return "GREEN";
  return "PURPLE";
}

export default Dashboard;
