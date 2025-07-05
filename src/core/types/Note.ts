import { Player } from "tone";
import Konva from "konva";

interface Note {
    id: number,
    isSelected?: boolean,
    sound: Player,
    note: string,
    numberNote?: string,
    canvasDot?: Konva.Circle,
}

export type { Note }