import { ImageBackground, StyleSheet, Text, View, Image, TextInput, Pressable, StatusBar } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
const LoginScreen = () => {
  const navigation = useNavigation()
  return (
    <ImageBackground source={require('../assets/clapperboard.jpg')} style={styles.backgroundImage} blurRadius={4}>
      <StatusBar backgroundColor="#ff0000" barStyle="light-content" />
      <View style={styles.overlay}>
        <Text style={styles.text}>Welcome to again...</Text>
        <View style={{width: 350, flexDirection: "row", alignItems: "center", gap: 10, borderColor: "#d0d0d0", borderWidth: 1, paddingVertical:5, borderRadius:5, marginVertical: 20}}>
          <Ionicons name="person" size={24} color="white"  style={{marginLeft:15}} />
          <TextInput  style={{width:300, color: "white", marginVertical: 10, paddingTop: 2}} placeholder='Enter your email' placeholderTextColor='white'/>
        </View>
        <View style={{width: 350, flexDirection: "row", alignItems: "center", gap: 10, borderColor: "#d0d0d0", borderWidth: 1, paddingVertical:5, borderRadius:5, marginVertical: 20}}>
          <MaterialIcons name="vpn-key" size={24} color="white" style={{marginLeft:15}} />
          <TextInput  style={{width:300, color: "white", marginVertical: 10, paddingTop: 2}} placeholder='Enter your password' placeholderTextColor='white'/>
        </View>
        <View style={{width: 350}}>
          <Pressable style={{ backgroundColor: "#ea1124", marginVertical: 10, borderRadius: 10}}>
            <Text style={{color: "white", textAlign: "center", paddingVertical:20, fontSize:18}}>Login</Text>
          </Pressable>
        </View>
        <View style={{ width:350, marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Pressable onPress={()=> navigation.navigate('Register')}>
            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', padding: 15 }}>Register</Text>
          </Pressable>
          <Pressable onPress={()=> navigation.navigate('ForgotPassword')}>
            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', padding: 15 }}>Forgot Password</Text>
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

export default LoginScreen;
