import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Pressable, Alert} from 'react-native';
import {Camera, CameraView, CameraViewRef, useCameraPermissions} from 'expo-camera';
import Ionicons from "@expo/vector-icons/Ionicons";
import {CameraType} from "expo-camera/legacy";
import {useRouter} from "expo-router";


const initialData = [
    { id: '1', user: 'Alicee', image: require('@/assets/images/react-logo.png') },
    { id: '2', user: 'Bob', image: require('@/assets/images/partial-react-logo.png') },
    { id: '3', user: 'Cintia', image: require('@/assets/images/icon.png') },
    // Add more sample posts here
];
interface FeedItem {
    id: string;
    user: string;
    image: any;
}

const Post = ({ user, image }:FeedItem) => (
    <View style={styles.post}>
        <Text style={styles.postUser}>{user}</Text>
        <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.postImage} />
    </View>
);

export default function HomeScreen() {
    const [facing, setFacing] = useState(CameraType.front);
    const [permission, requestPermission] = useCameraPermissions();
    const [feed, setFeed] = useState<FeedItem[]>(initialData);
    const cameraRef = useRef<CameraView | null>(null);
    const router = useRouter();


    useEffect(() => {
        (async () => {
            await requestPermission();
        })();
    }, []);
const switchToCameraScreen = () => {
    //route to / camera
    router.push('/camera');
}
    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({base64: true});
            if (photo &&  photo.uri) {
                const updatedFeed = feed.map(item => ({ ...item, image: photo.uri }));
                setFeed(updatedFeed);
            }
            //wait 3 sec
            /*setCameraType('front')*/
            // @ts-ignore
            /*const frontData = await cameraRef.current.takePictureAsync();
            setFrontPhoto(frontData.uri);
            setCameraType('back')
            // Save the dual photo to the feed
            setFeed([{ photo: data.uri, frontPhoto: frontData.uri, id: Date.now().toString() }, ...feed]);
        */}
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>BeReal</Text>
            </View>
                <CameraView
                    facing={facing}
                    ref={cameraRef}
                >
                    <View style={styles.cameraView}>
                        <Pressable style={styles.captureButton} onPress={()=>switchToCameraScreen()}>
                            <Ionicons name={"camera"} style={styles.cameraIcon}/>
                        </Pressable>
                    </View>
                </CameraView>
            <FlatList
                data={feed}
                renderItem={({ item }) => <Post id={item.id} user={item.user} image={item.image/* ONLY WORKS AFTER FIRST PIC TAKEN item.image*/} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.feed}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    post: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    postUser: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    }, camera: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    text: {
        color: 'white',
    },
    cameraIcon:
        {
            fontSize: 30,
            color: 'white'
        }
});
