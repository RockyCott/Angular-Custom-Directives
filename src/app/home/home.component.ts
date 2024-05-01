import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Directive {
  name: string;
  description: string;
  path: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      flex: 1
    }
  `,
  imports: [CommonModule],
})
export class HomeComponent {
  directives: Directive[] = [
    {
      name: 'Format Case Input',
      description: 'Format text input based on different cases.',
      path: 'format-case-input'
    },
  ];

  constructor(private router: Router) {}

  protected navigateToDirectiveExample(directive: Directive) {
    this.router.navigate([directive.path]);
  }
}
