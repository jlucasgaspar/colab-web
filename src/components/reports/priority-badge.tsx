import { Badge } from '@/components/ui/badge';
import { PRIORITIES, type Priority } from '@/lib/validations';

export function PriorityBadge({ priority }: { priority: Priority | null }) {
  if (!priority) return null;
  const config = PRIORITIES[priority];
  return (
    <Badge variant="outline" className={`${config.color} border-0 font-medium`}>
      {config.label}
    </Badge>
  );
}
