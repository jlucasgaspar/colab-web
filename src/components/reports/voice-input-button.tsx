'use client';

import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceInput } from '@/hooks/use-voice-input';

interface VoiceInputButtonProps {
  onResult: (text: string) => void;
}

export function VoiceInputButton({ onResult }: VoiceInputButtonProps) {
  const { isListening, isSupported, startListening, stopListening } =
    useVoiceInput(onResult);

  if (!isSupported) return null;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="shrink-0 cursor-pointer"
      onClick={isListening ? stopListening : startListening}
      title={isListening ? 'Parar gravação' : 'Falar'}
    >
      {isListening ? (
        <MicOff className="h-4 w-4 text-red-500" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
