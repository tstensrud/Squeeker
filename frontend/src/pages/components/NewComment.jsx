import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';

import { BASE_URL } from '../../utils/globalVariables';
import useSubpagePost from '../../hooks/useSubpagePost';

function NewComment({commentDataRefech, postId, subpageUid, subPageName, msgToParent}) {

    const { currentUser, idToken } = useContext(AuthContext);
    const [comment, setComment] = useState("");
    const { loading, data, error, subpagePost } = useSubpagePost(`${BASE_URL}/api/subpage/comment/new/`, idToken);

    useEffect(() => {
        if(data !== null && data !== undefined) {
            commentDataRefech();
            commentRef.current.value = "";
        }
    },[data]);
    
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
        if (currentUser) {
            setComment({
                author: currentUser.uid,
                postId: postId,
                subpageUid: subpageUid,
                subPageName: subPageName,
            });
        }
    },[]);

    // Textarea ref
    const commentRef = useRef(null);

    return (
        <>
            <div className="flex-box-column">
                <span>
                    <h4>Leave a comment</h4>
                </span>
                <form onSubmit={handleSubmit}>
                    <textarea ref={commentRef} onChange={handleInputChange} name="comment" className="form-text-area" placeholder="Write a comment"></textarea>
                    <p>
                        <button type="submit">Post</button>
                    </p>
                    
                </form>
            </div>
            <p>
                {error && error}
                {data && data.error ? (<>{data.error}</>):(<></>)}
            </p>
        </>
    );
}

export default NewComment;