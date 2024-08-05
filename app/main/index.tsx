import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, FlatList, Pressable} from 'react-native';
import { useCameraPermissions} from 'expo-camera';
import {CameraType} from "expo-camera/legacy";
import {useRouter} from "expo-router";
import {AxiosError} from "axios";
import {client} from "@/api/client";
import {BlurView} from "expo-blur";
import { FontAwesome} from "@expo/vector-icons";
import * as Location from 'expo-location';
import {LocationObject} from "expo-location";

const initialData = [
    { id: '111', name: 'Alicee', data: require('@/assets/images/react-logo.png') },
    // Add more sample posts here
];

interface FeedItem {
    id: string;
    name: string;
    data: any;
}
interface WholeBeReal {
    data1: any,
    data2: any
}


export default function HomeScreen() {
    const [facing, setFacing] = useState(CameraType.front);
    const [permission, requestPermission] = useCameraPermissions();
    const [feed, setFeed] = useState<FeedItem[]>(initialData);
    const router = useRouter();
    const [myBeReal, setMyBeReal] = useState<FeedItem[] |null>(null);
    const [location, setLocation] = useState<LocationObject |null>(null);
    const [locationName, setLocationName] = useState<string |null>(null);

    useEffect(() => {
        (async () => {
            await requestPermission();
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            let locationName = await Location.reverseGeocodeAsync({latitude: location.coords.latitude, longitude: location.coords.longitude});
            setLocationName(locationName[0].city + ", " + locationName[0].country);
        })();
        client.get('photos/4')
            .then(value => {
                setFeed([value.data,value.data])
                //setFeed(prevState => [...prevState, value.data])
            }).catch((error: AxiosError) => {
            alert(error);
        });
        client.get('photos/today/7')
            .then(value => {
                client.get('photos/today/8')
                    .then(value2 => {
                        setMyBeReal([value2.data,value.data])
                    }).catch((error: AxiosError) => {
                    alert(error);
                });
            }).catch((error: AxiosError) => {
            alert(error);
        });


    }, []);

    const switchToCameraScreen = () => {
        router.push('/camera');
    }
    const Post = ({ name, data, myBeRealIsTaken }: FeedItem & { myBeRealIsTaken: boolean }) => (
        <View>
            <View style={styles.postUserContainer}>
                <Image style={styles.profilePhoto}/>
                <Text style={styles.postUser}>{name}</Text>
            </View>
            <View style={styles.imagesContainer}>
                <Image source={typeof data === 'string' ? { uri: data } : data}
                       style={styles.capturedImageBig}/>
                <Image source={typeof data === 'string' ? { uri: data } : data}
                       style={styles.capturedImageSmall}/>
                {
                    !myBeRealIsTaken && (
                        <>
                            <BlurView intensity={50} experimentalBlurMethod={"dimezisBlurView"} style={styles.blurOverlay}/>
                                <Pressable style={styles.captureButton} onPress={switchToCameraScreen}>
                                <Text style={{color: "white"}}>Take a BeReal</Text>
                                </Pressable>
                        </>
                    )
                }
            </View>
        </View>
    );
    const MyPost = ({data1,data2 }:WholeBeReal) => (
        <View>
            <View style={styles.postUserContainer}>
            </View>
            <View style={styles.myImagesContainer}>
                <Image source={typeof data1 === 'string' ? { uri: data1 } : data2}
                       style={styles.myCapturedImageBig}/>
                <Image source={typeof data2 === 'string' ? { uri: data2 } : data2}
                       style={styles.myCapturedImageSmall}/>
            </View>
            <View style={{alignItems:"center"}}>
                <Text style={styles.text}>Add a caption...</Text>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                <Text style={styles.text}>{
                    locationName
                }
                </Text>
                    <View style={{width:8,height:8, marginHorizontal: 8,
                        borderRadius: 4, backgroundColor:"white"}} />
                <Text style={styles.text}>{new Date().toLocaleTimeString()}</Text>
            </View>
                </View>
        </View>
    );


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>BeReal</Text>
            </View>
            <FlatList data={feed} renderItem={({ item }) => (
                    <Post
                        id={item.id}
                        name={item.name}
                        data={item.data}
                        myBeRealIsTaken={!!myBeReal} // Conditionally blur images if myBeReal is not set
                    />
                )}
                keyExtractor={(item) => item.id}
                      ListHeaderComponent={myBeReal && (
                          <MyPost
                              data1={myBeReal[0].data}
                              data2={myBeReal[1].data}
                          />
                      )}
            />
            <FontAwesome name="circle-thin" style={styles.captureCircle} size={80} color="white"
            onPress={switchToCameraScreen}/>
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
        height: 60,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
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
    postUser: {
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
        transform: [{scaleX: -1}],
    },
    capturedImageSmall: {
        backgroundColor: '#000',
        borderRadius: 15,
        position: 'absolute',
        top: 30,
        left: 30,
        width: "30%",
        aspectRatio: 3 / 4,
        transform: [{scaleX: -1}],
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
    }, myCapturedImageBig: {
        borderRadius: 10,
        width: "99%",
        backgroundColor: '#fff',
        aspectRatio: 3 / 4,
        transform: [{scaleX: -1}],
    }, myCapturedImageSmall: {
        backgroundColor: '#000',
        borderRadius: 5,
        position: 'absolute',
        top: 10,
        left: 10,
        width: "30%",
        aspectRatio: 3 / 4,
        transform: [{scaleX: -1}],
    },
    captureCircle: {
        bottom: 20,
        position: 'absolute',
        alignSelf: 'center',
    }

});
