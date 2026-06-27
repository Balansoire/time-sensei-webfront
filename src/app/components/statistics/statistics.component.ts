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

  getStatEntries(): Array<{ label: string; value: number; accentClass: string }> {
    const stats = this.statistics();
    if (!stats?.stats) {
      return [];
    }

    return Object.entries(stats.stats)
      .map(([label, value], index) => ({
        label: this.formatStatLabel(label),
        value,
        accentClass: this.getAccentClass(index)
      }))
      .sort((a, b) => b.value - a.value);
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

  private formatStatLabel(label: string): string {
    return label
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private getAccentClass(index: number): string {
    const colors = ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-amber-600', 'text-rose-600', 'text-cyan-600'];
    return colors[index % colors.length];
  }
}
