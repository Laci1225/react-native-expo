import React, {useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Animated,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
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

    // Animated value for scroll
    const scrollY = useRef(new Animated.Value(0)).current;

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

    // Interpolated values for dynamic resizing
    const imageContainerHeight = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [450, 300],
        extrapolate: "clamp",
    });

    const imageScale = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.35],
        extrapolate: "clamp",
    });

    return (
        <View style={styles.container}>
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
            <Animated.ScrollView
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: scrollY}}}],
                    {useNativeDriver: false}
                )}
            >
                <View>
                    <Animated.View style={[styles.imagesContainer, {height: imageContainerHeight}]}>
                        <Animated.View style={[styles.imageWrapper, {transform: [{scale: imageScale}]}]}>
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
                        </Animated.View>
                    </Animated.View>
                        <View style={styles.detailsContainer}>
                            <Text style={styles.captionText}>Add caption...</Text>
                            <Text style={styles.visibilityText}>Only visible to your friends</Text>
                            <View style={styles.locationContainer}>
                                <FontAwesome name="location-arrow" size={24} color="white"/>
                                <Text style={styles.locationText}>{myBeReal.location}</Text>
                            </View>
                        </View>
                    <View style={styles.separator}/>
                    <FlatList
                        data={[1, 2, 3, 4]}
                        renderItem={({item}) => (
                            <Image
                                source={require('@/assets/images/icon.png')}
                                style={styles.profileImage}
                            />
                        )}
                        style={styles.flatList}
                        horizontal={true}
                    />
                    <View style={styles.separator}/>
                    <FlatList
                        data={[1, 2, 3, 4, 5]}
                        renderItem={({item}) => (
                            <View style={styles.commentContainer}>
                                <Image
                                    source={require('@/assets/images/icon.png')}
                                    style={styles.commentImage}
                                />
                                <Text style={styles.commentText}>Comment</Text>
                            </View>
                        )}
                        style={styles.flatList}
                    />
                </View>
            </Animated.ScrollView>
            <View style={styles.footer}>
                <View style={styles.commentInputContainer}>
                    <TextInput
                        placeholder="Add a comment..."
                        placeholderTextColor={"rgba(100,100,100,1)"}
                        style={styles.commentInput}
                        onChangeText={() => {
                        }}
                    />
                    <MaterialCommunityIcons name="send-circle" size={40} color="blue"/>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 10,
        paddingTop: 30,
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
    detailsContainer: {
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    captionText: {
        color: "white",
        marginTop: 20,
        fontSize: 16,
        fontWeight: "bold",
    },
    visibilityText: {
        color: "grey",
        marginVertical: 5,
    },
    locationContainer: {
        backgroundColor: "rgba(80,80,80,0.5)",
        flexDirection: "row",
        marginTop: 5,
        paddingHorizontal: 15,
        paddingVertical: 4,
        borderRadius: 25,
        alignItems: "center",
    },
    locationText: {
        color: "white",
        paddingLeft: 8,
    },
    separator: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        marginVertical: 15,
    },
    flatList: {
        paddingHorizontal: 5,
        marginBottom: 50
    },
    profileImage: {
        width: 65,
        height: 65,
        borderRadius: 50,
        marginHorizontal: 5,
    },
    commentContainer: {
        flexDirection: "row",
        marginVertical: 5,
    },
    commentImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginHorizontal: 5,
    },
    commentText: {
        color: "white",
    },
    footer: {
        position: "absolute",
        bottom: 0,
        backgroundColor: "black",
        width: "103%", //todo malfunction
        borderTopWidth: 1,
        borderColor: "grey",
        paddingTop: 5
    },
    commentInputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    commentInput: {
        fontSize: 22,
        color: "white",
        paddingHorizontal: 20,
        height: 40,
        width: "90%",
    },
});
