import { useState, useEffect } from 'react';
import type { Activity } from '@/lib/types';

const STORAGE_KEY = 'activities';

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setActivities(JSON.parse(stored));
    }
  }, []);

  const saveActivities = (newActivities: Activity[]) => {
    setActivities(newActivities);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newActivities));
  };

  const addActivity = (activity: Omit<Activity, 'id' | 'createdAt' | 'comments'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      comments: []
    };
    saveActivities([...activities, newActivity]);
  };

  const updateActivity = (id: number, updates: Partial<Activity>) => {
    const updated = activities.map(a => 
      a.id === id ? { ...a, ...updates, lastUpdated: new Date().toISOString() } : a
    );
    saveActivities(updated);
  };

  const deleteActivity = (id: number) => {
    saveActivities(activities.filter(a => a.id !== id));
  };

  const addComment = (activityId: number, text: string, author: string) => {
    const updated = activities.map(a => {
      if (a.id === activityId) {
        return {
          ...a,
          comments: [...a.comments, {
            id: Date.now(),
            text,
            author,
            timestamp: new Date().toISOString()
          }]
        };
      }
      return a;
    });
    saveActivities(updated);
  };

  const importActivities = (newActivities: Activity[]) => {
    saveActivities([...activities, ...newActivities]);
  };

  const resetAll = () => {
    localStorage.clear();
    setActivities([]);
  };

  return {
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    addComment,
    importActivities,
    resetAll,
    setActivities: saveActivities
  };
}
