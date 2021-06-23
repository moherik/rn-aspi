import {useNavigation} from '@react-navigation/core';
import axios from 'axios';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {
  Appbar,
  Title,
  Button,
  Subheading,
  Caption,
  ActivityIndicator,
} from 'react-native-paper';
import {AuthContext} from '../App';
import {API_URL} from './Constant';

import styles from './Style';

export type HistoryPayload = {
  id: number;
  packet: {
    name: string;
  };
  packet_id: number;
  trx_code: string;
  total_price: number;
  created_at: string;
};

export const HistoryPage = () => {
  const navigation = useNavigation();

  const [trxs, setTrxs] = React.useState<HistoryPayload[]>([]);
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
        .get(`${API_URL}/transactions/history`, axiosOpts)
        .then(response => {
          console.log(response.data);
          setTrxs(response.data);
        })
        .finally(() => setIsLoading(false));
    };

    bootstrap();
  }, [state, refreshLoad]);

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Riwayat Pembelian" />
        <Appbar.Action
          icon="refresh"
          onPress={() => setRefreshLoad(refreshLoad + 1)}
        />
      </Appbar.Header>

      <ScrollView style={styles.bgWhite}>
        {isLoading ? (
          <ActivityIndicator size={30} style={{marginTop: 20}} />
        ) : trxs.length <= 0 ? (
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Caption>Belum ada transaksi saat ini</Caption>
            <Button onPress={() => navigation.navigate('Packet')}>
              Temukan Paket
            </Button>
          </View>
        ) : (
          trxs.map(trx => (
            <View style={styles.box} key={trx.id}>
              <View style={styles.rowCenter}>
                <View>
                  <Subheading>{trx.packet.name}</Subheading>
                  <Title>Rp. {trx.total_price}</Title>
                  <Caption>ID: {trx.trx_code}</Caption>
                </View>
                <Button mode="contained" onPress={() => {}}>
                  Beli Lagi
                </Button>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </>
  );
};
