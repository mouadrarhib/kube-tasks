import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskPriority, TaskStatus } from '../../../models/task.model';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-container card mb-4">
      <div class="filter-title">Filter Tasks</div>
      
      <div class="filters">
        <div class="filter-group">
          <label for="priority">Priority</label>
          <select 
            id="priority" 
            [(ngModel)]="priorityFilter" 
            (change)="onFilterChange()"
          >
            <option value="">All Priorities</option>
            <option [value]="TaskPriority.LOW">Low</option>
            <option [value]="TaskPriority.MEDIUM">Medium</option>
            <option [value]="TaskPriority.HIGH">High</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="status">Status</label>
          <select 
            id="status" 
            [(ngModel)]="statusFilter" 
            (change)="onFilterChange()"
          >
            <option value="">All Statuses</option>
            <option [value]="TaskStatus.TODO">To Do</option>
            <option [value]="TaskStatus.IN_PROGRESS">In Progress</option>
            <option [value]="TaskStatus.COMPLETED">Completed</option>
          </select>
        </div>
        
        <div class="filter-actions">
          <button 
            type="button" 
            class="btn-secondary" 
            (click)="clearFilters()"
            [disabled]="!priorityFilter && !statusFilter"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-container {
      padding: var(--space-4);
      background-color: var(--neutral-50);
    }
    
    .filter-title {
      font-weight: 600;
      margin-bottom: var(--space-3);
      color: var(--neutral-700);
    }
    
    .filters {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    
    .filter-group {
      flex: 1;
    }
    
    .filter-group label {
      margin-bottom: var(--space-1);
      font-size: 0.875rem;
    }
    
    .filter-group select {
      margin-bottom: 0;
    }
    
    .filter-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: var(--space-2);
    }
    
    @media (min-width: 768px) {
      .filters {
        flex-direction: row;
        align-items: flex-end;
      }
    }
  `]
})
export class TaskFilterComponent {
  @Input() set selectedPriority(value: string) {
    this.priorityFilter = value;
  }
  
  @Input() set selectedStatus(value: string) {
    this.statusFilter = value;
  }
  
  @Output() filterChanged = new EventEmitter<{priority: string, status: string}>();
  
  priorityFilter: string = '';
  statusFilter: string = '';
  
  // Exposing enums to the template
  TaskPriority = TaskPriority;
  TaskStatus = TaskStatus;
  
  onFilterChange(): void {
    this.filterChanged.emit({
      priority: this.priorityFilter,
      status: this.statusFilter
    });
  }
  
  clearFilters(): void {
    this.priorityFilter = '';
    this.statusFilter = '';
    this.onFilterChange();
  }
}