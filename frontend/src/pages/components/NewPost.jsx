import { useState } from 'react';

import { collection, serverTimestamp, addDoc } from "firebase/firestore";
import { db } from '../../utils/firebase';

function NewPost({subPageName}) {

    const [postContent, setPostContent] = useState("");
    
    const handleInputChange = (e) => {
        setPostContent({
            ...postContent,
            [e.target.id]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await addDoc(collection(db, "subpagePost"), {
                author: "name",
                title: postContent.title,
                content: postContent.content,
                timestamp: serverTimestamp(),
                pts: 1,
                downvotes: 0,
                upvotes: 1,
                sub
            });

        } catch (err) {
            console.log(err);
        }
    }
    return (
        <>
            <div className="content-card">
                <form onSubmit={handleSubmit}>
                    <input onChange={handleInputChange} id="title" type="text" placeholder="Post title" />
                    <textarea onChange={handleInputChange} id="content" className="form-text-area" placeholder="Write something here.."></textarea>
                    <button type="submit">Post</button>
                </form>
            </div>
        </>
    );
}

export default NewPost;