import { useState } from 'react';
import { useActivities } from '@/hooks/useActivities';
import { STATUSES, STATUS_COLORS } from '@/lib/constants';
import type { Activity, StatusFilter } from '@/lib/types';
import { StatusCard } from '@/components/StatusCard';
import { ActivityCard } from '@/components/ActivityCard';
import { ActivityDetail } from '@/components/ActivityDetail';
import { cn } from '@/lib/utils';

type ViewType = 'federal' | 'state';

interface DashboardProps {
  activities: Activity[];
}

export function Dashboard({ activities }: DashboardProps) {
  const [view, setView] = useState<ViewType>('federal');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const filteredByLevel = activities.filter(a => a.level === view);
  
  const filteredActivities = statusFilter === 'All' 
    ? filteredByLevel 
    : filteredByLevel.filter(a => a.status === statusFilter);

  const counts: Record<string, number> = { 'All': filteredByLevel.length };
  STATUSES.forEach(s => { counts[s] = filteredByLevel.filter(a => a.status === s).length; });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Strategic Overview</h2>
        <div className="flex gap-2">
          <button
            onClick={() => { setView('federal'); setStatusFilter('All'); }}
            className={cn(
              'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
              view === 'federal' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            Federal
          </button>
          <button
            onClick={() => { setView('state'); setStatusFilter('All'); }}
            className={cn(
              'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
              view === 'state' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            State
          </button>
        </div>
      </div>

      {/* Status Cards - Including "All" */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 mb-8">
        <StatusCard
          status="All"
          count={counts['All']}
          isSelected={statusFilter === 'All'}
          onClick={() => setStatusFilter('All')}
        />
        {STATUSES.map(status => (
          <StatusCard
            key={status}
            status={status}
            count={counts[status]}
            isSelected={statusFilter === status}
            onClick={() => setStatusFilter(status)}
          />
        ))}
      </div>

      <h3 className="text-lg sm:text-xl font-bold mb-4 text-foreground">
        {statusFilter === 'All' ? 'All Activities' : `${statusFilter} Activities`}
        <span className="text-muted-foreground font-normal ml-2">({filteredActivities.length})</span>
      </h3>

      {filteredActivities.length === 0 ? (
        <div className="bg-card rounded-lg shadow p-8 sm:p-12 text-center">
          <p className="text-muted-foreground">
            No {view} level activities {statusFilter !== 'All' ? `with status "${statusFilter}"` : ''} yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredActivities.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onClick={() => setSelectedActivity(activity)}
            />
          ))}
        </div>
      )}

      <ActivityDetail
        activity={selectedActivity}
        open={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
}
