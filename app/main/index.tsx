import React, {useEffect, useState} from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useCameraPermissions} from 'expo-camera';
import {CameraType} from "expo-camera/legacy";
import {useRouter} from "expo-router";
import {AxiosError} from "axios";
import {client} from "@/api/client";
import {BlurView} from "expo-blur";
import {Entypo, FontAwesome, FontAwesome5, MaterialIcons} from "@expo/vector-icons";
import * as Location from 'expo-location';
import {LocationObject} from 'expo-location';
import {BeReal} from "@/model/be-real";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from "@expo/vector-icons/Ionicons";
import BlurredBackground from "@/customComponents/BlurredBackground";


interface WholeBeReal {
    myBeReal: BeReal;
}

export default function HomeScreen() {
    const [facing, setFacing] = useState(CameraType.front);
    const [permission, requestPermission] = useCameraPermissions();
    const [feed, setFeed] = useState<BeReal[]>([]);
    const router = useRouter();
    const [myBeReal, setMyBeReal] = useState<BeReal | null>(null);
    const [location, setLocation] = useState<LocationObject | null>(null);
    const [locationName, setLocationName] = useState<string | null>(null);

    useEffect(() => {

        (async () => {
            await requestPermission();
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            let locationName = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });
            setLocationName(locationName[0].city + ", " + locationName[0].country);

        })()
        // Fetching the feed data
        client.get<BeReal[]>('bereals/feed/2')
            .then(response => {
                setFeed(response.data);
            })
            .catch((error: AxiosError) => {
                alert(error);
            });
        (async () => {
            let userId = await AsyncStorage.getItem('userId');
        client.get<BeReal[]>(`bereals/today/${userId}`)
            .then(response => {
                setMyBeReal(response.data[0]);
            })
            .catch((error: AxiosError) => {
                alert(error);
            });
        })()
    }, []);

    const switchToCameraScreen = () => {
        router.push('/camera');
    }
    function uint8ArrayToBase64(uint8Array:Uint8Array) {
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i++) {
            binaryString += String.fromCharCode(uint8Array[i]);
        }
        return binaryString;
    }
    const Post = ({frontPhoto, backPhoto, user, dateCreated, myBeRealIsTaken}: BeReal & { myBeRealIsTaken: boolean }) => {
        return (
        <View>
            <View style={styles.postUserContainer}>
                <Image style={styles.profilePhoto} />
                <View>
                <Text style={styles.postNickname}>{user.nickname}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center"}}>
                        <Text style={styles.text}>
                            {locationName}
                        </Text>
                        <View style={{
                            width: 8, height: 8, marginHorizontal: 8,
                            borderRadius: 4, backgroundColor: "white"
                        }} />
                        <Text style={styles.text}>{new Date(dateCreated).toLocaleTimeString()}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.imagesContainer}>
                <Image source={{ uri: `data:image/jpeg;base64,${uint8ArrayToBase64(frontPhoto)}` }} style={styles.capturedImageBig} />
                <Image source={{ uri: `data:image/jpeg;base64,${uint8ArrayToBase64(backPhoto)}` }} style={styles.capturedImageSmall} />
                {
                    !myBeRealIsTaken && (
                        <>
                            <BlurView intensity={50} experimentalBlurMethod={"dimezisBlurView"} style={styles.blurOverlay} />
                            <Pressable style={styles.captureButton} onPress={switchToCameraScreen}>
                                <Text style={{ color: "white" }}>Take a BeReal</Text>
                            </Pressable>
                        </>
                    )
                }
            </View>
        </View>
    );
    }

    const MyPost = ({frontPhoto,backPhoto,location,dateCreated}:BeReal) => {
        return (
        <View>
            <View style={styles.myPostFriendSuggestion}>
                <Text style={{color: "white",fontSize: 18}}>My friends</Text>
                <Text style={{color: "white",fontSize: 18}}>Friend of my friends</Text>
            </View>
            <View style={styles.myImagesContainer}>
                    <Image source={{ uri: `data:image/jpeg;base64,${uint8ArrayToBase64(frontPhoto)}` }} style={styles.myCapturedImageBig} />
                    <Image source={{ uri: `data:image/jpeg;base64,${uint8ArrayToBase64(backPhoto)}` }} style={styles.myCapturedImageSmall} />
            </View>
            <View style={{ alignItems: "center" }}>
                <Text style={styles.text}>Add a caption...</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.text}>
                        {location}
                    </Text>
                    <View style={{
                        width: 8, height: 8, marginHorizontal: 8,
                        borderRadius: 4, backgroundColor: "white"
                    }} />
                    <Text style={styles.text}>{new Date(dateCreated).toLocaleTimeString()}</Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center"}}>

                <Entypo style={{marginRight: 15}} name="share" size={24} color="white"/>
                <MaterialIcons name="person-add-alt-1" size={24} color="white"/>
                </View>
            </View>
        </View>
    );
    }

    return (
        <View style={styles.container}>
            <View>
            {myBeReal && (
                <BlurredBackground imageUri={`data:image/jpeg;base64,${uint8ArrayToBase64(myBeReal.backPhoto)}`} />
            )}
            <View style={styles.header}>
                <FontAwesome5 style={{width: "33%",}}
                    name="user-friends" size={24} color="white" />
                <Text style={styles.headerText}>StayReal</Text>
                <View style={{flexDirection: "row",
                    width: "33%", justifyContent: "flex-end",
                    alignItems: "center"}}>
                <Ionicons
                          name="calendar-outline" size={24} color="white" />
                <Image style={styles.profilePhoto} />
                </View>
            </View>
                <View style={{marginBottom:5}}>
            {myBeReal && (
                <MyPost {...myBeReal}/>
            )}
                </View>
            </View>
            <FlatList data={feed} renderItem={({ item }) => (
                <Post
                    {...item}
                    myBeRealIsTaken={!!myBeReal}
                />
            )}
                      keyExtractor={(item) => item.beRealId.toString()}
            />
            <FontAwesome name="circle-thin" style={styles.captureCircle} size={80} color="white"
                         onPress={switchToCameraScreen} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        marginHorizontal: 10,
        height: 60,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        width: "34%",
        textAlign: 'center',
    },
    captureButton: {
        width: "80%",
        height: 60,
        borderRadius: 30,
        backgroundColor: '#555555',
        opacity: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 40,
    },
    postNickname: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    text: {
        color: '#fff',
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
    imagesContainer: {
        alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 10,
    },
    profilePhoto: {
        width: 40,
        height: 40,
        marginHorizontal: 10,
        borderRadius: 25,
        backgroundColor: '#fff',
    },
    myPostFriendSuggestion: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 10,
        marginHorizontal: "15%",
    },
    postUserContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
    },
    blurOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 15,
        overflow: 'hidden',
    },
    myImagesContainer: {
        width: "40%",
        aspectRatio: 3 / 4,
        alignSelf: 'center',
    },
    myCapturedImageBig: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000',
        width: "99%",
        backgroundColor: '#fff',
        aspectRatio: 3 / 4,
        transform: [{ scaleX: -1 }],
    },
    myCapturedImageSmall: {
        backgroundColor: '#000',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000',
        position: 'absolute',
        top: 10,
        left: 10,
        width: "30%",
        aspectRatio: 3 / 4,
        transform: [{ scaleX: -1 }],
    },
    captureCircle: {
        bottom: 20,
        position: 'absolute',
        alignSelf: 'center',
    }
});
