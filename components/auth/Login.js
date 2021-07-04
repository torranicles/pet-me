import React, { Component } from 'react';
import { View, TextInput, Button } from 'react-native';
import firebase from 'firebase';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: '',
            password: ''
        };
    }

    handleSignIn() {
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(res => {
            console.log(res)
        })
        .catch(err => console.log(err))
    }

    render() {
        return (
            <View>
                <TextInput 
                    placeholder="email"
                    onChangeText={(email) => this.setState({email})}/>
                <TextInput 
                    placeholder="password"
                    onChangeText={(password) => this.setState({password})}
                    secureTextEntry={true}/>
                <Button
                    title="Sign in"
                    onPress={this.handleSignIn}/>
            </View>
        );
    }
}

export default Login;