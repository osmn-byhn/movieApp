import { ImageBackground, StyleSheet, Text, View, Image, TextInput, Pressable, StatusBar, Alert } from 'react-native';
import {  Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("")
  const navigation = useNavigation()

  const sendLink = async () => {
    const user = {
      email: email
    };
    try {
      const response = await axios.post("http://192.168.93.159:3000/setting-code", user);
      console.log(response);
      const token = response.data.token;
      Alert.alert("Check your mail for reset password link");
    } catch (error) {
      Alert.alert("This user is not found");
      console.log("error: ", error);
    }
  };
  return (
    <ImageBackground source={require('../assets/clapperboard.jpg')} style={styles.backgroundImage} blurRadius={4}>
      <StatusBar backgroundColor="#ff0000" barStyle="light-content" />
      <View style={styles.overlay}>
        <Text style={styles.text}>Reset Your Password</Text>
        <View style={{width: 350, flexDirection: "row", alignItems: "center", gap: 10, borderColor: "#d0d0d0", borderWidth: 1, paddingVertical:5, borderRadius:5, marginVertical: 20}}>
          <Ionicons name="person" size={24} color="white"  style={{marginLeft:15}} />
          <TextInput value={email} onChangeText={(text) => setEmail(text)}  style={{width:300, color: "white", marginVertical: 10, paddingTop: 2}} placeholder='Enter your email' placeholderTextColor='white'/>
        </View>
        <View style={{width: 350}}>
          <Pressable onPress={sendLink} style={{ backgroundColor: "#ea1124", marginVertical: 10, borderRadius: 10}}>
            <Text style={{color: "white", textAlign: "center", paddingVertical:20, fontSize:18}}>Reset Password</Text>
          </Pressable>
        </View>
        <View style={{ width:350, marginVertical: 5, flexDirection: 'row', justifyContent: 'center' }}>
          <Pressable onPress={()=> navigation.navigate('Login')}>
            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', padding: 15 }}>Back to Login</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Resmi kaplamak için
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Griye yakın bir filtre
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: "600"
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 100
  }
});

export default ForgotPasswordScreen;
