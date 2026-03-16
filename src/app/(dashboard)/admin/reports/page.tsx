'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Calendar, MapPin } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function AdminReportsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.replace('/reports');
      return;
    }
    api
      .get<Report[]>('/reports')
      .then(setReports)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [user, router]);

  async function handleStatusChange(id: string, newStatus: ReportStatus) {
    setUpdatingId(id);
    try {
      const updated = await api.patch<Report>(`/reports/${id}/status`, {
        status: newStatus,
      });
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updated } : r)),
      );
      toast.success('Status atualizado!');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao atualizar status',
      );
    } finally {
      setUpdatingId(null);
    }
  }

  if (user?.role !== 'ADMIN') return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Painel de Administração</h1>
        <p className="text-muted-foreground">
          Gerencie todas as solicitações dos cidadãos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Todas as Solicitações ({loading ? '...' : reports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Nenhuma solicitação registrada
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Localização
                    </TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow
                      key={report.id}
                      className="cursor-pointer transition-colors hover:bg-muted/50"
                      onClick={() => router.push(`/admin/reports/${report.id}`)}
                    >
                      <TableCell className="max-w-[200px] font-medium">
                        <div className="truncate">{report.title}</div>
                        {report.technicalSummary && (
                          <div className="truncate text-xs text-muted-foreground">
                            {report.technicalSummary}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="max-w-[150px] truncate">
                            {report.location}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {report.category || '—'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={report.priority} />
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={report.status}
                          onValueChange={(val) =>
                            handleStatusChange(report.id, val as ReportStatus)
                          }
                          disabled={updatingId === report.id}
                        >
                          <SelectTrigger className="w-[150px] cursor-pointer">
                            {updatingId === report.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <SelectValue>
                                <StatusBadge status={report.status} />
                              </SelectValue>
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(REPORT_STATUSES).map(
                              ([key, config]) => (
                                <SelectItem
                                  key={key}
                                  value={key}
                                  className="cursor-pointer"
                                >
                                  {config.label}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(report.createdAt).toLocaleDateString(
                            'pt-BR',
                          )}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
