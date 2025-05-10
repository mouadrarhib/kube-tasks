import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo" routerLink="/">
            <span class="logo-text">Kube-Tasks</span>
          </div>
          <nav class="nav">
            <ul class="nav-list">
              <li class="nav-item">
                <a routerLink="/tasks" routerLinkActive="active" class="nav-link">Tasks</a>
              </li>
              <li class="nav-item">
                <a routerLink="/tasks/add" routerLinkActive="active" class="nav-link">Add Task</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: var(--primary-700);
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4) 0;
    }
    
    .logo {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    
    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
    }
    
    .nav-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .nav-item {
      margin-left: var(--space-4);
    }
    
    .nav-link {
      color: var(--neutral-100);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease-in-out;
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-md);
    }
    
    .nav-link:hover {
      color: white;
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .nav {
        margin-top: var(--space-3);
        width: 100%;
      }
      
      .nav-list {
        width: 100%;
      }
      
      .nav-item {
        margin-left: 0;
        margin-right: var(--space-4);
      }
    }
  `]
})
export class HeaderComponent {
}