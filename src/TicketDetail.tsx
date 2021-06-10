import {useNavigation, useRoute} from '@react-navigation/core';
import axios from 'axios';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Caption,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';
import {AuthContext} from '../App';
import {API_URL} from './Constant';
import styles from './Style';

type TicketDetail = {
  id: number;
  title: string;
  creator: string;
  created_at: string;
  conversations: Array<Chat>;
};

type Chat = {
  id: number;
  body: string;
  type: string;
  created_at: string;
};

export const TicketDetailPage = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [detail, setDetail] = React.useState<TicketDetail>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [message, setMessage] = React.useState('');

  const {state} = React.useContext(AuthContext);

  const axiosOpts = {
    headers: {Authorization: `Bearer ${state.userToken}`},
  };

  const id = route.params?.id;

  React.useEffect(() => {
    const bootstrap = async () => {
      setIsLoading(true);
      await axios
        .get(`${API_URL}/tickets/${id}/detail`, axiosOpts)
        .then(response => {
          setDetail(response.data);
        })
        .catch(err => console.error(err.response.data))
        .finally(() => setIsLoading(false));
    };

    bootstrap();
  }, []);

  const handleAddChat = async () => {
    setMessage('');
    await axios
      .post(`${API_URL}/tickets/${id}/send`, {body: message}, axiosOpts)
      .then(_response => {
        handleReloadChat();
      })
      .catch(err => console.error(err.response.data))
      .finally(() => setIsLoading(false));
  };

  const handleReloadChat = async () => {
    await axios
      .get(`${API_URL}/tickets/${id}/detail`, axiosOpts)
      .then(response => {
        setDetail(response.data);
      })
      .catch(err => console.error(err.response.data))
      .finally(() => setIsLoading(false));
  };

  if (isLoading) {
    return <ActivityIndicator size={30} style={{marginTop: 20}} />;
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={detail?.title}
          subtitle={detail?.creator + ' | ' + detail?.created_at}
        />
      </Appbar.Header>
      <ScrollView style={styles.bgWhite}>
        <View style={{padding: 15, flexDirection: 'column'}}>
          {detail?.conversations.map(chat => (
            <Surface
              key={chat.id}
              style={chat.type === 'FROM' ? styles.chatFrom : styles.chatTo}>
              <Caption style={styles.textWhite}>{chat.created_at}</Caption>
              <Text style={styles.textWhite}>{chat.body}</Text>
            </Surface>
          ))}
        </View>
      </ScrollView>
      <View>
        <TextInput
          mode="flat"
          autoFocus
          placeholder="Ketik pesan disini, enter untuk mengirim"
          onChangeText={val => setMessage(val)}
          value={message}
          onSubmitEditing={() => handleAddChat()}
        />
      </View>
    </>
  );
};
