/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/core';
import axios from 'axios';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Button,
  Caption,
  Subheading,
  Title,
  TouchableRipple,
} from 'react-native-paper';
import {AuthContext} from '../App';
import {API_URL} from './Constant';
import styles from './Style';

export type TicketPayload = {
  id: number;
  title: string;
  status: string;
  date: string;
};

export const TicketPage = () => {
  const navigation = useNavigation();

  const [tickets, setTickets] = React.useState<TicketPayload[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshLoad, setRefreshLoad] = React.useState(0);

  const {state} = React.useContext(AuthContext);

  React.useEffect(() => {
    const axiosOpts = {
      headers: {Authorization: `Bearer ${state.userToken}`},
    };

    const bootstrap = async () => {
      setIsLoading(true);
      await axios
        .get(`${API_URL}/tickets`, axiosOpts)
        .then(response => {
          setTickets(response.data);
        })
        .catch(err => console.error(err.response.data))
        .finally(() => setIsLoading(false));
    };

    bootstrap();
  }, [state, refreshLoad]);

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Layanan Pelanggan" />
        {tickets.length <= 0 || (
          <Appbar.Action
            icon="plus"
            onPress={() => navigation.navigate('AddTicket')}
          />
        )}
        <Appbar.Action
          icon="refresh"
          onPress={() => setRefreshLoad(refreshLoad + 1)}
        />
      </Appbar.Header>

      <ScrollView style={styles.bgWhite}>
        {isLoading ? (
          <ActivityIndicator size={30} style={{marginTop: 20}} />
        ) : tickets.length <= 0 ? (
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Caption>Belum ada tiket saat ini</Caption>
            <Button
              icon="plus"
              onPress={() =>
                navigation.navigate('AddTicket', {
                  onGoBack: () => setRefreshLoad(refreshLoad + 1),
                })
              }>
              Buat Tiket
            </Button>
          </View>
        ) : (
          tickets.map(ticket => (
            <TouchableRipple
              key={ticket.id}
              onPress={() =>
                navigation.navigate('TicketDetail', {id: ticket.id})
              }>
              <View style={styles.box}>
                <View style={styles.rowCenter}>
                  <View>
                    <Title>{ticket.title}</Title>
                  </View>
                  <Subheading
                    style={{color: ticket.status === 'OPEN' ? 'blue' : 'red'}}>
                    {ticket.status}
                  </Subheading>
                </View>
              </View>
            </TouchableRipple>
          ))
        )}
      </ScrollView>
    </>
  );
};
