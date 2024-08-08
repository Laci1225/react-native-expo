import React, {useEffect, useRef, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {CameraView, useCameraPermissions} from 'expo-camera';
import Ionicons from "@expo/vector-icons/Ionicons";
import {CameraType} from "expo-camera/legacy";
import {useRouter} from "expo-router";
import {AntDesign, Feather} from "@expo/vector-icons";
import {getBrightnessAsync, setBrightnessAsync} from "expo-brightness";
import {AxiosError} from "axios";
import {client} from "@/api/client";
import {BeRealInput} from "@/model/be-real";

interface PhotoData {
    uri: string;
    bytes: Uint8Array;
}
interface CapturedPhotos {
    front: PhotoData | null;
    back: PhotoData | null;
}

export default function CameraScreen() {
    const [facing, setFacing] = useState(CameraType.front);
    const [permission, requestPermission] = useCameraPermissions();
    const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhotos>({
        front: null,
        back: null
    });
    const cameraRef = useRef<CameraView | null>(null);
    const [flash, setFlash] = useState(false);
    const [originalBrightness, setOriginalBrightness] = useState<number>();
    const [flashTriggered, setFlashTriggered] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
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
        let utf8Encode = new TextEncoder();
        if (cameraRef.current) {
            if (flashTriggered) {
                setTimeout(async () => {
                    const brightness = await getBrightnessAsync();
                    setOriginalBrightness(brightness);
                    await setBrightnessAsync(1);
                    setFlash(true);

                    const photo = await cameraRef.current?.takePictureAsync({
                        quality: 0.4,
                        base64: true,
                    });

                    if (photo && photo.uri) {
                        const updatedPhoto: PhotoData = {
                            uri: photo.uri,
                            bytes: utf8Encode.encode(photo.base64 || '')
                        };
                            handleCapturedPhoto(updatedPhoto);
                    }

                    await setBrightnessAsync(originalBrightness ? originalBrightness : 0.5);
                    setFlash(false);
                }, 100);
            } else {
                const photo = await cameraRef.current?.takePictureAsync({
                    quality: 0.5,
                    base64: true,
                });

                if (photo && photo.uri) {
                    const updatedPhoto: PhotoData = {
                        uri: photo.uri,
                        bytes: utf8Encode.encode(photo.base64 || '')
                    };
                        handleCapturedPhoto(updatedPhoto);
                }
            }
        }
    };

    const handleCapturedPhoto = (photo: PhotoData) => {
        if (facing === CameraType.front) {
            setCapturedPhotos((prev) => ({...prev, front: photo}));
            setFacing(CameraType.back);
            setIsCapturing(false);
        } else {
            setCapturedPhotos((prev) => ({...prev, back: photo}));
            setIsCapturing(false);
        }
    };

    const toggleFlash = () => {
        setFlashTriggered(!flashTriggered);
    };

    const retakePicture = () => {
        setCapturedPhotos({front: null, back: null});
        setFacing(CameraType.front);
    };

    const publishPhoto = () => {
        if (capturedPhotos.front && capturedPhotos.back) {
            const postData : BeRealInput = {
                user: {userId: 1,phoneNumber:"string",birthDate:"2000-12-25",nickname:"string"}, // TODO: Replace with actual user data
                frontPhoto: Array.from(capturedPhotos.front.bytes),
                backPhoto: Array.from(capturedPhotos.back.bytes),
                location: 'Unknown',
            };

            client.post('/bereals/upload', postData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(() => {
                router.push('/');
            }).catch((error: AxiosError) => {
                alert('Failed to upload photo.');
                console.log(error);
                console.log(error.stack);
            });
        } else {
            alert('Both front and back photos are required.');
        }
    };

    useEffect(() => {
        if (!isCapturing && facing === CameraType.back && capturedPhotos.front) {
            setIsCapturing(true);
            takePicture();
        }
    }, [facing, capturedPhotos.front]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>BeReal</Text>
            </View>
            {capturedPhotos.front && capturedPhotos.back ? (
                <>
                    <View style={styles.imagesContainer}>
                        <Image source={{uri: capturedPhotos.front.uri}} style={styles.capturedImageBig}/>
                        <Image source={{uri: capturedPhotos.back.uri}} style={styles.capturedImageSmall}/>
                    </View>
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
                    <View style={styles.cameraContainer}>
                    <CameraView
                        facing={facing}
                        ref={cameraRef}
                        style={styles.cameraView}
                    />
                    </View>
                    {flash && <View style={styles.flashOverlay}/>}
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.button} onPress={toggleFlash}>
                            <Ionicons name={flashTriggered ? "flash-outline" : "flash-off-outline"} size={40} color="white"/>
                        </Pressable>
                        <Pressable style={styles.captureButton} onPress={() => {
                            setIsCapturing(true);
                            takePicture();
                        }}>
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
    cameraContainer: {
        borderRadius: 25,
        overflow: 'hidden',
        width: "95%",
        aspectRatio: 3 / 4,
        alignSelf: 'center',
        marginVertical: 20,
    },
    cameraView: {
        width: "100%",
        height: "100%",
    },
    imagesContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 20,
        marginHorizontal: 10,
    },
    capturedImageBig: {
        borderRadius: 25,
        width: "95%",
        aspectRatio: 3 / 4,
        transform: [{scaleX: -1}],
    },
    capturedImageSmall: {
        borderRadius: 15,
        position: 'absolute',
        top: 15,
        left: 30,
        width: "25%",
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
    },
});
