import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { PILLARS, OBJECTIVES, STATUSES, STATUS_COLORS } from '@/lib/constants';
import type { Activity } from '@/lib/types';
import { cn } from '@/lib/utils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ViewType = 'federal' | 'state';

interface AnalyticsProps {
  activities: Activity[];
}

export function Analytics({ activities }: AnalyticsProps) {
  const [view, setView] = useState<ViewType>('federal');
  const [drillPillar, setDrillPillar] = useState<string | null>(null);
  
  const filtered = activities.filter(a => a.level === view);

  // Find pillar key from pillar full name
  const pillarEntries = Object.entries(PILLARS);

  const handleBarClick = (_event: any, elements: any[]) => {
    if (!elements.length) return;
    const index = elements[0].index;
    if (drillPillar) return; // Already drilled down
    const pillarKey = pillarEntries[index]?.[0];
    if (pillarKey) setDrillPillar(pillarKey);
  };

  const getMainChartData = () => {
    const labels = pillarEntries.map(([, name]) => {
      // Shorten to "Pillar 1", "Pillar 2", "Pillar 3"
      const match = name.match(/Pillar \d/);
      return match ? match[0] : name;
    });

    const datasets = STATUSES.map(status => ({
      label: status,
      data: pillarEntries.map(([, pillarName]) =>
        filtered.filter(a => a.pillar === pillarName && a.status === status).length
      ),
      backgroundColor: STATUS_COLORS[status],
      borderWidth: 1
    }));

    return { labels, datasets };
  };

  const getDrillChartData = () => {
    if (!drillPillar) return null;
    const pillarName = PILLARS[drillPillar as keyof typeof PILLARS];
    const objectives = OBJECTIVES[drillPillar] || [];
    
    const labels = objectives.map(o => o.short);

    const datasets = STATUSES.map(status => ({
      label: status,
      data: objectives.map(obj =>
        filtered.filter(a => 
          a.pillar === pillarName && 
          (a.objective === obj.full || a.objectiveShort === obj.short) && 
          a.status === status
        ).length
      ),
      backgroundColor: STATUS_COLORS[status],
      borderWidth: 1
    }));

    return { labels, datasets };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: drillPillar ? undefined : handleBarClick,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: {
        callbacks: {
          title: (items: any[]) => {
            if (drillPillar && items[0]) {
              const objectives = OBJECTIVES[drillPillar] || [];
              const obj = objectives[items[0].dataIndex];
              return obj ? obj.full : items[0].label;
            }
            if (items[0]) {
              return pillarEntries[items[0].dataIndex]?.[1] || items[0].label;
            }
            return '';
          }
        }
      }
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  const mainData = getMainChartData();
  const drillData = getDrillChartData();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Analytics & Insights</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView('federal')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
              view === 'federal' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            )}
          >
            Federal
          </button>
          <button
            onClick={() => setView('state')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
              view === 'state' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            )}
          >
            State
          </button>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold">
            {drillPillar
              ? PILLARS[drillPillar as keyof typeof PILLARS]
              : 'Activities by Pillar & Status'}
          </h3>
          {drillPillar && (
            <button
              onClick={() => setDrillPillar(null)}
              className="px-3 py-1 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              ← Back to Pillars
            </button>
          )}
        </div>
        {!drillPillar && (
          <p className="text-xs text-muted-foreground mb-4">Click a pillar bar to drill down into objectives</p>
        )}
        <div style={{ height: '400px', position: 'relative' }}>
          <Bar
            data={drillPillar ? drillData! : mainData}
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
}
