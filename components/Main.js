import React, { Component } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { fetchUser, fetchUserPosts } from '../redux/actions/index';
import FeedScreen from './main/Feed';
import ProfileScreen from './main/Profile';
import SearchScreen from './main/Search';

const Tab = createMaterialBottomTabNavigator();
const EmptyScreen = () => {
    return (null)
}

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    componentDidMount() {
        this.props.fetchUser();
        this.props.fetchUserPosts();
    }
    render() {
        return (
            <Tab.Navigator initialRouteName="Feed" labeled={false}>
                <Tab.Screen 
                    name="Feed" 
                    component={FeedScreen} 
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26}/>
                        )
                    }}/>
                <Tab.Screen 
                    name="Search" 
                    component={SearchScreen} 
                    navigation={this.props.navigation}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="magnify" color={color} size={26}/>
                        )
                    }}/>
                <Tab.Screen 
                    name="AddContainer" 
                    component={EmptyScreen} 
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Add");
                        }
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="plus-box" color={color} size={26}/>
                        )
                    }}/>
                <Tab.Screen 
                    name="Profile" 
                    component={ProfileScreen} 
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account-circle" color={color} size={26}/>
                        )
                    }}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Profile", {userId: firebase.auth().currentUser.uid});
                        }
                    })}/>
            </Tab.Navigator>
        );
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserPosts }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);