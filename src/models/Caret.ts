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
    private _offsetLeft: number,
    private _offsetTop: number,
    private _width: number,
    private _height: number,
  ) {}

  private _setPosition(offsetX: number, offsetY: number): void {
    this._offsetLeft = offsetX;
    this._offsetTop = offsetY;
  }

  draw({ parsedText, ctx, settings, moveLeft = true }: DrawPayload) {
    if (parsedText.length) {
      if (moveLeft) this.index = parsedText.length - 1;

      if (this.index === -1) {
        this._setPosition(0, 0);
        return;
      }

      const caretPosition = parsedText[this.index];
      const { value, offsetLeft, offsetTop } = caretPosition;
      const { width } = ctx.measureText(value);

      this._setPosition(offsetLeft + width, offsetTop - settings.size / 1.25);
    } else {
      this._setPosition(
        0,
        settings.calculatedLineHeight - settings.size / 1.25,
      );
      this.index = -1;
    }

    ctx.fillStyle = '#000';
    ctx.fillRect(this._offsetLeft, this._offsetTop, this._width, this._height);
  }
}
