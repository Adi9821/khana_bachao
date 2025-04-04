
import React from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FoodItemData } from "./FoodItemForm";
import { Clock, Calendar } from "lucide-react";
import { format, addDays } from "date-fns";

// ML model simulation for food expiry prediction
// In a real application, this would be replaced with actual ML model predictions
const predictExpiry = (data: FoodItemData): {days: number, risk: string} => {
  // Base days for each category under normal conditions
  const baseDays: Record<string, number> = {
    fruits: 7,
    vegetables: 5,
    dairy: 7,
    meat: 3,
    bakery: 5
  };
  
  // Get base days or default to 5 if category not found
  let days = baseDays[data.category] || 5;
  
  // Temperature adjustment (temperature has strong effect)
  // Higher temperature reduces shelf life
  if (data.temperature > 30) {
    days *= 0.3; // Significant reduction
  } else if (data.temperature > 25) {
    days *= 0.6;
  } else if (data.temperature > 20) {
    days *= 0.8;
  } else if (data.temperature > 10) {
    days *= 0.9;
  } else if (data.temperature > 5) {
    days *= 1.0;
  } else if (data.temperature > 0) {
    days *= 1.5; // Cold temperatures extend shelf life
  } else {
    days *= 2.0; // Freezing greatly extends shelf life
  }
  
  // Humidity adjustment
  // Very high or very low humidity can affect shelf life
  const optimalHumidity: Record<string, number> = {
    fruits: 90,
    vegetables: 95,
    dairy: 40,
    meat: 70,
    bakery: 60
  };
  
  const categoryOptimalHumidity = optimalHumidity[data.category] || 70;
  const humidityDeviation = Math.abs(data.humidity - categoryOptimalHumidity);
  
  if (humidityDeviation > 30) {
    days *= 0.7;
  } else if (humidityDeviation > 20) {
    days *= 0.8;
  } else if (humidityDeviation > 10) {
    days *= 0.9;
  }
  
  // Packaging adjustment
  switch (data.packaging) {
    case 'vacuum':
      days *= 2.0; // Vacuum sealing significantly extends shelf life
      break;
    case 'plastic':
      days *= 1.3;
      break;
    case 'glass':
      days *= 1.4;
      break;
    case 'paper':
      days *= 1.1;
      break;
    case 'none':
      days *= 0.8; // No packaging reduces shelf life
      break;
  }
  
  // Round to 1 decimal place
  days = Math.round(days * 10) / 10;
  
  // Determine risk level
  let risk = "low";
  if (days < 2) {
    risk = "high";
  } else if (days < 4) {
    risk = "medium";
  }
  
  return { days, risk };
};

interface ExpiryPredictionProps {
  foodData: FoodItemData | null;
}

const ExpiryPrediction: React.FC<ExpiryPredictionProps> = ({ foodData }) => {
  if (!foodData) {
    return (
      <Card className="h-full flex flex-col justify-center">
        <CardContent className="py-6 text-center text-muted-foreground">
          <div className="mx-auto rounded-full p-4 bg-muted w-16 h-16 mb-4 flex items-center justify-center">
            <Clock className="h-8 w-8 opacity-70" />
          </div>
          <p className="text-lg">Enter food details to get a prediction</p>
        </CardContent>
      </Card>
    );
  }
  
  const result = predictExpiry(foodData);
  const expiryDate = addDays(new Date(), result.days);
  const formattedDate = format(expiryDate, 'MMMM d, yyyy');
  const daysText = result.days === 1 ? "day" : "days";
  
  // Calculate risk color and percentage
  const riskColor = {
    low: "bg-freshGreen-500",
    medium: "bg-warning-500",
    high: "bg-danger-500"
  }[result.risk];
  
  const riskPercentage = {
    low: 25,
    medium: 65,
    high: 95
  }[result.risk];
  
  // Calculate freshness percentage (inverse of risk)
  const freshness = 100 - riskPercentage;
  
  const riskLabels = {
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk"
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Expiry Prediction</span>
          <span className={`px-3 py-1 text-sm rounded-full ${
            result.risk === "low" ? "bg-freshGreen-100 text-freshGreen-800" : 
            result.risk === "medium" ? "bg-warning-100 text-warning-700" : 
            "bg-danger-100 text-danger-700"
          }`}>
            {riskLabels[result.risk as keyof typeof riskLabels]}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">{foodData.name}</h3>
          <p className="text-muted-foreground capitalize">{foodData.category}</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span>Freshness</span>
            <span>{freshness}%</span>
          </div>
          <Progress value={freshness} className="h-3" />
        </div>
        
        <div className="bg-accent rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-freshGreen-600" />
            <div>
              <p className="text-sm text-muted-foreground">Estimated Time Until Expiry</p>
              <p className="font-medium text-lg">{result.days} {daysText}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-freshGreen-600" />
            <div>
              <p className="text-sm text-muted-foreground">Expiry Date</p>
              <p className="font-medium text-lg">{formattedDate}</p>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <h4 className="font-medium mb-2">Storage Recommendations</h4>
          <ul className="text-sm space-y-2 list-disc pl-5">
            {foodData.category === "fruits" && (
              <>
                <li>Store most fruits in the refrigerator at 0-4°C</li>
                <li>Keep bananas and tropical fruits at room temperature</li>
              </>
            )}
            {foodData.category === "vegetables" && (
              <>
                <li>Store leafy greens in the refrigerator</li>
                <li>Keep root vegetables in a cool, dark place</li>
              </>
            )}
            {foodData.category === "dairy" && (
              <>
                <li>Keep refrigerated at 2-4°C</li>
                <li>Store away from strong-smelling foods</li>
              </>
            )}
            {foodData.category === "meat" && (
              <>
                <li>Keep refrigerated at 0-2°C or frozen at -18°C</li>
                <li>Use airtight packaging to prevent cross-contamination</li>
              </>
            )}
            {foodData.category === "bakery" && (
              <>
                <li>Store bread at room temperature for short-term use</li>
                <li>Freeze bread for longer storage</li>
              </>
            )}
            <li>Maintain optimal humidity levels for your food type</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpiryPrediction;
