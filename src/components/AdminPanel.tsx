import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { STATUSES, STATUS_COLORS } from '@/lib/constants';
import type { Activity, StatusType, StatusFilter } from '@/lib/types';

import { AddActivityModal } from '@/components/AddActivityModal';
import { EditActivityModal } from '@/components/EditActivityModal';
import { CommentsModal } from '@/components/CommentsModal';
import { LinkifyText } from '@/components/LinkifyText';
import { exportActivities, parseImportFile } from '@/lib/excelUtils';
import { cn } from '@/lib/utils';

interface AdminPanelProps {
  activities: Activity[];
  onAddActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'comments'>) => void;
  onUpdateActivity: (id: number, updates: Partial<Activity>) => void;
  onDeleteActivity: (id: number) => void;
  onAddComment: (activityId: number, text: string, author: string) => void;
  onImportActivities: (activities: Activity[]) => void;
  onResetAll: () => void;
}

export function AdminPanel({
  activities,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onAddComment,
  onImportActivities,
  onResetAll
}: AdminPanelProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editActivity, setEditActivity] = useState<Activity | null>(null);
  const [commentsActivity, setCommentsActivity] = useState<Activity | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const counts: Record<string, number> = { 'All': activities.length };
  STATUSES.forEach(s => { counts[s] = activities.filter(a => a.status === s).length; });

  const filteredActivities = statusFilter === 'All'
    ? activities
    : activities.filter(a => a.status === statusFilter);

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await parseImportFile(file);
      const newActivities = imported.map(a => ({
        ...a,
        id: Date.now() + Math.random(),
        createdAt: new Date().toISOString(),
        createdBy: 'Import',
        comments: []
      })) as Activity[];
      onImportActivities(newActivities);
      alert(`Successfully imported ${newActivities.length} activities`);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to import file');
    }
    
    e.target.value = '';
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Activities Management</h2>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            📤 Import
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileImport}
          />
          <Button variant="secondary" onClick={() => exportActivities(activities)}>
            📥 Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            + Add Activity
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 mb-6">
        <div
          onClick={() => setStatusFilter('All')}
          className={cn(
            'rounded-lg shadow p-3 sm:p-4 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-white',
            statusFilter === 'All' && 'ring-4 ring-offset-2 ring-foreground/30'
          )}
          style={{ background: 'linear-gradient(135deg, hsl(0,84%,60%), hsl(25,95%,53%), hsl(48,96%,53%), hsl(84,81%,44%), hsl(142,71%,45%))' }}
        >
          <div className="text-2xl sm:text-3xl font-bold">{counts['All']}</div>
          <div className="text-xs mt-1 opacity-90">All</div>
        </div>
        {STATUSES.map(status => (
          <div
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              'rounded-lg shadow p-3 sm:p-4 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-white',
              statusFilter === status && 'ring-4 ring-offset-2 ring-foreground/30'
            )}
            style={{ backgroundColor: STATUS_COLORS[status] }}
          >
            <div className="text-2xl sm:text-3xl font-bold">{counts[status]}</div>
            <div className="text-xs mt-1 opacity-90">{status}</div>
          </div>
        ))}
      </div>

      <h3 className="text-lg sm:text-xl font-bold mb-4 text-foreground">
        {statusFilter === 'All' ? 'All Activities' : `${statusFilter} Activities`}
        <span className="text-muted-foreground font-normal ml-2">({filteredActivities.length})</span>
      </h3>

      <div className="space-y-3 sm:space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="bg-card rounded-lg shadow p-8 text-center">
            <p className="text-muted-foreground">
              No activities {statusFilter !== 'All' ? `with status "${statusFilter}"` : ''} yet. Add your first activity!
            </p>
          </div>
        ) : (
          filteredActivities.map(activity => (
            <div
              key={activity.id}
              className="bg-card rounded-lg shadow-sm border-l-4 p-4 sm:p-6 hover:shadow-lg transition"
              style={{ borderColor: STATUS_COLORS[activity.status] }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 w-full">
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">
                    <LinkifyText text={activity.title} />
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {activity.level === 'federal' ? 'Federal' : `State: ${activity.stateName}`}
                    </span>
                    <span className="ml-2">| {activity.pillar}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                    <strong>Objective:</strong>{' '}
                    <LinkifyText text={activity.objective} />
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <span>📅 {activity.dueDate || 'No date'}</span>
                    <span>🏢 {activity.assignee || 'Unassigned'}</span>
                    <span>🎯 {activity.priority}</span>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                  <span
                    className="px-3 py-1 rounded-full text-xs sm:text-sm text-white font-medium whitespace-nowrap"
                    style={{ backgroundColor: STATUS_COLORS[activity.status] }}
                  >
                    {activity.status}
                  </span>
                  <Select
                    value={activity.status}
                    onValueChange={(v: StatusType) => onUpdateActivity(activity.id, { status: v })}
                  >
                    <SelectTrigger className="text-xs sm:text-sm flex-1 sm:flex-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {activity.nextAction && (
                <div className="bg-primary/10 border border-primary/20 rounded p-3 mt-3">
                  <p className="text-xs sm:text-sm font-medium text-primary">Next:</p>
                  <p className="text-xs sm:text-sm">
                    <LinkifyText text={activity.nextAction} />
                  </p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 pt-4 border-t">
                <button
                  onClick={() => setCommentsActivity(activity)}
                  className="text-xs sm:text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  💬 Comments ({activity.comments?.length || 0})
                </button>
                <button
                  onClick={() => setEditActivity(activity)}
                  className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this activity?')) {
                      onDeleteActivity(activity.id);
                    }
                  }}
                  className="text-xs sm:text-sm text-destructive hover:text-destructive/80 font-medium"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-6 border-t">
        <Button
          variant="destructive"
          onClick={() => {
            if (confirm('Delete ALL data? Cannot be undone!')) {
              onResetAll();
            }
          }}
        >
          Reset All Data
        </Button>
      </div>

      <AddActivityModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={onAddActivity}
        createdBy="Admin"
      />

      <EditActivityModal
        activity={editActivity}
        open={!!editActivity}
        onClose={() => setEditActivity(null)}
        onSave={onUpdateActivity}
      />

      <CommentsModal
        activity={commentsActivity}
        open={!!commentsActivity}
        onClose={() => setCommentsActivity(null)}
        onAddComment={onAddComment}
        currentUser="Admin"
      />
    </div>
  );
}
