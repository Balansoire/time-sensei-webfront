import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SelectionComponent } from './components/selection/selection.component';
import { RevisionComponent } from './components/revision/revision.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'selection', component: SelectionComponent, canActivate: [AuthGuard] },
  { path: 'revision', component: RevisionComponent, canActivate: [AuthGuard] },
  { path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];
