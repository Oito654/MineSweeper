import { Dimensions } from "react-native"

let Constants = () => {

}

export default Constants = {
    MAX_WIDTH: Dimensions.get('screen').width,
    MAX_HEIGHT: Dimensions.get('screen').height,
    BOARD_SIZE: 10,
    CELL_SIZE: 30,
    MAX_BOMBS_CELLS: 8,
    TILE_COUNTER: 0,
    FIRST_CLICK: true
}