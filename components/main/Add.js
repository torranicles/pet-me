import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button} from 'react-native';
import { Camera } from 'expo-camera';


function Add(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

    }, []);

    const flipCam = () => {
        setType(
            type === Camera.Constants.Type.back
            ? Camera.Constants.Type.front
            : Camera.Constants.Type.back
        )
    }
    return (
        hasPermission === null //Error
        ?   <View/>
        : hasPermission === false
        ?   <Text>
                App does not have permission to access the camera.
            </Text>
        :   <View style={styles.container}>
                <View style={styles.camContainer}>
                    <Camera style={styles.fixedRatio} type={type} ratio={'1:1'}/>
                </View>
                <Button
                    title="Flip Camera"
                    onPress={flipCam}/>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    camContainer: {
        flexDirection: 'row'
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    }
})
export default Add;