import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'redux';
import { fetchUser } from '../redux/actions/index';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    componentDidMount() {
        this.props.fetchUser();
    }
    render() {
        const { currentUser } = this.props;
        return (
        <View style={styles.container}>
            <Text>
                User is logged in.
            </Text>
        </View>
        );
    }
}

const mapStateToProps = (store) => {
    currentUser: store.userState.currentUser
}
const mapDispatchToProps = (dispatch) => {
    bindActionCreators({ fetchUser }, dispatch)
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center'
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Main);