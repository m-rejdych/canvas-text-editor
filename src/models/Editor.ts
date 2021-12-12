import Settings from './Settings';
import Parser from './Parser';
import Caret from './Caret';

export default class Editor {
  private _ctx: CanvasRenderingContext2D;
  private _text: string[] = [];
  private _settings = new Settings(16, 1.5, false, false);
  private _parser = new Parser();
  private _caret = new Caret(
    0,
    this._settings.calculatedLineHeight - this._settings.size / 1.25,
    1,
    this._settings.size,
  );

  constructor(private _canvas: HTMLCanvasElement) {
    this._ctx = _canvas.getContext('2d')!;

    window.addEventListener('keypress', this._handleKeyPress.bind(this));
    window.addEventListener('keydown', this._handleKeyDown.bind(this));

    window.addEventListener('unload', () => {
      window.removeEventListener('keypress', this._handleKeyPress);
      window.removeEventListener('keydown', this._handleKeyDown);
    });
  }

  draw(x?: number, y?: number): void {
    if (x) this.x = x;
    if (y) this.y = y;

    this.clear();
    this._drawBackground();
    this._drawOutline();
    this._drawText();
    this._caret.draw(this._ctx);
  }

  clear(): void {
    this._ctx.clearRect(0, 0, this.x, this.y);
  }

  private _handleKeyPress(e: KeyboardEvent): void {
    this._text.push(e.key);
    this.draw();
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (e.key !== 'Backspace' || !this._text.length) return;

    this._text.pop();
    this.draw();
  }

  private _drawBackground(): void {
    this._ctx.fillStyle = '#fff';
    this._ctx.fillRect(0, 0, this.x, this.y);
  }

  private _drawOutline(): void {
    this._ctx.strokeStyle = '#555';
    this._ctx.strokeRect(0, 0, this.x, this.y);
  }

  private _drawText(): void {
    this._ctx.fillStyle = '#000';

    const parsedText = this._parser.parseText({
      ctx: this._ctx,
      settings: this._settings,
      text: this._text,
      maxWidth: this.x,
    });
    parsedText.forEach(({ offsetTop, offsetLeft, value, font }) => {
      this._ctx.font = font;
      this._ctx.fillText(value, offsetLeft, offsetTop);
    });

    if (parsedText.length) {
      const { value, offsetLeft, offsetTop } =
        parsedText[parsedText.length - 1];
      const { width } = this._ctx.measureText(value);
      this._caret.setPosition(
        offsetLeft + width,
        offsetTop - this._settings.size / 1.25,
      );
    }
  }

  get x(): number {
    return this._canvas.width;
  }

  get y(): number {
    return this._canvas.height;
  }

  private set x(value: number) {
    this._canvas.width = value;
  }

  private set y(value: number) {
    this._canvas.height = value;
  }
}
