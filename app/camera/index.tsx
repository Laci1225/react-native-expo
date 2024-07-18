import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Pressable } from 'react-native';
import { Camera, CameraView, CameraViewRef, useCameraPermissions } from 'expo-camera';
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraType } from "expo-camera/legacy";
import { useRouter } from "expo-router";

interface FeedItem {
    id: string;
    user: string;
    image: any;
}

const Post = ({ user, image }: FeedItem) => (
    <View style={styles.post}>
        <Text style={styles.postUser}>{user}</Text>
        <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.postImage} />
    </View>
);

export default function CameraScreen() {
    const [facing, setFacing] = useState(CameraType.front);
    const [permission, requestPermission] = useCameraPermissions();
    const [feed, setFeed] = useState<FeedItem[]>([]);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const cameraRef = useRef<CameraView | null>(null);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            await requestPermission();
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 1,
                base64: true,
            });
            if (photo && photo.uri) {
                setCapturedPhoto(photo.uri);
                const updatedFeed = [{ id: '1', user: 'You', image: photo.uri }];
                setFeed(updatedFeed);
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>BeReal</Text>
            </View>
            {capturedPhoto ? (
                <Image source={{ uri: capturedPhoto }} style={styles.capturedImage} />
            ):(
                <>
            <CameraView
                facing={facing}
                ref={cameraRef}
                style={styles.cameraView}
            />
            <Pressable style={styles.captureButton} onPress={() => takePicture()}>
                <Ionicons name={"camera"} style={styles.cameraIcon} />
            </Pressable>
                </>
    )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        marginTop: 40,
        height: 80,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        borderBottomColor: '#ddd',
    },
    headerText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    cameraView: {
        marginTop: 20,
        marginHorizontal: "auto",
        width: "95%",
        aspectRatio: 3 / 4,
    },
    capturedImage: {
        marginHorizontal: "auto",
        width: "95%",
        aspectRatio: 3 / 4,
        //flip the image
        transform: [{scaleX: -1}],
    },
    captureButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ff6347',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: 20,
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
    },
    cameraIcon: {
        fontSize: 30,
        color: 'white',
    }
});
