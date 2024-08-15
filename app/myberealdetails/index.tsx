import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import {useRouter} from 'expo-router';
import {BeReal} from '@/model/be-real';
import {uint8ArrayToBase64} from "@/customComponents/uint8ArrayToBase64";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {client} from "@/api/client";
import {AxiosError} from "axios";
import {Entypo, FontAwesome, MaterialCommunityIcons} from "@expo/vector-icons";

export default function BeRealDetailsScreen() {
    const router = useRouter();
    const [myBeReal, setMyBeReal] = useState<BeReal>();
    const [loading, setLoading] = useState(true);
    const [isSwapped, setIsSwapped] = useState(false);

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
                <ActivityIndicator size="large" color="#fff"/>
            </View>
        );
    }

    if (!myBeReal) {
        router.push('/main');
        return null;
    }

    const handleImagePress = () => {
        setIsSwapped(!isSwapped);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}>
                <View style={{paddingHorizontal: 10}}>
                    <View style={styles.header}>
                        <Entypo style={{width: "15%"}} name="chevron-left" size={24} color="white"
                                onPress={() => router.back()}/>
                        <View style={{width: "70%", alignItems: "center"}}>
                            <Text style={styles.headerText}>My BeReal.</Text>
                            <View>
                                <Text
                                    style={styles.headerSmallerText}>Date: {new Date(myBeReal.dateCreated).toLocaleString()}</Text>
                            </View>
                        </View>
                        <View style={{width: "15%", flexDirection: "row"}}>
                            <Entypo style={{marginRight: 15}} name="share" size={24} color="white"/>
                            <Entypo name="dots-three-vertical" size={24} color="white"/>
                        </View>
                    </View>
                    <View style={styles.imagesContainer}>
                        <View style={styles.imageWrapper}>
                            <Image
                                source={{uri: `data:image/jpeg;base64,${uint8ArrayToBase64(isSwapped ? myBeReal.frontPhoto : myBeReal.backPhoto)}`}}
                                style={styles.capturedImageBig}
                            />
                            <Pressable onPress={handleImagePress} style={styles.touchableWrapper}>
                                <Image
                                    source={{uri: `data:image/jpeg;base64,${uint8ArrayToBase64(isSwapped ? myBeReal.backPhoto : myBeReal.frontPhoto)}`}}
                                    style={styles.capturedImageSmall}
                                />
                            </Pressable>
                        </View>
                        <Text style={{color: "white", marginTop: 20, fontSize: 16, fontWeight: "bold"}}>Add
                            caption...</Text>
                        <Text style={{color: "grey", marginVertical: 5}}>Only visible to your friends</Text>
                        <View style={{
                            backgroundColor: "rgba(80,80,80,0.5)", flexDirection: "row", marginTop: 5,
                            paddingHorizontal: 15, paddingVertical: 4, borderRadius: 25, alignItems: "center"
                        }}>
                            <FontAwesome name="location-arrow" size={24} color="white"/>
                            <Text style={{color: "white", paddingLeft: 8}}>{myBeReal.location}</Text>
                        </View>
                    </View>
                    <View style={{borderBottomColor: 'gray', borderBottomWidth: 1, marginVertical: 15}}/>
                    <View>
                        <FlatList data={[1, 2, 3, 4]} renderItem={
                            ({item}) => (
                                <Image source={require('@/assets/images/icon.png')}
                                       style={{width: 65, height: 65, borderRadius: 50, marginHorizontal: 5}}/>
                            )
                        }
                                  style={{paddingHorizontal: 5}} horizontal={true}
                        />
                    </View>
                </View>
                <View style={{borderBottomColor: 'gray', borderBottomWidth: 1, marginVertical: 15}}/>
                <View>
                    <FlatList data={[1, 2]} renderItem={
                        ({item}) => (
                            <View style={{flexDirection: "row", marginVertical: 5}}>
                                <Image source={require('@/assets/images/icon.png')}
                                       style={{width: 50, height: 50, borderRadius: 25, marginHorizontal: 5}}/>
                                <Text style={{color: "white"}}>Comment</Text>
                            </View>
                        )
                    }
                              style={{paddingHorizontal: 5}}/>
                </View>

            </ScrollView>
            <View style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: 50,
                backgroundColor: "black",
            }}>
                <View style={{borderBottomColor: 'gray', borderBottomWidth: 1}}/>
            <View style={{flexDirection:"row", justifyContent: "space-between", alignItems: "center"}}>
            <TextInput
                placeholder="Add a comment..."
                placeholderTextColor={"rgba(100,100,100,1)"}
                style={{fontSize: 22, color: "white", paddingHorizontal: 20, height: 40, width: "90%"}}
                onChangeText={() => {
                }}
            />
                <MaterialCommunityIcons name="send-circle" size={40} color="blue" />

            </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerText: {
        fontSize: 20,
        color: '#fff',
    },
    imagesContainer: {
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10,
        marginHorizontal: 10,
    },
    imageWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    capturedImageBig: {
        borderRadius: 25,
        width: "99%",
        backgroundColor: '#fff',
        aspectRatio: 3 / 4,
        transform: [{scaleX: -1}],
    },
    touchableWrapper: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: "30%",
    },
    capturedImageSmall: {
        backgroundColor: '#000',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#000',
        aspectRatio: 3 / 4,
        transform: [{scaleX: -1}],
    },
    headerSmallerText: {
        color: '#fff',
        fontSize: 14,
        marginVertical: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
});
