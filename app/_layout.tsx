import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, {useEffect} from 'react';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import HomeScreen from "@/app/main";
import CameraScreen from "@/app/camera";
import {createStackNavigator} from "@react-navigation/stack";
import LoginScreen from "@/app/login";
import BeRealDetailsScreen from "@/app/myberealdetails";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();


export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }
    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack.Navigator
                screenOptions={{
                    gestureDirection: 'horizontal',
                    headerShown: false,
                    cardStyleInterpolator: ({current, layouts}) => {
                        return {
                            cardStyle: {
                                transform: [
                                    {
                                        translateX: current.progress.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [layouts.screen.width, 0],
                                        }),
                                    },
                                ],
                            },
                        };
                    },
                }}
                initialRouteName={"login"}>
                <Stack.Screen name="main" component={HomeScreen} options={{headerShown: false}}/>
                <Stack.Screen name="login" component={LoginScreen} options={{headerShown: false}}/>
                <Stack.Screen name="myberealdetails" component={BeRealDetailsScreen} options={{headerShown: false}}/>
                <Stack.Screen name="camera" component={CameraScreen} options={{headerShown: false}}/>
            </Stack.Navigator>
        </ThemeProvider>
    )/*
  return <HomeScreen />;
  //return <Stack />;

    return (
        <NavigationContainer>
          <Stack >
            <Stack.Screen name="main"/>
            {/* Add other screens here *//*}
          </Stack>
        </NavigationContainer>
    );
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );*/
}
