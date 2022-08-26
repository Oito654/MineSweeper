import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Text
} from 'react-native';
import Constants from '../Constants';
import Imagens from '../assets/Imagens';

export default class Cell extends Component {
    constructor(props) {
        super(props);

        this.state = {
            revealed: false,
            isMine: 0,
            neighboors: null,
            counted: false,
        }
    }

    revealWithoutCallback = () => {
        if (this.state.revealed) {
            return;
        }
        this.setState({
            revealed: true
        })
    }

    onReveal = (userInitiated) => {
        if (this.state.revealed) {
            return;
        }

        if (!userInitiated && this.state.isMine) {
            return;
        }

        this.setState({
            revealed: true
        }, () => {
            if (this.state.isMine) {
                this.props.onDie();
            } else {
                if(this.state.revealed && !this.state.counted){
                    Constants.TILE_COUNTER++;
                    this.state.counted = true;
                }
                this.props.onReveal(this.props.x, this.props.y);
                if(Constants.TILE_COUNTER === 92){
                    this.props.onWin();
                }
            }
        });
    }

    reset = () => {
        this.setState({
            revealed: false,
            isMine: 0,
            neighboors: null,
            counted: false
        })
    }

    render() {
        if (!this.state.revealed) {
            return (
                <TouchableOpacity onPress={() => { this.onReveal(true); }}>
                    <View style={[styles.cell, { width: this.props.width, height: this.props.height }]}>

                    </View>
                </TouchableOpacity>
            )
        } else {
            let content = null;

            if (this.state.isMine) {
                content = (
                    <Image source={Imagens.mine} style={{ width: this.props.width, height: this.props.height }} resizeMode="contain" />
                )
            } else if (this.state.neighboors) {
                if (this.state.neighboors == 1) {
                    content = (
                        <Text style={{ color: 'blue' }}>{this.state.neighboors}</Text>
                    )
                }
                else if (this.state.neighboors == 2) {
                    content = (
                        <Text style={{ color: 'green' }}>{this.state.neighboors}</Text>
                    )
                }
                else if (this.state.neighboors == 3) {
                    content = (
                        <Text style={{ color: 'red' }}>{this.state.neighboors}</Text>
                    )
                } else {
                    content = (
                        <Text>{this.state.neighboors}</Text>
                    )
                }
            }

            return (
                <View style={[styles.cellRevealed, { width: this.props.width, height: this.props.height }]}>
                    {content}
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    cell: {
        backgroundColor: '#bdbdbd',
        borderWidth: 3,
        borderTopColor: '#ffffff',
        borderLeftColor: '#ffffff',
        borderRightColor: '#7d7d7d',
        borderBottomColor: '#7d7d7d'
    },
    cellRevealed: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#7d7d7d',
        alignItems: 'center',
        justifyContent: 'center'
    },
})