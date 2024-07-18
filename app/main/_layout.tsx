import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function MainLayout({ children}: { children: React.ReactNode}) {
    return (
        <View style={styles.container}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
});
