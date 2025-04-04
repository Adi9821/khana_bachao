
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FoodItemForm, { FoodItemData } from "@/components/FoodItemForm";
import ExpiryPrediction from "@/components/ExpiryPrediction";
import ExpiryAlerts from "@/components/ExpiryAlerts";
import { toast } from "sonner";
import { Trophy, ClipboardList, UserRound } from "lucide-react";

const Index = () => {
  const [foodData, setFoodData] = useState<FoodItemData | null>(null);
  const [expiryDays, setExpiryDays] = useState<number | null>(null);

  const handleFormSubmit = (data: FoodItemData) => {
    setFoodData(data);
    // Simulate ML model processing
    setTimeout(() => {
      // This would come from the ML model in a real application
      const days = simulateExpiryPrediction(data);
      setExpiryDays(days);
      
      // Show expiry notification
      if (days < 2) {
        toast.error(`Critical Alert: ${data.name} will expire very soon!`, {
          description: "Consume immediately to avoid waste.",
          duration: 5000,
        });
      } else if (days < 4) {
        toast.warning(`Warning: ${data.name} will expire in ${Math.round(days)} days.`, {
          description: "Plan to use it soon.",
          duration: 4000,
        });
      } else {
        toast.success(`Prediction complete for ${data.name}`, {
          description: `Expected to last ${Math.round(days)} days with proper storage.`,
          duration: 3000,
        });
      }
    }, 800);
  };

  // Simple simulation function for quick predictions
  const simulateExpiryPrediction = (data: FoodItemData): number => {
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
    
    // Temperature adjustment
    if (data.temperature > 30) {
      days *= 0.3;
    } else if (data.temperature > 25) {
      days *= 0.6;
    } else if (data.temperature > 20) {
      days *= 0.8;
    } else if (data.temperature > 10) {
      days *= 0.9;
    } else if (data.temperature > 5) {
      days *= 1.0;
    } else if (data.temperature > 0) {
      days *= 1.5;
    } else {
      days *= 2.0;
    }
    
    // Humidity adjustment simplification
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
        days *= 2.0;
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
        days *= 0.8;
        break;
    }
    
    return Math.round(days * 10) / 10;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-freshGreen-50">
      <Header />
      
      <main className="flex-grow container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-freshGreen-800 gradient-text">
              AI-Driven Food Expiry Predictor
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Reduce food waste and save money with our advanced AI technology that accurately 
              predicts when your food will expire.
            </p>
          </div>
          
          {foodData && expiryDays !== null && (
            <div className="mb-6">
              <ExpiryAlerts foodData={foodData} expiryDays={expiryDays} />
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <FoodItemForm onSubmit={handleFormSubmit} />
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <ExpiryPrediction foodData={foodData} />
            </div>
          </div>
          
          {/* Features section with animation */}
          <div className="mt-16 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <h2 className="text-2xl font-semibold text-center mb-8 gradient-text">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border rounded-lg p-6 text-center hover-scale shadow-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-freshGreen-100 flex items-center justify-center">
                  <ClipboardList className="h-8 w-8 text-freshGreen-600" />
                </div>
                <h3 className="font-medium mb-2">Enter Food Details</h3>
                <p className="text-sm text-muted-foreground">
                  Input information about your food item including type, storage conditions, and packaging.
                </p>
              </div>
              
              <div className="bg-white border rounded-lg p-6 text-center hover-scale shadow-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-freshGreen-100 flex items-center justify-center">
                  <UserRound className="h-8 w-8 text-freshGreen-600" />
                </div>
                <h3 className="font-medium mb-2">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Our ML model analyzes environmental factors to calculate the expected shelf life.
                </p>
              </div>
              
              <div className="bg-white border rounded-lg p-6 text-center hover-scale shadow-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-freshGreen-100 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-freshGreen-600" />
                </div>
                <h3 className="font-medium mb-2">Get Predictions</h3>
                <p className="text-sm text-muted-foreground">
                  Receive accurate expiry predictions and personalized storage recommendations.
                </p>
              </div>
            </div>
          </div>
          
          {/* Hackathon banner */}
          <div className="mt-16 p-6 rounded-lg bg-gradient-to-r from-freshGreen-600 to-freshGreen-800 text-white text-center shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">FoodWise - Hackathon Edition</h2>
            <p className="max-w-2xl mx-auto">
              Our solution tackles food waste by leveraging AI and machine learning to help consumers 
              know exactly when their food will expire. Join us in our mission to reduce global food waste.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <style jsx global>{`
        .gradient-text {
          background: linear-gradient(135deg, #2e7d32, #4caf50);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hover-scale {
          transition: transform 0.3s ease;
        }
        .hover-scale:hover {
          transform: scale(1.03);
        }
      `}</style>
    </div>
  );
};

export default Index;
