import {React,useState,Component, useEffect } from 'react';
import { StyleSheet, Text, View,Image,Button,TextInput,Alert} from 'react-native';

const requestURL = "https://pythonchessapi.herokuapp.com";

const AccountCreation = ({navigation,route}) => {
    const [password, set_password] = useState('');
    const [confirmPass,set_confirm] = useState('')
    const [user_ID, set_ID,] = useState('');
    const [username, set_username] = useState('');

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
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        console.log(user_ID)
        console.log(username)
        console.log(password)
        formData.append('password',password);
        formData.append('new_username',username);
        formData.append('new_user_ID',user_ID);
        xhr.onreadystatechange = (e) => {
        if (xhr.readyState !== 4) {
            return;
        }
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.response)
            console.log(data)
            if (data.valid == 1){
                console.log(data.msg)
                navigation.navigate('Login screen')
            }
            else{
                console.log(data.msg)
            }
        } 
        else {
            console.log('account creation failure')
        }
        };
        xhr.open('POST',requestURL+'/create_account',true);
        xhr.send(formData);
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