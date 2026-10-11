import type { Recipe } from "@/types/recipe";

export const recipes: Recipe[] = [
  { id: "scrambled-eggs", name: "Creamy scrambled eggs", description: "Soft scrambled eggs for a quick, comforting breakfast.", requiredIngredients: ["Eggs", "Butter", "Milk"], mealType: "Breakfast", prepMinutes: 2, cookMinutes: 5 },
  { id: "tomato-toast", name: "Tomato toast", description: "Fresh tomato on crisp toast with a drizzle of olive oil.", requiredIngredients: ["Bread", "Tomato", "Olive oil"], mealType: "Breakfast", prepMinutes: 5, cookMinutes: 3 },
  { id: "cheese-toastie", name: "Cheese toastie", description: "Golden, buttery bread with a melted cheese centre.", requiredIngredients: ["Bread", "Cheese", "Butter"], mealType: "Lunch", prepMinutes: 3, cookMinutes: 6 },
  { id: "tomato-pasta", name: "Garlic tomato pasta", description: "A simple tomato and garlic sauce tossed through pasta.", requiredIngredients: ["Pasta", "Tomato", "Garlic", "Olive oil"], mealType: "Dinner", prepMinutes: 5, cookMinutes: 15 },
  { id: "egg-rice", name: "Egg fried rice", description: "A quick pan of rice, egg, and peas with soy sauce.", requiredIngredients: ["Rice", "Eggs", "Peas", "Soy sauce", "Olive oil"], mealType: "Dinner", prepMinutes: 5, cookMinutes: 15 },
  { id: "potato-eggs", name: "Potato breakfast skillet", description: "Crisp potatoes and onion topped with eggs.", requiredIngredients: ["Potato", "Onion", "Eggs", "Olive oil"], mealType: "Breakfast", prepMinutes: 10, cookMinutes: 20 },
  { id: "chickpea-salad", name: "Chickpea salad", description: "A fresh chickpea, cucumber, and tomato salad with lemon dressing.", requiredIngredients: ["Chickpeas", "Cucumber", "Tomato", "Lemon", "Olive oil"], mealType: "Lunch", prepMinutes: 10, cookMinutes: 0 },
  { id: "spinach-omelette", name: "Spinach and cheese omelette", description: "A fluffy omelette filled with spinach and cheese.", requiredIngredients: ["Eggs", "Spinach", "Cheese", "Butter"], mealType: "Lunch", prepMinutes: 5, cookMinutes: 8 },
  { id: "chicken-rice", name: "Lemon chicken and rice", description: "A simple chicken and rice dinner with garlic and lemon.", requiredIngredients: ["Chicken", "Rice", "Garlic", "Lemon", "Olive oil"], mealType: "Dinner", prepMinutes: 10, cookMinutes: 25 },
  { id: "banana-porridge", name: "Banana porridge", description: "Warm oats with milk and sliced banana.", requiredIngredients: ["Oats", "Milk", "Banana"], mealType: "Breakfast", prepMinutes: 2, cookMinutes: 5 },
];
