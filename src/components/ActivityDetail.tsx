import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Activity } from '@/lib/types';
import { STATUS_COLORS, STATUS_PERCENTAGES } from '@/lib/constants';
import { LinkifyText } from './LinkifyText';

interface ActivityDetailProps {
  activity: Activity | null;
  open: boolean;
  onClose: () => void;
}

export function ActivityDetail({ activity, open, onClose }: ActivityDetailProps) {
  if (!activity) return null;

  const percentage = STATUS_PERCENTAGES[activity.status];
  const statusColor = STATUS_COLORS[activity.status];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
            <LinkifyText text={activity.title} />
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm font-semibold text-primary mb-2">Pillar</p>
            <p className="text-foreground">{activity.pillar}</p>
          </div>
          
          <div className="bg-accent border border-accent-foreground/10 rounded-lg p-4">
            <p className="text-sm font-semibold text-accent-foreground mb-2">Objective</p>
            <p className="text-foreground">
              <LinkifyText text={activity.objective} />
            </p>
          </div>
          
          {activity.description && (
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">KPI</p>
              <p className="text-muted-foreground">
                <LinkifyText text={activity.description} />
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border rounded-lg p-3">
              <p className="text-sm font-semibold text-muted-foreground mb-2">Status</p>
              <span 
                className="inline-block px-3 py-1 rounded-full text-sm text-white font-medium"
                style={{ backgroundColor: statusColor }}
              >
                {activity.status} ({percentage}%)
              </span>
            </div>
            <div className="bg-card border rounded-lg p-3">
              <p className="text-sm font-semibold text-muted-foreground mb-2">Priority</p>
              <p className="text-foreground">{activity.priority}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border rounded-lg p-3">
              <p className="text-sm font-semibold text-muted-foreground mb-2">Due Date</p>
              <p className="text-foreground">{activity.dueDate || 'Not set'}</p>
            </div>
            <div className="bg-card border rounded-lg p-3">
              <p className="text-sm font-semibold text-muted-foreground mb-2">Responsible Org</p>
              <p className="text-foreground">{activity.assignee || 'Unassigned'}</p>
            </div>
          </div>

          {activity.level === 'state' && activity.stateName && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">State</p>
              <p className="text-blue-800">{activity.stateName}</p>
            </div>
          )}
          
          {activity.nextAction && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-900 mb-2">Next Action</p>
              <p className="text-yellow-800">
                <LinkifyText text={activity.nextAction} />
              </p>
            </div>
          )}
          
          {activity.mov && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm font-semibold text-primary mb-2">MOV</p>
              <p className="text-foreground">
                <LinkifyText text={activity.mov} />
              </p>
            </div>
          )}
          
          {activity.comments && activity.comments.length > 0 && (
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-3">Comments</p>
              {activity.comments.map(c => (
                <div key={c.id} className="bg-card rounded p-3 mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-sm">{c.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">
                    <LinkifyText text={c.text} />
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
