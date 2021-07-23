import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, Button, FlatList, StyleSheet, StatusBar, Platform } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import 'firebase/firestore';

function Profile(props) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(false);

    const userId = props.route.params.userId;
    const currentUserId = firebase.auth().currentUser.uid;

    useEffect(() => {
        const { currentUser, posts } = props;
        if (userId === currentUserId) {
            setUser(currentUser);
            setUserPosts(posts);
        } else {
            firebase.firestore()
                .collection("users")
                .doc(userId)
                .get()
                .then(doc => {
                    if (doc.exists) {
                        setUser(doc.data())
                    } else {
                        console.log("Document not found.") //Update
                    }
                });
            firebase.firestore()
                .collection("posts")
                .doc(userId)
                .collection("userPosts")
                .orderBy("creation", "asc")
                .get()
                .then(snapshot => {
                    let posts; 
                    if (snapshot) {
                        posts = snapshot.docs.map(doc => {
                            let id = doc.id;
                            let data = doc.data();
                            return {id, ...data}
                        })
                    }
                    setUserPosts(posts)
                })
        };

        if (props.following.indexOf(userId > -1)) {
            setFollowing(true);
        } else {
            setFollowing(false);
        }
    }, [userId, props.following]);

    if (user === null) { //Update
        return <View/>
    };

    const handleFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(currentUserId)
            .collection("userFollowing")
            .doc(userId)
            .set({})
    }

    const handleUnfollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(currentUserId)
            .collection("userFollowing")
            .doc(userId)
            .delete()
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.infoContainer}>
                <View>{user.name}</View>
                <View>{user.email}</View>
                {
                    userId !== currentUserId
                    ? <View>{
                        following 
                        ? <Button title="Following" onPress={handleUnfollow}/>
                        : <Button title="Follow" onPress={handleFollow}/>
                        }</View>
                    : null
                }
            </View>
            <View style={styles.galleryContainer}>
                <FlatList 
                    horizontal={false} 
                    numColumns={3} 
                    data={userPosts} //add componentDidUpdate
                    renderItem={item => (
                        <View style={styles.imageContainer}>
                            <Image source={{uri: item.downloadUrl}}/>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    ); 
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
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
export default connect(mapStateToProps, null)(Profile);