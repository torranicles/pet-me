import firebase from "firebase";
import { USER_POSTS_STATE_CHANGE, USER_STATE_CHANGE } from "../constants";

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