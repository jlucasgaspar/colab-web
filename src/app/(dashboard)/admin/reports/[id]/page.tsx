'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, Calendar, Clock, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/reports/status-badge';
import { PriorityBadge } from '@/components/reports/priority-badge';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import {
  REPORT_STATUSES,
  type Report,
  type ReportStatus,
} from '@/lib/validations';

export default function AdminReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.replace('/reports');
      return;
    }
    api
      .get<Report>(`/reports/${id}`)
      .then(setReport)
      .catch((err) => {
        toast.error(err.message);
        router.replace('/admin/reports');
      })
      .finally(() => setLoading(false));
  }, [id, user, router]);

  async function handleStatusChange(newStatus: ReportStatus) {
    if (!report) return;
    setUpdatingStatus(true);
    try {
      const updated = await api.patch<Report>(`/reports/${report.id}/status`, {
        status: newStatus,
      });
      setReport((prev) => (prev ? { ...prev, ...updated } : prev));
      toast.success('Status atualizado!');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao atualizar status',
      );
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleDelete() {
    if (!report) return;
    setDeleting(true);
    try {
      await api.delete(`/reports/${report.id}`);
      toast.success('Relato excluído com sucesso!');
      router.replace('/admin/reports');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao excluir relato',
      );
    } finally {
      setDeleting(false);
    }
  }

  if (user?.role !== 'ADMIN') return null;

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
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="cursor-pointer gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <Dialog>
          <DialogTrigger
            render={
              <Button
                variant="destructive"
                size="sm"
                className="cursor-pointer gap-2"
              />
            }
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir relato</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este relato? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar exclusão
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl">{report.title}</CardTitle>
            <div className="shrink-0">
              <Select
                value={report.status}
                onValueChange={(val) => handleStatusChange(val as ReportStatus)}
                disabled={updatingStatus}
              >
                <SelectTrigger className="w-[160px] cursor-pointer">
                  {updatingStatus ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SelectValue>
                      <StatusBadge status={report.status} />
                    </SelectValue>
                  )}
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(REPORT_STATUSES).map(([key, config]) => (
                    <SelectItem
                      key={key}
                      value={key}
                      className="cursor-pointer"
                    >
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            <h3 className="text-sm font-semibold">Descrição do cidadão</h3>
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
