import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

import { BASE_URL } from '../../utils/globalVariables';
import useSubpagePost from '../../hooks/useSubpagePost';

function NewPost(props) {

    const { currentUser, idToken } = useContext(AuthContext);
    const [postContent, setPostContent] = useState("");
    const subpageUid = props.subPageUid;
    const { loading, error, subpagePost } = useSubpagePost(`${BASE_URL}/api/subpage/${subpageUid}/new_post/`, idToken);

    const handleInputChange = (e) => {
        setPostContent({
            ...postContent,
            [e.target.id]: e.target.value,
        })
    }

    useEffect(() => {
        setPostContent({
            ...postContent,
            author: props.author.uid,
            pts: 1,
            downvotes: 0,
            upvotes: 1,
            subpageName: props.subPageName,
        });
    }, [])

    useEffect(() => {
        setPostContent((prevContent) => ({
            ...prevContent,
            subpageUid: subpageUid,
        }));
    }, [subpageUid])

    const handleSubmit = async (e) => {
        e.preventDefault();
        subpagePost(postContent);
    }
    return (
        <>
            <div className="flex-box-column">
                <span>
                    <h4>Create new post</h4>
                </span>
                <form onSubmit={handleSubmit}>
                    <input onChange={handleInputChange} id="title" type="text" placeholder="Post title" />
                    <textarea onChange={handleInputChange} id="content" className="form-text-area" placeholder="Write something here.."></textarea>
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

export default NewPost;