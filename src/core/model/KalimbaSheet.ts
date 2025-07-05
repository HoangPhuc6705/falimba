import { KalimbaDot } from "./KalimbaDot";
import { startSimpleSound } from "../audio/StartAudio";
import type { KalimbaStyle } from "./KalimbaStyle";
import type Konva from "konva";

class KalimbaSheet {
  private kalimbaUsing: KalimbaDot[];
  private sheet: KalimbaDot[];
  private volume: number = 15;
  private reverb: number = 0;
  private toolIndex: number = 1;
  protected currentId: number;
  protected dotSize: number;
  protected radius: number;
  private selectedNotes: KalimbaDot[];

  protected copiedAndCutStack: KalimbaDot[];

  private kalimbaUsingMap: Map<string, KalimbaDot>;

  public constructor(kalimbaUsing: KalimbaDot[]) {
    this.kalimbaUsing = kalimbaUsing;
    this.sheet = []
    this.kalimbaUsingMap = new Map()
    this.kalimbaUsing.forEach(note => {
      this.kalimbaUsingMap.set(note.getNote(), note);
    })
    this.currentId = 1;
    this.dotSize = 20;
    this.radius = this.dotSize / 2;
    this.selectedNotes = [];
    this.copiedAndCutStack = []
  }

  addNote(dot: KalimbaDot): void {
    dot.setId(this.currentId)
    dot.setSound(this.kalimbaUsingMap.get(dot.getNote())?.getSound()!)
    startSimpleSound(dot.getSound()!, this.volume)
    this.sheet.push(dot)
    this.unselectNote();
    ++this.currentId;
  }

  selectNote(dot: KalimbaDot) {
    startSimpleSound(dot.getSound()!, this.volume)
    this.unselectNote()
    dot.setIsSelect(true);
    this.selectedNotesObserver()
  }

  selectNoteInArea(dot: KalimbaDot) {
    dot.setIsSelect(true);
    this.selectedNotesObserver()
  }

  selectMultiNote(dot: KalimbaDot) {
    startSimpleSound(dot.getSound()!, this.volume)
    dot.setIsSelect(true);
    this.selectedNotesObserver()
  }

  unselectNote() {
    this.sheet.forEach(note => {
      note.setIsSelect(false);
      note.stroke("")
    });
    while (this.selectedNotes.length > 0) {
      this.selectedNotes.pop();
    }
  }

  selectAllNote(style: KalimbaStyle) {
    this.sheet.forEach(note => {
      note.setIsSelect(true)
      note.stroke(style.getSelect())
      note.strokeWidth(3);
    });
    this.selectedNotesObserver()
  }

  selectedNotesObserver() {
    this.selectedNotes = this.sheet.filter(note => note.getIsSelect())
  }

  eraseNote(dot: KalimbaDot) {
    if (!dot) return;
    dot.destroy();
    const idx = this.sheet.indexOf(dot);
    if (idx > -1) {
      this.sheet.splice(idx, 1)
    }
  }

  eraseAllSelectedNote() {
    this.selectedNotes.forEach(note => {
      note.destroy();
      this.eraseNote(note)
    })
  }

  copyNotes(dots: KalimbaDot[]) {
    this.unselectNote()
    dots.forEach(dot => {
      this.sheet.push(dot)
      this.selectedNotes.push(dot)
    })
  }

  setNoteSound(dot: KalimbaDot, pitch: string) {
    const idx = this.sheet.indexOf(dot);
    if (idx > -1) {
      dot.setSound(this.kalimbaUsingMap.get(pitch)?.getSound()!)
    }
  }

  sortNotes() {
    this.sheet.sort((a, b) => a.x() - b.y());
  }

  setCopyAndCutStack(state: string) {
    this.copiedAndCutStack = this.selectedNotes.map(dot => {
      return new KalimbaDot({
        note: dot.getNote(),
        sound: dot.getSound()
      }, {
        x: dot.x(),
        y: dot.y(),
        width: dot.width(),
        height: dot.height(),
        fill: dot.fill(),
      })
    });
    if (state === 'cut') {
      this.eraseAllSelectedNote()
    }
  }

  paste(clockwise?: Konva.Group) {
    if (this.copiedAndCutStack.length === 0) return;
    this.copiedAndCutStack.sort((a, b) => a.x() - b.x())
    const firstX = this.copiedAndCutStack[0].x();
    this.copiedAndCutStack.forEach(dot => {
      dot.x(dot.x() - firstX + clockwise?.x()! + dot.radius())
      this.sheet.push(dot)
    })
  }

  public getCopiedAndCutStack() {
    return this.copiedAndCutStack;
  }

  public getSelectedNotes() {
    return this.selectedNotes;
  }

  public getKalimbaUsingMap() {
    return this.kalimbaUsingMap;
  }

  public getKalimbaUsing(): KalimbaDot[] {
    return this.kalimbaUsing;
  }

  public setKalimbaUsing(kalimbaUsing: KalimbaDot[]): void {
    this.kalimbaUsing = kalimbaUsing;
  }

  public getSheet(): KalimbaDot[] {
    return this.sheet;
  }

  public setSheet(sheet: KalimbaDot[]): void {
    this.sheet = sheet;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(volume: number): void {
    this.volume = volume;
  }

  public getReverb(): number {
    return this.reverb;
  }

  public setReverb(reverb: number): void {
    this.reverb = reverb;
  }

  public getToolIndex(): number {
    return this.toolIndex;
  }

  public setToolIndex(toolIndex: number): void {
    this.toolIndex = toolIndex;
  }

}

export { KalimbaSheet };