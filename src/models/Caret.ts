export default class Caret {
  private _interval?: NodeJS.Timer;

  constructor(
    private _offsetLeft: number,
    private _offsetTop: number,
    private _width: number,
    private _height: number,
  ) {
    window.addEventListener('unload', () => {
      if (this._interval) {
        clearInterval(this._interval);
      }
    })
  }

  setPosition(offsetX: number, offsetY: number): void {
    this._offsetLeft = offsetX;
    this._offsetTop = offsetY;
  }

  move(offsetX: number, offsetY: number): void {
    this._offsetLeft += offsetX;
    this._offsetTop += offsetY;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#000';
    ctx.fillRect(this._offsetLeft, this._offsetTop, this._width, this._height);

    if (this._interval) {
      clearInterval(this._interval);
    }

    const interval = setInterval(this.blink.bind(this, ctx), 1000);
    this._interval = interval;
  }

  blink(ctx: CanvasRenderingContext2D): void {
    this.clear(ctx);
    ctx.fillStyle = '#fff';
    ctx.fillRect(this._offsetLeft, this._offsetTop, this._width, this._height);

    setTimeout(() => {
      ctx.fillStyle = '#000';
      ctx.fillRect(this._offsetLeft, this._offsetTop, this._width, this._height);
    }, 500);
  }

  clear(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(this._offsetLeft, this._offsetTop, this._width, this._height);
  }
}
