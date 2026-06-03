import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CharacterType, RevisionMode, DifficultyLevel } from '../../models/character.model';

@Component({
  selector: 'app-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selection.component.html',
  styleUrl: './selection.component.css'
})
export class SelectionComponent {
  characterType = signal<CharacterType | ''>('');
  revisionMode = signal<RevisionMode | ''>('');
  difficulty = signal<DifficultyLevel | ''>('');
  isLoading = signal(false);

  characterTypes: Array<{ value: CharacterType; label: string; description: string }> = [
    { value: 'hiragana', label: 'Hiragana', description: 'Script phonétique japonais' },
    { value: 'katakana', label: 'Katakana', description: 'Script phonétique japonais' },
    { value: 'kanji', label: 'Kanji', description: 'Caractères sino-japonais' }
  ];

  revisionModes: Array<{ value: RevisionMode; label: string; description: string }> = [
    { value: 'recognition', label: 'Reconnaissance', description: 'Identifiez le caractère' },
    { value: 'writing', label: 'Écriture', description: 'Écrivez la romanisation' }
  ];

  difficulties: Array<{ value: DifficultyLevel; label: string; description: string }> = [
    { value: 'beginner', label: 'Débutant', description: 'Caractères de base' },
    { value: 'intermediate', label: 'Intermédiaire', description: 'Caractères courants' },
    { value: 'advanced', label: 'Avancé', description: 'Caractères moins courants' }
  ];

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  isSelectionValid(): boolean {
    return !!this.characterType() && !!this.revisionMode() && !!this.difficulty();
  }

  startRevision(): void {
    if (!this.isSelectionValid()) {
      return;
    }

    this.isLoading.set(true);

    const params = {
      type: this.characterType() as string,
      mode: this.revisionMode() as string,
      difficulty: this.difficulty() as string
    };

    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/revision'], { queryParams: params });
    }, 300);
  }

  viewStatistics(): void {
    this.router.navigate(['/statistics']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
