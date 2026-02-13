import { useState, useEffect } from 'react';
import { useActivities } from '@/hooks/useActivities';
import { Dashboard } from '@/components/Dashboard';
import { Analytics } from '@/components/Analytics';
import { AdminPanel } from '@/components/AdminPanel';
import { AdminLoginModal } from '@/components/AdminLoginModal';
import { cn } from '@/lib/utils';

type TabType = 'dashboard' | 'analytics' | 'admin';

const Index = () => {
  const {
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    addComment,
    importActivities,
    resetAll,
    setActivities
  } = useActivities();

  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Check session storage for admin auth
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('admin-auth');
    if (adminAuth === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const handleTabChange = (tab: TabType) => {
    if (tab === 'admin' && !isAdminAuthenticated) {
      setShowAdminLogin(true);
    } else {
      setCurrentTab(tab);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('admin-auth', 'true');
    setShowAdminLogin(false);
    setCurrentTab('admin');
  };

  const handleImportActivities = (newActivities: any[]) => {
    importActivities(newActivities);
  };

  const handleResetAll = () => {
    resetAll();
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('admin-auth');
    setCurrentTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                National Policy on Cosmetics Safety & Health
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Strategic Workplan Implementation Tracker
              </p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => handleTabChange('dashboard')}
              className={cn(
                'px-4 sm:px-6 py-2 rounded-lg font-medium transition whitespace-nowrap',
                currentTab === 'dashboard'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleTabChange('analytics')}
              className={cn(
                'px-4 sm:px-6 py-2 rounded-lg font-medium transition whitespace-nowrap',
                currentTab === 'analytics'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              Analytics
            </button>
            <button
              onClick={() => handleTabChange('admin')}
              className={cn(
                'px-4 sm:px-6 py-2 rounded-lg font-medium transition whitespace-nowrap',
                currentTab === 'admin'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              Admin {isAdminAuthenticated && '✓'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {currentTab === 'dashboard' && <Dashboard activities={activities} />}
      {currentTab === 'analytics' && <Analytics activities={activities} />}
      {currentTab === 'admin' && isAdminAuthenticated && (
        <AdminPanel
          activities={activities}
          onAddActivity={addActivity}
          onUpdateActivity={updateActivity}
          onDeleteActivity={deleteActivity}
          onAddComment={addComment}
          onImportActivities={handleImportActivities}
          onResetAll={handleResetAll}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        open={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
};

export default Index;
