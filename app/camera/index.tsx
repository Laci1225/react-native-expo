import React, {useEffect, useRef, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {CameraView, useCameraPermissions} from 'expo-camera';
import Ionicons from "@expo/vector-icons/Ionicons";
import {CameraType} from "expo-camera/legacy";
import {useRouter} from "expo-router";
import {AntDesign, Feather} from "@expo/vector-icons";
import {getBrightnessAsync, setBrightnessAsync} from "expo-brightness";

interface FeedItem {
    id: string;
    user: string;
    image: any;
}

export default function CameraScreen() {
    const [facing, setFacing] = useState(CameraType.front);
    const [permission, requestPermission] = useCameraPermissions();
    const [feed, setFeed] = useState<FeedItem[]>([]);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const cameraRef = useRef<CameraView | null>(null);
    const [flash, setFlash] = useState(false);
    const [originalBrightness, setOriginalBrightness] = useState<number>();
    const [flashTriggered, setFlashTriggered] = useState(false);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const {status} = await requestPermission();
            if (status !== 'granted') {
                alert('Camera permissions are required.');
            }
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            if (flashTriggered) {
                setTimeout(async () => {
                    const brightness = await getBrightnessAsync();
                    alert(brightness.toString());
                    setOriginalBrightness(brightness);
                    await setBrightnessAsync(1);
                    setFlash(true);
                    const photo = await cameraRef.current?.takePictureAsync({
                        quality: 1,
                        base64: true,
                    });
                    if (photo && photo.uri) {
                        setCapturedPhoto(photo.uri);
                        const updatedFeed = [{id: '1', user: 'You', image: photo.uri}];
                        setFeed(updatedFeed);
                    }
                    await setBrightnessAsync(originalBrightness? originalBrightness : 0.5); //todo
                    setFlash(false);
                }, 100);
            } else {
                const photo = await cameraRef.current?.takePictureAsync({
                    quality: 1,
                    base64: true,
                });
                if (photo && photo.uri) {
                    setCapturedPhoto(photo.uri);
                    const updatedFeed = [{id: '1', user: 'You', image: photo.uri}];
                    setFeed(updatedFeed);
                }
            }
        }
    }

    const toggleFlash = () => {
        setFlashTriggered(!flashTriggered);
    };
    const retakePicture = () => {
        setCapturedPhoto(null);
    }

    function publishPhoto() {

    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>BeReal</Text>
            </View>
            {capturedPhoto ? (
                <>
                    <Image source={{uri: capturedPhoto}} style={styles.capturedImage}/>
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.button} onPress={retakePicture}>
                            <Feather name="refresh-cw" size={40} color="white"/>
                        </Pressable>
                        <Pressable style={styles.button} onPress={() => publishPhoto()}>
                            <AntDesign name="checkcircleo" size={40} color="white"/>
                        </Pressable>
                    </View>
                </>
            ) : (
                <>
                    <CameraView
                        facing={facing}
                        ref={cameraRef}
                        style={styles.cameraView}
                    />
                    {flash && <View style={styles.flashOverlay}/>}
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.button} onPress={toggleFlash}>
                            <Ionicons name={flashTriggered ? "flash-outline" : "flash-off-outline"} size={40}
                                      color="white"/>
                        </Pressable>
                        <Pressable style={styles.captureButton} onPress={takePicture}>
                            <Ionicons name={"camera"} style={styles.cameraIcon}/>
                        </Pressable>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
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
        marginTop: 20,
        marginHorizontal: "auto",
        width: "95%",
        aspectRatio: 3 / 4,
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
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    button: {
        fontSize: 40,
        padding: 10,
    },
    cameraIcon: {
        fontSize: 30,
        color: 'white',
    },
    flashOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'white',
        opacity: 1,
        //set phone brightness to 100%
    },
});
