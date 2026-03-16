'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, MapPin, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VoiceInputButton } from '@/components/reports/voice-input-button';
import { useGeolocation } from '@/hooks/use-geolocation';
import { api } from '@/lib/api';
import { reportSchema } from '@/lib/validations';

export default function NewReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [listeningField, setListeningField] = useState<string | null>(null);

  const { loading: geoLoading, getLocation } = useGeolocation();

  const handleGetLocation = useCallback(async () => {
    const address = await getLocation();
    if (address) {
      setLocation(address);
      toast.success('Localização obtida!');
    }
  }, [getLocation]);

  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setImagePreview(URL.createObjectURL(file));
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post<{ url: string }>('/upload/image', formData);
        setImageUrl(res.url);
        toast.success('Imagem enviada!');
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Erro ao enviar imagem',
        );
        setImagePreview(null);
      } finally {
        setUploading(false);
      }
    },
    [],
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = { title, description, location, imageUrl: imageUrl ?? undefined };
    const result = reportSchema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      await api.post('/reports', result.data);
      toast.success('Solicitação criada! A IA está processando sua triagem.');
      router.push('/reports');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao criar solicitação',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Relatar Problema Urbano</h1>
        <p className="text-muted-foreground">
          Descreva o problema e nossa IA fará a triagem automaticamente
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Problema</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="title"
                    placeholder={listeningField === 'title' ? 'Ouvindo...' : 'Ex: Buraco na calçada'}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={listeningField === 'title' ? 'border-red-400 ring-2 ring-red-200 text-muted-foreground' : ''}
                  />
                  {listeningField === 'title' && (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500 animate-pulse">
                      Ouvindo...
                    </span>
                  )}
                </div>
                <VoiceInputButton
                  onStart={() => setTitle('')}
                  onInterim={(text) => setTitle(text)}
                  onResult={(text) => setTitle(text)}
                  onListeningChange={(listening) => setListeningField(listening ? 'title' : null)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Textarea
                    id="description"
                    placeholder={listeningField === 'description' ? 'Ouvindo...' : 'Descreva o problema com detalhes...'}
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className={listeningField === 'description' ? 'border-red-400 ring-2 ring-red-200 text-muted-foreground' : ''}
                  />
                  {listeningField === 'description' && (
                    <span className="pointer-events-none absolute right-3 top-3 text-xs text-red-500 animate-pulse">
                      Ouvindo...
                    </span>
                  )}
                </div>
                <VoiceInputButton
                  onStart={() => setDescription('')}
                  onInterim={(text) => setDescription(text)}
                  onResult={(text) => setDescription(text)}
                  onListeningChange={(listening) => setListeningField(listening ? 'description' : null)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="location"
                    placeholder={listeningField === 'location' ? 'Ouvindo...' : 'Ex: Rua das Flores, 123 - Centro'}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className={listeningField === 'location' ? 'border-red-400 ring-2 ring-red-200 text-muted-foreground' : ''}
                  />
                  {listeningField === 'location' && (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500 animate-pulse">
                      Ouvindo...
                    </span>
                  )}
                </div>
                <VoiceInputButton
                  onStart={() => setLocation('')}
                  onInterim={(text) => setLocation(text)}
                  onResult={(text) => setLocation(text)}
                  onListeningChange={(listening) => setListeningField(listening ? 'location' : null)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0 cursor-pointer"
                  onClick={handleGetLocation}
                  disabled={geoLoading}
                  title="Usar minha localização atual"
                >
                  {geoLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Foto (opcional)</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                  {uploading ? 'Enviando...' : 'Tirar Foto / Enviar'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading || uploading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Solicitação
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
