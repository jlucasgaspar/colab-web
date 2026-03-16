'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/reports/status-badge';
import { PriorityBadge } from '@/components/reports/priority-badge';
import { api } from '@/lib/api';
import type { Report } from '@/lib/validations';

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Report>(`/reports/${id}`)
      .then(setReport)
      .catch((err) => {
        toast.error(err.message);
        router.replace('/reports');
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button
        variant="ghost"
        className="cursor-pointer gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl">{report.title}</CardTitle>
            <StatusBadge status={report.status} />
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {report.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(report.createdAt).toLocaleDateString('pt-BR')}
            </span>
            {report.updatedAt !== report.createdAt && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Atualizado em {new Date(report.updatedAt).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {(report.category || report.priority) && (
            <div className="flex flex-wrap items-center gap-3">
              {report.category && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Categoria:</span>
                  <span className="text-sm">{report.category}</span>
                </div>
              )}
              {report.priority && <PriorityBadge priority={report.priority} />}
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Descrição</h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {report.description}
            </p>
          </div>

          {report.technicalSummary && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Resumo Técnico (IA)</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {report.technicalSummary}
                </p>
              </div>
            </>
          )}

          {report.imageUrl && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Foto</h3>
                <img
                  src={report.imageUrl}
                  alt={report.title}
                  className="max-h-80 w-full rounded-lg object-cover"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
