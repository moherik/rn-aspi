/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useNavigation} from '@react-navigation/core';
import {ScrollView, View, Text, Image} from 'react-native';
import {Button, Caption, Snackbar, TextInput, Title} from 'react-native-paper';
import {AuthContext} from '../App';

export const LoginPage = () => {
  const navigation = useNavigation();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const {signIn} = React.useContext(AuthContext);

  const handleSignin = async () => {
    setIsLoading(true);
    await signIn(username, password)
      .catch(_err => setHasError(true))
      .finally(() => setIsLoading(false));
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      style={{backgroundColor: 'white', padding: 15}}>
      <Snackbar visible={hasError} onDismiss={() => setHasError(false)}>
        Username dan password tidak cocok
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
          style={{marginBottom: 15}}
        />
        <Button
          mode="contained"
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
    </ScrollView>
  );
};
