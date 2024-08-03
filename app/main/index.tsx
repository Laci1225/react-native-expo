import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Image, FlatList, Pressable} from 'react-native';
import { CameraView, useCameraPermissions} from 'expo-camera';
import Ionicons from "@expo/vector-icons/Ionicons";
import {CameraType} from "expo-camera/legacy";
import {useRouter} from "expo-router";
import {AxiosError} from "axios";
import {client} from "@/api/client";
import {BlurView} from "expo-blur";

const initialData = [
    { id: '111', name: 'Alicee', data: require('@/assets/images/react-logo.png') },
    // Add more sample posts here
];

interface FeedItem {
    id: string;
    name: string;
    data: any;
}

const Post = ({ name, data, blur }: FeedItem & { blur: boolean }) => (
    <View>
        <View style={styles.postUserContainer}>
            <Image style={styles.profilePhoto}/>
            <Text style={styles.postUser}>{name}</Text>
        </View>
        <View style={styles.imagesContainer}>
                    <Image source={typeof data === 'string' ? { uri: data } : data} style={styles.capturedImageBig}/>
                    <Image source={typeof data === 'string' ? { uri: data } : data} style={styles.capturedImageSmall}/>
            {
              !blur && <BlurView intensity={50} experimentalBlurMethod={"dimezisBlurView"} style={styles.blurOverlay}/>
            }
            </View>
    </View>
);

export default function HomeScreen() {
    const [facing, setFacing] = useState(CameraType.front);
    const [permission, requestPermission] = useCameraPermissions();
    const [feed, setFeed] = useState<FeedItem[]>(initialData);
    const cameraRef = useRef<CameraView | null>(null);
    const router = useRouter();
    const [myBeReal, setMyBeReal] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            await requestPermission();
        })();
        client.get('photos/4')
            .then(value => {
                setFeed([value.data])
                //setFeed(prevState => [...prevState, value.data])
            }).catch((error: AxiosError) => {
            alert(error);
        });
    }, []);

    const switchToCameraScreen = () => {
        router.push('/camera');
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({ base64: true });
            if (photo && photo.uri) {
                setMyBeReal(photo.uri); // Set myBeReal with the new photo
                const updatedFeed = feed.map(item => ({ ...item, image: photo.uri }));
                setFeed(updatedFeed);
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>BeReal</Text>
            </View>
            <CameraView facing={facing} ref={cameraRef}>
                <View style={styles.cameraView}>
                    <Pressable style={styles.captureButton} onPress={switchToCameraScreen}>
                        <Ionicons name={"camera"} style={styles.cameraIcon}/>
                    </Pressable>
                    <Text style={{color: "white"}}>Take a BeReal</Text>
                </View>
            </CameraView>
            <FlatList
                data={feed}
                renderItem={({ item }) => (
                    <Post
                        id={item.id}
                        name={item.name}
                        data={item.data}
                        blur={!myBeReal} // Conditionally blur images if myBeReal is not set
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.feed}
            />
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
    cameraView: {
        height: 200,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ff6347',
        justifyContent: 'center',
        alignItems: 'center',
    },
    feed: {
        padding: 10,
    },
    postUser: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    text: {
        color: '#fff',
    },
    cameraIcon: {
        fontSize: 30,
        color: 'white'
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
        marginVertical: 20,
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
    }
});
