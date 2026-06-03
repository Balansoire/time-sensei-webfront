import { Injectable, signal } from '@angular/core';
import { UserStatistics, CharacterAnswer } from '../models/character.model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private readonly statistics = signal<UserStatistics>({
    userId: '1',
    totalAnswers: 250,
    correctAnswers: 180,
    accuracy: 72,
    byType: {
      hiragana: { correct: 95, total: 100 },
      katakana: { correct: 45, total: 75 },
      kanji: { correct: 40, total: 75 }
    },
    byDifficulty: {
      beginner: { correct: 120, total: 150 },
      intermediate: { correct: 40, total: 75 },
      advanced: { correct: 20, total: 25 }
    }
  });

  constructor() {
    // Charger les statistiques depuis localStorage si disponible
    const savedStats = localStorage.getItem('userStatistics');
    if (savedStats) {
      this.statistics.set(JSON.parse(savedStats));
    }
  }

  getUserStatistics(): Observable<UserStatistics> {
    return of(this.statistics()).pipe(delay(300));
  }

  recordAnswer(answer: CharacterAnswer): void {
    const currentStats = this.statistics();
    const newStats = { ...currentStats };

    newStats.totalAnswers++;
    if (answer.correct) {
      newStats.correctAnswers++;
    }
    newStats.accuracy = Math.round((newStats.correctAnswers / newStats.totalAnswers) * 100);

    localStorage.setItem('userStatistics', JSON.stringify(newStats));
    this.statistics.set(newStats);
  }

  resetStatistics(): void {
    const resetStats: UserStatistics = {
      userId: '1',
      totalAnswers: 0,
      correctAnswers: 0,
      accuracy: 0,
      byType: {
        hiragana: { correct: 0, total: 0 },
        katakana: { correct: 0, total: 0 },
        kanji: { correct: 0, total: 0 }
      },
      byDifficulty: {
        beginner: { correct: 0, total: 0 },
        intermediate: { correct: 0, total: 0 },
        advanced: { correct: 0, total: 0 }
      }
    };

    localStorage.setItem('userStatistics', JSON.stringify(resetStats));
    this.statistics.set(resetStats);
  }
}
