/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ImageBackground, ScrollView, View, Linking, Text} from 'react-native';
import {
  Button,
  Title,
  Caption,
  ActivityIndicator,
  Colors,
  IconButton,
  Subheading,
  Snackbar,
} from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';
import {Buffer} from 'buffer';
global.Buffer = Buffer;

import {AuthContext} from '../App';

import {PacketItem} from './PacketItem';
import styles from './Style';
import {PacketType} from './Type';

import axios from 'axios';
import {API_URL} from './Constant';
import {curencyFormat, formatStrDate} from './utils';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {Image} from 'react-native';

type PaymentPayload = {
  orderId: string;
  payDate: string;
  unpaid: number;
  total_price: number;
  packet: {
    name: string;
    speed: string;
    price: string;
  };
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
  const [loadingPay, setLoadingPay] = React.useState(false);
  const [update, setUpdate] = React.useState(0);
  const [status, setStatus] = React.useState<
    'LOADING' | 'PENDING' | 'WAITING' | 'SUCCESS'
  >('LOADING');

  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState<string | undefined>('');
  const [title, setTitle] = React.useState<string | undefined>('');

  const onDismissSnackBar = () => setVisible(false);

  const [trxDetail, setTrxDetail] = React.useState<{
    payment_code: string;
    gross_amount: string;
    store: string;
    transaction_status: string;
    payment_type: string;
    va_numbers: [
      {
        bank: string;
        va_number: string;
      },
    ];
  }>({
    payment_code: '',
    gross_amount: '',
    store: '',
    transaction_status: '',
    payment_type: '',
    va_numbers: [{bank: '', va_number: ''}],
  });

  const {signOut, state} = React.useContext(AuthContext);

  const handlePay = async (orderId: string) => {
    setLoadingPay(true);
    await axios
      .get(`${API_URL}/transactions/pay/${orderId}`, {
        headers: {Authorization: `Bearer ${state.userToken}`},
      })
      .then(response => {
        openLink(response.data.url);
      })
      .catch(err => console.error(err.response.data))
      .finally(() => setLoadingPay(false));
  };

  const openLink = async (url: string) => {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, {
        showTitle: true,
        toolbarColor: '#6200EE',
        secondaryToolbarColor: 'black',
        navigationBarColor: 'black',
        navigationBarDividerColor: 'white',
        enableUrlBarHiding: true,
        forceCloseOnRedirection: false,
        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_left',
          endExit: 'slide_out_right',
        },
      });
    } else {
      Linking.openURL(url);
    }
  };

  const getOrderDetail = async (trxCode: string) => {
    const serverKey = Buffer.from('SB-Mid-server-eTSr0VeD0QjZWQ1IHdWp_qTY:');

    await axios
      .get(`https://api.sandbox.midtrans.com/v2/${trxCode}/status`, {
        headers: {
          Accept: 'application/json',
          ContentType: 'appliaction/json',
          Authorization: `Basic ${serverKey.toString('base64')}`,
        },
      })
      .then(response => {
        setTrxDetail(response.data);
      })
      .catch(err => console.error(err.response.data));
  };

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
        .get(`${API_URL}/transactions/check`, options)
        .then(response => {
          if (response.data.status === 'PENDING') {
            getTotalPayment();
          } else {
            setPayment(response.data);
            setStatus(response.data.status);
            getOrderDetail(response.data.trx_code);
          }
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

    const getTotalPayment = async () => {
      await axios
        .get(`${API_URL}/transactions/total-payment`, {
          headers: {Authorization: `Bearer ${state.userToken}`},
        })
        .then(res => {
          setStatus('PENDING');
          setPayment(res.data);
          console.log(res.data);
        })
        .catch(err => console.error(err.response.data));
    };

    bootstrap();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setMessage(remoteMessage.notification?.body);
      setTitle(remoteMessage.notification?.title);
      setVisible(!visible);
    });

    return unsubscribe;
  }, [state, update, visible]);

  return (
    <>
      <Snackbar visible={visible} onDismiss={onDismissSnackBar}>
        {title}: {message}
      </Snackbar>
      <ScrollView style={{backgroundColor: 'white', flex: 1}}>
        <ImageBackground
          source={require('../image/bg.jpg')}
          style={{
            flexDirection: 'column',
            paddingBottom: 40,
            paddingTop: 20,
            paddingHorizontal: 20,
            minHeight: 200,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
                onPress={() => setUpdate(update + 1)}
              />
              <IconButton
                rippleColor={Colors.red500}
                color="white"
                icon="logout"
                onPress={() => signOut()}
              />
            </View>
          </View>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../image/brand.png')}
              style={{flex: 1, width: 200, height: 100, resizeMode: 'contain'}}
            />
          </View>
        </ImageBackground>

        <View
          style={{
            paddingHorizontal: 15,
            paddingVertical: 5,
          }}>
          <Caption>
            {status === 'SUCCESS' ? 'Paket Aktif' : 'Tagihan Bulan Ini'}
          </Caption>
        </View>

        {status === 'LOADING' ? (
          <ActivityIndicator
            style={{marginTop: 50}}
            animating={true}
            color={Colors.amber400}
            size={30}
          />
        ) : status === 'PENDING' ? (
          <View style={styles.box}>
            <View style={styles.rowCenter}>
              <View>
                <Title>{curencyFormat(payment?.unpaid || 0)}</Title>
                <Caption>Bayar segera sebelum tanggal:</Caption>
                <Caption style={{marginTop: -2}}>
                  {formatStrDate(payment?.payDate!!)}
                </Caption>
              </View>
              <Button
                mode="contained"
                loading={loadingPay}
                onPress={() => handlePay(payment?.orderId!!)}>
                Bayar
              </Button>
            </View>
          </View>
        ) : status === 'WAITING' ? (
          <View style={styles.box}>
            <View style={styles.rowCenter}>
              <View>
                <Title>{curencyFormat(payment?.total_price || 0)}</Title>
                <Caption>
                  {trxDetail.transaction_status === 'pending'
                    ? 'Segera selesaikan pembayaran:'
                    : ''}
                </Caption>
                <Caption
                  style={{
                    marginTop: -4,
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                  }}>
                  {trxDetail.payment_type} {trxDetail.store || ''}
                </Caption>
                {trxDetail.va_numbers.length > 0 ? (
                  trxDetail.va_numbers.map(va => (
                    <Caption style={{marginTop: -4}}>
                      <Text
                        style={{
                          textTransform: 'uppercase',
                        }}>{`VA ${va.bank}`}</Text>
                      : {va.va_number}
                    </Caption>
                  ))
                ) : (
                  <Caption style={{marginTop: -4}}>
                    Kode transaksi: {trxDetail.payment_code}
                  </Caption>
                )}
              </View>
            </View>
          </View>
        ) : status === 'SUCCESS' ? (
          <View style={styles.box}>
            <Title>{payment?.packet?.name}</Title>
            <Caption
              style={{
                marginTop: -3,
                marginBottom: 10,
              }}>
              {`Speed: ${payment?.packet.speed} Mbps`} |{' '}
              {curencyFormat(+payment?.packet.price!!)}
            </Caption>
          </View>
        ) : null}

        {isLoading ? (
          <ActivityIndicator
            style={{marginTop: 50}}
            animating={true}
            color={Colors.amber400}
            size={30}
          />
        ) : (
          packets.map(packet => (
            <PacketItem
              type="home"
              key={packet.id}
              data={packet}
              refresh={() => setUpdate(update + 1)}
            />
          ))
        )}
      </ScrollView>
    </>
  );
};
