
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FoodItemForm, { FoodItemData } from "@/components/FoodItemForm";
import ExpiryPrediction from "@/components/ExpiryPrediction";

const Index = () => {
  const [foodData, setFoodData] = useState<FoodItemData | null>(null);

  const handleFormSubmit = (data: FoodItemData) => {
    setFoodData(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-freshGreen-800">
              AI-Driven Food Expiry Predictor
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Reduce food waste and save money by accurately predicting when your food will expire
              based on temperature, humidity, and packaging conditions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <FoodItemForm onSubmit={handleFormSubmit} />
            </div>
            
            <div>
              <ExpiryPrediction foodData={foodData} />
            </div>
          </div>
          
          {/* Features section */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-center mb-8">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border rounded-lg p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-freshGreen-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-freshGreen-600">1</span>
                </div>
                <h3 className="font-medium mb-2">Enter Food Details</h3>
                <p className="text-sm text-muted-foreground">
                  Input information about your food item including type, storage conditions, and packaging.
                </p>
              </div>
              
              <div className="bg-white border rounded-lg p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-freshGreen-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-freshGreen-600">2</span>
                </div>
                <h3 className="font-medium mb-2">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Our ML model analyzes environmental factors to calculate the expected shelf life.
                </p>
              </div>
              
              <div className="bg-white border rounded-lg p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-freshGreen-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-freshGreen-600">3</span>
                </div>
                <h3 className="font-medium mb-2">Get Predictions</h3>
                <p className="text-sm text-muted-foreground">
                  Receive accurate expiry predictions and personalized storage recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
