import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskPriority, TaskStatus } from '../../../models/task.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="task-card card" [ngClass]="getPriorityClass()">
      <div class="flex justify-between">
        <h3 class="task-title" [ngClass]="{'completed': task.status === TaskStatus.COMPLETED}">
          {{ task.title }}
        </h3>
        <span class="task-badge" [ngClass]="'status-' + task.status.toLowerCase()">
          {{ getStatusLabel() }}
        </span>
      </div>
      
      <p class="task-description" [ngClass]="{'completed': task.status === TaskStatus.COMPLETED}">
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
            [(ngModel)]="task.status"
            (ngModelChange)="onStatusChangeDirect($event)"
            [disabled]="task.status === TaskStatus.COMPLETED"
            class="status-select">
            <option [ngValue]="TaskStatus.TODO">To Do</option>
            <option [ngValue]="TaskStatus.IN_PROGRESS">In Progress</option>
            <option [ngValue]="TaskStatus.COMPLETED">Completed</option>
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

  TaskStatus = TaskStatus; // Expose enum to template
  TaskPriority = TaskPriority;

  getPriorityClass(): string {
  return `priority-${(this.task.priority || '').toString().toLowerCase()}`;
  }

getPriorityLabel(): string {
  console.log('Priority value:', this.task.priority);
  switch ((this.task.priority || '').toString().toUpperCase()) {
    case TaskPriority.HIGH: return 'High Priority';
    case TaskPriority.MEDIUM: return 'Medium Priority';
    case TaskPriority.LOW: return 'Low Priority';
    default: return 'Unknown Priority';
  }
}

  getStatusLabel(): string {
    switch(this.task.status) {
      case TaskStatus.TODO: return 'To Do';
      case TaskStatus.IN_PROGRESS: return 'In Progress';
      case TaskStatus.COMPLETED: return 'Completed';
      default: return 'Unknown Status';
    }
  }

  isOverdue(): boolean {
    if (!this.task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(this.task.dueDate);
    // Remove time part for comparison
    today.setHours(0,0,0,0);
    dueDate.setHours(0,0,0,0);
    return dueDate < today && this.task.status !== TaskStatus.COMPLETED;
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

  onStatusChangeDirect(newStatus: TaskStatus): void {
  const updatedTask: Task = {
    ...this.task,
    status: newStatus
  };
  this.statusChange.emit(updatedTask);
}
}