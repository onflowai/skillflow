import { useEffect, useRef } from 'react';

import styles from './HeroConway.module.css';

const COLUMN_COUNT = 64;
const ROW_COUNT = 32;
const CELL_COUNT = COLUMN_COUNT * ROW_COUNT;

const DEAD = 0;
const ALIVE = 1;
const DYING = 2;

const FRAME_INTERVAL = 170;
const MINIMUM_ALIVE_CELLS = 18;
const MAX_SIGNATURES = 12;

const GLIDER_PATTERN = [
  [1, 0],
  [2, 1],
  [0, 2],
  [1, 2],
  [2, 2],
];

function getCellIndex(row: number, column: number) {
  const wrappedRow = (row + ROW_COUNT) % ROW_COUNT;
  const wrappedColumn = (column + COLUMN_COUNT) % COLUMN_COUNT;

  return wrappedRow * COLUMN_COUNT + wrappedColumn;
}

function injectGliders(grid: Uint8Array, amount: number) {
  for (let index = 0; index < amount; index += 1) {
    const startRow = Math.floor(Math.random() * ROW_COUNT);
    const startColumn = Math.floor(Math.random() * COLUMN_COUNT);

    GLIDER_PATTERN.forEach(([columnOffset, rowOffset]) => {
      const cellIndex = getCellIndex(
        startRow + rowOffset,
        startColumn + columnOffset,
      );

      grid[cellIndex] = ALIVE;
    });
  }
}

function createInitialGrid() {
  const grid = new Uint8Array(CELL_COUNT);

  for (let index = 0; index < CELL_COUNT; index += 1) {
    if (Math.random() < 0.18) {
      grid[index] = ALIVE;
    }
  }

  injectGliders(grid, 5);

  return grid;
}

function countAliveNeighbors(
  grid: Uint8Array,
  row: number,
  column: number,
) {
  let aliveNeighbors = 0;

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (
      let columnOffset = -1;
      columnOffset <= 1;
      columnOffset += 1
    ) {
      if (rowOffset === 0 && columnOffset === 0) continue;

      const cellIndex = getCellIndex(
        row + rowOffset,
        column + columnOffset,
      );

      if (grid[cellIndex] === ALIVE) {
        aliveNeighbors += 1;
      }
    }
  }

  return aliveNeighbors;
}

function createNextGrid(grid: Uint8Array) {
  const nextGrid = new Uint8Array(CELL_COUNT);

  for (let row = 0; row < ROW_COUNT; row += 1) {
    for (let column = 0; column < COLUMN_COUNT; column += 1) {
      const cellIndex = getCellIndex(row, column);
      const aliveNeighbors = countAliveNeighbors(
        grid,
        row,
        column,
      );

      if (grid[cellIndex] === ALIVE) {
        nextGrid[cellIndex] =
          aliveNeighbors === 2 || aliveNeighbors === 3
            ? ALIVE
            : DYING;

        continue;
      }

      nextGrid[cellIndex] =
        aliveNeighbors === 3 ? ALIVE : DEAD;
    }
  }

  return nextGrid;
}

function countAliveCells(grid: Uint8Array) {
  let aliveCells = 0;

  for (let index = 0; index < grid.length; index += 1) {
    if (grid[index] === ALIVE) {
      aliveCells += 1;
    }
  }

  return aliveCells;
}

function createGridSignature(grid: Uint8Array) {
  let signature = 2166136261;

  for (let index = 0; index < grid.length; index += 1) {
    if (grid[index] !== ALIVE) continue;

    signature ^= index + 1;
    signature = Math.imul(signature, 16777619);
  }

  return signature >>> 0;
}

function drawGrid(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  grid: Uint8Array,
) {
  const bounds = canvas.getBoundingClientRect();

  if (!bounds.width || !bounds.height) return;

  const pixelRatio = Math.min(
    window.devicePixelRatio || 1,
    2,
  );

  const canvasWidth = Math.floor(bounds.width * pixelRatio);
  const canvasHeight = Math.floor(bounds.height * pixelRatio);

  if (
    canvas.width !== canvasWidth ||
    canvas.height !== canvasHeight
  ) {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  }

  context.setTransform(
    pixelRatio,
    0,
    0,
    pixelRatio,
    0,
    0,
  );

  context.clearRect(0, 0, bounds.width, bounds.height);
  context.imageSmoothingEnabled = false;

  const cellSize = Math.max(
    3,
    Math.floor(
      Math.min(
        bounds.width / COLUMN_COUNT,
        bounds.height / ROW_COUNT,
      ),
    ),
  );

  const gridWidth = cellSize * COLUMN_COUNT;
  const gridHeight = cellSize * ROW_COUNT;
  const startX = Math.floor((bounds.width - gridWidth) / 2);
  const startY = Math.floor((bounds.height - gridHeight) / 2);
  const gap = Math.max(1, Math.floor(cellSize * 0.14));
  const pixelSize = Math.max(1, cellSize - gap);

  const cellColor = getComputedStyle(canvas)
    .getPropertyValue('--cells-color')
    .trim();

  context.fillStyle = cellColor || '#ffffff';

  for (let row = 0; row < ROW_COUNT; row += 1) {
    for (let column = 0; column < COLUMN_COUNT; column += 1) {
      const cellState = grid[getCellIndex(row, column)];

      if (cellState === DEAD) continue;

      context.globalAlpha = cellState === DYING ? 0.5 : 1;

      context.fillRect(
        startX + column * cellSize,
        startY + row * cellSize,
        pixelSize,
        pixelSize,
      );
    }
  }

  context.globalAlpha = 1;
}

function HeroConway() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) return;

    let grid = createInitialGrid();
    let animationFrameId = 0;
    let previousFrameTime = 0;
    let recentSignatures: number[] = [];
    let isPageVisible = !document.hidden;

    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    const renderGrid = () => {
      drawGrid(canvas, context, grid);
    };

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
    };

    const resizeObserver = new ResizeObserver(renderGrid);

    const themeObserver = new MutationObserver(renderGrid);

    resizeObserver.observe(canvas);

    themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    );

    renderGrid();

    const animate = (currentTime: number) => {
      if (
        isPageVisible &&
        currentTime - previousFrameTime >= FRAME_INTERVAL
      ) {
        grid = createNextGrid(grid);

        const aliveCells = countAliveCells(grid);
        const signature = createGridSignature(grid);
        const isRepeating = recentSignatures.includes(signature);

        if (
          aliveCells < MINIMUM_ALIVE_CELLS ||
          isRepeating
        ) {
          injectGliders(
            grid,
            aliveCells < MINIMUM_ALIVE_CELLS ? 4 : 2,
          );

          recentSignatures = [];
        } else {
          recentSignatures.push(signature);

          if (recentSignatures.length > MAX_SIGNATURES) {
            recentSignatures.shift();
          }
        }

        renderGrid();
        previousFrameTime = currentTime;
      }

      animationFrameId = window.requestAnimationFrame(animate);
    };

    if (!reducedMotionQuery.matches) {
      animationFrameId = window.requestAnimationFrame(animate);
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      themeObserver.disconnect();

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );
    };
  }, []);

  return (
    <div
      className={styles.container}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
      />
    </div>
  );
}

export default HeroConway;