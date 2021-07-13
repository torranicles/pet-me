import React from 'react';
import { SafeAreaView, View, Text, Image, FlatList, StyleSheet, StatusBar, Platform } from 'react-native';
import { connect } from 'react-redux'

function Profile(props) {
    const { currentUser, posts } = props;
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.infoContainer}>
                <Text>{currentUser.name}</Text>
                <Text>{currentUser.email}</Text>
            </View>
            <View style={styles.galleryContainer}>
                <FlatList 
                    horizontal={false} 
                    numColumns={3} 
                    data={posts} //add componentDidUpdate
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
    posts: store.userState.posts
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