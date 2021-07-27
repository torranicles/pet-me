import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, Button, FlatList, StyleSheet, StatusBar, Platform } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import 'firebase/firestore';

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        let posts = [];
        if (props.usersLoaded == props.following.length) { //If all users are loaded
            for (let i = 0; i < props.following.length; i++) {
                const user = getState().props.users.find(el => el.uid === props.following[i]);
                if (user != undefined) {
                    posts = [...posts, ...user.posts]
                }
            }
            posts.sort((x, y) => {
                return x.creation - y.creation;
            });
            setPosts(posts);
        }
    }, [props.usersLoaded]);
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.galleryContainer}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item }) => (
                        <View style={stles.imageContainer}>
                            <Text style={styles.container}>{item.user.name}</Text>
                            <Image style={styles.image} source={{uri: item.downloadUrl}}/>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    ); 
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    users: store.userState.users,
    usersLoaded: store.usersState.usersLoaded,
    following: store.userState.following
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
    },
    infoContainer: {
        margin: 15
    },
    galleryContainer: {
        flex: 1
    },
    imageContainer: {
        flex: 1/3   
    },
    image: {
        flex: 1,
        aspectRatio: 1/1
    }
})
export default connect(mapStateToProps, null)(Feed);