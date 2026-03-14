'use client';

import { useState, useCallback } from 'react';

interface GeolocationState {
  loading: boolean;
  error: string | null;
  address: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    address: null,
  });

  const getLocation = useCallback(async (): Promise<string | null> => {
    if (!navigator.geolocation) {
      setState({ loading: false, error: 'Geolocalização não suportada', address: null });
      return null;
    }

    setState({ loading: true, error: null, address: null });

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { latitude, longitude } = position.coords;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      );
      const data = await res.json();
      const address = data.display_name || `${latitude}, ${longitude}`;

      setState({ loading: false, error: null, address });
      return address;
    } catch (err) {
      const message = err instanceof GeolocationPositionError
        ? 'Permissão de localização negada'
        : 'Erro ao obter localização';
      setState({ loading: false, error: message, address: null });
      return null;
    }
  }, []);

  return { ...state, getLocation };
}
