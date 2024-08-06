import { useState } from 'react';

import { collection, serverTimestamp, addDoc } from "firebase/firestore";
import { db } from '../utils/firebase';

function CreateSubPage() {

    const [pageData, setPageData] = useState({});
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        setPageData({
            ...pageData,
            [e.target.id]: e.target.value,
        })
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const res = await addDoc(collection(db, "subpages"), {

                subpageName: pageData.name,
                description: pageData.description,
                timeStamp: serverTimestamp(),
            });
            console.log(res);
        } catch (err) {
            console.log(err)
            setError(err.message);
        }
    }

    return (
        <>
            <div className="login-container">
                <div className="login-card">
                    Create new subpage <br />
                    
                    <form onSubmit={handleRegister}>
                        <input id="name" onChange={handleInputChange} type="text" placeholder="Subpage name" />

                        <input id="description" onChange={handleInputChange} type="text" placeholder="Subpage description" />

                        <button type="submit">Create!</button>
                    </form>
                    <br />
                    {error && error}
                </div>
            </div>
        </>
    );
}

export default CreateSubPage;