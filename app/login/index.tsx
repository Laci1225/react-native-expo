import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, Button} from 'react-native'; // Import AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter} from "expo-router";

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('06203373041');
    const [userId, setUserId] = useState(1);
    const [birthdate, setBirthdate] = useState('2002-12-25');
    const [nickname, setNickname] = useState('UserName');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        // Perform login/authentication logic (phone number verification, etc.)
        // Once authenticated, store user data locally
        try {
            await AsyncStorage.setItem('phoneNumber', phoneNumber);
            await AsyncStorage.setItem('birthdate', birthdate);
            await AsyncStorage.setItem('nickname', nickname);
            await AsyncStorage.setItem('userId', userId.toString());
            setIsLoggedIn(true);
            //naivate to main
            router.push('/main');

        } catch (error) {
            console.error('Error storing data:', error);
        }
    };

    const handleLogout = async () => {
        // Clear stored user data when logging out
        try {
            await AsyncStorage.multiRemove(['phoneNumber', 'birthdate', 'nickname', 'userId']);
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Error clearing data:', error);
        }
    };

    const checkLoginStatus = async () => {
        // Check if user is already logged in
        try {
            const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
            if (storedPhoneNumber !== null) {
                setIsLoggedIn(true);
                // Optionally, load additional user data if needed
                // const storedBirthdate = await AsyncStorage.getItem('birthdate');
                // const storedNickname = await AsyncStorage.getItem('nickname');
            }
        } catch (error) {
            console.error('Error checking login status:', error);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <View>
            {isLoggedIn ? (
                <View>
                    <Text>Welcome back!</Text>
                    <Button title="Logout" onPress={handleLogout} />
                </View>
            ) : (
                <View>
                    <Text>Please log in:</Text>
                    <TextInput
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                    <TextInput
                        placeholder="Birthdate"
                        value={birthdate}
                        onChangeText={setBirthdate}
                    />
                    <TextInput
                        placeholder="Nickname"
                        value={nickname}
                        onChangeText={setNickname}
                    />
                    <Button title="Login" onPress={handleLogin} />
                </View>
            )}
        </View>
    );
};

export default LoginScreen;
