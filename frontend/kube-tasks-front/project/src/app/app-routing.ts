import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/tasks', 
    pathMatch: 'full' 
  },
  { 
    path: 'tasks', 
    loadComponent: () => import('./components/task-list/task-list.component').then(m => m.TaskListComponent) 
  },
  { 
    path: 'tasks/add', 
    loadComponent: () => import('./components/task-add/task-add.component').then(m => m.TaskAddComponent) 
  },
  { 
    path: 'tasks/edit/:id', 
    loadComponent: () => import('./components/task-edit/task-edit.component').then(m => m.TaskEditComponent) 
  },
  { 
    path: '**', 
    redirectTo: '/tasks' 
  }
];