/**
 * Typing Engine Mathematical Formulas and Keystroke Analytics
 * Implements standard international typing speed metrics:
 * - Standard Word Length = 5 characters (including spaces & punctuation)
 * - Gross WPM = (Total Typed Characters / 5) / Elapsed Time (min)
 * - Net WPM = Gross WPM - (Unfixed Errors / Elapsed Time (min))
 * - Accuracy (%) = (Correct Characters Typed / Total Characters Typed) * 100
 */

import { KeystrokeEvent, TypingMetrics } from '../types';

export const STANDARD_WORD_LENGTH = 5;

/**
 * Calculates current typing metrics given reference text and user input
 */
export function calculateTypingMetrics(
  referenceText: string,
  userInput: string,
  elapsedSeconds: number,
  unfixedErrorsOverride?: number
): TypingMetrics {
  const totalChars = userInput.length;
  const elapsedMinutes = Math.max(elapsedSeconds / 60, 0.001); // avoid div by zero

  let correctChars = 0;
  let incorrectChars = 0;

  for (let i = 0; i < userInput.length; i++) {
    if (i < referenceText.length && userInput[i] === referenceText[i]) {
      correctChars++;
    } else {
      incorrectChars++;
    }
  }

  // Count unfixed errors in the current typed buffer
  let unfixedErrors = 0;
  if (unfixedErrorsOverride !== undefined) {
    unfixedErrors = unfixedErrorsOverride;
  } else {
    for (let i = 0; i < userInput.length; i++) {
      if (i >= referenceText.length || userInput[i] !== referenceText[i]) {
        unfixedErrors++;
      }
    }
  }

  // Gross WPM: All keystrokes converted to 5-char standard words per minute
  const grossWpm = Math.round((totalChars / STANDARD_WORD_LENGTH) / elapsedMinutes);

  // Net WPM: Gross WPM penalized by error penalty rate (1 word penalty per unfixed error)
  const errorPenaltyWpm = unfixedErrors / elapsedMinutes;
  const netWpm = Math.max(0, Math.round(grossWpm - errorPenaltyWpm));

  // Accuracy: ratio of correct keystrokes
  const accuracyPercentage = totalChars === 0
    ? 100
    : Number(Math.max(0, Math.min(100, (correctChars / totalChars) * 100)).toFixed(1));

  return {
    totalChars,
    correctChars,
    incorrectChars,
    unfixedErrors,
    grossWpm: Math.max(0, grossWpm),
    netWpm: Math.max(0, netWpm),
    accuracyPercentage,
    consistencyPercentage: 92, // default; recalculated with telemetry
    durationSeconds: Math.round(elapsedSeconds),
    elapsedSeconds,
  };
}

/**
 * Computes inter-keystroke interval (flight time & dwell time) statistical variance
 * Used for both consistency score calculation and anti-cheat anomaly detection
 */
export function analyzeKeystrokeDynamics(keystrokes: KeystrokeEvent[]) {
  if (keystrokes.length < 5) {
    return {
      meanFlightMs: 140,
      stdDevFlightMs: 35,
      meanDwellMs: 75,
      stdDevDwellMs: 18,
      consistencyPercentage: 88,
      isSynthetic: false,
    };
  }

  const flightTimes: number[] = [];
  const dwellTimes: number[] = [];

  for (let i = 1; i < keystrokes.length; i++) {
    const flight = keystrokes[i].downTimestamp - keystrokes[i - 1].downTimestamp;
    if (flight > 10 && flight < 2000) { // filter extreme pauses
      flightTimes.push(flight);
    }
    if (keystrokes[i].dwellTime && keystrokes[i].dwellTime! > 5 && keystrokes[i].dwellTime! < 600) {
      dwellTimes.push(keystrokes[i].dwellTime!);
    }
  }

  const meanFlightMs = flightTimes.length > 0
    ? flightTimes.reduce((a, b) => a + b, 0) / flightTimes.length
    : 150;

  const varianceFlight = flightTimes.length > 0
    ? flightTimes.reduce((acc, val) => acc + Math.pow(val - meanFlightMs, 2), 0) / flightTimes.length
    : 900;
  const stdDevFlightMs = Math.sqrt(varianceFlight);

  const meanDwellMs = dwellTimes.length > 0
    ? dwellTimes.reduce((a, b) => a + b, 0) / dwellTimes.length
    : 70;

  const varianceDwell = dwellTimes.length > 0
    ? dwellTimes.reduce((acc, val) => acc + Math.pow(val - meanDwellMs, 2), 0) / dwellTimes.length
    : 400;
  const stdDevDwellMs = Math.sqrt(varianceDwell);

  // Coefficient of Variation (CV = stdDev / mean)
  // Normal human typing CV is between 0.20 and 0.45.
  // Synthetic bots either have CV < 0.05 (too perfect) or identical fixed delays (e.g. exactly 50ms).
  const cv = meanFlightMs > 0 ? stdDevFlightMs / meanFlightMs : 0.3;
  
  // Consistency percentage: higher is smoother human typing (CV around 0.25 -> ~95% consistency)
  const consistencyScore = Math.max(40, Math.min(99, Math.round(100 - (cv * 100))));

  // Synthetic check: standard deviation < 4ms is physically impossible for human hands
  const isSynthetic = stdDevFlightMs < 5.0 && flightTimes.length > 15;

  return {
    meanFlightMs: Math.round(meanFlightMs),
    stdDevFlightMs: Number(stdDevFlightMs.toFixed(1)),
    meanDwellMs: Math.round(meanDwellMs),
    stdDevDwellMs: Number(stdDevDwellMs.toFixed(1)),
    consistencyPercentage: consistencyScore,
    isSynthetic,
  };
}
