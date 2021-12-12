import './styles';
import Editor from './models/Editor';

const main = (): void => {
  const canvas: HTMLCanvasElement = document.getElementById(
    'canvas',
  ) as HTMLCanvasElement;

  const editor = new Editor(canvas);
  editor.draw({ x: window.innerWidth * 0.5, y: window.innerHeight - 128 });

  window.addEventListener('resize', () => {
    editor.draw({ x: window.innerWidth * 0.5, y: window.innerHeight - 128 });
  });
};

window.addEventListener('load', main);
