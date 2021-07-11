import React, { useState } from 'react';
import { View, Image, TextInput, Button } from 'react-native';
import firebase from 'firebase';
//Check imports:
import "firebase/firebase-storage"; 
import "firebase/firestore"

function Save(props) {
    const [caption, setCaption] = useState("");
    const uri = props.route.params.image;
    
    //To storage
    const handleUploadImage = async () => {
        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(`post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`)
            .put(blob);
            
        //Update the functions 
        const taskOnProgress = (snapshot) => {
            console.log(`Uploading... ${snapshot.bytesTransferred}`)
        }

        const taskError = (error) => {
            console.log(error)
        }
        
        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL()
                .then(snapshot => {
                    savePostData(snapshot)
                })
        }

        task.on("state_changed", taskOnProgress, taskError, taskCompleted)
    }
    
    //To firebase database
    const savePostData= (url) => {
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection('userPosts')
            .add({
                downloadUrl: url,
                caption,
                creation: firebase.firestore().FieldValue.serverTimestamp()
            })
            .then(() => {
                navigation.popToTop();
            })
    }

    return (
        <View style={{flex: 1}}>
            <Image source={{uri: uri}}/>
            <TextInput placeholder="Tell something about it..." onChangeText={(text) => setCaption(text)}/>
            <Button title="Save" onPress={() => handleUploadImage()}/>
        </View>
    );
}

export default Save;