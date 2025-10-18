import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, Info, CheckCircle, Clock } from "lucide-react";

interface Announcement {
  id: string;
  type: 'info' | 'warning' | 'success' | 'emergency';
  title: string;
  message: string;
  timestamp: string;
  dismissible?: boolean;
  autoHide?: boolean;
  duration?: number;
}

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Service Delay',
      message: 'Express Line 101 is delayed by 15 minutes due to signal maintenance.',
      timestamp: new Date().toISOString(),
      dismissible: true,
      autoHide: false
    },
    {
      id: '2',
      type: 'info',
      title: 'Platform Change',
      message: 'Train REG205 will depart from Platform 3 instead of Platform 1.',
      timestamp: new Date().toISOString(),
      dismissible: true,
      autoHide: true,
      duration: 10000
    }
  ]);

  const [visibleAnnouncements, setVisibleAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    // Show announcements with staggered timing
    announcements.forEach((announcement, index) => {
      setTimeout(() => {
        setVisibleAnnouncements(prev => [...prev, announcement.id]);
        
        // Auto-hide if specified
        if (announcement.autoHide && announcement.duration) {
          setTimeout(() => {
            dismissAnnouncement(announcement.id);
          }, announcement.duration);
        }
      }, index * 500);
    });
  }, []);

  const dismissAnnouncement = (id: string) => {
    setVisibleAnnouncements(prev => prev.filter(announcementId => announcementId !== id));
  };

  const getIcon = (type: Announcement['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={16} />;
      case 'success':
        return <CheckCircle size={16} />;
      case 'emergency':
        return <AlertTriangle size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  const getAlertStyle = (type: Announcement['type']) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'emergency':
        return 'border-red-200 bg-red-50 text-red-800';
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (announcements.length === 0) return null;

  return (
    <div className="space-y-2">
      {announcements
        .filter(announcement => visibleAnnouncements.includes(announcement.id))
        .map((announcement) => (
          <Alert 
            key={announcement.id} 
            className={`${getAlertStyle(announcement.type)} animate-slide-in-right`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getIcon(announcement.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{announcement.title}</h4>
                    <div className="flex items-center gap-1 text-xs opacity-75">
                      <Clock size={12} />
                      {formatTime(announcement.timestamp)}
                    </div>
                  </div>
                  <AlertDescription className="text-sm">
                    {announcement.message}
                  </AlertDescription>
                </div>
              </div>
              
              {announcement.dismissible && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-black/10"
                  onClick={() => dismissAnnouncement(announcement.id)}
                >
                  <X size={14} />
                </Button>
              )}
            </div>
          </Alert>
        ))}
    </div>
  );
};

export default AnnouncementBanner;