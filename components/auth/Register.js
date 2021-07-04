import React, { Component } from 'react';
import { View, TextInput, Button } from 'react-native';
import firebase from 'firebase';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            password: '',
        };
        this.handleSignUp = this.handleSignUp.bind(this);
    }

    handleSignUp() {
        const { email, name, password } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(res => {
            firebase.firestore().collection("users")
            .doc(firebase.auth().currentUser.uid)
            .set({
                name,
                email
            })
            console.log(res)
        })
        .catch(err => console.log(err))
    }
    render() {
        return (
            <View>
                <TextInput 
                    placeholder="name"
                    onChangeText={(name) => this.setState({name})}/>
                <TextInput 
                    placeholder="email"
                    onChangeText={(email) => this.setState({email})}/>
                <TextInput 
                    placeholder="password"
                    onChangeText={(password) => this.setState({password})}
                    secureTextEntry={true}/>
                <Button
                    title="Sign up"
                    onPress={this.handleSignUp}/>
            </View>
        );
    }
}

export default Register;