import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Task, TaskPriority, TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Complete project documentation',
      description: 'Write detailed documentation for the Kubernetes deployment process',
      priority: TaskPriority.High,
      status: TaskStatus.Todo,
      dueDate: new Date('2025-06-15'),
      createdAt: new Date('2025-06-01')
    },
    {
      id: 2,
      title: 'Refactor authentication service',
      description: 'Improve the JWT implementation and add refresh token support',
      priority: TaskPriority.Medium,
      status: TaskStatus.InProgress,
      dueDate: new Date('2025-06-10'),
      createdAt: new Date('2025-05-28')
    },
    {
      id: 3,
      title: 'Update dependencies',
      description: 'Update all npm packages to their latest versions',
      priority: TaskPriority.Low,
      status: TaskStatus.Completed,
      dueDate: new Date('2025-06-05'),
      createdAt: new Date('2025-05-25'),
      updatedAt: new Date('2025-06-02')
    }
  ];

  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);

  constructor() { }

  // Get all tasks
  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  // Get task by ID
  getTaskById(id: number): Observable<Task | undefined> {
    const task = this.tasks.find(t => t.id === id);
    return of(task);
  }

  // Add a new task
  addTask(task: Omit<Task, 'id' | 'createdAt'>): Observable<Task> {
    const newTask: Task = {
      ...task,
      id: this.getNextId(),
      createdAt: new Date()
    };
    
    this.tasks = [...this.tasks, newTask];
    this.tasksSubject.next(this.tasks);
    
    return of(newTask);
  }

  // Update existing task
  updateTask(updatedTask: Task): Observable<Task> {
    this.tasks = this.tasks.map(task => 
      task.id === updatedTask.id 
        ? { ...updatedTask, updatedAt: new Date() } 
        : task
    );
    
    this.tasksSubject.next(this.tasks);
    
    return of(this.tasks.find(t => t.id === updatedTask.id) as Task);
  }

  // Delete task
  deleteTask(id: number): Observable<boolean> {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.tasksSubject.next(this.tasks);
    
    return of(true);
  }

  // Get next ID (for simplicity - in a real app, this would be handled by the backend)
  private getNextId(): number {
    return this.tasks.length > 0 
      ? Math.max(...this.tasks.map(task => task.id)) + 1 
      : 1;
  }
}