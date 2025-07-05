import kalimbaInit from "../../store/sounds";
import type { KalimbaDot } from "./KalimbaDot";

class KalimbaInit {
  private notes: KalimbaDot[];
  private notesMap: Map<string, KalimbaDot>
  private typesMap: Map<string, KalimbaDot[]>

  public constructor() {
    this.notes = kalimbaInit.notes;
    this.notesMap = kalimbaInit.notesMap;
    this.typesMap = kalimbaInit.kalimbaTypeMaps;
  }

  public getNotes(): KalimbaDot[] {
    return this.notes;
  }

  public setNotes(notes: KalimbaDot[]): void {
    this.notes = notes;
  }

  public getNotesMap(): Map<string, KalimbaDot> {
    return this.notesMap;
  }

  public setNotesMap(notesMap: Map<string, KalimbaDot>): void {
    this.notesMap = notesMap;
  }

  public getTypesMap(): Map<string, KalimbaDot[]> {
    return this.typesMap;
  }

  public setTypesMap(typesMap: Map<string, KalimbaDot[]>): void {
    this.typesMap = typesMap;
  }
}

export { KalimbaInit };