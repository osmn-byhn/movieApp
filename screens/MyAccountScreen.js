import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';


const MyAccountScreen = () => {
  const navigation = useNavigation()
  const logOut = () => {
    AsyncStorage.clear();
    navigation.navigate("Login")
  }
  return (
    <View>
      <Text>MyAccountScreen</Text>
      <Pressable onPress={logOut}>
        <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', padding: 15 }}>Çıkış Yap</Text>
      </Pressable>
    </View>
  )
}

export default MyAccountScreen

const styles = StyleSheet.create({})