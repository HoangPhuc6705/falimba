import Konva from "konva";
import type { Player } from "tone";

class KalimbaDot extends Konva.Circle {
  private noteId: number;
  private isSelect: boolean;
  private sound: Player | undefined;
  private note: string;
  private numberNote: string | undefined;
  private played: boolean;

  constructor(props: { sound?: Player, note: string, numberNote?: string }, config: Konva.CircleConfig) {
    super(config);
    this.sound = props.sound;
    this.note = props.note;
    this.numberNote = props.numberNote;
    this.isSelect = false;
    this.noteId = 0;
    this.played = false;
  }

  isInsideDot({ x, y }: { x: number, y: number }): boolean {
    return Math.pow(x - this.x(), 2) + Math.pow(y - this.y(), 2) <= this.radius() * this.radius();
  }

  updatePosition({ x, y }: { x: number, y: number }) {
    this.x(x);
    this.y(y);
  }

  public getNoteId(): number | undefined {
    return this.noteId;
  }

  public setId(noteId: number): void {
    this.noteId = noteId;
  }

  public getIsSelect(): boolean {
    return this.isSelect;
  }

  public setIsSelect(isSelect: boolean): void {
    this.isSelect = isSelect;
  }

  public getSound(): Player | undefined {
    return this.sound;
  }

  public setSound(sound: Player): void {
    this.sound = sound;
  }

  public getNote(): string {
    return this.note;
  }

  public setNote(note: string): void {
    this.note = note;
  }

  public getNumberNote(): string | undefined {
    return this.numberNote;
  }

  public isPlayed() {
    return this.played;
  }

  public setPlayed(play: boolean) {
    this.played = play
  }

  public setNumberNote(numberNote: string): void {
    this.numberNote = numberNote;
  }
}

export { KalimbaDot }