import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormatCaseInputComponent } from './examples/format-case-input/format-case-input.component';

export const routes: Routes = [
  { path: '', redirectTo: '/directives', pathMatch: 'full' },
  { path: 'directives', component: HomeComponent },
  {
    path: 'format-case-input',
    component: FormatCaseInputComponent,
  },
];
