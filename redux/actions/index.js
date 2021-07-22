import firebase from "firebase";
import { USER_POSTS_STATE_CHANGE, USER_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE } from "../constants";

export const fetchUser = () => {
    return (
        (dispatch) => {
            firebase.firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .get()
                .then(doc => {
                    if (doc.exists) {
                        dispatch({
                            type: USER_STATE_CHANGE,
                            currentUser: doc.data()
                        });
                        console.log(doc.data())
                    } else {
                        console.log("Document not found.") //Update
                    }
                })
        }
    )
}

export const fetchUserPosts = () => {
    return (
        (dispatch) => {
            firebase.firestore()
                .collection("posts")
                .doc(firebase.auth().currentUser.uid)
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
                    dispatch({
                        type: USER_POSTS_STATE_CHANGE,
                        posts
                    })
                })
        }
    )
}

export const fetchUserFollowing = () => {
    return (
        (dispatch) => {
            firebase.firestore()
                .collection("following")
                .doc(firebase.auth().currentUser.uid)
                .collection("userFollowing")
                .get()
                .onSnapshot(snapshot => {
                    let following;
                    if (snapshot) {
                        following = snapshot.docs.map(doc => {
                            let id = doc.id;
                            return id;
                        })
                    }
                    dispatch({
                        type: USER_FOLLOWING_STATE_CHANGE,
                        following
                    });
                    for (let i = 0; i < following.length; i++) {
                        dispatch(fetchUsersData(following[i]))
                    }
                })
        }
    )
}

export const fetchUsersData = (uid) => {
    return ((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);

        if (!found) {
            firebase.firestore()
                .collection("users")
                .doc(uid)
                .get()
                .then(doc => {
                    if (doc.exists) {
                        let user = doc.data();
                        user.uid = doc.id;
                        dispatch({
                            type: USERS_DATA_STATE_CHANGE,
                            user
                        });
                        dispatch(fetchUsersFollowingPosts(user.id));
                        console.log(doc.data())
                    } else {
                        console.log("Document not found.") //Update
                    }
                })
        }
    })
}

export const fetchUsersFollowingPosts = (uid) => {
    return (
        (dispatch) => {
            firebase.firestore()
                .collection("posts")
                .doc(uid)
                .collection("userPosts")
                .orderBy("creation", "asc")
                .get()
                .then(snapshot => {    
                    const uid =   snapshot.query.EP.path.segments[1]; 
                    const user = getState().usersState.users.find(el => el.uid === uid);
                    let posts;
                    if (snapshot) {
                        posts = snapshot.docs.map(doc => {
                            let id = doc.id;
                            let data = doc.data();
                            return { id, ...data, user }
                        })
                    }
                    dispatch({
                        type: USERS_POSTS_STATE_CHANGE,
                        uid,
                        posts
                    })
                })
        }
    )
}