import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CallScenario } from './types';

export const API_KEY_STORAGE_KEY = 'anthropic_api_key';

const SCENARIO_PROMPTS: Record<CallScenario, string> = {
  emergency: 'an urgent emergency situation requiring the person to leave immediately',
  work: 'an urgent work matter like a critical meeting, deadline, or task that needs immediate attention',
  family: 'a family member who needs help or wants to check in on them',
  medical: 'a doctor\'s office, pharmacy, or medical provider with an appointment or test result',
  delivery: 'a delivery driver or courier who has arrived or needs the recipient\'s attention',
  social: 'a friend who wants to hang out or is calling to catch up',
  home_service: 'a home repair or service professional (plumber, electrician, handyman) who needs to reschedule or has arrived',
  custom: 'a caller with an important message',
};

async function getApiKey(): Promise<string> {
  // 1. Try AsyncStorage (user-entered in Settings)
  const stored = await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
  if (stored?.trim()) return stored.trim();

  // 2. Fall back to app.json extra config
  const fromConfig = Constants.expoConfig?.extra?.anthropicApiKey as string | undefined;
  if (fromConfig?.trim()) return fromConfig.trim();

  throw new Error('No API key found. Add your Anthropic API key in Settings to use AI script generation.');
}

export async function generateVoiceScript(
  contactName: string,
  scenario: CallScenario
): Promise<string> {
  const key = await getApiKey();
  const scenarioContext = SCENARIO_PROMPTS[scenario] ?? SCENARIO_PROMPTS.custom;

  const prompt = `Generate a short, realistic spoken script (2-4 sentences) for a fake incoming phone call.

Caller name: ${contactName}
Scenario: ${scenarioContext}

Requirements:
- Write only the spoken words — no stage directions, labels, or quotes
- Sound natural and conversational, like a real person leaving a quick voicemail
- Create a mild sense of urgency so the recipient has a convincing reason to leave
- Do not mention "fake", "script", or hint this is staged
- Under 60 words total

Reply with only the script text.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text: string = data?.content?.[0]?.text ?? '';
  if (!text) throw new Error('Empty response from AI');
  return text.trim();
}
