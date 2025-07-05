import type { KalimbaDot } from "../model/KalimbaDot";
import type { Note } from "./Note";

interface KalimbaAudio {
  notes: KalimbaDot[],
  notesMap: Map<string, KalimbaDot>
  kalimbaTypeMaps: Map<string, KalimbaDot[]>,
}

interface KalimbaSheet {
  kalimbaUsing: Note[]
  sheet: Note[]
  volume: number,
  reverb: number,
  tool: number,
  addNote: () => void,
  selectNotes: () => void,
  unSelectNotes: () => void,
  eraseNotes: () => void,
  moveNotes: () => void,
  dragToSelectNotes: () => void,
  copyNotes: () => void,
  setTool: (toolIndex: number) => void,
}

interface KalimbaKeys {
  widthPerKey: number,
  heightPerKey: number,
  height?: number,
}

interface KalimbaRuler {
  rulerWidth: number,
  rulerHeight: number,
}

interface KalimbaCenter {
  timelineWidth: number,
  timelineHeight: number,
}

interface Timeline {
  kalimbaKey: KalimbaKeys,
  kalimbaRuler: KalimbaRuler,
  kalimbaCenter: KalimbaCenter,

  beat: number,
  beatWidth: number,
  bpm: number,

  isPlay: boolean,

  colorTheme?: string,
  colorSelect?: string,
  colorClockwise?: string,
  colorLine?: string,
  colorStroke?: string,

  setIsPlay: () => void
}

export type { KalimbaAudio, KalimbaSheet, Timeline, KalimbaKeys, KalimbaRuler, KalimbaCenter }