import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskItemComponent } from '../shared/task-item/task-item.component';
import { TaskFilterComponent } from '../shared/task-filter/task-filter.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TaskItemComponent, TaskFilterComponent],
  template: `
    <section class="task-list-container">
      <div class="flex justify-between align-center mb-6">
        <h1>My Tasks</h1>
        <button routerLink="/tasks/add" class="add-task-btn">
          Add New Task
        </button>
      </div>
      
      <app-task-filter 
        [selectedPriority]="selectedPriority"
        [selectedStatus]="selectedStatus"
        (filterChanged)="applyFilters($event)">
      </app-task-filter>
      
      <div *ngIf="filteredTasks.length === 0" class="no-tasks-message card">
        <p>No tasks found. Add a new task to get started.</p>
      </div>
      
      <div class="tasks-grid">
        <app-task-item 
          *ngFor="let task of filteredTasks" 
          [task]="task"
          (edit)="onEdit($event)"
          (delete)="onDelete($event)"
          (statusChange)="onStatusChange($event)"
          class="fade-in">
        </app-task-item>
      </div>
    </section>
  `,
  styles: [`
    .task-list-container {
      animation: fadeIn 0.3s ease-in-out;
    }
    
    .add-task-btn {
      background-color: var(--primary-600);
      padding: var(--space-2) var(--space-4);
    }
    
    .no-tasks-message {
      text-align: center;
      padding: var(--space-6);
      background-color: var(--neutral-50);
      border: 1px dashed var(--neutral-300);
    }
    
    .tasks-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-4);
      margin-top: var(--space-4);
    }
    
    @media (min-width: 768px) {
      .tasks-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (min-width: 1024px) {
      .tasks-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedPriority: string = '';
  selectedStatus: string = '';

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilters();
    });
  }

  applyFilters(filters?: { priority: string, status: string }): void {
    if (filters) {
      this.selectedPriority = filters.priority;
      this.selectedStatus = filters.status;
    }

    this.filteredTasks = this.tasks.filter(task => {
      const priorityMatch = !this.selectedPriority || task.priority === this.selectedPriority;
      const statusMatch = !this.selectedStatus || task.status === this.selectedStatus;
      
      return priorityMatch && statusMatch;
    });
  }

  onEdit(task: Task): void {
    this.router.navigate(['/tasks/edit', task.id]);
  }

  onDelete(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe(() => {
        this.loadTasks();
      });
    }
  }

  onStatusChange(task: Task): void {
    this.taskService.updateTask(task).subscribe(() => {
      this.loadTasks();
    });
  }
}