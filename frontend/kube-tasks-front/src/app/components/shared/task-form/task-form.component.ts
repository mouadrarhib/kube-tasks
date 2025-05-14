import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskPriority, TaskStatus } from '../../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" class="task-form">
      <div class="form-group">
        <label for="title">Title <span class="required">*</span></label>
        <input 
          type="text" 
          id="title" 
          formControlName="title" 
          placeholder="Enter task title"
          [ngClass]="{'invalid': isInvalid('title')}"
        >
        <div *ngIf="isInvalid('title')" class="text-error">
          <span *ngIf="formGroup.get('title')?.errors?.['required']">Title is required.</span>
          <span *ngIf="formGroup.get('title')?.errors?.['minlength']">Title must be at least 3 characters.</span>
        </div>
      </div>

      <div class="form-group">
        <label for="description">Description <span class="required">*</span></label>
        <textarea 
          id="description" 
          formControlName="description" 
          rows="4" 
          placeholder="Enter task description"
          [ngClass]="{'invalid': isInvalid('description')}"
        ></textarea>
        <div *ngIf="isInvalid('description')" class="text-error">
          <span *ngIf="formGroup.get('description')?.errors?.['required']">Description is required.</span>
          <span *ngIf="formGroup.get('description')?.errors?.['minlength']">Description must be at least 5 characters.</span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group form-group-half">
          <label for="priority">Priority <span class="required">*</span></label>
          <select 
            id="priority" 
            formControlName="priority"
            [ngClass]="{'invalid': isInvalid('priority')}"
          >
            <option [value]="TaskPriority.LOW">Low</option>
            <option [value]="TaskPriority.MEDIUM">Medium</option>
            <option [value]="TaskPriority.HIGH">High</option>
          </select>
          <div *ngIf="isInvalid('priority')" class="text-error">
            Priority is required.
          </div>
        </div>

        <div class="form-group form-group-half">
          <label for="status">Status <span class="required">*</span></label>
          <select 
            id="status" 
            formControlName="status"
            [ngClass]="{'invalid': isInvalid('status')}"
          >
            <option [value]="TaskStatus.TODO">To Do</option>
            <option [value]="TaskStatus.IN_PROGRESS">In Progress</option>
            <option [value]="TaskStatus.COMPLETED">Completed</option>
          </select>
          <div *ngIf="isInvalid('status')" class="text-error">
            Status is required.
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="dueDate">Due Date</label>
        <input 
          type="date" 
          id="dueDate" 
          formControlName="dueDate"
        >
      </div>

      <div class="form-actions">
        <button type="button" class="btn-secondary" routerLink="/tasks">Cancel</button>
        <button type="submit" [disabled]="formGroup.invalid">{{ submitButtonText }}</button>
      </div>
    </form>
  `,
  styles: [`
    .task-form {
      margin-bottom: var(--space-4);
    }
    
    .required {
      color: var(--error-500);
    }
    
    .form-row {
      display: flex;
      gap: var(--space-4);
      flex-direction: column;
    }
    
    .form-group-half {
      flex: 1;
    }
    
    @media (min-width: 768px) {
      .form-row {
        flex-direction: row;
      }
    }
    
    .invalid {
      border-color: var(--error-500);
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);
      margin-top: var(--space-4);
    }
    
    button[type="submit"] {
      min-width: 120px;
    }
  `]
})
export class TaskFormComponent {
  @Input() formGroup!: FormGroup;
  @Input() submitButtonText: string = 'Submit';
  @Output() submitForm = new EventEmitter<void>();

  // Exposing enums to the template
  TaskPriority = TaskPriority;
  TaskStatus = TaskStatus;

  isInvalid(controlName: string): boolean {
    const control = this.formGroup.get(controlName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }
  
  onSubmit(): void {
    this.submitForm.emit();
  }
}