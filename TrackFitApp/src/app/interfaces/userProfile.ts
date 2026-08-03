export interface IUserProfile {
  userId: number;
  age: number;
  height?: number | null;
  weight?: number | null;
  goal: string;
  profileImage?: string;
}
