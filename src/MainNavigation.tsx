import React, {useContext, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';

import {HomePage} from './Home';
import {PacketPage} from './Packet';
import {HistoryPage} from './History';
import {TicketPage} from './Ticket';
import {TicketDetailPage} from './TicketDetail';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {AddTicketPage} from './AddTicket';
import {AuthContext} from '../App';
import axios from 'axios';
import {API_URL} from './Constant';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const tabBarIcon = (
  outlineName: string,
  focusName: string,
  color: string,
  size: number,
  focused: boolean,
) => (
  <Ionicons
    name={focused ? focusName : outlineName}
    color={color}
    size={size}
  />
);

export const TicketStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Ticket" component={TicketPage} />
      <Stack.Screen name="AddTicket" component={AddTicketPage} />
      <Stack.Screen name="TicketDetail" component={TicketDetailPage} />
    </Stack.Navigator>
  );
};

export const MainNavigation = () => {
  const {state} = useContext(AuthContext);

  useEffect(() => {
    const axiosOpts = {
      headers: {Authorization: `Bearer ${state.userToken}`},
    };

    const saveTokenToDatabase = async (token: string) => {
      await axios
        .post(`${API_URL}/user/update-token`, {token}, axiosOpts)
        .then(response => {
          console.log(response.data);
        });
    };

    messaging()
      .getToken()
      .then(token => {
        return saveTokenToDatabase(token);
      });

    return messaging().onTokenRefresh(token => {
      saveTokenToDatabase(token);
    });
  }, [state.userToken]);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        adaptive: true,
        activeTintColor: 'tomato',
        showLabel: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarLabel: 'Beranda',
          tabBarIcon: ({color, focused, size}) =>
            tabBarIcon('home-outline', 'home', color, size, focused),
        }}
      />
      <Tab.Screen
        name="Packet"
        component={PacketPage}
        options={{
          tabBarLabel: 'Paket',
          tabBarIcon: ({color, focused, size}) =>
            tabBarIcon('cube-outline', 'cube', color, size, focused),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryPage}
        options={{
          tabBarLabel: 'Riwayat Transaksi',
          tabBarIcon: ({color, focused, size}) =>
            tabBarIcon('time-outline', 'time', color, size, focused),
        }}
      />
      <Tab.Screen
        name="Ticket"
        component={TicketStack}
        options={{
          tabBarLabel: 'Tiket',
          tabBarIcon: ({color, focused, size}) =>
            tabBarIcon(
              'chatbubbles-outline',
              'chatbubbles',
              color,
              size,
              focused,
            ),
        }}
      />
    </Tab.Navigator>
  );
};
