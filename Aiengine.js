// src/services/aiEngine.js

/**
 * DRAGON AI HEURISTIC ENGINE V2
 * Combines Pattern Matching, Trend Following, and Streak Reversal
 */

const analyzePattern = (historyData) => {
  if (!historyData || historyData.length < 5) {
    return { prediction: "WAIT", confidence: 0, pattern: "DATA_LOW" };
  }

  // 1. Data Prep: Convert Numbers to BIG/SMALL
  const rawHistory = historyData.map(item => ({
    period: item.issueNumber,
    number: parseInt(item.number),
    isBig: parseInt(item.number) >= 5,
    color: getColor(item.number)
  }));

  // Last 5 results for pattern analysis
  const last5 = rawHistory.slice(-5).map(h => h.isBig ? 'B' : 'S');
  const last3 = rawHistory.slice(-3).map(h => h.isBig ? 'B' : 'S');
  const last6 = rawHistory.slice(-6).map(h => h.isBig ? 'B' : 'S');

  let confidence = 0;
  let prediction = "SKIP";
  let patternName = "NEUTRAL";

  // --- RULE 1: STREAK REVERSAL (High Confidence) ---
  // If BBB (Big Big Big) -> Small is highly likely
  // If SSS (Small Small Small) -> Big is highly likely
  if (last3.join('') === 'BBB') {
    prediction = "SMALL";
    confidence += 45; 
    patternName = "STREAK BREAK (BBB)";
  } else if (last3.join('') === 'SBB') {
    prediction = "BIG";
    confidence += 30;
    patternName = "TREND SHIFT";
  } else if (last3.join('') === 'SSS') {
    prediction = "BIG";
    confidence += 45;
    patternName = "STREAK BREAK (SSS)";
  }

  // --- RULE 2: ALTERNATING PATTERNS (Medium Confidence) ---
  if (last5.join('') === 'BSBSB') {
    prediction = "SMALL";
    confidence += 25;
    patternName = "ALTERNATOR";
  } else if (last5.join('') === 'SBSBS') {
    prediction = "BIG";
    confidence += 25;
    patternName = "ALTERNATOR";
  }

  // --- RULE 3: TREND FOLLOWING (Low Confidence) ---
  const bigCount = last6.filter(x => x === 'B').length;
  const smallCount = last6.filter(x => x === 'S').length;

  if (bigCount >= 5 && prediction === "SKIP") {
    prediction = "BIG";
    confidence += 20;
    patternName = "STRONG BIG TREND";
  } else if (smallCount >= 5 && prediction === "SKIP") {
    prediction = "SMALL";
    confidence += 20;
    patternName = "STRONG SMALL TREND";
  }

  // Cap Confidence at 99%
  confidence = Math.min(confidence, 99);
  
  const predictedColor = getColorBySize(prediction);

  return {
    prediction,
    confidence,
    pattern: patternName,
    color: predictedColor,
    nextNumberHint: generateNumberHint(prediction)
  };
};

// Helper: Color Map
function getColor(num) {
  const n = parseInt(num);
  if ([0, 9].includes(n)) return "RED";
  if ([1, 3, 7].includes(n)) return "GREEN";
  if ([2, 4, 6, 8].includes(n)) return "PURPLE";
  return "GREEN";
}

function getColorBySize(type) {
  return "GREEN"; 
}

function generateNumberHint(type) {
  if (type === "SMALL") return Math.floor(Math.random() * 5); 
  if (type === "BIG") return Math.floor(Math.random() * 5) + 5; 
  return "-";
}

export { analyzePattern };
