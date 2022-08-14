import {React,useState,Component, useEffect,useContext } from 'react';
import { StyleSheet, Text, View,Image,Button,TextInput,Alert} from 'react-native';
import {SocketContext} from '../context/socket.js';

const Login = ({navigation,route}) => {
    const socket = useContext(SocketContext);
    const [temp_ID, set_temp_ID] = useState('');
    const [password, set_input_password] = useState('');
    const [user_ID, set_input_ID,] = useState('');

    useEffect(() => {

        socket.on("connect", () => {
            console.log("connected");
        });

        socket.on('new client', (data) =>{
            console.log(data.client_ID)
            set_temp_ID(data.client_ID)
        })

        socket.on('logged in', (data) =>{
            username = data.username
            console.log('logged in')
            console.log(username)
            navigation.navigate('Game Screen', {username:data.username})
        })


    }, []);

    return(
        <View style={styles.login_containter}>
            <Text style={{height:'5%',justifyContent:'center',alignItems:'center',fontSize:20}}>
                This is a Login in Screen
            </Text>
            <TextInput style={styles.textInput} placeholder='User ID' onChangeText={set_input_ID}></TextInput>
            <TextInput style={styles.textInput} placeholder='Password' onChangeText={set_input_password}></TextInput>
            <View style={{marginTop:"2%",justifyContent: 'center',alignItems: 'center',width:'60%'}}>
                <View style={styles.button}>
                    <Button title='Login' onPress={()=>{socket.emit('login',{user_ID:user_ID,password:password})}}></Button>
                </View>
                <View style={styles.button}>
                    <Button title='Create Account' onPress={()=>navigation.navigate('Account Creation Screen')}></Button>
                </View>
                <View style={styles.button}>
                    <Button title='Continue as guest' onPress={()=>navigation.navigate('Game Screen', {username: 'guest-' + temp_ID.substr(0,5)})}></Button>
                </View>
            </View>
        </View>
    );
}

export default Login;

const styles = StyleSheet.create({
    login_containter:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput:{
        borderWidth:1,
        width:'80%',
        height:"5%",
        marginBottom:"2%",
        marginTop:"1%",
        paddingLeft:"1%",
        borderRadius:5,
    },
    button:{
        borderWidth:1,
        backgroundColor:'lightblue',
        width:"100%",
        margin:'1%',
        borderRadius:5
    },
})