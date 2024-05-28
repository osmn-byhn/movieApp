import { ImageBackground, StyleSheet, Text, View, Image, TextInput, Pressable, StatusBar, Alert, ScrollView, Modal } from 'react-native';
import { AntDesign, FontAwesome  } from '@expo/vector-icons';
import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import { SliderBox } from 'react-native-image-slider-box'
import Movies from '../components/Movies';


const HomeScreen = () => {
  const [movies, setMovies] = useState([]);
  const [newMovies, setNewMovies] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const [softId, setSoftId] = useState("")
  const [fullName, setFullname] = useState("")
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [movieName, setMovieName] = useState("")
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    // TMDb API'dan popüler filmleri çekmek için istek yapma
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=e3cb52fd70afa367f679dfcf6033d0da&language=en-US&page=1`
        );
        setMovies(response.data.results);
        console.log('movies: ', movies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
    const fetchNewMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=e3cb52fd70afa367f679dfcf6033d0da&language=en-US&page=1`
        );

        setNewMovies(response.data.results);
        console.log('new Movies: ', newMovies);
      } catch (error) {
        console.error('Error fetching new movies:', error);
      }
    };
    fetchNewMovies();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        setUserId(token);
        const response = await axios.get(`http://192.168.75.159:3000/decode/${token}`);
        setSoftId(response.data);
        setFullname(softId)
        console.log("softId: ", softId);
      } catch (error) {
        console.log("Error fetching user data: ", error);
      }
    };
    fetchData();
  }, [userId]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://192.168.75.159:3000/profile/${userId}`);
        const userData = response.data;
        setFullname(userData.fullName);
        console.log(fullName);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    if (userId) {
      fetchUser();
    }
  }, [userId]);
  const handleSearchIconPress = () => {
    setSearchModalVisible(true);
  };
  const handleCloseModal = () => {
    setMovieName("")
    setSearchModalVisible(false);
  };
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=e3cb52fd70afa367f679dfcf6033d0da&query=${movieName}`
      );
      setSearchResults(response.data.results);
      console.log('Search results: ', searchResults);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };
  
  
  return (
    <ImageBackground source={require('../assets/cinema_background.jpg')} style={styles.backgroundImage} blurRadius={15}>
      <StatusBar backgroundColor="#ff0000" barStyle="light-content" />
      <ScrollView>
          <View style={{padding: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{color: 'white', fontSize: 23, fontWeight: '600', width: '75%'}}>Hello {fullName}!</Text>
            <View style={{flexDirection: 'row', gap: 15}}>
              <AntDesign name="filter" size={26} color="white" />
              <FontAwesome name="search" size={26} color="white" onPress={handleSearchIconPress} />
            </View>
          </View>
          <Text style={{color: 'white', fontSize: 18, fontWeight: "600", padding: 15}}>Latest Movie</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: -10 }}>
          {newMovies?.map((item, index) => (
            <View key={index}>
              <View>
                <SliderBox 
                  images={[`https://image.tmdb.org/t/p/w500${item.poster_path}`]}
                  autoPlay 
                  circleLoop 
                  dotColor="#13274F" 
                  inactiveDotColor="#90A4AE" 
                  ImageComponentStyle={{
                    borderRadius: 10,
                    width: "94%",
                    height: 500,
                    marginTop: 10
                  }}
                />
              </View>
              <View style={{flexDirection: 'col', paddingLeft: 25, paddingTop: 10}}>
                <View style={{flexDirection: "row", justifyContent: 'space-between'}}>
                  <Text style={{color: 'white', fontSize: 20, fontWeight: '400', paddingTop: 10}}>{item.title}</Text>
                  <Text style={{color: 'white', fontSize: 14, fontWeight: '400', backgroundColor: 'red', paddingVertical: 5, padding: 15, marginTop: 5,  borderRadius: 20, fontWeight: "900", marginRight: 15}}>{item.vote_average}</Text>
                </View>  
              </View>
            </View>
          ))}
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isSearchModalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={{ flexDirection: 'row', gap: 15, justifyContent: 'space-between', borderBottomColor: 'white', borderBottomWidth: 0.8, marginTop: 15 }}>
              <TextInput
                value={movieName}
                onChangeText={(text) => setMovieName(text)}
                placeholder='Enter movie name'
                placeholderTextColor='white'
                style={{ padding: 15, paddingHorizontal: 100, paddingLeft: 1, color: 'white', fontSize: 17 }}
                onSubmitEditing={handleSearch} // Add this line to trigger search on submit
              />
              <Pressable onPress={handleCloseModal} style={{ marginRight: 15, marginTop: 15 }}>
                <AntDesign name="closecircleo" size={24} color="red" />
              </Pressable>
            </View>
            <ScrollView>
              {searchResults.map((result, index) => (
                <View key={index} style={{ padding: 15 }}>
                  <Text style={{ color: 'white', fontSize: 15, fontWeight: '600' }}>{result.title}</Text>
                  {/* Add other details as needed */}
                </View>
              ))}
            </ScrollView>
          </View>
        </Modal>
        <Movies />
      </ScrollView>
    </ImageBackground>
  )
}
export default HomeScreen
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Resmi kaplamak için
  },
  poster: {
    width: 300,
    height: 400,
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 7,
  },
  movieDetails: {
    padding: 10,
    flexDirection: 'column',
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
  },
  type: {
    flex: 1,
    marginTop: 3,
    color: 'gray',
    fontWeight: '500',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  time: {
    color: 'green',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
});