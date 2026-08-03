import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-log-meal',
  templateUrl: './log-meal.component.html',
  styleUrls: ['./log-meal.component.css']
})
export class LogMealComponent implements OnInit {
  foodInput100g: string = '';
  foodResults100g: any[] = [];
  totalCalories100g: number = 0;
  showPopup100g: boolean = false;
  errorMessage100g: string = '';
  isLoading100g: boolean = false;

  // ── SECOND SEARCH (meal logging with quantity + serving) ──────
  foodInput: string = '';
  foodResults: any[] = [];
  totalCalories: number = 0;
  showPopup: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  // ── MEAL SECTION ──────────────────────────────────────────────
  mealType: string = '';
  mealTime: string = '';
  userId: number = 0;
  meals: any[] = [];
  showMeals: boolean = false;
  showDetails: boolean = false;
  isLight: boolean = false;

  // ── EDIT STATE ────────────────────────────────────────────────
  editingMealId: number | null = null;
  editMealType: string = '';
  editMealTime: string = '';
  editItems: any[] = [];

  constructor(private foodService: UserService) { }

  ngOnInit() {
    const id = localStorage.getItem('userId');
    if (!id) {
      alert("User not logged in");
      return;
    }
    this.userId = Number(id);
    console.log("UserId:", this.userId);
  }

  // ── THEME TOGGLE ──────────────────────────────────────────────
  toggleTheme() {
    this.isLight = !this.isLight;
    if (this.isLight) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }

  // ══════════════════════════════════════════════════════════════
  // FIRST SEARCH — per 100g only
  // ══════════════════════════════════════════════════════════════

  onFoodInput100gChange() {
    this.errorMessage100g = '';
    if (!this.foodInput100g || this.foodInput100g.trim() === '') {
      this.totalCalories100g = 0;
      this.foodResults100g = [];
      this.isLoading100g = false;
    }
  }

  searchFood100g() {
    if (!this.foodInput100g.trim()) {
      alert("Please enter food items");
      return;
    }
    const items = this.foodInput100g.split(',').map(x => x.trim()).filter(x => x !== '');
    if (items.length > 5) {
      alert("You can enter maximum 5 food items only");
      return;
    }
    this.isLoading100g = true;
    this.errorMessage100g = '';

    this.foodService.calculateFoodCalories(this.foodInput100g).subscribe(
      (res: any) => {
        this.isLoading100g = false;
        if (res.success === false) {
          this.errorMessage100g = res.message;
          this.foodResults100g = [];
          this.totalCalories100g = 0;
          return;
        }
        // Store only food name + calories per 100g
        this.foodResults100g = res.foods.map((f: any) => ({
          foodName: f.foodName,
          calories: f.calories   // calories per 100g from API
        }));
        // Sum of per-100g values for total display
        this.totalCalories100g = this.foodResults100g.reduce(
          (sum: number, f: any) => sum + f.calories, 0
        );
      },
      () => {
        this.isLoading100g = false;
        this.errorMessage100g = "Server error";
        this.foodResults100g = [];
        this.totalCalories100g = 0;
      }
    );
  }

  openPopup100g() { this.showPopup100g = true; }
  closePopup100g() { this.showPopup100g = false; }

  onFoodInputChange() {
    this.errorMessage = '';
    if (!this.foodInput || this.foodInput.trim() === '') {
      this.totalCalories = 0;
      this.foodResults = [];
      this.isLoading = false;
      this.showDetails = false;
    }
  }

  searchFood() {
    if (!this.foodInput.trim()) {
      alert("Please enter food items");
      return;
    }
    const items = this.foodInput.split(',').map(x => x.trim()).filter(x => x !== '');
    if (items.length > 5) {
      alert("You can enter maximum 5 food items only");
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    this.foodService.calculateFoodCalories(this.foodInput).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res.success === false) {
          this.errorMessage = res.message;
          this.foodResults = [];
          this.totalCalories = 0;
          return;
        }
        // Map with quantity + unit so serving-size calculation works
        this.foodResults = res.foods.map((f: any) => ({
          foodName: f.foodName,
          calories: f.calories,   // per 100g from API
          quantity: 100,           // default 100g
          unit: 'grams'
        }));
        this.updateTotalCalories();
        this.errorMessage = '';
        this.showDetails = false;
      },
      () => {
        this.isLoading = false;
        this.errorMessage = "Server error";
        this.foodResults = [];
        this.totalCalories = 0;
      }
    );
  }

  openPopup() { this.showPopup = true; }
  closePopup() { this.showPopup = false; }

  // ── UNIT CONVERSION ───────────────────────────────────────────
  getGrams(food: any): number {
    if (food.unit === 'cup') return food.quantity * 250;
    if (food.unit === 'ounce') return food.quantity * 28.35;
    return food.quantity; // grams
  }

  // ── TOTAL CALORIES (second search) ───────────────────────────
  updateTotalCalories() {
    this.totalCalories = this.foodResults.reduce((sum, f) => {
      const grams = this.getGrams(f);
      return sum + ((grams / 100) * f.calories);
    }, 0);
  }

  // ── SAVE MEAL ─────────────────────────────────────────────────
  saveMeal() {
    if (!this.userId) {
      alert("User not found");
      return;
    }
    if (!this.mealType) {
      alert("Please select a meal type");
      return;
    }
    if (this.foodResults.length === 0) {
      alert("Please search for food items first");
      return;
    }

    const payload = {
      userId: this.userId,
      mealType: this.mealType,
      mealTime: this.mealTime || new Date(),
      mealItems: this.foodResults.map((f: any) => ({
        foodName: f.foodName,
        calories: Math.round((this.getGrams(f) / 100) * f.calories),
        quantity: f.quantity || 1
      }))
    };

    console.log("Payload:", payload);

    this.foodService.addMeal(payload).subscribe(
      () => { alert("Meal added successfully"); },
      (err) => {
        console.error(err);
        alert("Error saving meal");
      }
    );
  }

  // ── LOAD MEALS ────────────────────────────────────────────────
  loadMeals() {
    if (!this.userId) {
      alert("User not found");
      return;
    }
    this.foodService.getMeals(this.userId).subscribe(
      (res: any) => {
        console.log("Meals Response:", res);
        this.meals = res;
        this.showMeals = true;
      },
      (err) => {
        console.error("GET ERROR:", err);
        alert("Error loading meals");
      }
    );
  }

  // ── DELETE MEAL ───────────────────────────────────────────────
  deleteMeal(mealId: number) {
    if (!mealId) { alert("Meal ID not found"); return; }
    if (!confirm("Delete this meal?")) return;

    this.foodService.deleteMeal(mealId).subscribe(
      () => {
        alert("Meal deleted");
        this.meals = this.meals.filter(
          m => (m.mealId || m.MealId) !== mealId
        );
      },
      (err) => {
        console.error(err);
        alert("Error deleting meal");
      }
    );
  }

  // ── OPEN EDIT MODAL ───────────────────────────────────────────
  openEditMeal(meal: any) {
    this.editingMealId = meal.mealId || meal.MealId;
    this.editMealType = meal.mealType || meal.MealType;
    const date = meal.mealDate || meal.MealDate;
    this.editMealTime = date
      ? new Date(date).toISOString().substring(0, 10)
      : '';
    const items = meal.items || meal.Items || [];

    this.editItems = items.map((i: any) => ({
      ...i,
      unit: 'grams',
      baseCalories: 0,
      quantity: i.quantity || i.Quantity || 1
    }));

    this.editItems.forEach(item => {
      this.searchEditItemCalories(item);
    });
  }

  searchEditItemCalories(item: any) {
    if (!item.foodName.trim()) return;

    this.foodService.calculateFoodCalories(item.foodName).subscribe(
      (res: any) => {
        const foods = res.foods || res;
        if (foods.length > 0) {
          item.baseCalories = foods[0].calories;
          item.calories = this.getEditCalories(item);
        }
      },
      () => { alert("Could not fetch calories for " + item.foodName); }
    );
  }

  cancelEdit() {
    this.editingMealId = null;
    this.editItems = [];
  }

  addEditItem() {
    this.editItems.push({
      foodName: '',
      baseCalories: 0,
      calories: 0,
      quantity: 1,
      unit: 'grams'
    });
  }

  removeEditItem(index: number) {
    this.editItems.splice(index, 1);
  }

  getEditGrams(item: any): number {
    if (item.unit === 'cup') return item.quantity * 250;
    if (item.unit === 'ounce') return item.quantity * 28.35;
    return item.quantity;
  }

  getEditCalories(item: any): number {
    return Math.round((this.getEditGrams(item) / 100) * item.baseCalories);
  }

  saveEdit() {
    if (!this.editingMealId) return;

    const payload = {
      mealId: this.editingMealId,
      userId: this.userId,
      mealType: this.editMealType,
      mealTime: this.editMealTime || new Date(),
      mealItems: this.editItems.map((i: any) => ({
        itemId: i.itemId || i.ItemId || 0,
        foodName: i.foodName || i.FoodName,
        calories: this.getEditCalories(i),
        quantity: i.quantity || i.Quantity
      }))
    };

    this.foodService.updateMeal(payload).subscribe(
      () => {
        alert("Meal updated successfully");
        this.cancelEdit();
        this.loadMeals();
      },
      (err) => {
        console.error(err);
        alert("Error updating meal");
      }
    );
  }
}
