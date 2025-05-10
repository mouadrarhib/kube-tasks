import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../shared/task-form/task-form.component';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-add',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TaskFormComponent],
  template: `
    <section class="task-add-container slide-in">
      <div class="flex justify-between align-center mb-6">
        <h1>Add New Task</h1>
        <button routerLink="/tasks" class="btn-secondary">
          Back to Tasks
        </button>
      </div>
      
      <div class="card">
        <app-task-form 
          [formGroup]="taskForm" 
          (submitForm)="onSubmit()"
          submitButtonText="Create Task">
        </app-task-form>
      </div>
    </section>
  `,
  styles: [`
    .task-add-container {
      animation: slideIn 0.3s ease-in-out;
    }
    
    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class TaskAddComponent {
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      priority: [TaskPriority.Medium, Validators.required],
      status: [TaskStatus.Todo, Validators.required],
      dueDate: [null]
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.taskService.addTask(this.taskForm.value).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    } else {
      this.markFormGroupTouched(this.taskForm);
    }
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if ((control as FormGroup).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}