import { cn } from '@/lib/utils';
import { STATUSES, STATUS_BG_CLASSES } from '@/lib/constants';

type StatusType = typeof STATUSES[number];

interface StatusCardProps {
  status: StatusType | 'All';
  count: number;
  isSelected: boolean;
  onClick: () => void;
}

export function StatusCard({ status, count, isSelected, onClick }: StatusCardProps) {
  const isAll = status === 'All';
  const bgClass = isAll 
    ? '' 
    : STATUS_BG_CLASSES[status as StatusType];

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-lg p-4 sm:p-6 text-white shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        !isAll && bgClass,
        isSelected && 'ring-4 ring-offset-2 ring-foreground/30'
      )}
      style={isAll ? { background: 'linear-gradient(135deg, hsl(0,84%,60%), hsl(25,95%,53%), hsl(48,96%,53%), hsl(84,81%,44%), hsl(142,71%,45%))' } : undefined}
    >
      <div className="text-2xl sm:text-4xl font-bold mb-2">{count}</div>
      <div className="text-xs sm:text-sm opacity-90">{status}</div>
    </div>
  );
}
