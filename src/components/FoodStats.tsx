
import React, { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { SavedFoodItem, getExpiringItems, getSavedFoodItems } from "@/utils/localStorage";
import { Chart, ChartData } from "react-chartjs-2";
import { 
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { AlertCircle, Check, Clock } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FoodStats: React.FC = () => {
  const [items, setItems] = useState<SavedFoodItem[]>([]);
  const [expiringItems, setExpiringItems] = useState<SavedFoodItem[]>([]);
  
  useEffect(() => {
    const loadItems = () => {
      const savedItems = getSavedFoodItems();
      setItems(savedItems);
      setExpiringItems(getExpiringItems(3));
    };

    loadItems();
    
    // Add event listeners for updates
    window.addEventListener('storage', loadItems);
    window.addEventListener('fooditem-saved', loadItems);
    
    return () => {
      window.removeEventListener('storage', loadItems);
      window.removeEventListener('fooditem-saved', loadItems);
    };
  }, []);

  if (items.length === 0) {
    return null;
  }

  // Count items by category
  const categoryCount: Record<string, number> = {};
  items.forEach(item => {
    if (categoryCount[item.category]) {
      categoryCount[item.category]++;
    } else {
      categoryCount[item.category] = 1;
    }
  });

  // Count items by expiry status
  const now = new Date();
  const expired = items.filter(item => new Date(item.expiryDate) < now).length;
  const expiringSoon = expiringItems.length;
  const safe = items.length - expired - expiringSoon;

  // Create category chart data
  const categoryData = {
    labels: Object.keys(categoryCount).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
    datasets: [
      {
        data: Object.values(categoryCount),
        backgroundColor: [
          '#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0',
        ],
      },
    ],
  };

  // Create expiry status chart data
  const expiryData = {
    labels: ['Expired', 'Expiring Soon', 'Safe'],
    datasets: [
      {
        data: [expired, expiringSoon, safe],
        backgroundColor: ['#F44336', '#FF9800', '#4CAF50'],
      },
    ],
  };

  return (
    <Card className="h-full">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-lg">Food Inventory Stats</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm mb-3">Food Categories</h3>
              <div className="aspect-square max-w-[180px] mx-auto">
                <Chart
                  type="pie"
                  data={categoryData}
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          boxWidth: 12,
                          font: {
                            size: 11
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-sm mb-3">Expiry Status</h3>
              <div className="aspect-square max-w-[180px] mx-auto">
                <Chart
                  type="doughnut"
                  data={expiryData}
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          boxWidth: 12,
                          font: {
                            size: 11
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>Add food items to see stats</p>
          </div>
        )}
        
        {/* Status summary cards */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-muted rounded-md p-3 text-center">
            <div className="flex justify-center mb-1">
              <div className="w-8 h-8 rounded-full bg-danger-100 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-danger-500" />
              </div>
            </div>
            <div className="text-xl font-bold">{expired}</div>
            <div className="text-xs text-muted-foreground">Expired</div>
          </div>
          
          <div className="bg-muted rounded-md p-3 text-center">
            <div className="flex justify-center mb-1">
              <div className="w-8 h-8 rounded-full bg-warning-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-warning-500" />
              </div>
            </div>
            <div className="text-xl font-bold">{expiringSoon}</div>
            <div className="text-xs text-muted-foreground">Expiring Soon</div>
          </div>
          
          <div className="bg-muted rounded-md p-3 text-center">
            <div className="flex justify-center mb-1">
              <div className="w-8 h-8 rounded-full bg-freshGreen-100 flex items-center justify-center">
                <Check className="h-4 w-4 text-freshGreen-500" />
              </div>
            </div>
            <div className="text-xl font-bold">{safe}</div>
            <div className="text-xs text-muted-foreground">Safe</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodStats;
