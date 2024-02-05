import { ImageBackground, StyleSheet, Text, View, Image, TextInput, Pressable, StatusBar, Dimensions, Alert } from 'react-native';
import { MaterialIcons, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
const RegisterScreen = () => {
  const [fullname, setFullname] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedImage, setSelectedImage] = useState('');
  const [base64Value, setBase64Value] = useState('');
  const navigation = useNavigation()

  const pickImage = async () => {
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4], // Bu satırı geçici olarak yorum satırı yapabilir veya kaldırabilirsiniz.
        quality: 1,
      });
      
    console.log(result.assets[0].uri);
    if (result.assets[0].uri) {
        console.log(result.assets[0].uri);
        try {
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          setSelectedImage(base64)
          setBase64Value("data:image/jpeg;base64," + base64);
          console.log(base64);
        } catch (base64Error) {
          console.error('Error converting to base64:', base64Error);
        }
    }
      
  } catch (error) {
    console.error('Error picking image:', error);
  }
};
const handleRegister = async () => {
  const user = {
    fullName: fullname,
    username: username,
    email: email,
    password: password,
    profilePicture: base64Value
  };
  console.log(base64Value);
  try {
    const response = await axios.post("http://192.168.30.159:3000/register", user);
    console.log(response);
    Alert.alert("Registration successful. You have been registered successfully");
    setFullname("");
    setEmail("");
    setUsername("")
    setPassword("");
  } catch (error) {
    Alert.alert("Registration failed. An error occurred during registration");
    console.log("error: ", error);
  }
};
  return (
    <ImageBackground source={require('../assets/clapperboard.jpg')} style={styles.backgroundImage} blurRadius={4}>
      <StatusBar backgroundColor="#ff0000" barStyle="light-content" />
      <View style={styles.overlay}>
        <Text style={styles.text}>Register to MovieApp</Text>
        <View style={{width: 100, height: 100, justifyContent: 'center', alignItems: 'center', borderRadius: 100, marginVertical:15}}>
        {base64Value ? (
            <Image source={{ uri: base64Value }} style={{ width: 100, height: 100, borderRadius: 100 }} />
        ) : (
            <Pressable onPress={pickImage}>
                <MaterialIcons name="add-a-photo" size={33} color="white" style={{ backgroundColor: "#ea1124", padding: 35, borderRadius: 100 }} />
            </Pressable>
        )}
        </View>
        <View style={{width: 350, flexDirection: "row", alignItems: "center", gap: 10, borderColor: "#d0d0d0", borderWidth: 1, paddingVertical:5, borderRadius:5, marginVertical: 20}}>
          <Ionicons name="person" size={24} color="white"  style={{marginLeft:15}} />
          <TextInput value={fullname} onChangeText={(text) => setFullname(text)} style={{width:300, color: "white", marginVertical: 10, paddingTop: 2}} placeholder='Enter your fullname' placeholderTextColor='white'/>
        </View>
        <View style={{width: 350, flexDirection: "row", alignItems: "center", gap: 10, borderColor: "#d0d0d0", borderWidth: 1, paddingVertical:5, borderRadius:5, marginVertical: 20}}>
          <MaterialIcons name="alternate-email" size={24} color="white"  style={{marginLeft:15}} />
          <TextInput value={username} onChangeText={(text) => setUsername(text)} style={{width:300, color: "white", marginVertical: 10, paddingTop: 2}} placeholder='Enter your username' placeholderTextColor='white'/>
        </View>
        <View style={{width: 350, flexDirection: "row", alignItems: "center", gap: 10, borderColor: "#d0d0d0", borderWidth: 1, paddingVertical:5, borderRadius:5, marginVertical: 20}}>
          <MaterialCommunityIcons name="email" size={24} color="white"  style={{marginLeft:15}} />
          <TextInput  value={email} onChangeText={(text) => setEmail(text)} style={{width:300, color: "white", marginVertical: 10, paddingTop: 2}} placeholder='Enter your email address' placeholderTextColor='white'/>
        </View>
        <View style={{width: 350, flexDirection: "row", alignItems: "center", gap: 10, borderColor: "#d0d0d0", borderWidth: 1, paddingVertical:5, borderRadius:5, marginVertical: 20}}>
          <MaterialIcons name="vpn-key" size={24} color="white" style={{marginLeft:15}} />
          <TextInput value={password} onChangeText={(text) => setPassword(text)} style={{width:300, color: "white", marginVertical: 10, paddingTop: 2}} placeholder='Enter your password' placeholderTextColor='white'/>
        </View>
        <View style={{width: 350}}>
          <Pressable onPress={handleRegister} style={{ backgroundColor: "#ea1124", marginVertical: 10, borderRadius: 10}}>
            <Text style={{color: "white", textAlign: "center", paddingVertical:20, fontSize:18}}>Register</Text>
          </Pressable>
        </View>
        <View style={{ width:350, marginVertical: 5, flexDirection: 'row', justifyContent: 'center' }}>
          <Pressable onPress={()=> navigation.navigate('Login')}>
            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', padding: 15 }}>Already have an account? Login</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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

export default RegisterScreen;
