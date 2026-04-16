// src/models/Task.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  deadline?: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}