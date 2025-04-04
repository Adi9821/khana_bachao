
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Info } from "lucide-react";
import { format, formatDistance } from "date-fns";
import { SavedFoodItem, deleteFoodItem, getSavedFoodItems } from "@/utils/localStorage";
import { toast } from "sonner";

const SavedFoodItems: React.FC = () => {
  const [items, setItems] = useState<SavedFoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load items on component mount
  useEffect(() => {
    const loadItems = () => {
      setLoading(true);
      const savedItems = getSavedFoodItems();
      setItems(savedItems);
      setLoading(false);
    };

    loadItems();
    
    // Add event listener to update items when storage changes
    window.addEventListener('storage', loadItems);
    
    // Custom event to refresh the list when new items are added
    window.addEventListener('fooditem-saved', loadItems);
    
    return () => {
      window.removeEventListener('storage', loadItems);
      window.removeEventListener('fooditem-saved', loadItems);
    };
  }, []);

  const handleDelete = (id: string, name: string) => {
    try {
      deleteFoodItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success(`Removed ${name} from your tracked items`);
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  // Get expiry status color
  const getExpiryStatusColor = (expiryDays: number) => {
    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setDate(today.getDate() + expiryDays);
    
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "bg-gray-400"; // Expired
    if (diffDays <= 2) return "bg-danger-500"; // Critical
    if (diffDays <= 5) return "bg-warning-500"; // Warning
    return "bg-freshGreen-500"; // Good
  };

  if (loading) {
    return (
      <Card className="h-full animate-pulse">
        <CardContent className="p-6">
          <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-24 bg-gray-100 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
          <Info className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
          <p className="text-lg font-medium">No saved food items</p>
          <p className="text-muted-foreground mt-1">
            Add food items using the form on the left to track their expiry dates
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-lg">Your Saved Food Items</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[400px] overflow-y-auto">
          <ul className="divide-y">
            {items.map((item) => {
              const expiryStatusColor = getExpiryStatusColor(item.expiryDays);
              const expiryDate = new Date(item.expiryDate);
              const now = new Date();
              const isExpired = expiryDate < now;
              
              return (
                <li key={item.id} className="p-4 hover:bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        <Badge variant="outline" className="capitalize">
                          {item.category}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mt-1">
                        {isExpired ? (
                          <span className="text-danger-600 font-medium">Expired</span>
                        ) : (
                          <>
                            Expires {format(expiryDate, 'MMM d')} ({' '}
                            <span className="font-medium">
                              {formatDistance(expiryDate, now, { addSuffix: true })}
                            </span>
                            )
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${expiryStatusColor}`}></div>
                        <span className="text-xs">
                          {item.temperature}°C, {item.humidity}% humidity, {item.packaging} packaging
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(item.id, item.name)}
                      className="text-muted-foreground hover:text-danger-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedFoodItems;
