import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';
import {useRouter, useGlobalSearchParams} from 'expo-router';
import { BeReal } from '@/model/be-real';
import { Entypo } from '@expo/vector-icons';
import {uint8ArrayToBase64} from "@/customComponents/uint8ArrayToBase64";

export default function BeRealDetailsScreen() {
    const { beReal } = useGlobalSearchParams();
    const router = useRouter();
    const beRealData: BeReal = JSON.parse(beReal as string);
    useEffect(() => {
    }, []);
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Entypo name="chevron-left" size={24} color="white" onPress={() => router.back()} />
                <Text style={styles.headerText}>BeReal Details</Text>
            </View>
            <View style={styles.content}>
                <Image
                    source={{ uri: `data:image/jpeg;base64,${uint8ArrayToBase64(beRealData.frontPhoto)}` }}
                    style={styles.image}
                />
                <Image
                    source={{ uri: `data:image/jpeg;base64,${uint8ArrayToBase64(beRealData.backPhoto)}` }}
                    style={styles.image}
                />
                <Text style={styles.text}>User: {beRealData.user.nickname}</Text>
                <Text style={styles.text}>Location: {beRealData.location}</Text>
                <Text style={styles.text}>Date: {new Date(beRealData.dateCreated).toLocaleString()}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 16,
    },
    content: {
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 300,
        marginBottom: 16,
        borderRadius: 10,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        marginVertical: 4,
    },
});
