
import axios from 'axios';



export const signInCallack = () => async (dispatch, getState) => {
    axios.get("http://localhost:5000/api/login/callback", { withCredentials: true })
        .then(response => {
            console.log(response.data)
            let user_token = response.data.user_token
            let refresh_token = response.data.refresh_token
            console.log("action, usertoken", user_token)
            console.log("action, refresh", refresh_token)
            localStorage.setItem("user_token", user_token)
            localStorage.setItem("refresh_token", refresh_token)
            
            dispatch({type: "LOG_IN_CALLBACK", loggedIn: true})
        })
        .catch(err => console.log(err))
}

export const checkLogInStatus = () => (dispatch, getState) => {
    
    const user_token = localStorage.getItem("user_token")
    const refresh_token = localStorage.getItem("refresh_token")

    console.log("user_token?", Boolean(user_token))
    console.log("refresh_token?", Boolean(refresh_token))

    if (user_token && refresh_token){
        console.log("found both tokens, yes")
        axios.get("http://localhost:5000/api/getcurrentuser", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("user_token")}`
                }
        }).then(res => {
                console.log("found user?", res.data)
                let state = {loggedIn: true, loggedInUser: res.data}
                dispatch({type: "LOG_IN_STATUS", state})
        })
    }
    else {
        console.log("no user logged in")
        let state = {loggedIn: false, loggedInUser: {}}
        dispatch({type: "LOG_IN_STATUS", state})
    }

}

export const signOut = () => async (dispatch, getState) => {
    // axios.get("http://localhost:5000/api/login/callback", { withCredentials: true })
    //     .then(response => {
    //         let user_token = response.data
    //         console.log("action, usertoken", user_token)
    //         localStorage.setItem("user_token", user_token)
    //         dispatch({type: "LOG_IN_CALLBACK", loggedIn: true})
    //     })
    //     .catch(err => console.log(err))

    if (localStorage.getItem("user_token")) {
        const token = localStorage.getItem("user_token")
        axios.post("http://localhost:5000/api/logout/access", {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.data.error) {
                console.error(res.data.error)
            } else {
                localStorage.removeItem("user_token")
            }
        })
    }
    if (localStorage.getItem("refresh_token")) {
        const refreshToken = localStorage.getItem("refresh_token")
        axios.post("http://localhost:5000/api/logout/refresh", {}, {
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        }).then(res => {
            if (res.data.error) {
                console.error(res.data.error)
            } else {
                localStorage.removeItem("refresh_token")
            }
        })
    }
    localStorage.clear();

    console.log("me out")
    dispatch({type: "LOG_OUT", loggedIn: false})

}

// export const loadCards = () => async (dispatch, getState) => {
//     const cards = await axios.get("http://localhost:5000/api/flashcards")
//         .then(response => {
//             const cards = response.data
//             console.log("mah cah")
//             console.log(cards)
//             dispatch({type: "LOAD_CARDS", cards: cards})
//         })
//         .catch(err => console.log(err))

// }

  
//   export const signOut = () => {
//     return (dispatch, getState, {getFirebase}) => {
//       const firebase = getFirebase();
  
//       firebase.auth().signOut().then(() => {
//         dispatch({ type: 'SIGNOUT_SUCCESS' })
//       });
//     }
//   }