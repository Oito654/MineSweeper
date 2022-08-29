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
import * as Font from 'expo-font';

export default class Cell extends Component {
    constructor(props) {
        super(props);

        this.state = {
            revealed: false,
            isMine: 0,
            neighboors: null,
            counted: false,
            banner: false
        }
    }

    async loadFonts() {
        await Font.loadAsync({
            'Silk': require('../assets/fonts/Silkscreen-Regular.ttf'),
        });
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
        if (this.state.banner) {
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
                if (this.state.revealed && !this.state.counted) {
                    Constants.TILE_COUNTER++;
                    this.state.counted = true;
                }
                this.props.onReveal(this.props.x, this.props.y);
                if (Constants.TILE_COUNTER === 92) {
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
            counted: false,
            banner: false
        })
    }

    render() {
        if (Constants.FIRST_CLICK) {
            this.loadFonts();
        }

        if (!this.state.revealed && !this.state.banner) {
            return (
                <TouchableOpacity onPress={() => { this.onReveal(true); }} onLongPress={() => { this.setState({ banner: true }) }}>
                    <View style={[styles.cell, { width: this.props.width, height: this.props.height }]}>

                    </View>
                </TouchableOpacity>
            )
        }
        else if (this.state.banner) {
            return (
                <TouchableOpacity onLongPress={() => { this.setState({ banner: false }) }}>
                    <View style={[styles.cell, { width: this.props.width, height: this.props.height }]}>
                        <Image source={Imagens.banner} style={{ width: this.props.width / 1.5, height: this.props.height, alignContent: 'center' }} resizeMode="contain" />
                    </View>
                </TouchableOpacity>
            )
        }
        else {
            let content = null;

            if (this.state.isMine) {
                content = (
                    <Image source={Imagens.mine} style={{ width: this.props.width, height: this.props.height }} resizeMode="contain" />
                )
            } else if (this.state.neighboors) {
                if (this.state.neighboors == 1) {
                    content = (
                        <Text style={{ color: 'blue', fontFamily: 'Silk' }}>{this.state.neighboors}</Text>
                    )
                }
                else if (this.state.neighboors == 2) {
                    content = (
                        <Text style={{ color: 'green', fontFamily: 'Silk' }}>{this.state.neighboors}</Text>
                    )
                }
                else if (this.state.neighboors == 3) {
                    content = (
                        <Text style={{ color: 'red', fontFamily: 'Silk' }}>{this.state.neighboors}</Text>
                    )
                } else {
                    content = (
                        <Text style={{ fontFamily: 'Silk' }}>{this.state.neighboors}</Text>
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