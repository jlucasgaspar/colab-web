'use client';

import { useState, useCallback, useRef } from 'react';

interface UseVoiceInputOptions {
  onStart?: () => void;
  onInterim?: (text: string) => void;
  onResult: (text: string) => void;
}

interface VoiceInputState {
  isListening: boolean;
  isSupported: boolean;
}

export function useVoiceInput({ onStart, onInterim, onResult }: UseVoiceInputOptions) {
  const [state, setState] = useState<VoiceInputState>({
    isListening: false,
    isSupported: typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
  });
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const callbacksRef = useRef({ onStart, onInterim, onResult });
  callbacksRef.current = { onStart, onInterim, onResult };

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        callbacksRef.current.onResult(final);
      } else if (interim) {
        callbacksRef.current.onInterim?.(interim);
      }
    };

    recognition.onend = () => {
      setState((s) => ({ ...s, isListening: false }));
    };

    recognition.onerror = () => {
      setState((s) => ({ ...s, isListening: false }));
    };

    callbacksRef.current.onStart?.();
    recognitionRef.current = recognition;
    recognition.start();
    setState((s) => ({ ...s, isListening: true }));
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setState((s) => ({ ...s, isListening: false }));
  }, []);

  return { ...state, startListening, stopListening };
}
