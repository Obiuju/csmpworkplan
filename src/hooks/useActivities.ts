import { useState, useEffect } from 'react';
import type { Activity } from '@/lib/types';
import { api } from '@/lib/api';

const STORAGE_KEY = 'activities';

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Load activities from MongoDB on mount
  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await api.getWorkplans();
      setActivities(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Error loading activities:', err);
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setActivities(JSON.parse(stored));
      }
    } finally {
      setLoading(false);
    }
  };

  const saveActivities = (newActivities: Activity[]) => {
    setActivities(newActivities);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newActivities));
  };

  const addActivity = async (activity: Omit<Activity, 'id' | 'createdAt' | 'comments'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      comments: []
    };
    
    try {
      await api.createWorkplan(newActivity);
      await loadActivities();
    } catch (err) {
      console.error('Error adding activity:', err);
      saveActivities([...activities, newActivity]);
    }
  };

  const updateActivity = async (id: number, updates: Partial<Activity>) => {
    const activity = activities.find(a => a.id === id);
    if (!activity) return;

    const updatedActivity = { 
      ...activity, 
      ...updates, 
      lastUpdated: new Date().toISOString() 
    };

    try {
      await api.updateWorkplan((activity as any)._id || String(id), updatedActivity);
      await loadActivities();
    } catch (err) {
      console.error('Error updating activity:', err);
      const updated = activities.map(a => a.id === id ? updatedActivity : a);
      saveActivities(updated);
    }
  };

  const deleteActivity = async (id: number) => {
    const activity = activities.find(a => a.id === id);
    if (!activity) return;

    try {
      await api.deleteWorkplan((activity as any)._id || String(id));
      await loadActivities();
    } catch (err) {
      console.error('Error deleting activity:', err);
      saveActivities(activities.filter(a => a.id !== id));
    }
  };

  const addComment = async (activityId: number, text: string, author: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;

    const updatedActivity = {
      ...activity,
      comments: [...activity.comments, {
        id: Date.now(),
        text,
        author,
        timestamp: new Date().toISOString()
      }]
    };

    try {
      await api.updateWorkplan((activity as any)._id || String(activityId), updatedActivity);
      await loadActivities();
    } catch (err) {
      console.error('Error adding comment:', err);
      const updated = activities.map(a => a.id === activityId ? updatedActivity : a);
      saveActivities(updated);
    }
  };

  const importActivities = async (newActivities: Activity[]) => {
    try {
      for (const activity of newActivities) {
        await api.createWorkplan(activity);
      }
      await loadActivities();
    } catch (err) {
      console.error('Error importing activities:', err);
      saveActivities([...activities, ...newActivities]);
    }
  };

  const resetAll = async () => {
    try {
      for (const activity of activities) {
        if ((activity as any)._id) {
          await api.deleteWorkplan((activity as any)._id);
        }
      }
      localStorage.clear();
      setActivities([]);
    } catch (err) {
      console.error('Error resetting:', err);
      localStorage.clear();
      setActivities([]);
    }
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
