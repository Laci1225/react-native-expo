import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {BlurView} from 'expo-blur';

const BlurredBackground = ({imageUri}) => (
    <View style={StyleSheet.absoluteFill}>
        <ImageBackground
            source={{uri: imageUri}}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
        >
            <BlurView
                experimentalBlurMethod={"dimezisBlurView"}
                intensity={30}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.overlay}/>
        </ImageBackground>
    </View>
);
const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black', // Color for the dark overlay
        opacity: 0.6, // Adjust the opacity to make it darker or lighter
    },
});

export default BlurredBackground;
