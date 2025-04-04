
// Simple localStorage utility to mimic a database
export interface SavedFoodItem {
  id: string;
  name: string;
  category: string;
  expiryDate: string; // ISO string
  expiryDays: number;
  temperature: number;
  humidity: number;
  packaging: string;
  createdAt: string; // ISO string
}

const STORAGE_KEY = 'foodwise_items';

// Get all saved food items
export const getSavedFoodItems = (): SavedFoodItem[] => {
  try {
    const items = localStorage.getItem(STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error getting food items from localStorage:', error);
    return [];
  }
};

// Save a new food item
export const saveFoodItem = (item: Omit<SavedFoodItem, 'id' | 'createdAt'>): SavedFoodItem => {
  try {
    const items = getSavedFoodItems();
    const newItem: SavedFoodItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...items, newItem]));
    return newItem;
  } catch (error) {
    console.error('Error saving food item to localStorage:', error);
    throw error;
  }
};

// Delete a food item
export const deleteFoodItem = (id: string): void => {
  try {
    const items = getSavedFoodItems();
    const updatedItems = items.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
  } catch (error) {
    console.error('Error deleting food item from localStorage:', error);
    throw error;
  }
};

// Check for items that will expire soon
export const getExpiringItems = (daysThreshold: number = 3): SavedFoodItem[] => {
  const items = getSavedFoodItems();
  const now = new Date();
  
  return items.filter(item => {
    const expiryDate = new Date(item.expiryDate);
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= daysThreshold && diffDays >= 0;
  });
};

// Clear all saved items (for testing)
export const clearAllItems = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
