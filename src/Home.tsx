/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ImageBackground, ScrollView, View} from 'react-native';
import {
  Avatar,
  Button,
  Title,
  Caption,
  ActivityIndicator,
  Colors,
  IconButton,
  Subheading,
} from 'react-native-paper';
import {AuthContext} from '../App';

import {PacketItem} from './PacketItem';
import styles from './Style';
import {PacketType} from './Type';

import axios from 'axios';
import {API_URL} from './Constant';
import {curencyFormat, formatStrDate} from './utils';

type PaymentPayload = {
  payDate: string;
  unpaid: number;
};

type UserPayload = {
  id: number;
  username: string;
  name: string;
};

export const HomePage = () => {
  const [me, setMe] = React.useState<UserPayload>();
  const [packets, setPackets] = React.useState<Array<PacketType>>([]);
  const [payment, setPayment] = React.useState<PaymentPayload>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [update, setUpdate] = React.useState(0);

  const {signOut, state} = React.useContext(AuthContext);

  React.useEffect(() => {
    const bootstrap = async () => {
      const options = {
        headers: {Authorization: `Bearer ${state.userToken}`},
      };

      await axios
        .get(`${API_URL}/user`, options)
        .then(response => {
          setMe(response.data);
        })
        .catch(err => console.error(err.response.data));

      await axios
        .get(`${API_URL}/transactions/total-payment`, options)
        .then(response => {
          setPayment(response.data);
        })
        .catch(err => console.error(err.response.data));

      setIsLoading(true);
      await axios
        .get(`${API_URL}/packets/feed`, options)
        .then(response => {
          setPackets(response.data);
        })
        .catch(err => console.error(err.response.data))
        .finally(() => setIsLoading(false));
    };

    bootstrap();
  }, [state, update]);

  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <ImageBackground
        source={require('../image/smule.jpg')}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 20,
          minHeight: 200,
        }}>
        <View>
          <Subheading style={{color: 'white'}}>Selamat Datang,</Subheading>
          <Title
            style={{
              color: 'white',
              textTransform: 'uppercase',
              marginTop: -5,
            }}>
            {me?.name}
          </Title>
        </View>
        <View style={{flexDirection: 'row'}}>
          <IconButton
            rippleColor={Colors.red500}
            color="white"
            icon="refresh"
            onPress={() => setUpdate(update+1)}
          />
          <IconButton
            rippleColor={Colors.red500}
            color="white"
            icon="logout"
            onPress={() => signOut()}
          />
        </View>
      </ImageBackground>

      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 5,
        }}>
        <Caption>Tagihan Bulan Ini</Caption>
      </View>

      <View style={styles.box}>
        <View style={styles.rowCenter}>
          <View>
            <Title>{curencyFormat(payment?.unpaid || 0)}</Title>
            <Caption>
              Bayar segera sebelum tanggal {formatStrDate(payment?.payDate)}
            </Caption>
          </View>
          <Button mode="contained" onPress={() => {}}>
            Bayar
          </Button>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator
          style={{marginTop: 50}}
          animating={true}
          color={Colors.amber400}
          size={30}
        />
      ) : (
        packets.map(packet => (
          <PacketItem type="home" key={packet.id} data={packet} />
        ))
      )}
    </ScrollView>
  );
};
