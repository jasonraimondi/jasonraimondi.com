+++
title = "Conways game of life in TypeScript."
slug = "conways-game-of-life-typescript"
date = 2019-03-26
draft = true
description = "Conways Game of Life TypeScript."
tags = [
    "typescript",
]
categories = [
    "frontend",
]
+++ 

#### The Rules

The game is a 0 player game. We start with a random board, and there is a button to progress the board.

**For a space that is 'populated':**

* Each cell with one or no neighbors dies, as if by solitude. 
* Each cell with four or more neighbors dies, as if by overpopulation. 
* Each cell with two or three neighbors survives. 

**For a space that is 'empty' or 'unpopulated'**

* Each cell with three neighbors becomes populated. 

### React 20 x 10 Grid of Conways Game

<div id="conways-game-of-life">Loading the game...</div>

<script type="text/javascript" src="/assets/js/main.package.1.js"></script>

### The React Code

```typescript
import * as React from 'react';
import { render } from 'react-dom';

const NUMBER_OF_CELLS = 200;
const ROW_LENGTH = 20;

interface Coordinate {
  x: number;
  y: number;
}

interface GameBoardState {
  cells: number[];
}

class GameBoard extends React.Component<{}, GameBoardState> {
  private readonly cellGrid: CellGrid;

  constructor(props) {
    super(props);
    this.cellGrid = new CellGrid(
      this.randomCellArray,
      ROW_LENGTH,
    );
    this.state = {
      cells: this.cellGrid.cells,
    };
    this.onClick = this.onClick.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  get randomCellArray(): number[] {
    return Array.from(Array(NUMBER_OF_CELLS)).map(() => Math.floor(Math.random() * Math.floor(2)));
  }

  onReset() {
    this.cellGrid.cells = this.randomCellArray;
    this.setState({cells: this.cellGrid.cells});
  }

  onClick() {
    this.cellGrid.progress();
    this.setState({cells: this.cellGrid.cells});
  }

  render() {
    const mainStyle: any = {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(${ROW_LENGTH}, ${100 / ROW_LENGTH}%)', // switch these to ``, the markdown transformers was having issues here
    };
    const red = '#E3342F';
    const green = '#38C172';
    const tbody = this.state.cells.map((cell, idx) => {
      const cellStyle: any = {
        backgroundColor: cell === 0 ? red : green,
        height: 50,
      };
      return <div style={cellStyle} key={idx}/>;
    });

    return <>
      <div style={mainStyle}>
        {tbody}
      </div>
      <button onClick={this.onReset}>Reset</button>
      <button onClick={this.onClick}>Progress</button>
    </>;
  }
}

class CellGrid {
  constructor(public cells: number[], private readonly width: number) {
  }

  progress(): void {
    this.cells = this.cells.map((cell, idx) => {
      const coordinates = this.getCoordinate(idx);
      const aliveNeighbors = this.countNumberOfAliveNeighbors(coordinates);
      if (cell === 1) { // for a cell that is alive
        if (aliveNeighbors <= 1) {
          return 0; // Each cell with one or no neighbors dies, as if by solitude.
        } else if (aliveNeighbors > 4) {
          return 0; // Each cell with four or more neighbors dies, as if by overpopulation.
        } else if (aliveNeighbors === 2 || aliveNeighbors === 3) {
          return cell; // Each cell with two or three neighbors survives.
        }
      }

      if (aliveNeighbors === 3) {
        return 1;
      }

      return cell;
    });
  }

  countNumberOfAliveNeighbors(c: Coordinate): number {
    return this.getCoordinatesOfNeighbors(c).filter(coordinate => this.isAlive(coordinate)).length;
  }

  getCoordinatesOfNeighbors(c: Coordinate): Coordinate[] {
    const right = { x: c.x + 1, y: c.y };
    const bottom = { x: c.x, y: c.y + 1 };
    const bottomRight = { x: c.x + 1, y: c.y + 1 };
    const left = { x: c.x - 1, y: c.y };
    const top = { x: c.x, y: c.y - 1 };
    const topLeft = { x: c.x - 1, y: c.y - 1 };
    const topRight = { x: c.x + 1, y: c.y - 1 };
    const bottomLeft = { x: c.x - 1, y: c.y + 1 };
    return [
      topLeft,
      top,
      topRight,
      left,
      right,
      bottomLeft,
      bottom,
      bottomRight,
    ].filter(coordinate =>
      !(coordinate.x < 0 || coordinate.y < 0 || coordinate.x >= this.width || coordinate.y >= this.width),
    );
  }

  isAlive(c: Coordinate): boolean {
    const cellIsAlive = this.cells[this.getIndex(c)];
    return !!cellIsAlive;
  }

  getIndex(c: Coordinate): number {
    return c.x + this.width * c.y;
  }

  getCoordinate(i: number): Coordinate {
    return {
      x: i % this.width,
      y: Math.floor(i / this.width),
    };
  }
}

render(<GameBoard/>, document.getElementById('conways-game-of-life'));

```

### The Test Cases

We set ourselves up with test grid before each test case.

```typescript
import { assert } from 'chai';
import { CellGrid } from './cell-grid';

describe('Test Conways Rules', () => {
  let cells: number[];
  let columnLength = 5;
  let grid: CellGrid;

  beforeEach(() => {
    // 0 0 0 1 0
    // 0 0 1 1 1
    // 1 0 1 1 0
    // 0 1 0 1 1
    // 1 0 1 0 0
    cells = [0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0];
    columnLength = 5;
    grid = new CellGrid(cells, columnLength);
  });

  it('Count alive neighbors', () => {
    const sut = grid.getCoordinatesOfNeighbors({x: 1, y: 1});
    const expected = [
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 2, y: 0},
      {x: 0, y: 1},
      {x: 2, y: 1},
      {x: 0, y: 2},
      {x: 1, y: 2},
      {x: 2, y: 2},
    ];
    assert.deepStrictEqual(sut[0], expected[0]);
    assert.deepStrictEqual(sut[1], expected[1]);
    assert.deepStrictEqual(sut[2], expected[2]);
    assert.deepStrictEqual(sut[3], expected[3]);
    assert.deepStrictEqual(sut[4], expected[4]);
    assert.deepStrictEqual(sut[5], expected[5]);
    assert.deepStrictEqual(sut[6], expected[6]);
    assert.deepStrictEqual(sut[7], expected[7]);
  });

  it('Count alive neighbors of cell on the top left', () => {
    const sut = grid.getCoordinatesOfNeighbors({x: 0, y: 0});
    const expected = [
      {x: 1, y: 0},
      {x: 0, y: 1},
      {x: 1, y: 1},
    ];
    assert.lengthOf(sut, 3);
    assert.deepStrictEqual(sut[0], expected[0]);
    assert.deepStrictEqual(sut[1], expected[1]);
    assert.deepStrictEqual(sut[2], expected[2]);
  });

  it('Count alive neighbors of cell on the bottom right', () => {
    const sut = grid.getCoordinatesOfNeighbors({x: 4, y: 4});
    const expected = [
      {x: 3, y: 3},
      {x: 4, y: 3},
      {x: 3, y: 4},
    ];
    assert.lengthOf(sut, 3);
    assert.deepStrictEqual(sut[0], expected[0]);
    assert.deepStrictEqual(sut[1], expected[1]);
    assert.deepStrictEqual(sut[2], expected[2]);
  });

  it('I can tell if a cell is alive or dead', () => {
    assert.isTrue(grid.isAlive({x: 3, y: 0}));
    assert.isTrue(grid.isAlive({x: 3, y: 1}));
    assert.isTrue(grid.isAlive({x: 3, y: 3}));
    assert.isTrue(grid.isAlive({x: 4, y: 3}));
    assert.isFalse(grid.isAlive({x: 0, y: 0}));
    assert.isFalse(grid.isAlive({x: 4, y: 4}));
  });

  it('Count number of alive neighbors in current grid', () => {
    assert.strictEqual(grid.countNumberOfAliveNeighbors({x: 0, y: 3}), 3);
    assert.strictEqual(grid.countNumberOfAliveNeighbors({x: 0, y: 3}), 3);
    assert.strictEqual(grid.countNumberOfAliveNeighbors({x: 4, y: 4}), 2);
  });

  it('Each cell with one or no neighbors dies, as if by solitude.', () => {
    const sut = { x: 0, y: 2 };
    const sutBefore = grid.isAlive(sut);
    grid.progress();
    const sutAfter = grid.isAlive(sut);
    assert.isTrue(sutBefore);
    assert.isFalse(sutAfter);
  });

  it('Each cell with four or more neighbors dies, as if by overpopulation. ', () => {
    const sut1 = { x: 0, y: 2};
    const sut2 = { x: 2, y: 1};
    const sutBefore1 = grid.isAlive(sut1);
    const sutBefore2 = grid.isAlive(sut2);
    grid.progress();
    const sutAfter1 = grid.isAlive(sut1);
    const sutAfter2 = grid.isAlive(sut2);

    assert.isTrue(sutBefore1);
    assert.isTrue(sutBefore2);
    assert.isFalse(sutAfter1);
    assert.isTrue(sutAfter2);
  });

  it('Each cell with two or three neighbors survives. ', () => {
    const sut1 = { x: 0, y: 2};
    const sut2 = { x: 2, y: 1};
    const sutBefore1 = grid.isAlive(sut1);
    const sutBefore2 = grid.isAlive(sut2);
    grid.progress();
    const sutAfter1 = grid.isAlive(sut1);
    const sutAfter2 = grid.isAlive(sut2);

    assert.isTrue(sutBefore1);
    assert.isTrue(sutBefore2);
    assert.isFalse(sutAfter1);
    assert.isTrue(sutAfter2);
  });

  it('Each cell with three neighbors becomes populated. ', () => {
    const sut1 = { x: 3, y: 4};
    const sutBefore1 = grid.isAlive(sut1);
    grid.progress();
    const sutAfter1 = grid.isAlive(sut1);

    assert.isFalse(sutBefore1);
    assert.isTrue(sutAfter1);
  });
});

```