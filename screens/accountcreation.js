import {React,useState,Component, useEffect,useContext } from 'react';
import { StyleSheet, Text, View,Image,Button,TextInput,Alert} from 'react-native';
import {SocketContext} from '../context/socket.js';

const AccountCreation = ({navigation,route}) => {
    const socket = useContext(SocketContext);
    const [password, set_password] = useState('');
    const [confirmPass,set_confirm] = useState('')
    const [user_ID, set_ID,] = useState('');
    const [username, set_username] = useState('');

    useEffect(() => {
        socket.on('account_creation_success',(data)=>{
            navigation.navigate('Login screen')
        })

    },[])

    const createAccount = () => {
        if (password != confirmPass){
            Alert.alert(
                "Account creation error",
                "Password do not match",
                [
                    {
                    text: "Return",
                    style: "cancel",
                    },
                ]
            )
            return
        }
        console.log("Creating Account")
        console.log(user_ID)
        console.log(username)
        console.log(password)
        socket.emit('create_account',{new_user_ID:user_ID,new_username:username,password:password})
    }

    return(
        <View style={styles.create_containter}>
            
            <Text>This is the account creation screen</Text>
            <TextInput style={styles.textInput} placeholder='User ID' onChangeText={set_ID}></TextInput>
            <TextInput style={styles.textInput} placeholder='Username' onChangeText={set_username}></TextInput>
            <TextInput style={styles.textInput} placeholder='Password' onChangeText={set_password}></TextInput>
            <TextInput style={styles.textInput} placeholder='confirm Password' onChangeText={set_confirm}></TextInput>

            <View style={{marginTop:"2%",justifyContent: 'center',alignItems:'center',width:'60%'}}>
                <View style={styles.button}>
                    <Button title='Confirm' onPress={createAccount}></Button>
                </View>
                <View style={styles.button}>
                    <Button title='Back' onPress={()=>navigation.navigate('Login screen')}></Button>
                </View>
            </View>
        </View>
    )
}

export default AccountCreation;

const styles = StyleSheet.create({
    create_containter:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput:{
        borderWidth:1,
        height:"5%",
        width:'80%',
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