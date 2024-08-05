import { useContext, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const {dispatch} = useContext(AuthContext);

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
            dispatch({type:"LOGIN", payload:user})
            navigate("/");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(true);
          });
    }

    return (
        <>
            <div className="login-container">
                <div className="login-card">
                    <form onSubmit={handleLogin}>
                        <input onChange={handleUsernameChange} type="text" placeholder="E-mail" />

                        <input onChange={handlePasswordChange} type="password" placeholder="Password" />
                        <br />
                        <button type="submit">Log in</button>
                    </form>

                    {error && <span>Wrong username and/or email</span>}

                </div>
            </div>
        </>
    );
}

export default Login