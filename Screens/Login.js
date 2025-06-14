import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginHandler = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const response = await axios.post(
        'https://reqres.in/api/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'reqres-free-v1',
          },
        }
      );

      await AsyncStorage.setItem('token', response.data.token);
      setIsLoggedIn(true); // ✅ Trigger navigation change in App.js
    } catch (err) {
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <TextInput
        placeholder="Email ID"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.loginBtn} onPress={loginHandler}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  header: { fontSize: 32, fontWeight: 'bold', marginBottom: 30 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  loginBtn: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});
