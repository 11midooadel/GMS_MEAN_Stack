/* Type definitions mirroring the backend Mongoose schemas. */

export type Role = 'Super Admin' | 'Admin' | 'Member' | 'Trainer';

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: Role;
  assignedTrainer?: string | User | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: { id: string; name: string; email: string; role: Role };
}

export interface GymClass {
  _id?: string;
  name: string;
  description?: string;
  trainer: string | User;
  days: string[];
  startTime: string;
  duration: number;   // minutes
  capacity: number;
  location?: string;
  createdAt?: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
}
export interface WorkoutDay {
  day: string;
  exercises: Exercise[];
}
export interface WorkoutPlan {
  _id?: string;
  memberId: string | User;
  name: string;
  description?: string;
  days: WorkoutDay[];
  createdAt?: string;
}

export interface Attendance {
  _id?: string;
  user: string | User;
  checkIn: string;
  checkOut?: string | null;
}

export interface Plan {
  _id?: string;
  name: string;
  description: string;
  price: number;
  durationInDays: number;
  features: string[];
  isActive: boolean;
}

export type SubscriptionStatus =
  | 'Pending' | 'Active' | 'Expired' | 'Cancelled' | 'Frozen';

export interface Subscription {
  _id?: string;
  memberId: string | User;
  planId: string | Plan;
  paymentId?: string;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  frozenUntil?: string;
}

export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded';
export interface Payment {
  _id?: string;
  memberId: string | User;
  subscriptionId: string | Subscription;
  amount: number;
  paymentMethod: 'Cash' | 'Card';
  status: PaymentStatus;
  transactionId?: string;
  paymentDate?: string;
}

export interface HealthRecord {
  _id?: string;
  memberId: string | User;
  date: string;
  weight: number;
  height: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  notes?: string;
}
