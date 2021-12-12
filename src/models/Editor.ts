import Settings from './Settings';
import Parser from './Parser';
import Caret from './Caret';
import type ParsedText from '../interfaces/ParsedText';
import { FUNCTIONAL_BUTTONS, ARROW_KEYS } from '../constants/buttons';

interface DrawPayload {
  x?: number;
  y?: number;
  moveCaretLeft?: boolean;
}

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

  draw(options?: DrawPayload): void {
    if (options?.x) this.x = options?.x;
    if (options?.y) this.y = options?.y;

    this.clear();
    this._drawBackground();
    this._drawOutline();
    this._drawText();
    this._caret.draw({
      parsedText: this._parsedText,
      ctx: this._ctx,
      settings: this._settings,
      moveLeft: options?.moveCaretLeft,
    });
  }

  clear(): void {
    this._ctx.clearRect(0, 0, this.x, this.y);
  }

  private _handleKeyPress(e: KeyboardEvent): void {
    this._text.push(e.key);
    this.draw();
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (
      !Object.values(FUNCTIONAL_BUTTONS).includes(e.key) ||
      !this._text.length
    )
      return;

    switch (e.key) {
      case FUNCTIONAL_BUTTONS.BACKSPACE:
        this._text.pop();
        break;
      case FUNCTIONAL_BUTTONS.ARROW_RIGHT:
        if (this._caret.index < this._parsedText.length - 1) {
          this._caret.index++;
        }
        break;
      case FUNCTIONAL_BUTTONS.ARROW_LEFT:
        if (this._caret.index >= 0) {
          this._caret.index--;
        }
        break;
      default:
        break;
    }

    this.draw({ moveCaretLeft: !Object.values(ARROW_KEYS).includes(e.key) });
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

    this._parsedText.forEach(({ offsetTop, offsetLeft, value, font }) => {
      this._ctx.font = font;
      this._ctx.fillText(value, offsetLeft, offsetTop);
    });
  }

  get x(): number {
    return this._canvas.width;
  }

  get y(): number {
    return this._canvas.height;
  }

  private get _parsedText(): ParsedText[] {
    return this._parser.parseText({
      ctx: this._ctx,
      settings: this._settings,
      text: this._text,
      maxWidth: this.x,
    });
  }

  private set x(value: number) {
    this._canvas.width = value;
  }

  private set y(value: number) {
    this._canvas.height = value;
  }
}
