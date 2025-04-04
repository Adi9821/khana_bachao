
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full mt-auto py-4 px-6 border-t">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FoodWise AI Expiry Predictor
          </p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <p className="text-sm text-muted-foreground">
              Powered by AI and ML models for food preservation
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
