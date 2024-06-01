import { API_KEY, BASE_URL, SERVER } from '@env';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View, Image, TextInput, Pressable, StatusBar, Alert, ScrollView, Modal } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DetailsScreen = () => {
  const genreMapping = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western',
    9648: 'Mystery',
    10402: 'Music'
  };
  const route = useRoute();
  const { movieId } = route.params;
  const [movieDetails, setMovieDetails] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
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
                <Ionicons name="arrow-back-sharp" size={24} style={{marginTop: 2}} color="white" onPress={goToBack} />
                <Text style={{fontSize: 20, fontWeight: "700", color: 'white' }}>{movieDetails.title}</Text>
              </View>
              <Feather name="bookmark" size={24} color="white" style={{marginRight: 15, marginTop: 5}} />
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
            {movieDetails?.genre_ids?.map((genreId) => (
              <Text key={genreId}>{genreMapping[genreId]}</Text>
            ))}

            <Text>{movieDetails.genre_ids}</Text>

          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </ImageBackground>
  );
};

export default DetailsScreen;
