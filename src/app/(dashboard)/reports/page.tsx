'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/reports/status-badge';
import { PriorityBadge } from '@/components/reports/priority-badge';
import { api } from '@/lib/api';
import type { Report } from '@/lib/validations';

export default function MyReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Report[]>('/reports/my')
      .then(setReports)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Minhas Solicitações</h1>
          <p className="text-muted-foreground">
            Acompanhe o status dos seus relatos
          </p>
        </div>
        <Link href="/reports/new">
          <Button className="cursor-pointer gap-2">
            <PlusCircle className="h-4 w-4" />
            Novo Relato
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Nenhuma solicitação ainda
            </p>
            <p className="mb-4 text-sm text-muted-foreground">
              Crie seu primeiro relato de problema urbano
            </p>
            <Link href="/reports/new">
              <Button className="cursor-pointer gap-2">
                <PlusCircle className="h-4 w-4" />
                Novo Relato
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <Link key={report.id} href={`/reports/${report.id}`}>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-tight">
                      {report.title}
                    </CardTitle>
                    <StatusBadge status={report.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {report.category && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Categoria:
                      </span>
                      <span className="text-sm">{report.category}</span>
                      {report.priority && (
                        <PriorityBadge priority={report.priority} />
                      )}
                    </div>
                  )}
                  {report.technicalSummary && (
                    <p className="text-sm text-muted-foreground">
                      {report.technicalSummary}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {report.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(report.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
