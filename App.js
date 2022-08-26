import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Button
} from 'react-native';
import Constants from './Constants';
import Cell from './components/Cell';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.boardWidth = Constants.CELL_SIZE * Constants.BOARD_SIZE;
    this.grid = Array.apply(null, Array(Constants.BOARD_SIZE)).map((el, idx) => {
      return Array.apply(null, Array(Constants.BOARD_SIZE)).map((el, idx) => {
        return null;
      });
    });
  }

  onDie = () => {
    Alert.alert('Boooooom!');
    for (let i = 0; i < Constants.BOARD_SIZE; i++) {
      for (let j = 0; j < Constants.BOARD_SIZE; j++) {
        this.grid[i][j].revealWithoutCallback();
      }
    }
  }

  onWin = () => {
    Alert.alert('Você venceu!');
    for (let i = 0; i < Constants.BOARD_SIZE; i++) {
      for (let j = 0; j < Constants.BOARD_SIZE; j++) {
        this.grid[i][j].revealWithoutCallback();
      }
    }
  }

  bombSeter = (x,y) => {
    while (Constants.MAX_BOMBS_CELLS >= 1) {
      for (let i = 0; i < Constants.BOARD_SIZE; i++) {
        for (let j = 0; j < Constants.BOARD_SIZE; j++) {
          if (Math.random() < 0.1  && i !== x && j !== y) {
            if (Constants.MAX_BOMBS_CELLS >= 1) {
              this.grid[i][j].state.isMine = true;
              Constants.MAX_BOMBS_CELLS--;
            }
          }
        }
      }
    }
  }

  checkForTiles = () => {
    Constants.TILE_COUNTER = 0;
    for (let i = 0; i < Constants.BOARD_SIZE; i++) {
      for (let j = 0; j < Constants.BOARD_SIZE; j++) {
        if (this.grid[i][j].state.revealed && !this.grid[i][j].state.isMine) {
          Constants.TILE_COUNTER++;
        }
      }
    }
  }

  checkForNeighboors = () => {
    for (let x = 0; x < Constants.BOARD_SIZE; x++) {
      for (let y = 0; y < Constants.BOARD_SIZE; y++) {

        let neighboors = 0;

        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (x + i >= 0 && x + i <= Constants.BOARD_SIZE - 1 && y + j >= 0 && y + j <= Constants.BOARD_SIZE - 1) {
              if (this.grid[x + i][y + j].state.isMine) {
                neighboors++
              }
            }

            if (neighboors) {
              this.grid[x][y].setState({
                neighboors: neighboors
              })
            }
          }
        }
      }
    }
  }

  revealNeighboors = (x, y) => {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if ((i != 0 || j != 0) && x + i >= 0 && x + i <= Constants.BOARD_SIZE - 1 && y + j >= 0 && y + j <= Constants.BOARD_SIZE - 1) {
          this.grid[x + i][y + j].onReveal(false);
        }
      }
    }
  }

  onReveal = (x, y) => {

    if(Constants.FIRST_CLICK){
      Constants.FIRST_CLICK = false;
      this.bombSeter(x, y);
      this.checkForNeighboors();
    }

    this.checkForTiles();

    if (this.grid[x][y].state.neighboors === null) {
      this.revealNeighboors(x, y);
    }
  }

  renderBoard = () => {
    return Array.apply(null, Array(Constants.BOARD_SIZE)).map((el, rowIdx) => {
      let cellList = Array.apply(null, Array(Constants.BOARD_SIZE)).map((el, collIdx) => {
        return <Cell
          onReveal={this.onReveal}
          onDie={this.onDie}
          onWin={this.onWin}
          key={collIdx}
          width={Constants.CELL_SIZE}
          height={Constants.CELL_SIZE}
          x={collIdx}
          y={rowIdx}
          ref={(ref) => { this.grid[collIdx][rowIdx] = ref }}
        />
      },
      );

      return (
        <View key={rowIdx} style={{ width: this.boardWidth, height: Constants.CELL_SIZE, flexDirection: 'row' }}>
          {cellList}
        </View>
      );
    });
  }

  resetGame = () => {
    Constants.MAX_BOMBS_CELLS = 8;
    Constants.FIRST_CLICK = true;
    for (let i = 0; i < Constants.BOARD_SIZE; i++) {
      for (let j = 0; j < Constants.BOARD_SIZE; j++) {
        this.grid[i][j].reset();
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Button title='Novo Jujo' onPress={this.resetGame}></Button>
        <View style={{ width: this.boardWidth, height: this.boardWidth, backgroundColor: '#888888', flexDirection: 'column' }}>
          {this.renderBoard()}
        </View>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
});