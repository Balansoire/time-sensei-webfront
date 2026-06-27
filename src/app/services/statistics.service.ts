import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { BackendUserStatistics, CharacterAnswer, UserStatistics } from '../models/character.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export function normalizeUserStatisticsPayload(payload: BackendUserStatistics | null | undefined): UserStatistics {
  const stats = Object.entries(payload?.stats ?? {}).reduce<Record<string, number>>((acc, [key, value]) => {
    acc[key] = Number(value) || 0;
    return acc;
  }, {});

  if (payload?.byType) {
    Object.entries(payload.byType).forEach(([key, value]) => {
      stats[key] = value.total;
    });
  }

  if (payload?.byDifficulty) {
    Object.entries(payload.byDifficulty).forEach(([key, value]) => {
      stats[key] = value.total;
    });
  }

  return {
    id: payload?.id,
    userId: payload?.user_id ?? payload?.userId,
    nombre_total_revisions: Number(payload?.nombre_total_revisions ?? payload?.totalAnswers ?? 0),
    totalAnswers: Number(payload?.totalAnswers ?? 0),
    correctAnswers: Number(payload?.correctAnswers ?? 0),
    accuracy: Number(payload?.accuracy ?? 0),
    stats
  };
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly statistics = signal<UserStatistics>(this.createEmptyStatistics());

  constructor() {
    const savedStats = localStorage.getItem('userStatistics');
    if (savedStats) {
      this.statistics.set(normalizeUserStatisticsPayload(JSON.parse(savedStats)));
    }
  }

  getUserStatistics(): Observable<UserStatistics> {
    const userId = this.authService.getCurrentUser()?.id ?? 'current-user';

    return this.http.get<BackendUserStatistics>(`${environment.apiURL}/stat_utilisateur/utilisateur/${userId}`).pipe(
      map((payload) => this.normalizeStatistics(payload, userId)),
      catchError(() => {
        const fallbackStats = this.getFallbackStatistics(userId);
        this.statistics.set(fallbackStats);
        return of(fallbackStats);
      }),
      tap((stats) => {
        this.statistics.set(stats);
        localStorage.setItem('userStatistics', JSON.stringify(stats));
      }),
      delay(300)
    );
  }

  recordAnswer(answer: CharacterAnswer): void {
    const currentStats = this.statistics();
    const nextStats: UserStatistics = {
      ...currentStats,
      nombre_total_revisions: (currentStats.nombre_total_revisions ?? 0) + 1,
      stats: { ...currentStats.stats }
    };

    const statKey = answer.type ? this.formatStatKey(answer.type) : (answer.difficulty ? this.formatStatKey(answer.difficulty) : 'Autre');
    nextStats.stats[statKey] = (nextStats.stats[statKey] ?? 0) + 1;

    localStorage.setItem('userStatistics', JSON.stringify(nextStats));
    this.statistics.set(nextStats);
  }

  resetStatistics(): void {
    const resetStats = this.createEmptyStatistics(this.authService.getCurrentUser()?.id);
    localStorage.setItem('userStatistics', JSON.stringify(resetStats));
    this.statistics.set(resetStats);
  }

  private normalizeStatistics(payload: BackendUserStatistics | null | undefined, userId: string): UserStatistics {
    const stats = normalizeUserStatisticsPayload(payload);
    stats.userId = userId;
    return stats;
  }

  private getFallbackStatistics(userId: string): UserStatistics {
    const savedStats = localStorage.getItem('userStatistics');
    if (savedStats) {
      return normalizeUserStatisticsPayload(JSON.parse(savedStats));
    }

    return this.createEmptyStatistics(userId);
  }

  private createEmptyStatistics(userId?: string): UserStatistics {
    return {
      userId,
      nombre_total_revisions: 0,
      stats: {}
    };
  }

  private formatStatKey(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
