import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <span>&copy; {{ currentYear }} MediCoreX. All rights reserved.</span>
      <span class="separator">|</span>
      <a href="/privacy">Privacy Policy</a>
      <span class="separator">|</span>
      <a href="/terms">Terms of Service</a>
    </footer>
  `,
  styles: [`
    .footer {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: white;
      border-top: 1px solid #e0e0e0;
      font-size: 0.75rem;
      color: #666;
    }

    .separator {
      color: #ccc;
    }

    a {
      color: #3f51b5;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .footer {
        flex-wrap: wrap;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
