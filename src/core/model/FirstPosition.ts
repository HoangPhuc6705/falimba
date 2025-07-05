interface Position {
  x: number,
  y: number,
}

class FirstPositon {
  firstPos!: Position;

  setFirstPos({ x, y }: Position) {
    this.firstPos = { x, y }
  }

  getFirstPos() {
    return this.firstPos;
  }
}

export default FirstPositon;