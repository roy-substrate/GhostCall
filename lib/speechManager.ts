import * as Speech from 'expo-speech';

export function speakScript(text: string): void {
  Speech.speak(text, {
    language: 'en-US',
    pitch: 1.1,
    rate: 0.9, // expo-speech rate scale differs from AVSpeechSynthesizer
  });
}

export function stopSpeaking(): void {
  Speech.stop();
}
