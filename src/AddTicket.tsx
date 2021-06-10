/* eslint-disable react-native/no-inline-styles */
import {useNavigation, useRoute} from '@react-navigation/core';
import axios from 'axios';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Appbar, Button, TextInput} from 'react-native-paper';
import {AuthContext} from '../App';
import {API_URL} from './Constant';
import styles from './Style';

export const AddTicketPage = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const {state} = React.useContext(AuthContext);

  const handleAddTicket = async () => {
    const axiosOpts = {
      headers: {Authorization: `Bearer ${state.userToken}`},
    };

    setIsLoading(true);
    await axios
      .post(`${API_URL}/tickets`, {title, body}, axiosOpts)
      .then(response => {
        if (response.status === 200) {
          route.params?.onGoBack();
          navigation.goBack();
        }
      })
      .catch(err => console.error(err.response.data))
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Buat Tiket Baru" />
      </Appbar.Header>

      <ScrollView style={styles.bgWhite}>
        <View style={{padding: 15}}>
          <TextInput
            label="Apa yang anda keluhkan?"
            value={title}
            onChangeText={value => setTitle(value)}
            style={{marginBottom: 15}}
          />
          <TextInput
            label="Jelaskan kepada kami"
            value={body}
            multiline
            numberOfLines={10}
            onChangeText={value => setBody(value)}
            style={{marginBottom: 15}}
          />
          <Button
            mode="contained"
            loading={isLoading}
            onPress={() => handleAddTicket()}
            uppercase
            style={{paddingVertical: 8}}>
            Buat
          </Button>
        </View>
      </ScrollView>
    </>
  );
};
