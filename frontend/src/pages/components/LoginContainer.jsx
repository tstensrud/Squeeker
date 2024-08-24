import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../../context/AuthContext";

function LoginContainer({ setShowLoginCointainer }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
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
                const errorMessage = error.message;
                setError(true);
                setErrorMessage(errorMessage)
            });
    }

    const closeLoginContainer = () => {
        setShowLoginCointainer(false);
    }


    return (
        <>
            <div className="fixed h-full w-full justify-center items-center z-50 bg-login-bg ">
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <div className="flex flex-col bg-card-bg-color p-6 w-96 h-96 justify-center items-center text-center rounded-lg">

                        <h3>Log in</h3>
                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <input className="h-10 w-80 bg-app-bg-color p-3 text-header-link-hover rounded-lg border text-sm border-border-color focus:border-form-focus outline-none hover:border-form-hover" onChange={handleUsernameChange} type="text" placeholder="E-mail" />
                            </div>
                            <div className="mb-4">
                                <input className="h-10 w-80 bg-app-bg-color p-3 text-header-link-hover rounded-lg border text-sm border-border-color focus:border-form-focus outline-none hover:border-form-hover" onChange={handlePasswordChange} type="password" placeholder="Password" />
                            </div>
                            <div className="mb-4">
                                <button className="bg-app-bg-color cursor-pointer border rounded-lg border-border-color p-1 h-10 w-24 text-grey-text transition:all 0.3 ease-in hover:border-link-green" type="submit">Log in</button>
                            </div>
                        </form>

                        <div className="mb-4">
                            <Link  to="#" onClick={closeLoginContainer} >Close</Link>
                        </div>
                        <p>
                            {error && <>{errorMessage}
                                <Link to="/reset">Forgot password?</Link></>}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginContainer