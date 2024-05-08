import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import MyAccountScreen from './screens/MyAccountScreen';
import SavedScreen from './screens/SavedScreen';
import DetailsScreen from './screens/DetailsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, AntDesign, Ionicons, FontAwesome  } from '@expo/vector-icons';
const StackNavigator = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  
  function BottomTabs() {
    return (
      <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#ff0000' }, // Burada arkaplan rengini saydam yapabilirsiniz
        tabBarLabelStyle: { color: '#ff0000' }, // Aktif ve pasif sekmelerin metin rengi
      }}
    >
        <Tab.Screen 
          name='Home' 
          component={HomeScreen} 
            options={{
              tabBarLabel: "", 
              tabBarLabelStyle:{color:"black"}, 
              headerShown: false, 
              tabBarIcon:({focused}) => focused ? (
                <Entypo name="home" size={24} color="white" />
              ) : (
                <AntDesign name="home" size={24} color="white" />
              )
            }
          } 
        />
        <Tab.Screen 
          name='Saved' 
          component={SavedScreen} 
            options={{
              tabBarLabel: "", 
              tabBarLabelStyle:{color:"black"}, 
              headerShown: false, 
              tabBarIcon:({focused}) => focused ? (
                <FontAwesome name="bookmark" size={24} color="white" />
              ) : (
                <FontAwesome name="bookmark-o" size={24} color="white" />
              )
            }
          } 
        />
        <Tab.Screen 
          name='MyAccount' 
          component={MyAccountScreen} 
            options={{
              tabBarLabel: "", 
              tabBarLabelStyle:{color:"black"}, 
              headerShown: false, 
              tabBarIcon:({focused}) => focused ? (
                <Ionicons name="person" size={24} color="white" />
              ) : (
                <Ionicons name="person-outline" size={24} color="white" />
              )
            }
          } 
        />
      </Tab.Navigator>
    )
  }
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{headerShown: false}} />
        <Stack.Screen name="DetailsScreen" component={DetailsScreen} options={{headerShown: false}} />
        <Stack.Screen name="Main" component={BottomTabs} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default StackNavigator;