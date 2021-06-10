import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {ActivityIndicator, Appbar, Caption} from 'react-native-paper';
import {AuthContext} from '../App';
import {PacketItem} from './PacketItem';
import styles from './Style';

import {PacketType} from './Type';
import axios from 'axios';
import {API_URL} from './Constant';

export const PacketPage = () => {
  const [packets, setPackets] = React.useState<PacketType[]>([]);
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
        .get(`${API_URL}/packets`, axiosOpts)
        .then(response => {
          setPackets(response.data);
        })
        .finally(() => setIsLoading(false));
    };

    bootstrap();
  }, [state, refreshLoad]);

  return (
    <ScrollView style={styles.bgWhite}>
      <Appbar.Header>
        <Appbar.Content title="Daftar Paket" />
        <Appbar.Action
          icon="refresh"
          onPress={() => setRefreshLoad(refreshLoad + 1)}
        />
      </Appbar.Header>
      <View>
        {isLoading ? (
          <ActivityIndicator size={30} style={{marginTop: 20}} />
        ) : packets.length <= 0 ? (
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Caption>Belum ada transaksi saat ini</Caption>
          </View>
        ) : (
          packets.map(packet => <PacketItem key={packet.id} data={packet} />)
        )}
      </View>
    </ScrollView>
  );
};
