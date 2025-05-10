export enum TaskPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}

export enum TaskStatus {
  Todo = 'todo',
  InProgress = 'in-progress',
  Completed = 'completed'
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
}