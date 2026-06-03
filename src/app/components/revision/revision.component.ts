import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Kana, Kanji, CharacterType, RevisionMode, DifficultyLevel } from '../../models/character.model';
import { CharacterService } from '../../services/character.service';
import { StatisticsService } from '../../services/statistics.service';
import { AuthService } from '../../services/auth.service';

type Character = Kana | Kanji;

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

  characters = signal<Character[]>([]);
  currentIndex = signal(0);
  currentCharacter = signal<Character | null>(null);
  answerOptions = signal<string[]>([]);

  isLoading = signal(true);
  isAnswered = signal(false);
  selectedAnswer = signal<string | null>(null);
  userInput = signal('');
  correctAnswer = signal('');

  totalQuestions = signal(0);
  correctAnswers = signal(0);
  sessionComplete = signal(false);

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

      this.loadCharacters();
    });
  }

  private loadCharacters(): void {
    const type = this.characterType();
    const difficulty = this.difficulty();

    if (!type || !difficulty) return;

    this.characterService.getCharacters(type, difficulty).subscribe(characters => {
      this.characters.set(characters);
      this.totalQuestions.set(Math.min(characters.length, 10));
      this.isLoading.set(false);
      this.displayNextCharacter();
    });
  }

  private displayNextCharacter(): void {
    const characters = this.characters();
    const index = this.currentIndex();

    if (index >= this.totalQuestions()) {
      this.sessionComplete.set(true);
      return;
    }

    const character = characters[index];
    this.currentCharacter.set(character);
    this.correctAnswer.set(this.getCharacterAnswer(character));
    this.isAnswered.set(false);
    this.selectedAnswer.set(null);
    this.userInput.set('');

    const mode = this.revisionMode();
    if (mode === 'recognition') {
      const options = this.characterService.getAnswerOptions(character, 4);
      this.answerOptions.set(options);
    }
  }

  private getCharacterAnswer(character: Character): string {
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

    this.statisticsService.recordAnswer({
      characterId: this.currentCharacter()?.id || '',
      correct: isCorrect,
      userAnswer: answer
    });
  }

  submitWriting(): void {
    if (this.isAnswered() || !this.userInput()) return;

    this.isAnswered.set(true);
    const userAnswer = this.userInput().toLowerCase().trim();
    const isCorrect = userAnswer === this.correctAnswer();

    if (isCorrect) {
      this.correctAnswers.update(val => val + 1);
    }

    this.statisticsService.recordAnswer({
      characterId: this.currentCharacter()?.id || '',
      correct: isCorrect,
      userAnswer: userAnswer
    });
  }

  nextCharacter(): void {
    this.currentIndex.update(val => val + 1);
    if (this.currentIndex() < this.totalQuestions()) {
      this.displayNextCharacter();
    } else {
      this.sessionComplete.set(true);
    }
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
