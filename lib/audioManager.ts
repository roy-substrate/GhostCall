import { Audio } from 'expo-av';

let ringtoneSound: Audio.Sound | null = null;

export async function playRingtone(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/ringtone.wav'),
      { isLooping: true, volume: 1.0 }
    );
    ringtoneSound = sound;
    await sound.playAsync();
  } catch (e) {
    console.warn('Failed to play ringtone:', e);
  }
}

export async function stopRingtone(): Promise<void> {
  try {
    if (ringtoneSound) {
      await ringtoneSound.stopAsync();
      await ringtoneSound.unloadAsync();
      ringtoneSound = null;
    }
  } catch {}
}

export async function setEarpieceMode(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
    });
  } catch {}
}

export async function setSpeakerMode(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
    });
  } catch {}
}
