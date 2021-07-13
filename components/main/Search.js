import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import "firebase/firestore";

function Search(props) {
    const [users, setUsers] = useState([]);
    
    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            .where('name', '>=', search)
            .get()
            .then(snapshot => {
                if (snapshot) {
                    let users = snapshot.docs.map(doc => {
                        let id = doc.id;
                        let data = doc.data();
                        return { id, ...data }
                    });
                    setUsers(users);
                }
            })
    }
    return (
        <View style={{flex: 1}}>
            <TextInput placeholder="Search" onChangeText={(search) => fetchUsers(search)}/>
            <FlatList 
                numColumns={1} 
                horizontal={false} 
                data={users} //Add componentDidMount
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => props.navigation.navigate("Profile", {userId: item.id})}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

export default Search;