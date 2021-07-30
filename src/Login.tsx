/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useNavigation} from '@react-navigation/core';
import {ScrollView, View, Text, Image} from 'react-native';
import {
  Button,
  Caption,
  Dialog,
  Portal,
  Snackbar,
  TextInput,
} from 'react-native-paper';
import {AuthContext} from '../App';
import axios from 'axios';
import {API_URL} from './Constant';

export const LoginPage = () => {
  const navigation = useNavigation();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingReset, setIsLoadingReset] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [errorMesage, setErrorMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);

  const {signIn} = React.useContext(AuthContext);

  const showDialog = () => setVisible(true);

  const hideDialog = () => {
    setIsLoadingReset(false);
    setVisible(false);
  };

  const handleSignin = async () => {
    setIsLoading(true);
    await signIn(username, password)
      .catch(() => {
        showError('Username dan password tidak cocok');
      })
      .finally(() => setIsLoading(false));
  };

  const handleResetPassword = async () => {
    setIsLoadingReset(true);
    await axios
      .post(`${API_URL}/auth/forgot-password`, {email})
      .then(response => {
        if (response.status === 200) {
          setVisible(false);
        }
      })
      .catch(error => {
        console.log(error.response.data);
        showError('Terjadi kesalahan saat mengirim link ke email');
      })
      .finally(() => setIsLoadingReset(false));
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setHasError(true);
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      style={{backgroundColor: 'white', padding: 15}}>
      <Snackbar visible={hasError} onDismiss={() => setHasError(false)}>
        {errorMesage || 'Terjadi kesalahan.'}
      </Snackbar>

      <View style={{marginBottom: 20, alignItems: 'center'}}>
        <Image
          source={require('../image/brand.png')}
          style={{flex: 1, width: 200, height: 100, resizeMode: 'contain'}}
        />
        <Caption style={{textAlign: 'center'}}>
          Masuk menggunakan username dan password untuk dapat mengakses aplikasi
        </Caption>
      </View>

      <View style={{marginBottom: 20}}>
        <TextInput
          label="Username"
          value={username}
          onChangeText={value => setUsername(value)}
          style={{marginBottom: 15}}
        />
        <TextInput
          label="Password"
          value={password}
          textContentType="password"
          onChangeText={value => setPassword(value)}
          style={{marginBottom: 5}}
        />
        <Caption style={{marginBottom: 15}}>
          <Text style={{color: 'tomato'}} onPress={showDialog}>
            Lupa Kata Sandi?
          </Text>
        </Caption>

        <Button
          mode="contained"
          disabled={username === '' || password === ''}
          loading={isLoading}
          onPress={() => handleSignin()}
          uppercase
          style={{paddingVertical: 8}}>
          Masuk
        </Button>
      </View>

      <View>
        <Caption>
          Belum punya akun?{' '}
          <Text
            style={{color: 'tomato'}}
            onPress={() => navigation.navigate('Register')}>
            Daftar Sekarang
          </Text>
        </Caption>
      </View>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Reset Kata Sandi</Dialog.Title>
          <Dialog.Content>
            <Caption>
              Masukkan email anda untuk mendapatkan link reset password
            </Caption>
            <TextInput
              style={{marginTop: 5}}
              label="Email"
              placeholder="mail@example.com"
              value={email}
              onChangeText={value => setEmail(value)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <View
              style={{
                flexDirection: 'row',
                margin: 20,
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Button onPress={hideDialog}>Batal</Button>
              <Button
                disabled={email === ''}
                loading={isLoadingReset}
                onPress={handleResetPassword}
                mode="contained">
                Kirim
              </Button>
            </View>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};
