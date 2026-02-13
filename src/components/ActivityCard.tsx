import type { Activity } from '@/lib/types';
import { STATUS_COLORS, STATUS_PERCENTAGES } from '@/lib/constants';
import { LinkifyText } from './LinkifyText';

interface ActivityCardProps {
  activity: Activity;
  onClick: () => void;
}

export function ActivityCard({ activity, onClick }: ActivityCardProps) {
  const percentage = STATUS_PERCENTAGES[activity.status];
  const statusColor = STATUS_COLORS[activity.status];

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-lg p-3 sm:p-4 border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ 
        borderColor: statusColor,
        background: `linear-gradient(135deg, hsl(var(--card)) 0%, ${statusColor}15 100%)`
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span 
          className="text-xs px-2 py-1 rounded-full text-white font-medium"
          style={{ backgroundColor: statusColor }}
        >
          {activity.status}
        </span>
        <span 
          className="text-xs font-bold"
          style={{ color: statusColor }}
        >
          {percentage}%
        </span>
        {activity.level === 'state' && activity.stateName && (
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
            {activity.stateName}
          </span>
        )}
      </div>
      <h4 className="font-bold text-foreground mb-2 text-sm">
        <LinkifyText text={activity.title} />
      </h4>
      <p className="text-xs text-muted-foreground mb-1">
        <strong>Pillar:</strong> {activity.pillar}
      </p>
      <p className="text-xs text-muted-foreground">
        <strong>Objective:</strong> {activity.objectiveShort || activity.objective.substring(0, 50) + '...'}
      </p>
      {activity.dueDate && (
        <p className="text-xs text-muted-foreground mt-2">📅 {activity.dueDate}</p>
      )}
      {activity.mov && (
        <p className="text-xs text-primary mt-1">✓ MOV Submitted</p>
      )}
    </div>
  );
}
