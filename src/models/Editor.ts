import Settings from './Settings';

interface ParsedText {
  offsetLeft: number;
  offsetTop: number;
  font: string;
  value: string;
}

export default class Editor {
  private _ctx: CanvasRenderingContext2D;
  private _settings = new Settings(16, 1.5, false, false);
  private _text: string[] = [];

  constructor(private _canvas: HTMLCanvasElement) {
    this._ctx = _canvas.getContext('2d')!;

    window.addEventListener('keypress', this._handleKeyPress);
    window.addEventListener('keydown', this._handleKeyDown);

    window.addEventListener('unload', () => {
      window.removeEventListener('keypress', this._handleKeyPress);
      window.removeEventListener('keydown', this._handleKeyDown);
    });
  }

  private _handleKeyPress(e: KeyboardEvent): void {
    if (!this._text.length) this._text.push('');

    this._text[this._text.length - 1] += e.key;

    if (e.key === ' ') this._text.push('');

    this.draw();
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (e.key !== 'Backspace' || !this._text.length) return;

    const currentText = this._text[this._text.length - 1];

    if (currentText.length <= 1) {
      this._text.pop();
    } else {
      this._text[this._text.length - 1] = currentText.slice(
        0,
        currentText.length - 1,
      );
    }

    this.draw();
  }

  draw(x?: number, y?: number): void {
    if (x) this.x = x;
    if (y) this.y = y;

    this.clear();
    this.drawBackground();
    this.drawText();
  }

  private drawBackground(): void {
    this._ctx.fillStyle = '#fff';
    this._ctx.fillRect(0, 0, this.x, this.y);
  }

  private drawText(): void {
    this._ctx.fillStyle = '#000';

    this._parsedText.forEach(({ offsetTop, offsetLeft, value, font }) => {
      this._ctx.font = font;
      this._ctx.fillText(value, offsetLeft, offsetTop);
    });
  }

  clear(): void {
    this._ctx.clearRect(0, 0, this.x, this.y);
  }

  get x(): number {
    return this._canvas.width;
  }

  get y(): number {
    return this._canvas.height;
  }

  private get _parsedText(): ParsedText[] {
    let currentOffsetTop = this._calculatedLineHeight;
    let currentOffsetLeft = 0;

    return this._text.reduce((acc, value) => {
      const { width } = this._ctx.measureText(value);

      if (width + currentOffsetLeft > this.x) {
        currentOffsetTop += this._calculatedLineHeight;
        currentOffsetLeft = 0;
      }

      const updatedAcc: ParsedText[] = [
        ...acc,
        {
          font: this._formattedFont,
          offsetTop: currentOffsetTop,
          offsetLeft: currentOffsetLeft,
          value,
        },
      ];

      currentOffsetLeft += width;

      return updatedAcc;
    }, [] as ParsedText[]);
  }

  private get _formattedFont(): string {
    return `${this._settings.size}px${this._settings.bold ? ' bold' : ''}${
      this._settings.italic ? ' italic' : ''
    } Helvetica`;
  }

  private get _calculatedLineHeight(): number {
    return this._settings.size * this._settings.lineHeight;
  }

  private set x(value: number) {
    this._canvas.width = value;
  }

  private set y(value: number) {
    this._canvas.height = value;
  }
}
