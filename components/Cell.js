import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Text,
    Alert
} from 'react-native';
import Constants from '../Constants';
import Imagens from '../assets/Imagens';

export default class Cell extends Component {
    constructor(props) {
        super(props);

        this.state = {
            revealed: false,
            isMine: this.bombSeter(),
            neighboors: null
        }
    }

    bombSeter = () => {
        if(Constants.MAX_BOMBS_CELLS !== 0){
            let prob = Math.random() < 0.1;
            if(prob){
                Constants.MAX_BOMBS_CELLS--;
                return true;
            } else {
                return false;
            }
        } else{
            return false;
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
                this.props.onReveal(this.props.x, this.props.y);
            }
        });
    }

    reset = () => {
        this.setState({
            revealed: false,
            isMine: this.bombSeter(),
            neighboors: null
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
                content = (
                    <Text>{this.state.neighboors}</Text>
                )
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
        backgroundColor: '#bdbdbd',
        borderWidth: 1,
        borderColor: '#7d7d7d',
        alignItems: 'center',
        justifyContent: 'center'
    }
})