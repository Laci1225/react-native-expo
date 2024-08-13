import React, { useEffect, useState } from 'react';
import {Image, StyleSheet, Text, View, ScrollView, ActivityIndicator} from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { BeReal } from '@/model/be-real';
import { uint8ArrayToBase64 } from "@/customComponents/uint8ArrayToBase64";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { client } from "@/api/client";
import { AxiosError } from "axios";

export default function BeRealDetailsScreen() {
    //const { beReal } = useGlobalSearchParams();
    const router = useRouter();
    const [myBeReal, setMyBeReal] = useState<BeReal>();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            let userId = await AsyncStorage.getItem('userId');
            if (!userId) {
                router.push('/login');
                return;
            }

                client.get<BeReal[]>(`bereals/today/${userId}`)
                    .then(response => {
                        if (response.data && response.data.length > 0) {
                            setMyBeReal(response.data[0]);
                        } else {
                            router.push('/main');
                        }
                    })
                    .catch((error: AxiosError) => {
                        console.error('Error fetching myBeReal:', error);
                        router.push('/main');
                    })
                    .finally(() => setLoading(false));

        })();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }


    if (!myBeReal) {
        router.push('/main');
        return null;
    }

    // If beReal param is passed, use that data, otherwise use fetched myBeReal data
    //const beRealData: BeReal = beReal ? JSON.parse(beReal as string) : myBeReal;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>BeReal Details</Text>
            </View>
            <View style={styles.imagesContainer}>
                <Image
                    source={{ uri: `data:image/jpeg;base64,${uint8ArrayToBase64(myBeReal.backPhoto)}` }}
                    style={styles.capturedImageBig}
                />
                <Image
                    source={{ uri: `data:image/jpeg;base64,${uint8ArrayToBase64(myBeReal.frontPhoto)}` }}
                    style={styles.capturedImageSmall}
                />
                <Text style={styles.text}>User: {myBeReal.user.nickname}</Text>
                <Text style={styles.text}>Location: {myBeReal.location}</Text>
                <Text style={styles.text}>Date: {new Date(myBeReal.dateCreated).toLocaleString()}</Text>
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
    imagesContainer: {
        alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 10,
    },
    capturedImageBig: {
        borderRadius: 25,
        width: "99%",
        backgroundColor: '#fff',
        aspectRatio: 3 / 4,
        transform: [{ scaleX: -1 }],
    },
    capturedImageSmall: {
        backgroundColor: '#000',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#000',
        position: 'absolute',
        top: 20,
        left: 20,
        width: "30%",
        aspectRatio: 3 / 4,
        transform: [{ scaleX: -1 }],
    },
    text: {
        color: '#fff',
        fontSize: 16,
        marginVertical: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
});
