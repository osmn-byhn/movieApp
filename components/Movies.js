import { StyleSheet, Text, View, ScrollView, Image, onPress, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { SliderBox } from 'react-native-image-slider-box';
import LoaderKit from 'react-native-loader-kit'
import { useNavigation } from '@react-navigation/native';



const Movies = () => {
  
  const [genres, setGenres] = useState([]);
  const navigation = useNavigation();


  const fetchMoviesByGenre = async (genreId) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=e3cb52fd70afa367f679dfcf6033d0da&with_genres=${genreId}`
      );

      const genreDetails = await axios.get(
        `https://api.themoviedb.org/3/genre/${genreId}?api_key=e3cb52fd70afa367f679dfcf6033d0da`
      );

      const genreName = genreDetails.data.name;
      console.log(`Movies for ${genreName}: `, response.data.results);

      // Eğer bu genreId zaten genres state'inde varsa, eklemeyi geç
      if (!genres.some((existingGenre) => existingGenre.id === genreId)) {
        setGenres((prevGenres) => [...prevGenres, { id: genreId, name: genreName, movies: response.data.results }]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchAllMoviesByGenres = async () => {
      const genreIds = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10749, 878, 10770, 53, 10752, 37, 9648, 10402];
      for (const genreId of genreIds) {
        try {
          await fetchMoviesByGenre(genreId);
        } catch (error) {
          console.error(`Error fetching movies for genre ${genreId}:`, error);
        }
      }
    };
    fetchAllMoviesByGenres();
  }, []);

  const goToDetails = (movieId) => {
    navigation.navigate('DetailsScreen', { movieId });
  };

  return (
    <ScrollView style={{ padding: 25, }}>
      {genres.map((genre) => (
        <View key={genre.id} style={{ marginBottom: 20, marginVertical: 15 }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '800', marginBottom: 10 }}>{genre.name}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingRight: 10, marginRight: -10, marginVertical: 15  }}>
            {genre?.movies?.map((movie, index) => (
              <TouchableOpacity onPress={() => goToDetails(movie.id)} style={{ marginRight: 20 }}>
                <View key={index} onPress={goToDetails(movie.id)}>
                  {movie.poster_path ? (
                    <Image
                      source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                      style={{
                        borderRadius: 10,
                        width: 200,
                        height: 250,
                      }}
                    />
                  ) : (
                    <LoaderKit
                      style={{ width: 50, height: 50 }}
                      name={'BallPulse'}
                      size={50}
                      color={'red'}
                    />
                  )}
                  <Text style={{ color: 'white', fontSize: 15, fontWeight: '700', marginTop: 5, width: 170 }} numberOfLines={2}>{movie.original_title}</Text>
                </View>
              </TouchableOpacity>
              
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
};

export default Movies;

const styles = StyleSheet.create({});
