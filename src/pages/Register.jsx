import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../utils/firebase';
import { useState } from "react";

function Register() {

    const [userData, setUserData] = useState({});
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        setUserData({
            ...userData,
            [e.target.id]: e.target.value,
        })
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        //const auth = getAuth();
        try {
            const res = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            await setDoc(doc(db, "users", res.user.uid), {
                email: userData.email,
                name: userData.name,
                timeStamp: serverTimestamp(),
            });
        } catch (err) {
            console.log(err)
            setError(err.message);
        }

    }

    return (
        <>
            <div className="login-container">
                <div className="login-card">
                    Register <br />
                    <form onSubmit={handleRegister}>
                        <input id="email" onChange={handleInputChange} type="text" placeholder="E-mail" />

                        <input id="password" onChange={handleInputChange} type="password" placeholder="Password" />

                        <input id="name" onChange={handleInputChange} type="text" placeholder="Name" />
                        <br />
                        <button type="submit">Register</button>
                    </form>
                    <br />
                    {error && error}
                </div>
            </div>
        </>
    );
}

export default Register;