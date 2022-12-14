import {React,useState,useEffect,useContext} from 'react';
import { StyleSheet, Text, View, Dimensions,Image,Button,TextInput,ScrollView,Alert} from 'react-native';
import {chess} from '../components/chess_board.js';
import uuid from 'react-native-uuid';
import {SocketContext} from '../context/socket.js';

const windowWidth = Dimensions.get('window').width;
const windowheight = Dimensions.get('window').height;
var dot = require('../assets/dot.png')
var empty = require('../assets/empty.png')
var screensize = 0

if (windowWidth < windowheight){
   screensize = windowWidth
}
else{
   screensize = windowheight
}
screensize = screensize - 10
if (screensize > 500){
  screensize = 500
}
const block_size =Math.floor((screensize - 20)/8)
var game = new chess(block_size);

function getBoard(game_board){
  var background_color1 = 'rgb(222, 128, 35)';
  var background_color2 = 'rgb(255, 163, 71)';
  var board = new Array(8)
  for (let i = 0;i < 8;i++){
    board[i] = new Array(8);
  }

  for (let x = 0;x < 8;x++){
    for (let y = 0;y < 8;y++){  
      if (x % 2 == y % 2){
          board[x][y] = [game_board[y][x],x,y,background_color1]
      }
      else{
          board[x][y] = [game_board[y][x],x,y,background_color2]
      }
      if (game_board[y][x].highlight){
        board[x][y].push(dot)
      }
      else{
        board[x][y].push(empty)
      }
    }
  }
  return board
}

const GameScreen = ({navigation, route}) => {
    const socket = useContext(SocketContext);
    const [picked_up,setpickup] = useState(['nothing'])
    var board = getBoard(game.board)
    var [gameBoard,setgameBoard] = useState(board)
    const [game_ID,set_game_ID] = useState(route.params.username+ '-' + uuid.v4().substr(0,5))
    const [global_chat,set_global_chat] = useState('no New messages')
    const [newMessage,set_newMessage] = useState('')
    const [promotion_key,set_promotionKey] = useState('')
    const [play_as,set_play_as] = useState('spectate')

    const [displayMenu,set_displayMenu] = useState(StyleSheet.create({
        gameMenu:{
        display:'none',
        flexDirection:'row',
    },
    }))

    useEffect(() => {
        socket.on('new client', (data) =>{
            console.log(data.client_ID)
            set_temp_ID(data.client_ID)
        })

        socket.on('update_move_check', (data) =>{
            game.clear()
            if (data.validmove.length != 0){
            let canPromote = false
                for(var i = 0; i < data.validmove.length;i++){
                    var move = game.uci_to_move(data.validmove[i])
                    try{
                    if (data.validmove[i][4] == 'q'){
                        game.board[move[0][0]][move[0][1]].canPromote = true
                        canPromote = true
                        console.log(game.board[move[0][0]][move[0][1]])
                    }
                    else if (data.validmove[i][4] == 'r'){
                        game.board[move[0][0]][move[0][1]].canPromote = true
                        canPromote = true
                    }
                    else if (data.validmove[i][4] == 'b'){
                        game.board[move[0][0]][move[0][1]].canPromote = true
                        canPromote = true
                    }
                    else if (data.validmove[i][4] == 'n'){
                        game.board[move[0][0]][move[0][1]].canPromote = true
                        canPromote = true
                    }
                    }
                    catch(err){
                    console.log('no Promotion')
                    }
                    game.board[move[1][0]][move[1][1]].highlight = true
                }
                setgameBoard(getBoard(game.board))
                if (canPromote){
                    set_displayMenu(StyleSheet.create({
                        gameMenu:{
                        flexDirection:'row',
                        },
                    }))
                }
                else{
                    set_displayMenu(StyleSheet.create({
                        gameMenu:{
                        display:'none',
                        flexDirection:'row',
                    },
                    }))
                }
            }
        })

        socket.on('update_board', (data) => {
            game.update(data.game_array)
            game.clear()
            setgameBoard(getBoard(game.board))
        })

        socket.on('update_chat', (data) => {
            set_global_chat(data.chat);
        })

        socket.on('update_state', (data) => {
            game.update(data.game_array)
            game.clear()
            setgameBoard(getBoard(game.board))
            set_global_chat(data.chat);
        })

        socket.on('joined as', (data) => {
            set_play_as(data.join_as)
        })

        socket.on('error',(data)=>{
            Alert.alert(
                "Error",
                data.msg,
                [
                    {
                    text: "Return",
                    style: "cancel",
                    },
                ]
            )
        })

        socket.on('success',(data)=>{
            Alert.alert(
                "Success",
                data.msg,
                [
                    {
                    text: "Return",
                    style: "cancel",
                    },
                ]
            )
        })

    }, []);

    function pick_up(e,piece){
        if (play_as == 'spectator'){
            return
        }
        if (picked_up == 'nothing' && piece[0].name != "blank"){
            if (piece[0].color != play_as){
                return
            }
            console.log(game_ID)
            setpickup(piece)
            var uci = game.dic[piece[2]]
            uci = uci.concat(8-piece[1])
            socket.emit('check_move_piece',{game_ID:game_ID,uci:uci})
        }
        
        else if (picked_up != 'nothing'){
        if(piece[2] != picked_up[2] || picked_up[1] != piece[1]){
            var p1 = [picked_up[2],picked_up[1]]
            var p2 = [piece[2],piece[1]]
            var uci = (game.move_to_uci(p1,p2))
            if (picked_up[0].canPromote){
            uci = uci + promotion_key
            }
            socket.emit('check_move',{game_ID:game_ID,uci:uci})
        }
        setpickup(['nothing'])
        }
    }

    function Pre_Join(){
        Alert.alert(
        "Join Room",
        "Choose Join option",
        [
            {
            text: "Join As White",
            onPress: () => {socket.emit('join_game',{game_ID:game_ID,join_as:'white'})},
            style: "cancel",
            },
            {
            text: "Join As Black",
            onPress: () => {socket.emit('join_game',{game_ID:game_ID,join_as:'black'})},
            style: "cancel",
            },
            {
            text: "Spectate",
            onPress: () => {socket.emit('join_game',{game_ID:game_ID,join_as:'spectate'})},
            style: "cancel",
            },
            {
            text: "Cancel",
            style: "cancel",
            },
        ],
        );
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.userInfo}>
            <Text>Room Info</Text>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <Text>Username: {route.params.username}</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <Button title='Join Game Room' onPress={Pre_Join}></Button>
                <Button title='Generate Room ID' onPress={()=>{set_game_ID(route.params.username+ '-' + uuid.v4().substr(0,5))}}></Button>  
            </View>
            <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',width:'100%'}}>
                <View style={{width:'100%',borderWidth:1}}>
                    <TextInput placeholder='Enter Room ID:' onChangeText={set_game_ID}>{game_ID}</TextInput>
                </View>
                <Text>Current Room ID: {game_ID}</Text>
            </View>
            <Button title='Quit' onPress={()=>{socket.emit('log_off');navigation.navigate('Login screen')}}></Button>
            </View>

            <View style={displayMenu.gameMenu}>
            <Button title='Queen' onPress={()=>{set_promotionKey('q')}}></Button>
            <Button title='Bishop' onPress={()=>{set_promotionKey('b')}}></Button>
            <Button title='Rook' onPress={()=>{set_promotionKey('r')}}></Button>
            <Button title='Knight' onPress={()=>{set_promotionKey('k')}}></Button>
            </View>
            
            <View style={styles.game_board} >
            { gameBoard.map((item,key)=>(
                <View key= {key} style={styles.boards}>{ item.map((items, key)=>(
                    <View key={key} 
                    onTouchStart={(e) => pick_up(e,items)}
                    style={styles.block}>
                    
                    <Image style={{backgroundColor:items[3],width:'100%',height:'100%'}} source={items[0].image}></Image>
                    <Image style={{position:'absolute',width:'100%',height:'100%'}} source={items[4]}></Image>
                    </View>
                )
                )}</View>)
            )}
            
            </View>
            <View style={styles.chat}>
            <ScrollView style={styles.global_chat}>
                <Text>
                {global_chat}
                </Text>
            </ScrollView>
            <View style={styles.chat_input}>
                <ScrollView style={{width:'80%',borderWidth:1,}}>
                <TextInput placeholder='Enter Your Message' onChangeText={set_newMessage} clearButtonMode="always" value={newMessage}></TextInput>
                </ScrollView>
                <View style={{borderWidth:1,width: '20%'}}><Button title='Send' onPress={()=>{socket.emit('new_message',{game_ID:game_ID,message:newMessage})}}></Button></View>
            </View>
            </View>
        </View>
    );
}

export default GameScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    userInfo:{
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      position:'relative',
      borderStyle: "solid",
      borderWidth: 1,
      borderColor:"black",
      width: screensize-10,
    },
    game_board: {
      width: screensize-10,
      height: screensize-10,
      
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: "solid",
      borderWidth: 1,
      borderColor:"black",
    },
    chat:{
      backgroundColor: '#fff',
      position:'relative',
      borderStyle: "solid",
      
      borderColor:"black",
      width: screensize-10,
      height: screensize/2,
    },
    boards:{
      flexDirection:'row',
      position:'relative',
    },
    block:{
      height:block_size,
      width:block_size,
      borderWidth: 1,
      justifyContent:'center',
      alignItems:'center',
    },
    global_chat:{
      height: '80%',
      width: '100%',
      borderWidth: 2,
    },
    chat_input:{
      flexDirection:'row',
      marginTop: -2,
      borderWidth: 1,
    },
    gameMenu:{
      display:'none',
      flexDirection:'row',
    }
  });