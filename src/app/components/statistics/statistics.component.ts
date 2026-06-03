import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserStatistics } from '../../models/character.model';
import { StatisticsService } from '../../services/statistics.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit {
  statistics = signal<UserStatistics | null>(null);
  isLoading = signal(true);

  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    this.statisticsService.getUserStatistics().subscribe(stats => {
      this.statistics.set(stats);
      this.isLoading.set(false);
    });
  }

  goBack(): void {
    this.router.navigate(['/selection']);
  }

  resetStatistics(): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes vos statistiques?')) {
      this.statisticsService.resetStatistics();
      this.loadStatistics();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
