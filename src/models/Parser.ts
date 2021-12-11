import Settings from './Settings';
import ParsedText from '../interfaces/ParsedText';

interface ParseTextPayload {
  text: string[];
  ctx: CanvasRenderingContext2D;
  settings: Settings;
  maxWidth: number;
}

export default class Parser {
  parseFontString(settings: Settings): string {
    return `${settings.size}px${settings.bold ? ' bold' : ''}${
      settings.italic ? ' italic' : ''
    } Helvetica`;
  }

  parseText({ text, ctx, settings, maxWidth }: ParseTextPayload): ParsedText[] {
    let currentOffsetTop = settings.calculatedLineHeight;
    let currentOffsetLeft = 0;

    return text.reduce((acc, value) => {
      const { width } = ctx.measureText(value);

      if (width + currentOffsetLeft > maxWidth) {
        currentOffsetTop += settings.calculatedLineHeight;
        currentOffsetLeft = 0;
      }

      const updatedAcc: ParsedText[] = [
        ...acc,
        {
          font: this.parseFontString(settings),
          offsetTop: currentOffsetTop,
          offsetLeft: currentOffsetLeft,
          value,
        },
      ];

      currentOffsetLeft += width;

      return updatedAcc;
    }, [] as ParsedText[]);
  }
}
