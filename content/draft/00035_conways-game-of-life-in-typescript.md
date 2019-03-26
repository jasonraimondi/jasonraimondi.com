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

Conways Game of Life

<div id="conways-game-of-life">Loading the game...</div>

<script src="/assets/js/conways-game-of-life.package.js"></script>

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
    this.cellGrid.conway();
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

  conway(): void {
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