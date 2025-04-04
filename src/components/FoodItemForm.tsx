
import React, { useState } from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider
} from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Define food categories with examples
const foodCategories = [
  { 
    value: "fruits", 
    label: "Fruits",
    examples: ["Apple", "Banana", "Orange", "Grapes", "Berries"]
  },
  { 
    value: "vegetables", 
    label: "Vegetables",
    examples: ["Lettuce", "Tomato", "Cucumber", "Carrot", "Broccoli"]
  },
  { 
    value: "dairy", 
    label: "Dairy",
    examples: ["Milk", "Cheese", "Yogurt", "Butter", "Cream"]
  },
  { 
    value: "meat", 
    label: "Meat",
    examples: ["Chicken", "Beef", "Pork", "Fish", "Turkey"]
  },
  { 
    value: "bakery", 
    label: "Bakery",
    examples: ["Bread", "Pastry", "Cake", "Cookie", "Muffin"]
  }
];

// Define packaging types
const packagingTypes = [
  { value: "none", label: "None" },
  { value: "plastic", label: "Plastic Container" },
  { value: "paper", label: "Paper/Cardboard" },
  { value: "glass", label: "Glass Container" },
  { value: "vacuum", label: "Vacuum Sealed" }
];

interface FoodItemFormProps {
  onSubmit: (data: FoodItemData) => void;
}

export interface FoodItemData {
  name: string;
  category: string;
  temperature: number;
  humidity: number;
  packaging: string;
}

const FoodItemForm: React.FC<FoodItemFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FoodItemData>({
    name: "",
    category: "",
    temperature: 22,
    humidity: 50,
    packaging: "none"
  });

  // Examples state for suggestions
  const [examples, setExamples] = useState<string[]>([]);

  // Update form data and handle any side effects
  const updateFormData = (field: keyof FoodItemData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    // If category changes, update the examples
    if (field === "category") {
      const category = foodCategories.find(cat => cat.value === value);
      setExamples(category?.examples || []);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name.trim()) {
      toast.error("Please enter a food name");
      return;
    }
    
    if (!formData.category) {
      toast.error("Please select a food category");
      return;
    }
    
    onSubmit(formData);
    toast.success("Calculating food expiry prediction...");
  };

  const handleExampleClick = (example: string) => {
    setFormData(prev => ({ ...prev, name: example }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Food Item Details</CardTitle>
        <CardDescription>
          Enter information about your food item to get an expiry prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Food Name</Label>
              <Input 
                id="name"
                placeholder="e.g. Apple, Milk, Bread"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
              />
              
              {examples.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {examples.map((example) => (
                    <Button 
                      key={example} 
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleExampleClick(example)}
                      className="text-xs py-0 h-6"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Food Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => updateFormData("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {foodCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Temperature (°C)</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="temperature"
                min={-10}
                max={40}
                step={1}
                value={[formData.temperature]}
                onValueChange={(values) => updateFormData("temperature", values[0])}
                className="flex-1"
              />
              <span className="w-12 text-center font-medium">
                {formData.temperature}°C
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Humidity (%)</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="humidity"
                min={0}
                max={100}
                step={5}
                value={[formData.humidity]}
                onValueChange={(values) => updateFormData("humidity", values[0])}
                className="flex-1"
              />
              <span className="w-12 text-center font-medium">
                {formData.humidity}%
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="packaging">Packaging Type</Label>
            <Select 
              value={formData.packaging} 
              onValueChange={(value) => updateFormData("packaging", value)}
            >
              <SelectTrigger id="packaging">
                <SelectValue placeholder="Select packaging" />
              </SelectTrigger>
              <SelectContent>
                {packagingTypes.map((packaging) => (
                  <SelectItem key={packaging.value} value={packaging.value}>
                    {packaging.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full gradient-green"
          >
            Calculate Expiry Prediction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FoodItemForm;
