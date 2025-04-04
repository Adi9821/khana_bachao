
import React from "react";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FoodItemData } from "./FoodItemForm";

interface ExpiryAlertsProps {
  foodData: FoodItemData | null;
  expiryDays: number | null;
}

const ExpiryAlerts: React.FC<ExpiryAlertsProps> = ({ foodData, expiryDays }) => {
  if (!foodData || expiryDays === null) return null;

  // Determine alert type based on expiry days
  const getAlertInfo = () => {
    if (expiryDays < 2) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-danger-500" />,
        title: "Critical Expiry Alert",
        description: `${foodData.name} will expire within 2 days! Consume immediately.`,
        variant: "destructive" as const,
        actionText: "Add to Shopping List"
      };
    } else if (expiryDays < 4) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-warning-500" />,
        title: "Expiry Warning",
        description: `${foodData.name} will expire in ${Math.round(expiryDays)} days. Plan to use it soon.`,
        variant: "default" as const,
        actionText: "Set Reminder"
      };
    } else {
      return {
        icon: <Info className="h-5 w-5 text-freshGreen-500" />,
        title: "Storage Tip",
        description: `Optimize ${foodData.name} freshness by adjusting storage conditions.`,
        variant: "default" as const,
        actionText: "View Storage Tips"
      };
    }
  };

  const alertInfo = getAlertInfo();

  return (
    <Alert variant={alertInfo.variant} className="mb-4 animate-fade-in border-l-4 border-l-warning-500">
      <div className="flex items-center">
        {alertInfo.icon}
        <div className="ml-2">
          <AlertTitle>{alertInfo.title}</AlertTitle>
          <AlertDescription className="mt-1">
            {alertInfo.description}
          </AlertDescription>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button 
          size="sm" 
          variant="outline"
          className={alertInfo.variant === "destructive" ? "border-danger-500 text-danger-500 hover:bg-danger-50" : ""}
          onClick={() => console.log(`Action clicked for ${foodData.name}`)}
        >
          {alertInfo.actionText}
        </Button>
      </div>
    </Alert>
  );
};

export default ExpiryAlerts;
