import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View, Image, TextInput, Pressable, StatusBar, Alert, ScrollView, Modal } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DetailsScreen = () => {
  const route = useRoute();
  const { movieId } = route.params;
  const [movieDetails, setMovieDetails] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=e3cb52fd70afa367f679dfcf6033d0da`
        );
        setMovieDetails(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    getDetails();
  }, [movieId]);

  const goToBack = () => {
    navigation.navigate('Main');
  };

  return (
    <ImageBackground source={require('../assets/cinema_background.jpg')} style={{flex: 1, resizeMode: 'cover',}} blurRadius={15}>
      <View style={{ marginTop: 15 }} /*style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}*/>
        {movieDetails ? (
          <>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              <View style={{ gap: 15, flexDirection: "row" }}>
                <Ionicons name="arrow-back-sharp" size={24} color="white" onPress={goToBack} />
                <Text style={{fontSize: 20, fontWeight: "700", color: 'white' }}>{movieDetails.title}</Text>
              </View>
              <FontAwesome name="bookmark" size={24} color="white" style={{marginRight: 15}} />
            </View>
            <View style={{marginTop: 25}}>
              {movieDetails.poster_path ? (
                <View style={{ position: 'relative' }}>
                  <Text style={{ color: "white", fontSize: 15, fontWeight: "600", backgroundColor: "red", borderBottomRightRadius: 15, padding: 5, width: 50, textAlign: "center", position: 'absolute', top: 0, left: "5%", zIndex: 5, borderTopLeftRadius: 10 }}>{movieDetails.vote_average}</Text>
                  <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` }} style={{ borderRadius: 10, width: "90%", height: 500, marginLeft: "5%" }} />
                </View>
              ) : (
                <LoaderKit style={{ width: 50, height: 50 }} name={'BallPulse'} size={50} color={'red'} />
              )}
            </View>
            <Text style={{fontSize: 16, color: "white", width: "90%", marginLeft: "5%", marginTop: 15}}>{movieDetails.overview}</Text>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </ImageBackground>
  );
};

export default DetailsScreen;
