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
  // Updated base days for each category under normal conditions with more realistic values
  const baseDays: Record<string, number> = {
    fruits: 5,        // Reduced from 7 to 5
    vegetables: 4,    // Reduced from 5 to 4
    dairy: 4,         // Reduced from 7 to 4 (major change for milk products)
    meat: 2,          // Reduced from 3 to 2
    bakery: 3         // Reduced from 5 to 3
  };
  
  // Get base days or default to 3 if category not found (reduced default from 5 to 3)
  let days = baseDays[data.category] || 3;
  
  // More granular adjustments based on specific food items
  if (data.name.toLowerCase().includes('milk')) {
    days = 3; // Milk specifically lasts about 3 days after opening
  } else if (data.name.toLowerCase().includes('yogurt')) {
    days = 5; // Yogurt lasts a bit longer
  } else if (data.name.toLowerCase().includes('cheese') && !data.name.toLowerCase().includes('cottage')) {
    days = 7; // Hard cheese lasts longer
  } else if (data.name.toLowerCase().includes('cottage cheese')) {
    days = 4; // Cottage cheese is shorter
  } else if (data.name.toLowerCase().includes('leafy') || 
             data.name.toLowerCase().includes('lettuce') || 
             data.name.toLowerCase().includes('spinach')) {
    days = 2; // Leafy greens spoil quickly
  } else if (data.name.toLowerCase().includes('berries')) {
    days = 2; // Berries spoil quickly
  } else if (data.name.toLowerCase().includes('bread')) {
    days = 3; // Fresh bread
  }
  
  // Temperature adjustment (temperature has strong effect)
  // Higher temperature reduces shelf life - made effects stronger
  if (data.temperature > 30) {
    days *= 0.2; // More significant reduction at high temperatures
  } else if (data.temperature > 25) {
    days *= 0.4;
  } else if (data.temperature > 20) {
    days *= 0.6;
  } else if (data.temperature > 10) {
    days *= 0.8;
  } else if (data.temperature > 5) {
    days *= 1.0;
  } else if (data.temperature > 0) {
    days *= 1.3; // Cold temperatures extend shelf life, but not as dramatically
  } else {
    days *= 1.8; // Freezing extends shelf life, but adjusted to be more realistic
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
    days *= 0.6; // More significant impact
  } else if (humidityDeviation > 20) {
    days *= 0.7;
  } else if (humidityDeviation > 10) {
    days *= 0.85;
  }
  
  // Packaging adjustment - more realistic adjustments
  switch (data.packaging) {
    case 'vacuum':
      days *= 1.7; // Still extends shelf life, but less dramatically
      break;
    case 'plastic':
      days *= 1.2;
      break;
    case 'glass':
      days *= 1.3;
      break;
    case 'paper':
      days *= 0.9; // Paper slightly reduces shelf life for most items
      break;
    case 'none':
      days *= 0.7; // No packaging significantly reduces shelf life
      break;
  }
  
  // Round to 1 decimal place
  days = Math.round(days * 10) / 10;
  
  // More realistic risk thresholds
  let risk = "low";
  if (days < 1.5) {
    risk = "high";
  } else if (days < 3) {
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
