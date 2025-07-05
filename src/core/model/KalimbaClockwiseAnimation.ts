import Konva from "konva";
import type { KalimbaTimeline } from "./KalimbaTimeline";
import { startMultiSound, startSimpleSound } from "../audio/StartAudio";
import type { Player } from "tone";

interface TempNote {
  x: number,
  sound: Player,
  isPlay: boolean
}

class KalimbaClockwiseAnimation {
  protected clockwise: Konva.Group;
  protected timeline: KalimbaTimeline;
  protected animation: Konva.Animation;
  protected currentX: number;
  protected containerWidth: number;
  protected start: boolean;
  protected timeNow!: number;
  protected bpm: number;
  protected beatWith: number;
  protected beat: number;
  protected matrix: TempNote[][];
  protected copySheet: TempNote[]
  protected noteIdx: number;

  constructor(timeline: KalimbaTimeline) {
    this.clockwise = timeline.getCanvasClockwise();
    this.timeline = timeline;
    this.start = false;
    this.currentX = 0;
    this.matrix = []
    this.copySheet = []

    this.bpm = timeline.getBpm();
    this.beatWith = timeline.getBeatWidth();
    this.beat = timeline.getBeat()
    this.noteIdx = 0;

    const velocity = (this.beatWith * this.bpm) / 60;
    const timelineWidth = this.timeline.getCenter().timelineWidth

    const keysWidth = timeline.getKeys().widthPerKey;
    this.containerWidth = this.timeline.getSize().width


    this.animation = new Konva.Animation(() => {
      const now = performance.now() - this.timeNow;
      const elapsed = now / 1000;
      let x = elapsed * velocity + keysWidth;

      if (this.currentX > 0) {
        x += this.currentX - keysWidth;
      }

      // when clockwise go to the end of timeline
      if (x >= timelineWidth - keysWidth * 2) {
        x = keysWidth;
        this.start = false;
        this.currentX = 0;
        this.timeline.getCanvasKey().listening(true);
        this.noteIdx = 0
        this.delete()
        this.animation.stop();
      };

      // when clockwise run out of center range
      if (this.clockwise.getAbsolutePosition().x >= this.containerWidth) {
        this.timeline.setCanvasCenterPositionXWhenRun()
      }

      // reset sheet if onchange
      if (this.timeline.getSheet()?.getSheet().length !== this.copySheet.length) {
        this.setup()
      }

      this.clockwise.x(x);
      // start the sound
      this.handleStartSound();

      this.clockwise.getStage()?.batchDraw()
    }, this.clockwise.getStage())
  }

  animationStart() {
    this.start = true;
    this.timeline.getCanvasKey().listening(false);
    this.timeNow = performance.now();
    this.currentX = this.clockwise.x()
    this.setup()
    this.animation.start()
  }

  animationStop() {
    this.start = false;
    this.timeline.getCanvasKey().listening(true);
    this.currentX = this.clockwise.x();
    this.delete()
    this.animation.stop();
  }

  setup() {
    // get the sheet
    if (!this.timeline.getSheet()) return;
    this.timeline.getSheet()?.sortNotes();
    this.copySheet = this.timeline.getSheet()
      ?.getSheet()
      .map(note => {
        const sound = note.getSound();
        if (!sound) {
          throw new Error("Note sound is undefined");
        }
        return { x: note.x() - note.radius(), sound, isPlay: note.isPlayed() };
      }) ?? []
    if (this.copySheet.length === 0) return;
    // convert it to matrix
    this.matrix = this.createMatrixSheet()

    // kiem tra vi tri kim dong ho va check nhung not nhac nam truoc
    for (let i = 0; i < this.copySheet.length; ++i) {
      const note = this.copySheet[i];
      if (this.clockwise.x() >= note.x && !note.isPlay) {
        note.isPlay = true;
      }
    }
  }

  delete() {
    this.copySheet = []
    this.matrix = []
    this.noteIdx = 0;
  }

  handleStartSound() {
    if (this.copySheet.length === 0) return;

    for (let i = 0; i < this.copySheet.length; ++i) {
      const note = this.copySheet[i];
      if (this.clockwise.x() >= note.x && !note.isPlay) {
        startSimpleSound(note.sound, 15)
        note.isPlay = true;
        break;
      }
    }

  }

  createMatrixSheet(): TempNote[][] {
    const sheetMatrix: TempNote[][] = []

    let start = 0;
    let end = 1;

    while (end < this.copySheet.length) {
      const row: TempNote[] = []
      if (this.copySheet[start].x !== this.copySheet[end].x) {
        for (let idx = start; idx < end; ++idx) {
          row.push(this.copySheet[idx])
        }
        start = end;
      }
      sheetMatrix.push(row)
      ++end;
    }

    const r: TempNote[] = []
    for (let i = start; i < this.copySheet.length; ++i) {
      r.push(this.copySheet[i])
    }
    sheetMatrix.push(r)

    return sheetMatrix;
  }

  setContainerWidth(width: number) {
    this.containerWidth = width;
  }

  setCurrentX(x: number) {
    this.currentX = x;
  }

  isStart() {
    return this.start
  }
}

export { KalimbaClockwiseAnimation }