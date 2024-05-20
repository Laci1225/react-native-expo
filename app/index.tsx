import useAuth from "@/hooks/useAuth";
import React from "react";
import {Screen} from "react-native-screens";
import {Button, Text} from "react-native";
import {useNavigation, useRouter} from "expo-router";

export default function Home() {
    const { webLogin } = useAuth();
    const router = useRouter();

    const onNativeLogin = () => {
        router.push('/b');
    };
    return (
        <Screen>
            <Text>Welcome to the app!</Text>
            <Button title="Login" onPress={webLogin} />
            <Button title="Navigate to Login" onPress={() =>onNativeLogin()} />
        </Screen>
    );
}