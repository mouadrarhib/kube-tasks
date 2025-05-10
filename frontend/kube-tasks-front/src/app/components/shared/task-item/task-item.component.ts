import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '../../../models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-card card" [ngClass]="getPriorityClass()">
      <div class="flex justify-between">
        <h3 class="task-title" [ngClass]="{'completed': task.status === 'completed'}">
          {{ task.title }}
        </h3>
        <span class="task-badge" [ngClass]="'status-' + task.status">
          {{ getStatusLabel() }}
        </span>
      </div>
      
      <p class="task-description" [ngClass]="{'completed': task.status === 'completed'}">
        {{ task.description }}
      </p>
      
      <div class="task-details">
        <span class="task-priority">{{ getPriorityLabel() }}</span>
        <span *ngIf="task.dueDate" class="task-due-date" [ngClass]="{'overdue': isOverdue()}">
          Due: {{ task.dueDate | date:'mediumDate' }}
        </span>
      </div>
      
      <div class="task-actions">
        <div class="status-selector">
          <select 
            [value]="task.status" 
            (change)="onStatusChange($event)"
            [disabled]="task.status === 'completed'"
            class="status-select">
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div class="task-buttons">
          <button 
            (click)="onEdit()"
            class="btn-secondary edit-btn"
            title="Edit task">
            Edit
          </button>
          
          <button 
            (click)="onDelete()"
            class="btn-danger delete-btn"
            title="Delete task">
            Delete
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-card {
      position: relative;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      overflow: hidden;
    }
    
    .task-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 10px rgba(0, 0, 0, 0.08);
    }
    
    .priority-high {
      border-left: 4px solid var(--error-500);
    }
    
    .priority-medium {
      border-left: 4px solid var(--warning-500);
    }
    
    .priority-low {
      border-left: 4px solid var(--success-500);
    }
    
    .task-title {
      margin-bottom: var(--space-2);
      font-size: 1.25rem;
      word-break: break-word;
    }
    
    .task-description {
      color: var(--neutral-600);
      margin-bottom: var(--space-3);
      word-break: break-word;
    }
    
    .completed {
      text-decoration: line-through;
      color: var(--neutral-400);
    }
    
    .task-badge {
      font-size: 0.75rem;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-sm);
      font-weight: 500;
      white-space: nowrap;
    }
    
    .status-todo {
      background-color: var(--neutral-200);
      color: var(--neutral-700);
    }
    
    .status-in-progress {
      background-color: var(--primary-100);
      color: var(--primary-700);
    }
    
    .status-completed {
      background-color: var(--success-100);
      color: var(--success-700);
    }
    
    .task-details {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--space-3);
      font-size: 0.875rem;
    }
    
    .task-priority {
      font-weight: 500;
    }
    
    .task-due-date {
      color: var(--neutral-500);
    }
    
    .overdue {
      color: var(--error-500);
      font-weight: 500;
    }
    
    .task-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: var(--space-3);
    }
    
    .status-select {
      padding: var(--space-1) var(--space-2);
      font-size: 0.875rem;
      margin-bottom: 0;
    }
    
    .task-buttons {
      display: flex;
      gap: var(--space-2);
    }
    
    .edit-btn, .delete-btn {
      font-size: 0.875rem;
      padding: var(--space-1) var(--space-2);
    }
  `]
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
  @Output() statusChange = new EventEmitter<Task>();

  getPriorityClass(): string {
    return `priority-${this.task.priority}`;
  }

  getPriorityLabel(): string {
    switch(this.task.priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Unknown Priority';
    }
  }

  getStatusLabel(): string {
    switch(this.task.status) {
      case 'todo': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return 'Unknown Status';
    }
  }

  isOverdue(): boolean {
    if (!this.task.dueDate) return false;
    
    const today = new Date();
    const dueDate = new Date(this.task.dueDate);
    
    return dueDate < today && this.task.status !== 'completed';
  }

  onEdit(): void {
    this.edit.emit(this.task);
  }

  onDelete(): void {
    this.delete.emit(this.task.id);
  }

  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value as TaskStatus;
    
    const updatedTask: Task = {
      ...this.task,
      status: newStatus
    };
    
    this.statusChange.emit(updatedTask);
  }
}