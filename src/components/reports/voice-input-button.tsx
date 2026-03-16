'use client';

import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceInput } from '@/hooks/use-voice-input';
import { cn } from '@/lib/utils';

interface VoiceInputButtonProps {
  onStart?: () => void;
  onInterim?: (text: string) => void;
  onResult: (text: string) => void;
  onListeningChange?: (listening: boolean) => void;
}

export function VoiceInputButton({
  onStart,
  onInterim,
  onResult,
  onListeningChange,
}: VoiceInputButtonProps) {
  const { isListening, isSupported, startListening, stopListening } =
    useVoiceInput({
      onStart: () => {
        onStart?.();
        onListeningChange?.(true);
      },
      onInterim,
      onResult: (text) => {
        onResult(text);
        onListeningChange?.(false);
      },
    });

  if (!isSupported) return null;

  const handleClick = () => {
    if (isListening) {
      stopListening();
      onListeningChange?.(false);
    } else {
      startListening();
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(
        'shrink-0 cursor-pointer',
        isListening && 'animate-pulse border-red-400 bg-red-50',
      )}
      onClick={handleClick}
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
