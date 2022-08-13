import {React,useState,Component, useEffect } from 'react';
import { StyleSheet, Text, View,Image,Button,TextInput,Alert} from 'react-native';
import uuid from 'react-native-uuid';

const requestURL = "https://pythonchessapi.herokuapp.com";

const Login = ({navigation,route}) => {
    const [temp_ID, set_temp_ID] = useState(uuid.v4());
    const [password, set_input_password] = useState('');
    const [user_ID, set_input_ID,] = useState('');

    const login = () => {
        console.log("logging in")
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        console.log(user_ID)
        console.log(password)
        formData.append('password',password);
        formData.append('user_ID',user_ID);
        xhr.onreadystatechange = (e) => {
        if (xhr.readyState !== 4) {
            return;
        }
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.response)
            if (data.valid == 1){
                // console.log(data.msg)
                navigation.navigate('Game Screen', {user_ID: user_ID,username:data.username})
            }
            else{
                Alert.alert(
                    "Login",
                    "Login failed",
                    [
                        {
                        text: "Return",
                        style: "cancel",
                        },
                    ]
                )
                // console.log(data.msg)
            }
        } 
        else {
            Alert.alert(
                "Login",
                "Login failed",
                [
                    {
                    text: "Return",
                    style: "cancel",
                    },
                ]
            )
            console.log('login failure')
        }
        };
        xhr.open('POST',requestURL+'/login',true);
        xhr.send(formData);
    }

    return(
        <View style={styles.login_containter}>
            <Text style={{height:'5%',justifyContent:'center',alignItems:'center',fontSize:20}}>
                This is a Login in Screen
            </Text>
            <TextInput style={styles.textInput} placeholder='User ID' onChangeText={set_input_ID}></TextInput>
            <TextInput style={styles.textInput} placeholder='Password' onChangeText={set_input_password}></TextInput>
            <View style={{marginTop:"2%",justifyContent: 'center',alignItems: 'center',width:'60%'}}>
                <View style={styles.button}>
                    <Button title='Login' onPress={login}></Button>
                </View>
                <View style={styles.button}>
                    <Button title='Create Account' onPress={()=>navigation.navigate('Account Creation Screen')}></Button>
                </View>
                <View style={styles.button}>
                    <Button title='Continue as guest' onPress={()=>navigation.navigate('Game Screen', { user_ID: temp_ID, username: 'guest-' + temp_ID.substr(0,5)})}></Button>
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