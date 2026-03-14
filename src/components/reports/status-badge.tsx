import { Badge } from '@/components/ui/badge';
import { REPORT_STATUSES, type ReportStatus } from '@/lib/validations';

export function StatusBadge({ status }: { status: ReportStatus }) {
  const config = REPORT_STATUSES[status];
  return (
    <Badge variant="outline" className={`${config.color} border-0 font-medium`}>
      {config.label}
    </Badge>
  );
}
