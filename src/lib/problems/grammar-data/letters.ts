/**
 * Portuguese Alphabet Data
 *
 * Letter definitions for grammar problems including names and groupings.
 */

/** Information about a letter */
export interface LetterInfo {
	uppercase: string
	lowercase: string
	namePtBR: string // How to say the letter name in Portuguese
	nameEn: string
	isVowel: boolean
}

/** The Portuguese alphabet (same 26 letters as English) */
export const portugueseAlphabet: LetterInfo[] = [
	{ uppercase: 'A', lowercase: 'a', namePtBR: 'a', nameEn: 'a', isVowel: true },
	{ uppercase: 'B', lowercase: 'b', namePtBR: 'bê', nameEn: 'bee', isVowel: false },
	{ uppercase: 'C', lowercase: 'c', namePtBR: 'cê', nameEn: 'cee', isVowel: false },
	{ uppercase: 'D', lowercase: 'd', namePtBR: 'dê', nameEn: 'dee', isVowel: false },
	{ uppercase: 'E', lowercase: 'e', namePtBR: 'e', nameEn: 'ee', isVowel: true },
	{ uppercase: 'F', lowercase: 'f', namePtBR: 'efe', nameEn: 'ef', isVowel: false },
	{ uppercase: 'G', lowercase: 'g', namePtBR: 'gê', nameEn: 'gee', isVowel: false },
	{ uppercase: 'H', lowercase: 'h', namePtBR: 'agá', nameEn: 'aitch', isVowel: false },
	{ uppercase: 'I', lowercase: 'i', namePtBR: 'i', nameEn: 'eye', isVowel: true },
	{ uppercase: 'J', lowercase: 'j', namePtBR: 'jota', nameEn: 'jay', isVowel: false },
	{ uppercase: 'K', lowercase: 'k', namePtBR: 'cá', nameEn: 'kay', isVowel: false },
	{ uppercase: 'L', lowercase: 'l', namePtBR: 'ele', nameEn: 'el', isVowel: false },
	{ uppercase: 'M', lowercase: 'm', namePtBR: 'eme', nameEn: 'em', isVowel: false },
	{ uppercase: 'N', lowercase: 'n', namePtBR: 'ene', nameEn: 'en', isVowel: false },
	{ uppercase: 'O', lowercase: 'o', namePtBR: 'o', nameEn: 'oh', isVowel: true },
	{ uppercase: 'P', lowercase: 'p', namePtBR: 'pê', nameEn: 'pee', isVowel: false },
	{ uppercase: 'Q', lowercase: 'q', namePtBR: 'quê', nameEn: 'cue', isVowel: false },
	{ uppercase: 'R', lowercase: 'r', namePtBR: 'erre', nameEn: 'ar', isVowel: false },
	{ uppercase: 'S', lowercase: 's', namePtBR: 'esse', nameEn: 'ess', isVowel: false },
	{ uppercase: 'T', lowercase: 't', namePtBR: 'tê', nameEn: 'tee', isVowel: false },
	{ uppercase: 'U', lowercase: 'u', namePtBR: 'u', nameEn: 'you', isVowel: true },
	{ uppercase: 'V', lowercase: 'v', namePtBR: 'vê', nameEn: 'vee', isVowel: false },
	{ uppercase: 'W', lowercase: 'w', namePtBR: 'dáblio', nameEn: 'double-you', isVowel: false },
	{ uppercase: 'X', lowercase: 'x', namePtBR: 'xis', nameEn: 'ex', isVowel: false },
	{ uppercase: 'Y', lowercase: 'y', namePtBR: 'ípsilon', nameEn: 'why', isVowel: false },
	{ uppercase: 'Z', lowercase: 'z', namePtBR: 'zê', nameEn: 'zee', isVowel: false }
]

/** Vowels only */
export const vowels = portugueseAlphabet.filter((l) => l.isVowel)

/** Consonants only */
export const consonants = portugueseAlphabet.filter((l) => !l.isVowel)

/** Common consonants for early difficulty levels */
export const commonConsonants = portugueseAlphabet.filter((l) =>
	['B', 'C', 'D', 'M', 'N', 'P', 'S', 'T'].includes(l.uppercase)
)

/** Get letter info by uppercase letter */
export function getLetterInfo(letter: string): LetterInfo | undefined {
	return portugueseAlphabet.find((l) => l.uppercase === letter.toUpperCase())
}

/** Get letter index (0-25) */
export function getLetterIndex(letter: string): number {
	return portugueseAlphabet.findIndex((l) => l.uppercase === letter.toUpperCase())
}

/** Get letter at index */
export function getLetterAtIndex(index: number): LetterInfo | undefined {
	return portugueseAlphabet[index]
}

/**
 * Get letters for a specific difficulty level
 * Level 1: Vowels only (A, E, I, O, U)
 * Level 2: Vowels + common consonants (B, C, D, M, N, P, S, T)
 * Level 3: Full alphabet uppercase
 * Level 4: Full alphabet (for mixed case problems)
 */
export function getLettersForDifficulty(difficulty: 1 | 2 | 3 | 4): LetterInfo[] {
	switch (difficulty) {
		case 1:
			return vowels
		case 2:
			return [...vowels, ...commonConsonants]
		case 3:
		case 4:
			return portugueseAlphabet
	}
}
