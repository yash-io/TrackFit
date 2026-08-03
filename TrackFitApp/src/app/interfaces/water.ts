export interface WaterIntake {
  waterId?: number;
  userId?: number;
  quantityMl: number;
  intakeTime?: string;
}

export interface HydrationSuggestion {
  icon: string;
  title: string;
  subtitle: string;
  amount: number;
}
