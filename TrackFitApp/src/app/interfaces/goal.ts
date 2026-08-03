export interface Goal {
  goalId?: number;
  userId?: number;
  goalType: string;
  targetValue: number;
  deadline: string;
  status?: string;
}
