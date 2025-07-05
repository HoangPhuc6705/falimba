

function handleScroll() {
  // const stage = kalimbaTimelineGroup.getStage()!;
  // const stageWidth = stage.width();
  // const stageHeight = stage.height();
  // const width = kalimbaCenter.timelineWidth;

  // const height = kalimbaKey.height!;
  // stage.on('wheel', (event: KonvaEventObject<WheelEvent, Konva.Stage>) => {
  //   const delta = event.evt.deltaY;

  //   if (!keydown) {
  //     const currentY = kalimbaTimelineGroup.y()
  //     let valueY = currentY - delta;
  //     if (valueY >= 0) {
  //       valueY = 0;
  //     }
  //     if (valueY - stageHeight <= -height) {
  //       valueY = -(height - stageHeight) - kalimbaRuler.rulerHeight
  //     }
  //     kalimbaKeyGroups.y(valueY)
  //     kalimbaTimelineGroup.y(valueY)

  //   } else if (keydown === 'Shift') {
  //     const currentX = group1.x()
  //     let valueX = currentX - delta;
  //     if (valueX >= 0) {
  //       valueX = 0;
  //     }
  //     if (valueX - stageWidth <= -width) {
  //       valueX = -(width - stageWidth) - kalimbaKey.widthPerKey;
  //     }
  //     group1.x(valueX)
  //   }
  // })
}

export default handleScroll;