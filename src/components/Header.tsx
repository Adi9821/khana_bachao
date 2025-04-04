
import React from "react";
import { Package } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 border-b">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-freshGreen-100">
            <Package className="h-6 w-6 text-freshGreen-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-freshGreen-700">NiTyA_tAzA</h1>
            <p className="text-sm text-muted-foreground">AI-Driven Food Expiry Predictor</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
