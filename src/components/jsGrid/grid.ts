import './grid.css';
import { createContainer } from "./hover";

export type GridOptions = {
  cellSize: number;
}

export const createGrid = (grid: HTMLElement, opts: GridOptions) => {
  const { cellSize } = opts;

  const gap = cellSize / 20;
  const rows = Math.floor(window.visualViewport!.height / (cellSize + gap));
  const cols = Math.floor(window.visualViewport!.width / (cellSize + gap));
  const container = createContainer(opts);

  const cells: Array<HTMLDivElement> = [];

  for (let index = 0; index < rows * cols; index++) {
    const cell = createCell({
      gap,
      cellSize,
      cols,
      index,
      onMouseOver: (_, cell) => cell.appendChild(container),
      onMouseLeave: (_, cell) => cell.removeChild(container),
    })

    grid.appendChild(cell);
    cells.push(cell);
  }

  return () => cells.forEach((cell) => grid.removeChild(cell));
}

type Func<Args = {}> = (opts: Args) => HTMLDivElement;
type CreateCell = Func<{
  gap: number;
  cellSize: number;
  cols: number;
  index: number;
  onMouseOver: (ev: HTMLElementEventMap["mouseover"], element: HTMLDivElement) => void;
  onMouseLeave: (ev: HTMLElementEventMap["mouseleave"], element: HTMLDivElement) => void;
}>

const createCell: CreateCell = ({ gap, cellSize, cols, index, onMouseOver, onMouseLeave }) => {
  const borderRadius = cellSize / 12;
  const cell = document.createElement('div')
  cell.className = "GridCell";

  Object.assign(cell.style, {
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    left: `${(index % cols) * (cellSize + gap) + 15}px`,
    top: `${Math.floor(index / cols) * (cellSize + gap) + 5}px`,
    position: 'absolute',
    borderRadius: `${borderRadius}px`
  });

  cell.addEventListener('mouseover', (ev) => onMouseOver(ev, cell));
  cell.addEventListener('mouseleave', (ev) => onMouseLeave(ev, cell));

  return cell;
}


