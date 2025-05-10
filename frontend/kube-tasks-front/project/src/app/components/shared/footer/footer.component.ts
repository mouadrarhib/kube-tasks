import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <p class="copyright">&copy; {{ currentYear }} Kube-Tasks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--neutral-800);
      color: var(--neutral-300);
      padding: var(--space-4) 0;
      margin-top: var(--space-6);
    }
    
    .footer-content {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    
    .copyright {
      margin: 0;
      font-size: 0.875rem;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}