class KalimbaStyle {
  private main: string;
  private select: string;
  private clockwise: string;
  private line: string;
  private stroke: string;
  // @ts-ignore
  private active: string;

  public constructor(color: {main: string, select: string, clockwise: string, line: string, stroke: string, active: string}) {
    this.main = color.main;
    this.select = color.select;
    this.clockwise = color.clockwise;
    this.line = color.line;
    this.stroke = color.stroke;
    this.active = color.active;
  }

  public getMain(): string {
    return this.main;
  }

  public setMain(main: string): void {
    this.main = main;
  }


  public getSelect(): string {
    return this.select;
  }

  public getClockwise(): string {
    return this.clockwise;
  }

  public getLine(): string {
    return this.line;
  }

  public getStroke(): string {
    return this.stroke;
  }


  public setSelect(select: string): void {
    this.select = select;
  }

  public setClockwise(clockwise: string): void {
    this.clockwise = clockwise;
  }

  public setLine(line: string): void {
    this.line = line;
  }

  public setStroke(stroke: string): void {
    this.stroke = stroke;
  }
}

export { KalimbaStyle }