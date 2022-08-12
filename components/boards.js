import React, { Component } from 'react';
import Canvas from 'react-native-canvas';
import { StyleSheet, Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;

function Gameboard(props){
    console.log(props)
    class Gameboard extends Component {
        handleCanvas = (canvas) => {
            canvas.width = windowWidth - 20
            canvas.height = canvas.width
            const ctx = canvas.getContext('2d');
            block_size =Math.floor(canvas.width/8)
            background_color1 = 'rgb(222, 128, 35)';
            background_color2 = 'rgb(255, 163, 71)';
            for (var x = 0; x < 8;x++){
                for(var i = 0;i < 8; i++){
                    if (i % 2 == x % 2){
                        ctx.beginPath();
                        ctx.rect(i*block_size,x*block_size,block_size,block_size);
                        ctx.fillStyle = background_color1;
                        ctx.fill();
                    }
                    else{
                        ctx.beginPath();
                        ctx.rect(i*block_size,x*block_size,block_size,block_size);
                        ctx.fillStyle = background_color2;
                        ctx.fill();
                    }
                }
            }
            if (props.data){
                props.data[0].draw(ctx,true,canvas)
            }
        }
    
        render() {
            return (
            <Canvas ref={this.handleCanvas}/>
            )
        }
    }
    return(
        <Gameboard/>
    );
}

export default Gameboard;

const styles = StyleSheet.create({
});