import { StyleSheet, Text, View, TextInput } from 'react-native';
import React, { useEffect } from 'react';
import { useState } from 'react';

const App = () => {

  const [data, setData] = useState([]);
  const searchUser = async (text) => {
    const url = 'https://jsonplaceholder.typicode.com/posts/1';
    console.warn(url);
    let result = await fetch(url);
    result = await result.json();
    console.log(text)
    if (result) {
      setData(result)
    }
    //useEffect(()=> {
    //searchUser();
    //},[])
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={'Search'}
        onChangeText={(text) => searchUser(text)}
      />
      {
        data.length ?
          data.map((item) => <View
            style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 20 }}>{item.name}</Text>
            <Text style={{ fontSize: 20 }}>{item.age}</Text>
            <Text style={{ fontSize: 20 }}>{item.email}</Text>
          </View>)
          : null
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderColor: "blue",
    borderWidth: 1,
    fontSize: 20,
    padding: 10
  }
});

export default App;