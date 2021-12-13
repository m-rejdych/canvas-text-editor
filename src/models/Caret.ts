import type ParsedText from '../interfaces/ParsedText';
import type Settings from './Settings';

interface DrawPayload {
  parsedText: ParsedText[];
  ctx: CanvasRenderingContext2D;
  settings: Settings;
  moveLeft?: boolean;
}

export default class Caret {
  index = 0;

  constructor(
    public offsetLeft: number,
    public offsetTop: number,
    public width: number,
    public height: number,
  ) {}

  setPosition(offsetX: number, offsetY: number): void {
    this.offsetLeft = offsetX;
    this.offsetTop = offsetY;
  }

  draw({ parsedText, ctx, settings, moveLeft = true }: DrawPayload) {
    if (parsedText.length) {
      if (moveLeft) this.index = parsedText.length - 1;

      if (this.index === -1) {
        this.setPosition(0, 0);
        return;
      }

      const caretPosition = parsedText[this.index];
      const { value, offsetLeft, offsetTop } = caretPosition;
      const { width } = ctx.measureText(value);

      this.setPosition(offsetLeft + width, offsetTop - settings.size / 1.25);
    } else {
      this.setPosition(
        0,
        settings.calculatedLineHeight - settings.size / 1.25,
      );
      this.index = -1;
    }

    ctx.fillStyle = '#000';
    ctx.fillRect(this.offsetLeft, this.offsetTop, this.width, this.height);
  }
}
