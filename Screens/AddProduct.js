import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { getProducts, saveProducts } from '../utils/Storage';
import * as ImagePicker from 'expo-image-picker';

export default function AddProductScreen({ navigation }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to access your media library.');
      }
    })();
  }, []);

  const chooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const addProduct = async () => {
    if (!name || !price) {
      Alert.alert('Validation', 'Name and price are required');
      return;
    }

    const existing = await getProducts();
    const duplicate = existing.find((p) => p.name === name);
    if (duplicate) {
      Alert.alert('Duplicate', 'Product with this name already exists');
      return;
    }

    const newProduct = { name, price, image };
    const updated = [...existing, newProduct];
    await saveProducts(updated);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Product Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Price"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={chooseImage} style={styles.imagePicker}>
        <Text>{image ? 'Change Image' : 'Choose Image'}</Text>
      </TouchableOpacity>
      {image ? (
        <Image source={{ uri: image }} style={styles.preview} />
      ) : null}
      <TouchableOpacity onPress={addProduct} style={styles.addBtn}>
        <Text style={styles.addText}>Add Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderColor: '#ccc',
  },
  imagePicker: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderColor: '#ccc',
  },
  preview: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 10,
  },
  addBtn: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 10,
  },
  addText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
  },
});
