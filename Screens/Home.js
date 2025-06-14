import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
  Button,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getProducts, saveProducts } from '../utils/Storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultImage = 'https://placehold.jp/24/cccccc/ffffff/300x200.png';

export default function HomeScreen({ navigation, setIsLoggedIn }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadProducts();
    }
  }, [isFocused]);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const deleteProduct = async (name) => {
    const filtered = products.filter((p) => p.name !== name);
    await saveProducts(filtered);
    setProducts(filtered);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setIsLoggedIn(false); // This will trigger navigator to show Login screen
    } catch (error) {
      Alert.alert('Logout Error', 'Failed to logout. Please try again.');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.ontainerview}>
        {/* Logout Button */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
          <Button title="Logout" onPress={logout} color="#007bff" />
        </View>

        <TextInput
          placeholder="Search Products..."
          style={styles.search}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {filteredProducts.length === 0 ? (
          <Text>No Product Found</Text>
        ) : (
          <FlatList
            data={filteredProducts}
            key={'grid'}
            keyExtractor={(item) => item.name}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image
                  source={{ uri: item.image || defaultImage }}
                  style={styles.img}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => deleteProduct(item.name)}
                >
                  <MaterialIcons name="delete-outline" size={24} color="#000000" />
                </TouchableOpacity>
                <View style={styles.infoContainer}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>Rs.{item.price}</Text>
                </View>
              </View>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  ontainerview: { flex: 1, padding: 16 },
  search: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#ccc',
  },
  listContainer: {
    paddingBottom: 100,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    position: 'relative',
  },
  img: {
    width: '100%',
    height: 120,
  },
  deleteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
    elevation: 4,
  },
  infoContainer: {
    padding: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    backgroundColor: '#007bff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 3 },
    shadowRadius: 3,
  },
  fabIcon: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
});
