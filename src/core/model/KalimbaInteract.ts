import type Konva from "konva";
import type { KalimbaTimeline } from "./KalimbaTimeline";


class KalimbaInteract {
  protected timeline: KalimbaTimeline;

  constructor(timeline: KalimbaTimeline) {
    this.timeline = timeline;
  }

  handleMouseEvent() {
    this.timeline.getCanvasCenter().on('mousedown', (event) => {
      this.timeline.setIsMouseDown(true);
      const { x, y } = this.timeline.getPosition();
      const existedDot = this.timeline.getFoundDot({ x, y })
      const mouseIdx = event.evt.button;
      switch (mouseIdx) {
        case 0:
            
          break;
      
        case 2:
          
          break;
      }
    })
  }

}

export { KalimbaInteract }