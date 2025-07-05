import Konva from 'konva';
import type { KalimbaCenter, KalimbaKeys, KalimbaRuler } from '../types/Kalimba'
import type { KalimbaSheet } from './KalimbaSheet';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Area } from '../types/Area'
import { KalimbaStyle } from './KalimbaStyle';
import { startSimpleSound } from '../audio/StartAudio';
import { KalimbaDot } from './KalimbaDot';
import FirstPositon from './FirstPosition';
// @ts-ignore
import { KalimbaInteract } from './KalimbaInteract';
import { KalimbaClockwiseAnimation } from './KalimbaClockwiseAnimation';


class KalimbaTimeline {
  protected keys: KalimbaKeys;
  protected ruler: KalimbaRuler;
  protected center: KalimbaCenter;
  protected style: KalimbaStyle;
  protected containerWidth!: number;
  protected containerHeight!: number;
  protected beat: number;
  protected beatWidth: number;
  protected bpm: number;
  protected isPlay: boolean
  protected sheet: KalimbaSheet | null;
  protected dotSize: number;
  protected canvasKey!: Konva.Group;
  protected canvasRuler!: Konva.Group;
  protected canvasCenter!: Konva.Group;
  protected canvasHorizonGroup!: Konva.Group;
  protected canvasClockwise!: Konva.Group;
  protected keydown: string | undefined;
  protected isMouseDown: boolean;
  protected isMouseMove: boolean;
  protected newDot: KalimbaDot | null;
  protected firstPos!: FirstPositon | null;
  protected firstShapePos!: FirstPositon | null;
  protected firstSelectedShapePos: FirstPositon[];
  protected area: Area | null;
  protected areaRect: Konva.Rect | null;
  protected copiedDots: KalimbaDot[] | null;
  protected clockwiseFocus: boolean;
  protected kalimbaClockwiseAnimation!: KalimbaClockwiseAnimation;

  constructor(obj: {
    keys: KalimbaKeys,
    ruler: KalimbaRuler,
    center: KalimbaCenter,
    style: KalimbaStyle
  }) {
    this.keys = obj.keys;
    this.ruler = obj.ruler;
    this.center = obj.center;
    this.beat = 480;
    this.beatWidth = 80;
    this.bpm = 120;
    this.dotSize = 20;
    this.isPlay = false;
    this.style = obj.style;
    this.ruler.rulerWidth = this.beat * this.beatWidth;
    this.sheet = null;
    this.isMouseDown = false;
    this.isMouseMove = false;
    this.newDot = null;
    this.firstSelectedShapePos = []
    this.area = null;
    this.areaRect = null;
    this.copiedDots = null
    this.clockwiseFocus = false;
  }

  setKalimbaTimeModel(sheet: KalimbaSheet): void {
    this.sheet = sheet;
    this.keys.height = sheet.getKalimbaUsing().length * this.keys.heightPerKey;
    this.center.timelineHeight = sheet.getKalimbaUsing().length * this.keys.heightPerKey;
    this.center.timelineWidth = this.beat * this.beatWidth
    this.canvasKey = this.renderKeys()!;
    this.canvasRuler = this.renderRuler()!;
    this.canvasCenter = this.renderCenter()!;
    this.canvasClockwise = this.renderClockwise()!;
    this.canvasHorizonGroup = new Konva.Group();
    this.canvasHorizonGroup.add(this.canvasCenter);
    this.canvasHorizonGroup.add(this.canvasRuler);
    this.canvasHorizonGroup.add(this.canvasClockwise)
    this.kalimbaClockwiseAnimation = new KalimbaClockwiseAnimation(this)

    this.centerInteractEvent()
    this.setClockwisePosition()

    // const kalimbaInteract = new KalimbaInteract(this);
    // console.log(this.canvasKey.children.length + this.canvasRuler.children.length + this.canvasCenter.children.length);
    // kalimbaInteract.handleMouseEvent();

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Delete' || event.key === "Backspace") {
        this.sheet?.eraseAllSelectedNote()
      } else if (event.key === 'a' && (event.metaKey || event.ctrlKey)) {
        this.sheet?.selectAllNote(this.style);
      } else if (event.key === 'x' && (event.metaKey || event.ctrlKey)) {
        this.sheet?.setCopyAndCutStack('cut')
      } else if (event.key === 'c' && (event.metaKey || event.ctrlKey)) {
        this.sheet?.setCopyAndCutStack('copy')
      } else if (event.key === 'v' && (event.metaKey || event.ctrlKey)) {
        this.paste()
      }
    })
  }

  public renderKeys(): Konva.Group | null {
    if (!this.sheet) return null;
    const keysGroup = new Konva.Group()
    for (let index = 0; index < this.sheet.getKalimbaUsing().length; ++index) {
      const kgroup = new Konva.Group()
      const note = this.sheet.getKalimbaUsing()[index].getNote();
      const keyRect = new Konva.Rect({
        x: 0,
        y: index * this.keys.heightPerKey + this.ruler.rulerHeight,
        width: this.keys.widthPerKey,
        height: this.keys.heightPerKey,
        fill: note.includes('b') ? '#7dd3fc' : this.style.getMain(),
      })
      const textNote = new Konva.Text({
        x: this.keys.widthPerKey - 30,
        y: index * this.keys.heightPerKey + this.ruler.rulerHeight + 10,
        text: this.sheet.getKalimbaUsing()[index].getNote(),
        fill: this.style.getLine(),
        fontStyle: 'bold'
      })
      kgroup.add(keyRect)
      kgroup.add(textNote)
      if (index < this.sheet.getKalimbaUsing().length - 1) {
        const line = new Konva.Line({
          points: [
            0,
            index * this.keys.heightPerKey + this.ruler.rulerHeight,
            this.keys.widthPerKey,
            index * this.keys.heightPerKey + this.ruler.rulerHeight],
          stroke: this.style.getLine(),
          strokeWidth: 1.5,
        })
        kgroup.add(line)
      }
      kgroup.on('click', () => {

      })
      kgroup.on('mouseenter', () => {
        document.body.style.cursor = 'pointer'
      })
      kgroup.on('mouseleave', () => {
        document.body.style.cursor = 'context-menu'
        keyRect.fill(note.includes('b') ? '#7dd3fc' : this.style.getMain())
      })
      kgroup.on('mousedown', () => {
        startSimpleSound(this.sheet?.getKalimbaUsing()[index].getSound()!, this.sheet?.getVolume()!)
        keyRect.fill("#0ea5e9");
      })
      kgroup.on('mouseup', () => {
        keyRect.fill(note.includes('b') ? '#7dd3fc' : this.style.getMain())
      })
      keysGroup.add(kgroup);
    }
    return keysGroup;
  }

  private renderRuler(): Konva.Group | null {
    const rulerGroup = new Konva.Group();
    const ruler = new Konva.Rect({
      x: this.keys.widthPerKey,
      y: 0,
      width: this.ruler.rulerWidth,
      height: this.ruler.rulerHeight,
      fill: this.style.getMain()
    })
    rulerGroup.add(ruler)
    for (let index = 0; index <= this.beat; ++index) {
      const verLine = new Konva.Line({
        points: [
          index * this.beatWidth + this.keys.widthPerKey,
          0,
          index * this.beatWidth + this.keys.widthPerKey,
          this.ruler.rulerHeight
        ],
        stroke: this.style.getStroke(),
        strokeWidth: 1.5,
      })
      rulerGroup.add(verLine)
    }
    return rulerGroup;
  }

  private renderCenter(): Konva.Group | null {
    const centerGroup = new Konva.Group();
    if (!this.sheet) return null;
    for (let index = 0; index < this.sheet.getKalimbaUsing().length; ++index) {
      const lineGroup = new Konva.Group();
      const lineRect = new Konva.Rect({
        x: this.keys.widthPerKey,
        y: index * this.center.timelineHeight + this.ruler.rulerHeight,
        width: this.center.timelineWidth,
        height: this.center.timelineHeight,
        fill: this.style.getLine(),
        name: 'pitch-line',
      })
      lineGroup.add(lineRect)

      if (index > 0 && index <= this.sheet.getKalimbaUsing().length - 1) {
        const lineLine = new Konva.Line({
          points: [
            this.keys.widthPerKey,
            index * this.keys.heightPerKey + this.ruler.rulerHeight,
            this.center.timelineWidth + this.keys.widthPerKey,
            index * this.keys.heightPerKey + this.ruler.rulerHeight
          ],
          stroke: '#78716c',
          strokeWidth: 1,
          name: 'stroke-line'
        })
        lineGroup.add(lineLine)
      }

      centerGroup.add(lineGroup)
    }

    return centerGroup;
  }

  renderClockwise(): Konva.Group {
    const clockwiseGroup = new Konva.Group({
      x: this.keys.widthPerKey,
      y: 0
    });
    const triangle = new Konva.Shape({
      sceneFunc: (context, shape) => {
        context.beginPath()
        context.moveTo(-10, 0)
        context.lineTo(10, 0)
        context.lineTo(0, this.ruler.rulerHeight)
        context.closePath()
        context.fillStrokeShape(shape)
      },
      fill: this.style.getClockwise(),
      listening: false
    })
    const verticalLine = new Konva.Line({
      points: [
        0,
        0,
        0,
        this.keys.height!
      ],
      stroke: this.style.getClockwise(),
      strokeWidth: 1.8,
      listening: false
    })
    clockwiseGroup.add(triangle);
    clockwiseGroup.add(verticalLine);

    return clockwiseGroup;
  }

  setScrollActive(event: KonvaEventObject<WheelEvent, Konva.Stage>, stage: Konva.Stage): void {
    const { width, height }: {
      width: number, height: number
    } = {
      width: stage.width(),
      height: stage.height()
    }
    this.containerWidth = width;
    this.containerHeight = height;
    const delta = event.evt.deltaY;
    if (!this.keydown) {
      const groupY = this.canvasCenter.y();
      let y = groupY - delta;
      if (y >= 0) {
        y = 0;
      }
      if (y - height <= -this.center.timelineHeight) {
        y = -(this.center.timelineHeight - height) - this.ruler.rulerHeight;
      }

      this.canvasKey.y(y)
      this.canvasCenter.y(y)
    } else if (this.keydown === "Shift") {
      const groupX = this.canvasHorizonGroup.x();
      let x = groupX - delta;
      if (x >= 0) {
        x = 0
      }
      if (x - width <= -this.center.timelineWidth) {
        x = -(this.center.timelineWidth - width) - this.keys.heightPerKey
      }

      this.canvasHorizonGroup.x(x)
    }
  }

  private centerInteractEvent() {
    this.canvasCenter.on('mousedown', (event) => {
      this.isMouseDown = true;
      const { x, y } = this.getPosition()
      const existDot = this.getFoundDot({ x, y })
      const mouseIndex = event.evt.button;
      switch (mouseIndex) {
        case 0:
          switch (this.sheet?.getToolIndex()) {
            case 1:
              if (existDot) {
                this.selectNote(existDot)
              } else {
                this.addNote({ x, y })
              }
              break;
            case 2:
              this.selectNote(existDot!)
              break;
            case 3:
              this.eraseNote(existDot!)
              break;
          }
          break;

        case 2:
          switch (this.sheet?.getToolIndex()) {
            case 1:
              this.eraseNote(existDot!)
              break;
            case 2:
              this.selectNote(existDot!)
              break;
            case 3:
              this.eraseNote(existDot!)
              break;
          }
          break;
      }

      // create area shape
      if (!existDot && this.sheet?.getToolIndex() === 2) {
        this.area = { x1: x, y1: y, x2: x, y2: y };
        this.areaRect = new Konva.Rect({
          x: this.area.x1,
          y: this.area.y1,
          width: 0,
          height: 0,
          opacity: 0.3,
          fill: '#000000',
        })
        this.canvasCenter.add(this.areaRect)
      }
    })

    this.canvasCenter.on("mousemove", () => {
      if (this.isMouseDown) {
        this.isMouseMove = true;
        const { x, y } = this.getPosition();

        // new added dot
        if (this.newDot && this.firstPos) {
          const vectorX = x - this.firstPos.firstPos.x;
          const vectorY = y - this.firstPos.firstPos.y;
          this.newDot.updatePosition({
            x: this.firstShapePos?.firstPos.x! + vectorX,
            y: this.firstShapePos?.firstPos.y! + vectorY
          })
          this.canvasCenter.getLayer()?.batchDraw()
        }

        // move of copy multi select 
        if (this.firstSelectedShapePos.length > 0 && this.firstPos !== null) {
          this.isMouseMove = true;
          const vectorX = x - this.firstPos.firstPos.x;
          const vectorY = y - this.firstPos.firstPos.y;
          // copy
          if (this.keydown === 'Alt') {
            if (!this.copiedDots) {
              this.copiedDots = this.sheet?.getSelectedNotes()!.map(dot => new KalimbaDot({
                note: dot.getNote(),
              }, {
                x: dot.x(),
                y: dot.y(),
                width: dot.width(),
                height: dot.height(),
                fill: this.style.getMain()
              }
              ))!;
              this.copiedDots.forEach(dot => {
                dot.setIsSelect(true)
                this.canvasCenter.add(dot);
              })
            } else {
              for (let i = 0; i < this.copiedDots.length!; ++i) {
                const currentDot = this.copiedDots[i];
                currentDot.updatePosition({
                  x: this.firstSelectedShapePos[i].firstPos.x + vectorX,
                  y: this.firstSelectedShapePos[i].firstPos.y + vectorY,
                })
              }
            }
          } else {
            // move selected notes
            for (let i = 0; i < this.sheet?.getSelectedNotes().length!; ++i) {
              const currentDot = this.sheet?.getSelectedNotes()[i]!;
              currentDot.updatePosition({
                x: this.firstSelectedShapePos[i].firstPos.x + vectorX,
                y: this.firstSelectedShapePos[i].firstPos.y + vectorY,
              })
            }
          }
          this.canvasCenter.getLayer()?.batchDraw()
        }

        // move to erase (erase tool)
        if (this.sheet?.getToolIndex() === 3) {
          const foundDot = this.getFoundDot(this.getPosition())
          if (foundDot) {
            this.eraseNote(foundDot)
          }
        }

        // area drag
        if (this.areaRect && this.area) {
          this.area = {
            ...this.area,
            x2: x,
            y2: y
          }
          this.areaRect.width(x - this.area.x1);
          this.areaRect.height(y - this.area.y1);
        }
      }
    })

    this.canvasCenter.on('mouseup', () => {
      this.isMouseDown = false;
      this.clockwiseFocus = false;
      if (this.newDot) {
        const y = this.newDot.y();
        const { pitch, valueY } = this.getPitch(y)
        this.newDot.setNote(pitch);
        this.newDot.y(valueY + this.keys.heightPerKey / 2)
        this.sheet?.setNoteSound(this.newDot, pitch)
      }
      if (this.sheet?.getSelectedNotes().length! > 0 && this.isMouseMove) {
        // move note
        this.updateDotPositions(this.sheet?.getSelectedNotes()!);
        // copy note
        if (this.copiedDots) {
          this.updateDotPositions(this.copiedDots)
          this.sheet?.copyNotes(this.copiedDots)
          this.copiedDots.forEach(dot => this.setDotSelectedStyle(dot))
        }
      }

      if (this.isMouseMove) {
        this.setFirstShapeSelectedPos();
        if (this.areaRect) {
          this.selectNoteWithDrag(this.area)
          this.areaRect.destroy();
          this.area = null;
          this.areaRect = null;
        }
      }

      this.canvasCenter.on('mouseleave', () => {
        this.clockwiseFocus = false
        if (this.areaRect) {
          this.selectNoteWithDrag(this.area)
          this.areaRect.destroy();
          this.area = null;
          this.areaRect = null;
        }
      })

      this.copiedDots = null;
      this.newDot = null;
      this.firstPos = null;
      this.isMouseMove = false;
    })
  }

  addNote({ x, y }: { x: number, y: number }) {
    this.firstPos = new FirstPositon()
    this.firstPos.setFirstPos({ x, y })
    this.clearFirstShapeSelectedPos()

    let { pitch, valueY } = this.getPitch(y);
    const r = this.dotSize / 2
    x += r;
    valueY = valueY + this.ruler.rulerHeight - (r / 2);
    const dot = new KalimbaDot({
      note: pitch,
    }, {
      x: x,
      y: valueY,
      width: this.dotSize,
      height: this.dotSize,
      fill: this.style.getMain()
    })
    this.firstShapePos = new FirstPositon();
    this.firstShapePos.setFirstPos({ x: dot.x(), y: dot.y() })
    this.newDot = dot;
    this.sheet?.addNote(dot)
    this.canvasCenter.add(dot)

    if (x >= this.beatWidth * (this.beat - 10)) {
      this.expandTimelineCenter()
    }
  }

  selectNote(dot: KalimbaDot | undefined) {
    if (!dot) {
      this.sheet?.unselectNote();
      this.clearFirstShapeSelectedPos();
      return;
    }
    this.firstPos = new FirstPositon();
    this.firstPos.setFirstPos(this.getPosition())
    // mutli select
    if (this.keydown === 'Shift') {
      this.sheet?.selectMultiNote(dot)
      this.setDotSelectedStyle(dot)
    } else {
      // simple select
      if (!dot.getIsSelect()) {
        this.sheet?.selectNote(dot);
        this.setDotSelectedStyle(dot);
        this.clearFirstShapeSelectedPos()
        startSimpleSound(dot.getSound()!, this.sheet?.getVolume()!)
      } else {
        startSimpleSound(dot.getSound()!, this.sheet?.getVolume()!)
      }
    }
    this.setFirstShapeSelectedPos()
  }

  selectNoteWithDrag(area: Area | null) {
    if (!area) return;
    // Swap x1 and x2 if x2 < x1
    if (area.x2 < area.x1) {
      [area.x1, area.x2] = [area.x2, area.x1];
    }
    // Swap y1 and y2 if y2 < y1
    if (area.y2 < area.y1) {
      [area.y1, area.y2] = [area.y2, area.y1];
    }

    const notes = this.sheet?.getSheet()!;
    notes.forEach(note => {
      const bounding: { x1: number, x2: number, y1: number, y2: number } = {
        x1: note.x() - note.radius(),
        x2: note.x() + note.radius(),
        y1: note.y() - note.radius(),
        y2: note.y() + note.radius()
      };

      if (bounding.x1 <= area.x2 && bounding.x2 >= area.x1 && bounding.y1 <= area.y2 && bounding.y2 >= area.y1) {
        this.sheet?.selectNoteInArea(note)
        this.setDotSelectedStyle(note);
      }
    })
    this.setFirstShapeSelectedPos();
  }

  updateDotPositions(dots: KalimbaDot[]) {
    dots.forEach(dot => {
      // neu dot nam ngoai timeline
      if (dot.x() < this.keys.widthPerKey) {
        dot.x(this.keys.widthPerKey + dot.radius())
      }
      if (dot.x() > this.center.timelineWidth) {
        dot.x(this.center.timelineWidth - dot.radius())
      }
      if (dot.y() < this.ruler.rulerHeight) {
        dot.y(this.ruler.rulerHeight + dot.radius())
      }
      if (dot.y() > this.center.timelineHeight) {
        dot.y(this.center.timelineHeight - dot.radius())
      }

      // thiet lap vi tri
      const y = dot.y()
      const { pitch, valueY } = this.getPitch(y)

      dot.y(valueY + this.keys.heightPerKey / 2);
      dot.setSound(this.sheet?.getKalimbaUsingMap().get(pitch)?.getSound()!)
    })
  }

  setFirstShapeSelectedPos() {
    this.firstSelectedShapePos = this.sheet?.getSheet()
      .filter(note => note.getIsSelect())
      .map(note => {
        const pos = new FirstPositon();
        pos.setFirstPos({ x: note.x(), y: note.y() });
        return pos;
      }) || [];
  }

  clearFirstShapeSelectedPos() {
    while (this.firstSelectedShapePos.length > 0) {
      this.firstSelectedShapePos.pop()
    }
  }

  selectMultiNote(dot: KalimbaDot) {
    this.sheet?.selectMultiNote(dot);
    this.setDotSelectedStyle(dot)
  }

  eraseNote(dot: KalimbaDot) {
    this.sheet?.eraseNote(dot)
  }

  paste() {
    this.sheet?.paste(this.canvasClockwise)
    this.sheet?.getCopiedAndCutStack().forEach(dot => {
      this.canvasCenter.add(dot);
    })
    this.canvasCenter.getLayer()?.draw()
  }

  align(state: string) {
    if (state === 'left') {
      const minX = this.minDot(this.sheet?.getSelectedNotes()!).x();
      this.sheet?.getSelectedNotes().forEach(dot => dot.x(minX))
    }
  }

  minDot(dots: KalimbaDot[]): KalimbaDot {
    if (dots.length === 0) throw new Error("No dots provided");
    return dots.reduce((min, dot) => (dot.x() < min.x() ? dot : min), dots[0]);
  }

  getFoundDot({ x, y }: { x: number, y: number }): KalimbaDot | undefined {
    let found = this.sheet?.getSheet().find(note => note.isInsideDot({ x, y }));
    if (!found) return undefined;

    this.sheet?.getSheet().forEach(note => {
      if (note.isInsideDot({ x, y }) && note.getZIndex() > found!.getZIndex()) {
        found = note;
      }
    })

    return found;
  }

  getPitch(y: number): { pitch: string, valueY: number } {
    y -= this.ruler.rulerHeight;
    const idx = (y / this.keys.heightPerKey) | 0;
    const note = this.sheet?.getKalimbaUsing()[idx].getNote()!;
    y = idx * this.keys.heightPerKey + this.ruler.rulerHeight;
    return { pitch: note, valueY: y };
  }

  getPosition(): {
    x: number, y: number
  } {
    return this.canvasCenter.getRelativePointerPosition()!;
  }

  private setDotSelectedStyle(dot: KalimbaDot) {
    dot.stroke(this.style.getSelect());
    dot.strokeWidth(3)
  }

  // clockwise move
  private setClockwisePosition() {
    /**
     * Buoc 1: kich hoat onMouseDown -> dich chuyen clockwise toi vi tri x da chi dinh (dua tren ruler), set clockwiseFocus = true;
     * Buoc 2: kiem tra clockwiseFocus -> true -> dich chuyen clockwise tren toan bo ruler va center
     * Buoc 3: kich hoat onMouseUp -> tat clockwiseFocus = false
     */
    this.canvasRuler.on('mousedown', () => {
      this.clockwiseFocus = true;
      this.kalimbaClockwiseAnimation.animationStop()
      this.kalimbaClockwiseAnimation.delete()
      const { x } = this.getPosition();
      this.canvasClockwise.x(x)
    })

    this.canvasHorizonGroup.on('mousemove', () => {
      if (this.clockwiseFocus) {
        const { x } = this.getPosition()
        this.canvasClockwise.x(x)
      }
    })
    this.canvasHorizonGroup.on('mouseup', () => {
      this.clockwiseFocus = false
    })
    this.canvasHorizonGroup.on('mouseleave', () => {
      this.clockwiseFocus = false
    })
  }

  setCanvasCenterPositionXWhenRun() {
    const currentX = this.canvasHorizonGroup.x()
    this.canvasHorizonGroup.x(currentX - this.containerWidth + this.keys.widthPerKey)
  }

  setCanvasCenterPositionWhenReset() {
    this.canvasHorizonGroup.x(0)
  }

  expandTimelineCenter() {
    // this.beat += 20;
    // this.center.timelineWidth = this.beatWidth * (this.beat + 20)
    // this.ruler.rulerWidth = this.center.timelineWidth;
    // this.canvasCenter = this.renderCenter()!
    // this.canvasRuler = this.renderRuler()!;
    // this.centerInteractEvent()
    // // this.sheet?.getSheet().forEach(dot => {
    // //   this.canvasCenter.add(dot);
    // // })
    // this.canvasHorizonGroup.add(this.canvasCenter)
    // this.canvasHorizonGroup.add(this.canvasRuler)
    // this.canvasClockwise.moveToTop()
  }

  resetAndStartClockwise() {
    if (this.kalimbaClockwiseAnimation.isStart()) {
      this.kalimbaClockwiseAnimation.animationStop()
      this.setClockwisePositionX(this.keys.widthPerKey)
    } else {
      this.setClockwisePositionX(this.keys.widthPerKey)
    }
  }

  setClockwisePositionX(x: number) {
    this.canvasClockwise.x(x)
  }

  // Getters
  getContainerSize() {
    return {
      width: this.containerWidth,
      height: this.containerHeight
    }
  }

  getIsMouseDown() {
    return this.isMouseDown;
  }

  isMousePress(): boolean {
    return this.isMouseDown;
  }

  getKeydown(): string | undefined {
    return this.keydown;
  }

  getDotSize(): number {
    return this.dotSize;
  }

  getCanvasKey(): Konva.Group {
    return this.canvasKey;
  }

  getCanvasRuler(): Konva.Group {
    return this.canvasRuler;
  }

  getCanvasCenter(): Konva.Group {
    return this.canvasCenter;
  }

  getCanvasHorizonGroup(): Konva.Group {
    return this.canvasHorizonGroup;
  }

  getKeys(): KalimbaKeys {
    return this.keys;
  }

  getRuler(): KalimbaRuler {
    return this.ruler;
  }

  getCenter(): KalimbaCenter {
    return this.center;
  }

  getBeat(): number {
    return this.beat;
  }

  getBeatWidth(): number {
    return this.beatWidth;
  }

  getBpm(): number {
    return this.bpm;
  }

  getIsPlay(): boolean {
    return this.isPlay;
  }

  getStyle(): KalimbaStyle {
    return this.style;
  }

  getSheet(): KalimbaSheet | null {
    return this.sheet;
  }

  getSize(): { width: number, height: number } {
    return { width: this.containerWidth, height: this.containerHeight }
  }

  getCanvasClockwise(): Konva.Group {
    return this.canvasClockwise;
  }

  setCanvasClockwise(clockwise: Konva.Group): void {
    this.canvasClockwise = clockwise;
  }

  // Setters
  setShadowEnable() {
    this.canvasCenter
  }

  setIsMouseDown(mouseDown: boolean) {
    this.isMouseDown = mouseDown;
  }

  setKeydown(keydown: string | undefined) {
    this.keydown = keydown;
  }

  setDotSize(dotSize: number) {
    this.dotSize = dotSize;
  }

  setSize(obj: { width: number, height: number }) {
    this.containerWidth = obj.width;
    this.containerHeight = obj.height;
    if (this.kalimbaClockwiseAnimation) {
      this.kalimbaClockwiseAnimation.setContainerWidth(obj.width)
    }
  }

  setKeys(keys: KalimbaKeys): void {
    this.keys = keys;
  }

  setRuler(ruler: KalimbaRuler): void {
    this.ruler = ruler;
  }

  setCenter(center: KalimbaCenter): void {
    this.center = center;
  }

  setBeat(beat: number): void {
    this.beat = beat;
  }

  setBeatWidth(beatWidth: number): void {
    this.beatWidth = beatWidth;
  }

  setBpm(bpm: number): void {
    this.bpm = bpm;
  }

  setIsPlay(isPlay: boolean): void {
    this.isPlay = isPlay;
    if (isPlay === true) {
      this.kalimbaClockwiseAnimation.animationStart()
    } else if (isPlay === false) {
      this.kalimbaClockwiseAnimation.animationStop()
    }
  }

  setStyle(style: KalimbaStyle): void {
    this.style = style;
  }
}

export { KalimbaTimeline }