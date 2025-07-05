import Konva from 'konva'
import { KalimbaTimeline } from './KalimbaTimeline'
import type { KonvaEventObject } from 'konva/lib/Node';

class Falimba {
  private timeline!: KalimbaTimeline;

  setTimeline(timeline: KalimbaTimeline) {
    this.timeline = timeline;
  }

  use(app: HTMLElement | null) {
    if (!app || !this.timeline) return;
    let clientWidth = app.getBoundingClientRect().width;
    let clientHeight = app.getBoundingClientRect().height;
    const stage = new Konva.Stage({
      container: app.getAttribute('id')!,
      width: clientWidth,
      height: clientHeight
    })
    const layer = new Konva.Layer();

    layer.add(this.timeline.getCanvasHorizonGroup())
    layer.add(this.timeline.getCanvasKey())
    layer.add(new Konva.Rect({
      x: 0,
      y: 0,
      width: this.timeline.getKeys().widthPerKey,
      height: this.timeline.getRuler().rulerHeight,
      fill: this.timeline.getStyle().getMain()
    }))

    stage.add(layer);
    layer.draw()

    window.addEventListener('resize', () => {
      clientWidth = app.getBoundingClientRect().width;
      clientHeight = app.getBoundingClientRect().height;
      stage.width(clientWidth)
      stage.height(clientHeight)
      this.timeline.setSize({
        width: clientWidth,
        height: clientHeight
      })
    })

    window.addEventListener('keydown', (event: KeyboardEvent) => {
      this.timeline.setKeydown(event.key)
    })

    window.addEventListener('keyup', () => {
      this.timeline.setKeydown(undefined);
    })

    stage.on('contextmenu', (e) => {
      e.evt.preventDefault()
    })

    stage.on('wheel', (event) => {
      this.scrollActive(event, stage);
    })
  }

  private scrollActive(event: KonvaEventObject<WheelEvent, Konva.Stage>, stage: Konva.Stage): void {
    this.timeline.setScrollActive(event, stage)
  }

  getTimeline(): KalimbaTimeline {
    return this.timeline;
  }
}

export { Falimba }