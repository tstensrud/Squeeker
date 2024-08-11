import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
function ForgottenPassword() {

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [resetComplete, setResetComplete] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const auth = getAuth();
    const handleReset = (e) => {
        e.preventDefault();

        sendPasswordResetEmail(auth, email)
            .then(() => {
                setResetComplete("Password reset. Check your email for instructions.")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorMessage);
                // ..
            });
    }
    return (
        <>
            <div className="login-container">
                <div className="login-card">
                    <h3>Password reset</h3>
                    <form onSubmit={handleReset}>
                        <input onChange={handleEmailChange} type="text" placeholder="E-mail" />
                        <br />
                        <button type="submit">Reset</button>
                    </form>
                    <p>
                        {error && error}
                    </p>
                    <p>
                        {resetComplete && resetComplete}
                    </p>
                    
                </div>
            </div>
        </>
    );
}

export default ForgottenPassword;