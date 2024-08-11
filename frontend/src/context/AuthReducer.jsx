const AuthReducer = (state, action) => {
    switch(action.type) {
        case "LOGIN": {
            return {
                currentUser: action.payload.user,
                idToken: action.payload.idToken,
            };
        }
        case "LOGOUT": {
            return {
                currentUser: null,
                idToken: null,
            };
        }
        default:
            return state;
    }
}

export default AuthReducer;