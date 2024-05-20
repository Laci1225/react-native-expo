import React, {useState} from "react";
import {Alert, Button, TextInput} from "react-native";
import {Screen} from "react-native-screens";
import {ThemedText} from "@/components/ThemedText";
import useAuth from "@/hooks/useAuth";

export default function NativeLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {nativeLogin,isLoading} = useAuth();
    const onSubmit = () => {
        if (email.trim() === "") {
            Alert.alert("Email is required");
            return
        }
        if (password.trim() === "") {
            Alert.alert("Password is required");
            return
        }
        nativeLogin(email, password)
    }
    return (
        <Screen>
            <ThemedText> Sign up and Log</ThemedText>
            <TextInput
                placeholder={"Email"}
            onChangeText={(text)=>setEmail(text)}/>
            <TextInput
                placeholder={"Password"}
                secureTextEntry
            onChangeText={(text)=>setPassword(text)}/>
            <Button title={"Sign "} onPress={onSubmit}/>
        </Screen>)
}