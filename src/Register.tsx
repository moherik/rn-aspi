/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useNavigation} from '@react-navigation/core';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import {
  Appbar,
  Button,
  Caption,
  TextInput,
  RadioButton,
  Snackbar,
} from 'react-native-paper';
import {AuthContext} from '../App';

export const RegisterPage = () => {
  const navigation = useNavigation();
  const [name, setName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [gender, setGender] = React.useState('');

  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const {signUp} = React.useContext(AuthContext);

  const register = async () => {
    setIsLoading(true);
    await signUp({name, username, password, email, phone, address, gender})
      .catch(_err => setHasError(true))
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Daftar Akun" />
      </Appbar.Header>
      <ScrollView style={{backgroundColor: 'white'}}>
        <Snackbar visible={hasError} onDismiss={() => setHasError(false)}>
          Terjadi kesalahan
        </Snackbar>
        <View style={{padding: 15}}>
          <View style={{marginBottom: 20}}>
            <TextInput
              label="Nama"
              value={name}
              onChangeText={value => setName(value)}
              style={styles.input}
            />
            <TextInput
              label="Username"
              value={username}
              onChangeText={value => setUsername(value)}
              style={styles.input}
            />
            <TextInput
              label="Password"
              value={password}
              textContentType="password"
              onChangeText={value => setPassword(value)}
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={email}
              onChangeText={value => setEmail(value)}
              style={styles.input}
            />
            <TextInput
              label="Nomor Telepon"
              value={phone}
              onChangeText={value => setPhone(value)}
              style={styles.input}
            />
            <TextInput
              label="Alamat"
              value={address}
              onChangeText={value => setAddress(value)}
              style={styles.input}
            />
            <RadioButton.Group
              value={gender}
              onValueChange={value => setGender(value)}>
              <RadioButton.Item color="tomato" label="Laki-Laki" value="MALE" />
              <RadioButton.Item
                color="tomato"
                label="Perempuan"
                value="FEMALE"
              />
            </RadioButton.Group>
            <Button
              mode="contained"
              loading={isLoading}
              onPress={() => register()}
              uppercase
              style={{paddingVertical: 8, marginTop: 15}}>
              Daftar
            </Button>
          </View>

          <View>
            <Caption>
              Sudah punya akun?{' '}
              <Text
                style={{color: 'tomato'}}
                onPress={() => navigation.navigate('Login')}>
                Masuk
              </Text>
            </Caption>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 15,
  },
});
