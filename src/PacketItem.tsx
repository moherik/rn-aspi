import axios from 'axios';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Button,
  Caption,
  Dialog,
  Paragraph,
  Portal,
  Title,
} from 'react-native-paper';
import {AuthContext} from '../App';
import {API_URL} from './Constant';

import {PacketType} from './Type';
import {curencyFormat} from './utils';

export interface Props {
  type?: string;
  data: PacketType;
}

export const PacketItem: React.FC<Props> = props => {
  const {state} = React.useContext(AuthContext);
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selectedPacketId, setSelectedPacketId] = React.useState<number>();

  const axiosOpts = {
    headers: {Authorization: `Bearer ${state.userToken}`},
  };

  const handleShowDialog = (id: number) => {
    if (id != null && id > 0) {
      setSelectedPacketId(id);
      setVisible(true);
    }
  };

  const handleHideDialog = () => {
    setSelectedPacketId(undefined);
    setVisible(false);
  };

  const handleBuyItem = async () => {
    if (selectedPacketId != null && selectedPacketId > 0) {
      setLoading(true);
      await axios
        .get(`${API_URL}/transactions/buy/${selectedPacketId}`, axiosOpts)
        .then(response => {
          console.log(response.data);
        })
        .catch(err => console.error(err.response.data))
        .finally(() => {
          setVisible(false);
          setLoading(false);
        });
    }
  };

  return (
    <View style={styles.box}>
      <Portal>
        <Dialog visible={visible} onDismiss={handleHideDialog}>
          <Dialog.Title>Sedikit Lagi</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Beli paket ini?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button loading={loading} onPress={handleBuyItem}>
              Beli Sekarang
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View style={styles.rowCenter}>
        <View>
          <Title>{props.data.name}</Title>
          {props.type !== 'home' ? (
            <>
              <Caption style={styles.mbMinus}>
                Speed: {props.data.speed}Mbps
              </Caption>
              <Caption style={styles.mbMinus}>{props.data.description}</Caption>
            </>
          ) : (
            <Caption style={styles.mbMinus}>
              Speed: {props.data.speed}Mbps
            </Caption>
          )}
        </View>
        <Button
          mode="contained"
          onPress={() => handleShowDialog(props.data.id)}>
          Beli {curencyFormat(props.data.price || 0)}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#0000000d',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowBaseline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  mbMinus: {
    marginBottom: -4,
  },
});
