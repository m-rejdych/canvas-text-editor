export default class Settings {
  constructor(
    public size: number,
    public lineHeight: number,
    public bold: boolean,
    public italic: boolean,
  ) {}

  get calculatedLineHeight(): number {
    return this.size * this.lineHeight;
  }
}
