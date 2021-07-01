import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native'

function Landing(props) {
    return (
        <View style={styles.container}>
            <Button
                title="Register"
                onPress={() => {
                    props.navigation.navigate("Register")
                }} />
            <Button
                title="Login"
                onPress={() => {
                    props.navigation.navigate("Login")
                }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
})
export default Landing;