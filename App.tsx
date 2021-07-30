/* eslint-disable react-native/no-inline-styles */
import 'react-native-gesture-handler';
import React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  ActivityIndicator,
  Colors,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';

import {LoginPage} from './src/Login';
import {RegisterPage} from './src/Register';

import {MainNavigation} from './src/MainNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from './src/Constant';

import axios from 'axios';
import {AuthContextState, AuthReducerState} from './src/Type';

type LoginRequest = {
  username: string;
  password: string;
  device_name: string;
};

export type RegisterPayload = {
  name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  gender: string;
  device_name?: string;
};

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Register" component={RegisterPage} />
    </Stack.Navigator>
  );
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.red500,
    accent: 'yellow',
  },
};

export const AuthContext = React.createContext<AuthContextState>({
  signIn: async () => {},
  signOut: () => {},
  signUp: async () => {},
  state: {},
});

const initialState: AuthReducerState = {
  isLoading: true,
  isSignOut: false,
  userToken: null,
};

const App = () => {
  const [state, dispatch] = React.useReducer((prevState: any, action: any) => {
    switch (action.type) {
      case 'RESTORE_TOKEN':
        return {...prevState, userToken: action.token, isLoading: false};
      case 'SIGN_IN':
        return {...prevState, userToken: action.token, isSignOut: false};
      case 'SIGN_OUT':
        return {...prevState, isSignOut: true, userToken: null};
    }
  }, initialState);

  React.useEffect(() => {
    const getToken = async () => {
      await AsyncStorage.getItem('@token')
        .then(_token => {
          dispatch({type: 'RESTORE_TOKEN', token: _token});
        })
        .catch(err => console.log(err));
    };

    getToken();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (username: string, password: string) => {
        const payload: LoginRequest = {
          username: username,
          password: password,
          device_name: 'riva',
        };

        const url: string = `${API_URL}/auth/login`;
        await axios.post(url, payload).then(response => {
          if (response.status === 200) {
            const _token = response.data?.token;
            AsyncStorage.setItem('@token', _token);
            dispatch({type: 'SIGN_IN', token: _token});
          }
        });
      },
      signOut: async () => {
        await AsyncStorage.clear();
        dispatch({type: 'SIGN_OUT'});
      },
      signUp: async (payload: RegisterPayload) => {
        const url: string = `${API_URL}/auth/register`;
        await axios
          .post(url, payload)
          .then(response => {
            if (response.status === 200) {
              const _token = response.data?.token;
              AsyncStorage.setItem('@token', _token);
              dispatch({type: 'SIGN_IN', token: _token});
            }
          })
          .catch(err => console.log(err.response.data));
      },
      state: state,
    }),
    [state],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          {state.isLoading ? (
            <View style={{flexGrow: 1, justifyContent: 'center'}}>
              <ActivityIndicator size={50} />
            </View>
          ) : !state.userToken ? (
            <AuthStack />
          ) : (
            <MainNavigation />
          )}
        </NavigationContainer>
      </PaperProvider>
    </AuthContext.Provider>
  );
};

export default App;
