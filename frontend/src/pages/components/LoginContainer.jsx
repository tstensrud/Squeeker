import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../../context/AuthContext";

function LoginContainer({ userSubscriptionsRefetch, refetchUserData, setShowLoginCointainer }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const { dispatch } = useContext(AuthContext);
    
    // Handlers
    const handleUsernameChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                dispatch({ type: "LOGIN", payload: user })
                setShowLoginCointainer(false);
            })
            .catch((error) => {
                const errorCode = error.code;
                //console.log(errorCode);
                const errorMessage = error.message;
                //console.log(errorMessage)
                setError(true);
            });
    }

    const closeLoginContainer = () => {
        setShowLoginCointainer(false);
    }


    return (
        <>
            <div className="login-wrapper">
                <div className="login-container">
                    <div className="login-card">

                        <h3>Log in</h3>
                        <form onSubmit={handleLogin}>
                            <input onChange={handleUsernameChange} type="text" placeholder="E-mail" />
                            <br />
                            <input onChange={handlePasswordChange} type="password" placeholder="Password" />
                            <br />
                            <button type="submit">Log in</button>
                        </form>
                        <p>
                            {error && <>Wrong username and/or email. <br />
                                <Link className="link-card" to="/reset">Forgot password?</Link></>}
                        </p>
                        <div>
                            <Link className="link-card" to="#" onClick={closeLoginContainer} >Close</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginContainer