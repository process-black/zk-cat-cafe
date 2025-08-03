// Edit this file to specify ingredients for each food.
// The keys should match the food file names (without .png) and use underscores.
// Example: "beef_udon": { ingredients: [{ name: "udon noodles", amount: 1 }, ...] }

export interface Ingredient {
  name: string;
  amount: number;
}

export interface IngredientInfo {
  name: string;
  cost: number;
}

export interface FoodData {
  [foodKey: string]: {
    ingredients: Ingredient[];
  };
}

// All unique ingredients with cost
export const allIngredients: IngredientInfo[] = [
  { name: "beef", cost: 3 },           // $30 for 10
  { name: "boba pearls", cost: 2 },    // $20 for 10
  { name: "chocolate", cost: 3 },      // $30 for 10
  { name: "eggs", cost: 2 },           // $10 for 10
  { name: "flour", cost: 1 },          // $10 for 10
  { name: "milk", cost: 2 },           // $20 for 10
  { name: "noodles", cost: 2 },        // $20 for 10
  { name: "scallions", cost: 1 },      // $10 for 10
  { name: "strawberries", cost: 2 },   // $20 for 10
  { name: "sugar", cost: 1 },          // $10 for 10
];

export const foodData: FoodData = {
  beef_udon: {
    ingredients: [
      { name: "noodles", amount: 1 },
      { name: "beef", amount: 1 },
      { name: "scallions", amount: 1 },
    ],
  },
  triple_chocolate_cake: {
    ingredients: [
      { name: "chocolate", amount: 1 },
      { name: "flour", amount: 1 },
      { name: "eggs", amount: 1 },
      { name: "sugar", amount: 1 },
      { name: "milk", amount: 1 },
    ],
  },
  strawberry_milk_boba: {
    ingredients: [
      { name: "strawberries", amount: 1 },
      { name: "boba pearls", amount: 1 },
      { name: "milk", amount: 1 },
    ],
  },
  // Add more foods below following the same structure
};
