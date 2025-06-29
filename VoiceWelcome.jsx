
import { useEffect } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';

export default function VoiceWelcome() {
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    speak({ text: 'Welcome to CYBEV. Explore the world of AI-powered Web3 blogging and social tools.' });
  }, []);

  return null;
}
