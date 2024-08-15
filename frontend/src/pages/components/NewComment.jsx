import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

import { BASE_URL } from '../../utils/globalVariables';
import useSubpagePost from '../../hooks/useSubpagePost';

function NewComment(props) {

    const { currentUser, idToken } = useContext(AuthContext);
    const [comment, setComment] = useState("");
    const { loading, data, error, subpagePost } = useSubpagePost(`${BASE_URL}/api/subpage/comment/new/`, idToken);

    // Handlers
    const handleSubmit = async (e) => {
        e.preventDefault();
        await subpagePost(comment);
        //console.log(comment);
    }

    const handleInputChange = (e) => {
        setComment({
            ...comment,
            [e.target.name]: e.target.value,
        })
    }

    useEffect(() => {
        setComment({
            author: currentUser.uid,
            postId: props.postId,
            subpageUid: props.subpageUid,
            subPageName: props.subPageName,
        });
    },[]);

    return (
        <>
            <div className="flex-box-column">
                <span>
                    <h4>Comment</h4>
                </span>
                <form onSubmit={handleSubmit}>
                    <textarea onChange={handleInputChange} name="comment" className="form-text-area" placeholder="Write a comment"></textarea>
                    <p>
                        <button type="submit">Post</button>
                    </p>
                    
                </form>
            </div>
            <p>
                {error && error}
            </p>
        </>
    );
}

export default NewComment;