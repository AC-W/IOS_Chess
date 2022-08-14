import {React} from 'react';
import GameScreen from './screens/game.js';
import Login from './screens/login.js';
import AccountCreation from './screens/accountcreation.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {SocketContext, socket} from './context/socket.js';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <SocketContext.Provider value={socket}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login screen"
            component={Login}
            options={{headerShown:false}}
          />
          <Stack.Screen 
          name="Game Screen" 
          component={GameScreen} 
          options={{headerShown:false}}
          />
          <Stack.Screen 
          name="Account Creation Screen" 
          component={AccountCreation} 
          options={{headerShown:false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketContext.Provider>
  );
};

export default function App() {
  return (
    MyStack()
  );
}