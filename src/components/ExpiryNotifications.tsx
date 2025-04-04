
import React, { useState, useEffect } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { SavedFoodItem, getExpiringItems } from "@/utils/localStorage";
import { format } from "date-fns";
import { toast } from "sonner";

const ExpiryNotifications: React.FC = () => {
  const [expiringItems, setExpiringItems] = useState<SavedFoodItem[]>([]);
  
  // Load expiring items
  useEffect(() => {
    const loadExpiringItems = () => {
      const items = getExpiringItems(3); // Get items expiring in next 3 days
      setExpiringItems(items);
      
      // Show toast notifications for critical items (expiring in 1 day)
      const criticalItems = items.filter(item => {
        const expiryDate = new Date(item.expiryDate);
        const now = new Date();
        const diffTime = expiryDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 1;
      });
      
      if (criticalItems.length > 0) {
        criticalItems.forEach(item => {
          toast.warning(`${item.name} is expiring soon!`, {
            description: `Use it before ${format(new Date(item.expiryDate), 'MMM d')}`,
            duration: 5000,
          });
        });
      }
    };
    
    loadExpiringItems();
    
    // Check for expiring items when storage changes or component mounts
    window.addEventListener('storage', loadExpiringItems);
    window.addEventListener('fooditem-saved', loadExpiringItems);
    
    // Set up periodic checks (every 1 hour)
    const interval = setInterval(loadExpiringItems, 60 * 60 * 1000);
    
    return () => {
      window.removeEventListener('storage', loadExpiringItems);
      window.removeEventListener('fooditem-saved', loadExpiringItems);
      clearInterval(interval);
    };
  }, []);
  
  if (expiringItems.length === 0) {
    return (
      <Card className="mb-4 animate-fade-in">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <BellOff className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium">No expiring items</h3>
              <p className="text-sm text-muted-foreground">
                All your food items are safe for now
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 animate-fade-in border-l-4 border-l-warning-500">
      <CardHeader className="py-3 px-4 bg-warning-50">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-4 w-4 text-warning-500" />
          <span>Expiry Notifications</span>
          <Badge variant="outline" className="ml-auto bg-warning-100 text-warning-700 border-warning-200">
            {expiringItems.length} item{expiringItems.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y max-h-[200px] overflow-y-auto">
          {expiringItems.map(item => {
            const expiryDate = new Date(item.expiryDate);
            const now = new Date();
            const diffTime = expiryDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const isCritical = diffDays <= 1;
            
            return (
              <li key={item.id} className={`p-3 flex items-center justify-between ${isCritical ? 'bg-danger-50' : ''}`}>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Expires {format(expiryDate, 'MMM d')} 
                    ({diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : `in ${diffDays} days`})
                  </div>
                </div>
                
                <Button size="sm" variant={isCritical ? "destructive" : "outline"}>
                  {isCritical ? 'Use Now' : 'Remind Me'}
                </Button>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ExpiryNotifications;
