import { Link } from "react-router-dom";
import { 
  Home, 
  Gauge, 
  Train, 
  Map, 
  Ticket, 
  User, 
  HelpCircle, 
  Bell, 
  Info,
  Shield,
  Activity,
  Users,
  FileText,
  Settings,
  BarChart3,
  AlertTriangle,
  Zap,
  Calendar,
  Database,
  MessageSquare,
  CreditCard,
  Route,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  MapPin
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// Add proper types
interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const { user, isAdmin } = useAuth();
  
  return (
    <aside 
      className={cn(
        "transition-all duration-300 ease-in-out overflow-hidden shadow-lg rounded-r-2xl bg-gray-900 border-r border-gray-700",
        isOpen ? "w-72" : "w-0 md:w-16"
      )}
    >
      <div className="h-full flex flex-col py-6">
        <div className="px-6 mb-8">
          {isOpen && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">TrackWise</h2>
              <p className="text-sm text-gray-300">Railway Management</p>
            </div>
          )}
        </div>
        
        <nav className="flex-1 px-3">
          <div className="space-y-2">
            <SidebarLink to="/" icon={Home} label="Home" isOpen={isOpen} />
            
            {user && isAdmin && (
              <>
                {/* Collision Detection (kept) */}
                <SidebarLink to="/admin/collision" icon={AlertTriangle} label="Collision Detection" isOpen={isOpen} />
                {/* Priority Tickets Management */}
                <SidebarLink to="/admin/priority-tickets" icon={Star} label="Priority Tickets" isOpen={isOpen} />
                {/* Energy Management with Platform Lighting subpage */}
                <SidebarLink to="/admin/energy" icon={Zap} label="Energy Management" isOpen={isOpen} />
                {/* AI Station Management (empty page) */}
                <SidebarLink to="/admin/ai-station" icon={Shield} label="AI Station Management" isOpen={isOpen} />
              </>
            )}
            
            {user && !isAdmin && (
              <>
                <SidebarLink to="/passenger" icon={Gauge} label="Passenger Portal" isOpen={isOpen} />
                <SidebarLink to="/train-status" icon={Train} label="Train Status" isOpen={isOpen} />
                <SidebarLink to="/stations" icon={MapPin} label="Stations" isOpen={isOpen} />
                <SidebarLink to="/trip-planner" icon={Route} label="Trip Planner" isOpen={isOpen} />
                <SidebarLink to="/book-ticket" icon={Ticket} label="Book Ticket" isOpen={isOpen} />
                <SidebarLink to="/help" icon={HelpCircle} label="Help" isOpen={isOpen} />
              </>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isOpen: boolean;
}

const SidebarLink = ({ to, icon: Icon, label, isOpen }: SidebarLinkProps) => {
  if (isOpen) {
    return (
      <Link 
        to={to} 
        className={cn(
          "group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200",
          "text-gray-300 hover:text-white hover:bg-gray-800",
          isOpen ? "justify-start" : "justify-center"
        )}
      >
        <Icon className={cn(
          "flex-shrink-0 transition-transform group-hover:scale-110",
          isOpen ? "h-5 w-5" : "h-6 w-6"
        )} />
        {isOpen && <span className="ml-3 font-medium">{label}</span>}
      </Link>
    );
  }
  // Collapsed: show tooltip on icon hover
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link 
          to={to} 
          className={cn(
            "group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200",
            "text-gray-300 hover:text-white hover:bg-gray-800",
            "justify-center"
          )}
        >
          <Icon className="flex-shrink-0 transition-transform group-hover:scale-110 h-6 w-6" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" align="center">
        {label}
      </TooltipContent>
    </Tooltip>
  );
};

export default Sidebar;
