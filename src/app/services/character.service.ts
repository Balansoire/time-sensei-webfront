import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuid } from 'uuid';
import { Kana, Kanji, ListeUtilisateur, CharacterType, DifficultyLevel, ListeFiche, FicheRevision } from '../models/character.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

type RawHiraganaCaractere = { Hiragana: { romaji: string; kana: string; groupe: string; sous_groupe: string } };
type RawKatakanaCaractere = { Katakana: { romaji: string; kana: string; groupe: string; sous_groupe: string } };
type RawKanjiCaractere = { Kanji: { romaji_l: string; kana_l: string; romaji_c: string; kana_c: string; kanji: string; groupe: string; sous_groupe: string; signification: string } };
type RawCaractere = RawHiraganaCaractere | RawKatakanaCaractere | RawKanjiCaractere;
type RawFicheRevision = {
  caractere: RawCaractere;
  suite_succes: number;
  derniere_revision: string;
  nombre_revisions: number;
  nombre_succes: number;
};
type RawListeUtilisateur = {
  id: string;
  user_id: string;
  type_liste: 'Hiragana' | 'Katakana' | 'Kanji';
  nombre_revisions_liste: number;
  liste_fiche: RawFicheRevision[];
};

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private readonly http = inject(HttpClient);

  private hiraganaList: ListeUtilisateur | undefined;

  private katakanaList: ListeUtilisateur | undefined;

  private kanjiList: ListeUtilisateur | undefined;

  constructor() {}

  getLists(id: string): Observable<[ListeUtilisateur, ListeUtilisateur, ListeUtilisateur]> {
    return this.http.get<RawListeUtilisateur[]>(`${environment.apiURL}/liste_utilisateur/utilisateur/${id}`)
      .pipe(
        map((rawLists) => {
          if (!Array.isArray(rawLists)) {
            return [this.createEmptyList('hiragana'), this.createEmptyList('katakana'), this.createEmptyList('kanji')];
          }
          return this.normalizeLists(rawLists);
        })
      );
  }
  
  private normalizeLists(rawLists: RawListeUtilisateur[]): [ListeUtilisateur, ListeUtilisateur, ListeUtilisateur] {
    const normalizedLists = rawLists.map((raw) => ({
      id: raw.id,
      userId: raw.user_id,
      type_liste_fiche: this.mapType(raw.type_liste),
      nombre_revisions: raw.nombre_revisions_liste,
      liste_fiche: raw.liste_fiche.map((fiche) => this.normalizeFicheRevision(fiche))
    }));

    return [
      normalizedLists.find((list) => list.type_liste_fiche === 'hiragana') ?? this.createEmptyList('hiragana'),
      normalizedLists.find((list) => list.type_liste_fiche === 'katakana') ?? this.createEmptyList('katakana'),
      normalizedLists.find((list) => list.type_liste_fiche === 'kanji') ?? this.createEmptyList('kanji')
    ];
  }

  private normalizeFicheRevision(raw: RawFicheRevision): FicheRevision {
    const rawCaractere = raw.caractere;

    if ('Hiragana' in rawCaractere) {
      return {
        caractere: {
          id: uuid(),
          caractere: rawCaractere.Hiragana.kana,
          romaji: rawCaractere.Hiragana.romaji,
          type: 'hiragana',
          groupe: rawCaractere.Hiragana.groupe
        },
        suite_succes: raw.suite_succes,
        derniere_revision: raw.derniere_revision,
        nombre_revisions: raw.nombre_revisions,
        nombre_succes: raw.nombre_succes
      };
    }

    if ('Katakana' in rawCaractere) {
      return {
        caractere: {
          id: uuid(),
          caractere: rawCaractere.Katakana.kana,
          romaji: rawCaractere.Katakana.romaji,
          type: 'katakana',
          groupe: rawCaractere.Katakana.groupe
        },
        suite_succes: raw.suite_succes,
        derniere_revision: raw.derniere_revision,
        nombre_revisions: raw.nombre_revisions,
        nombre_succes: raw.nombre_succes
      };
    }

    return {
      caractere: {
        id: uuid(),
        caractere: rawCaractere.Kanji.kanji,
        hiragana_l: rawCaractere.Kanji.kana_l,
        romaji_l: rawCaractere.Kanji.romaji_l,
        hiragana_c: rawCaractere.Kanji.kana_c,
        romaji_c: rawCaractere.Kanji.romaji_c,
        signification: rawCaractere.Kanji.signification,
        type: 'kanji',
        groupe: rawCaractere.Kanji.groupe
      },
      suite_succes: raw.suite_succes,
      derniere_revision: raw.derniere_revision,
      nombre_revisions: raw.nombre_revisions,
      nombre_succes: raw.nombre_succes
    };
  }

  private mapType(type: RawListeUtilisateur['type_liste']): CharacterType {
    switch (type) {
      case 'Hiragana':
        return 'hiragana';
      case 'Katakana':
        return 'katakana';
      case 'Kanji':
        return 'kanji';
    }
  }

  private createEmptyList(type: CharacterType): ListeUtilisateur {
    return {
      id: '',
      userId: '',
      type_liste_fiche: type,
      nombre_revisions: 0,
      liste_fiche: []
    };
  }

  setLists(hiragana: ListeUtilisateur, katakana: ListeUtilisateur, kanji: ListeUtilisateur): void {
  this.hiraganaList = hiragana;
  this.katakanaList = katakana;
  this.kanjiList = kanji;
}

  getCharacters(type: CharacterType, difficulty: DifficultyLevel): Observable<ListeFiche> {
    let fiches: ListeFiche = [];

    switch (type) {
      case 'hiragana':
        if (!this.hiraganaList) {
          throw new Error("List not found")
        }
        fiches = this.hiraganaList.liste_fiche;
        break;
      case 'katakana':
        if (!this.katakanaList) {
          throw new Error("List not found")
        }
        fiches = this.katakanaList.liste_fiche;
        break;
      case 'kanji':
        if (!this.kanjiList) {
          throw new Error("List not found")
        }
        fiches = this.kanjiList.liste_fiche;
        break;
    }

    // Mélanger les caractères
    const shuffled = this.shuffleArray([...fiches] as FicheRevision[]);
    return of(shuffled).pipe(delay(300));
  }

  getAnswerOptions(fiche: FicheRevision, correctOptions: number = 4): string[] {
    const allCharacters = this.getAllFicheOfType(fiche.caractere.type);
    const options = new Set<string>();
    options.add(this.getCharacterAnswer(fiche.caractere));

    while (options.size < correctOptions) {
      const randomChar = allCharacters[Math.floor(Math.random() * allCharacters.length)];
      options.add(this.getCharacterAnswer(randomChar.caractere));
    }

    return this.shuffleArray(Array.from(options));
  }

  private getCharacterAnswer(character: Kana | Kanji): string {
    return character.type === 'kanji' ? character.romaji_l : character.romaji;
  }

  private getAllFicheOfType(type: CharacterType): ListeFiche {
    switch (type) {
      case 'hiragana':
        if (!this.hiraganaList) {
          throw new Error("List not found")
        }
        return this.hiraganaList.liste_fiche;
      case 'katakana':
        if (!this.katakanaList) {
          throw new Error("List not found")
        }
        return this.katakanaList.liste_fiche;
      case 'kanji':
        if (!this.kanjiList) {
          throw new Error("List not found")
        }
        return this.kanjiList.liste_fiche;
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
