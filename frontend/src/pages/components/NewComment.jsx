import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';

import { BASE_URL } from '../../utils/globalVariables';
import useSubpagePost from '../../hooks/useSubpagePost';

function NewComment({commentDataRefech, postId, subpageUid, subPageName, msgToParent}) {

    const { currentUser, idToken } = useContext(AuthContext);
    const [comment, setComment] = useState("");
    const [commentWarning, setCommentWarning] = useState("");
    const { loading, data, error, subpagePost } = useSubpagePost(`${BASE_URL}/api/subpage/comment/new/`, idToken);

    useEffect(() => {
        if(data !== null && data !== undefined) {
            if (data.success !== false) {
                commentDataRefech();
            }
            commentRef.current.value = "";
        }
    },[data]);
    
    // Handlers
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.comment || comment.comment === "") {
            setCommentWarning("Comments can not be empty");
            return;
        }
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
            <div className="flex flex-col bg-card-bg-color rounded-lg mt-5 p-3">
                <span>
                <h2 className="text-xl mt-2 mb-2">Leave a comment</h2>
                </span>
                <form onSubmit={handleSubmit}>
                    <textarea ref={commentRef} onChange={handleInputChange} name="comment" className="bg-app-bg-color border border-border-color outline-none p-2 h-40 w-96 rounded-lg mb-3 hover:border-form-hover focus:border-form-focus" placeholder="Write a comment"></textarea>
                    <p>
                        <button className="standard-button mr-3" type="submit">Post</button>
                        {commentWarning}
                        {data && data.success === false ? <>{data.message}</> : ""}
                        {error && error}
                        {data && data.error ? (<>{data.error}</>):(<></>)}
                    </p>
                    
                </form>
                <p>

                </p>
            </div>
        </>
    );
}

export default NewComment;