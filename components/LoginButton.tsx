import React from "react";
import { Button, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { ThemedText } from "@/components/ThemedText";

const LoginButton = () => {
    const { authorize } = useAuth0();

    const onPress = async () => {
        try {
            console.log('login');
            let a =  await authorize();
            console.log(a);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <View>
            <ThemedText>Please log in</ThemedText>
            <Button title="Login" onPress={onPress} />
        </View>
    );
}

export default LoginButton;
