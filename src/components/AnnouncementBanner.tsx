import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, Clock } from "lucide-react";
import { useTrainStatus } from "@/hooks/useTrainStatus";

const AnnouncementBanner = () => {
  const { trains } = useTrainStatus();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const delayed = (trains || []).filter((t: any) => String(t.status).toLowerCase().includes('delay'));
  if (delayed.length === 0) return null;

  const title = 'Service Delays';
  const message = `${delayed.length} train${delayed.length>1?'s':''} currently delayed. Example: ${delayed[0].id} delayed by ${delayed[0].delay || 0} min.`;
  const timestamp = new Date().toISOString();

  return (
    <div className="space-y-2">
      <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800 animate-slide-in-right">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <AlertTriangle size={16} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm">{title}</h4>
                <div className="flex items-center gap-1 text-xs opacity-75">
                  <Clock size={12} />
                  {new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <AlertDescription className="text-sm">
                {message}
              </AlertDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-black/10"
            onClick={(e) => {
              const el = (e.currentTarget.closest('.animate-slide-in-right') as HTMLElement);
              if (el) el.style.display = 'none';
            }}
          >
            <X size={14} />
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default AnnouncementBanner;