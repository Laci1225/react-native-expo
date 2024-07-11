import React from "react";
import {Screen} from "react-native-screens";
import {Button, Text} from "react-native";
import {useNavigation, useRouter} from "expo-router";

export default function Home() {
    const router = useRouter();

    const onNativeLogin = () => {
        router.push('/');
    };
    return (
        <Screen>
            <Text>Welcome to the app!</Text>
            <Button title="Login"/>
            <Button title="Navigate to Login" onPress={() =>onNativeLogin()} />
        </Screen>
    );
}