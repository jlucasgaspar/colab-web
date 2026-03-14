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
                <Input
                  id="title"
                  placeholder="Ex: Buraco na calçada"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <VoiceInputButton
                  onResult={(text) => setTitle((prev) => prev ? `${prev} ${text}` : text)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <div className="flex gap-2">
                <Textarea
                  id="description"
                  placeholder="Descreva o problema com detalhes..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <VoiceInputButton
                  onResult={(text) =>
                    setDescription((prev) => prev ? `${prev} ${text}` : text)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Ex: Rua das Flores, 123 - Centro"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
                <VoiceInputButton
                  onResult={(text) =>
                    setLocation((prev) => prev ? `${prev} ${text}` : text)
                  }
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
