'use client';

import { useState, useCallback, useRef } from 'react';

interface VoiceInputState {
  isListening: boolean;
  isSupported: boolean;
}

export function useVoiceInput(onResult: (text: string) => void) {
  const [state, setState] = useState<VoiceInputState>({
    isListening: false,
    isSupported: typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
  });
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onend = () => {
      setState((s) => ({ ...s, isListening: false }));
    };

    recognition.onerror = () => {
      setState((s) => ({ ...s, isListening: false }));
    };

    recognitionRef.current = recognition;
    recognition.start();
    setState((s) => ({ ...s, isListening: true }));
  }, [onResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setState((s) => ({ ...s, isListening: false }));
  }, []);

  return { ...state, startListening, stopListening };
}
