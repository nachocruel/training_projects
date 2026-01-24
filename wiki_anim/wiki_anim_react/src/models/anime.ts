import type { Character } from "./character";

export interface Anime {
    id: number;
    title: string;
    studio: string | null;
    release_year: number | null;
    characters: Character[];
}