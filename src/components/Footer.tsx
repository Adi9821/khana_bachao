
import React from "react";
import { Github, Twitter, Instagram, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full mt-auto py-6 px-6 border-t bg-gradient-to-r from-freshGreen-50 to-freshGreen-100">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FoodWise AI Expiry Predictor
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Made with <Heart className="inline-block h-3 w-3 text-red-500" /> for sustainable food management
            </p>
          </div>
          <div className="flex flex-col mt-4 md:mt-0">
            <p className="text-sm text-muted-foreground mb-2 text-center md:text-right">
              Powered by AI and ML models for food preservation
            </p>
            <div className="flex gap-4 justify-center md:justify-end">
              <a href="#" className="text-muted-foreground hover:text-freshGreen-700 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-freshGreen-700 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-freshGreen-700 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
