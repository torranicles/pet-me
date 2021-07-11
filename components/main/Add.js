import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';



function Add(props) {
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
        })();
    }, []);

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
          setImage(result.uri);
        }
      };

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
        hasCameraPermission === null || hasGalleryPermission === null //Error
        ?   <View/>
        : hasCameraPermission === false || hasGalleryPermission === false
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
                <Button //Add icon
                    title="Pick Image from Gallery"
                    onPress={() => handlePickImage()}/>
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