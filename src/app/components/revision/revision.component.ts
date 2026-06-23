import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Kana, Kanji, CharacterType, RevisionMode, DifficultyLevel, ListeFiche, CharacterAnswer } from '../../models/character.model';
import { CharacterService } from '../../services/character.service';
import { StatisticsService } from '../../services/statistics.service';
import { AuthService } from '../../services/auth.service';

type Caractere = Kana | Kanji;

@Component({
  selector: 'app-revision',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './revision.component.html',
  styleUrl: './revision.component.css'
})
export class RevisionComponent implements OnInit {
  characterType = signal<CharacterType | null>(null);
  revisionMode = signal<RevisionMode | null>(null);
  difficulty = signal<DifficultyLevel | null>(null);

  fiches = signal<ListeFiche>([]);
  currentIndex = signal(0);
  currentCharacter = signal<Caractere | null>(null);
  answerOptions = signal<string[]>([]);

  isLoading = signal(true);
  isAnswered = signal(false);
  selectedAnswer = signal<string | null>(null);
  userInput = signal('');
  correctAnswer = signal('');

  totalQuestions = signal(0);
  correctAnswers = signal(0);
  sessionComplete = signal(false);

  // Stocke les réponses de la session avant envoi au backend
  private sessionResults: CharacterAnswer[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly characterService: CharacterService,
    private readonly statisticsService: StatisticsService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const type = params['type'] as CharacterType;
      const mode = params['mode'] as RevisionMode;
      const difficulty = params['difficulty'] as DifficultyLevel;

      if (!type || !mode || !difficulty) {
        this.router.navigate(['/selection']);
        return;
      }

      this.characterType.set(type);
      this.revisionMode.set(mode);
      this.difficulty.set(difficulty);

      this.authService.getAuthState().subscribe((authState) => {

        const id = authState.user?.id;
        
        this.loadCharacters(id);
      });
    });
  }

  private loadCharacters(id: string | undefined): void {
    if (!id) {
      return
    }

    const type = this.characterType();
    const difficulty = this.difficulty();

    if (!type || !difficulty) return;

    this.characterService.getLists(id).subscribe({
      next: (res) => {
        if (!res || res.length < 3) {
          console.error('Réponse inattendue de l’API liste_utilisateur', res);
          this.isLoading.set(false);
          return;
        }

        this.characterService.setLists(res[0], res[1], res[2]);

        this.characterService.getCharacters(type, difficulty).subscribe({
          next: (listeFiche) => {
            if (listeFiche.length === 0) {
              console.warn('Aucune fiche de révision disponible pour ce type/difficulté.');
              this.fiches.set([]);
              this.totalQuestions.set(0);
              this.isLoading.set(false);
              this.sessionComplete.set(true);
              return;
            }

            this.fiches.set(listeFiche);
            this.totalQuestions.set(Math.min(listeFiche.length, 10));
            this.isLoading.set(false);
            this.displayNextCharacter();
          },
          error: (err) => {
            console.error(err);
            this.isLoading.set(false);
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  private displayNextCharacter(): void {
    const fiches = this.fiches();
    const index = this.currentIndex();

    if (index >= this.totalQuestions()) {
      this.sessionComplete.set(true);
      this.finalizeSession();
      return;
    }

    const fiche = fiches[index];
    this.currentCharacter.set(fiche.caractere);
    this.correctAnswer.set(this.getCharacterAnswer(fiche.caractere));
    this.isAnswered.set(false);
    this.selectedAnswer.set(null);
    this.userInput.set('');

    const mode = this.revisionMode();
    if (mode === 'recognition') {
      const options = this.characterService.getAnswerOptions(fiche, 4);
      this.answerOptions.set(options);
    }
  }

  private getCharacterAnswer(character: Caractere): string {
    return character.type === 'kanji' ? character.romaji_l : character.romaji;
  }

  selectAnswer(answer: string): void {
    if (this.isAnswered()) return;

    this.selectedAnswer.set(answer);
    this.isAnswered.set(true);

    const isCorrect = answer === this.correctAnswer();
    if (isCorrect) {
      this.correctAnswers.update(val => val + 1);
    }

    const res: CharacterAnswer = {
      characterId: this.currentCharacter()?.id || '',
      correct: isCorrect,
      userAnswer: answer,
      type: this.characterType() || undefined,
      difficulty: this.difficulty() || undefined
    };
    this.sessionResults.push(res);
    this.statisticsService.recordAnswer(res);
  }

  submitWriting(): void {
    if (this.isAnswered() || !this.userInput()) return;

    this.isAnswered.set(true);
    const userAnswer = this.userInput().toLowerCase().trim();
    const isCorrect = userAnswer === this.correctAnswer();

    if (isCorrect) {
      this.correctAnswers.update(val => val + 1);
    }

    const res: CharacterAnswer = {
      characterId: this.currentCharacter()?.id || '',
      correct: isCorrect,
      userAnswer: userAnswer,
      type: this.characterType() || undefined,
      difficulty: this.difficulty() || undefined
    };
    this.sessionResults.push(res);
    this.statisticsService.recordAnswer(res);
  }

  nextCharacter(): void {
    this.currentIndex.update(val => val + 1);
    if (this.currentIndex() < this.totalQuestions()) {
      this.displayNextCharacter();
    } else {
      this.sessionComplete.set(true);
      this.finalizeSession();
    }
  }

  private finalizeSession(): void {
    // Envoi des résultats de la session au backend
    const type = this.characterType();
    if (!type) return;

    const listId = this.characterService.getListId(type);
    if (!listId) {
      console.warn('Aucune liste trouvée pour le type', type);
      return;
    }

    // Envoi en une seule requête (endpoint provisoire à implémenter côté back)
    this.characterService.sendSessionResults(listId, this.sessionResults).subscribe({
      next: () => console.info('Résultats de session envoyés'),
      error: (err) => console.error('Erreur en envoyant les résultats de session', err)
    });
  }

  restartSession(): void {
    this.router.navigate(['/selection']);
  }

  getAccuracy(): number {
    const total = this.totalQuestions();
    return total > 0 ? Math.round((this.correctAnswers() / total) * 100) : 0;
  }

  isCorrect(): boolean {
    if (this.revisionMode() === 'recognition') {
      return this.selectedAnswer() === this.correctAnswer();
    } else {
      return this.userInput().toLowerCase().trim() === this.correctAnswer();
    }
  }

  get currentCharacterSignification(): string | undefined {
    const character = this.currentCharacter();
    return character?.type === 'kanji' ? character.signification : undefined;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
