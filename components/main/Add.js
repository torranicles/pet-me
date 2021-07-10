import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';


function Add(props) {
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

    }, []);

    const handleFlipCam = () => {
        setType(
            type === Camera.Constants.Type.back
            ? Camera.Constants.Type.front
            : Camera.Constants.Type.back
        )
    }

    const handleTakePicture = async () => {
        if (camera) {
            const data = await camera.takePictureAsync(null);
            setImage(data.uri);
        }
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
                    <Camera ref={ref => setCamera(ref)} style={styles.fixedRatio} type={type} ratio={'1:1'}/>
                </View>
                <Button //Add icon
                    title="Flip Camera"
                    onPress={handleFlipCam}/>
                <Button //Add icon
                    title="Take Photo"
                    onPress={() => handleTakePicture()}/>
                { image ? <Image source={{uri: image}} style={styles.container}/> : null}
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