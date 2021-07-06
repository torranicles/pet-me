import firebase from "firebase";
import { USER_STATE } from "../constants";

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
                        type: USER_STATE,
                        currentUser: doc.data()
                    })
                } else {
                    console.log("Document not found.") //Update
                }
            })
        }
    )
}