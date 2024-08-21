import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

import { BASE_URL } from '../../utils/globalVariables';
import useSubpagePost from '../../hooks/useSubpagePost';
import { useNavigate } from 'react-router-dom';

function NewPost(props) {

    const { currentUser, idToken } = useContext(AuthContext);
    const [postContent, setPostContent] = useState("");
    const subpageUid = props.subPageUid;
    const { loading, data, error, subpagePost } = useSubpagePost(`${BASE_URL}/api/subpage/${subpageUid}/new_post/`, idToken);
    const navigate = useNavigate();
    const subpageName = props.subPageName;

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
    }, [subpageUid]);

    useEffect(() => {
        if (data && data.success === true) {
            //props.refetchSubpageData();
            navigate(`/room/${subpageName}/post/${data.data.post_uid}/`)
        }
    }, [data])

    const handleSubmit = async (e) => {
        e.preventDefault();
        await subpagePost(postContent);
        //navigate to the new post, with the uid receved from this method
    }

    return (
        <>
            <div className="flex-box-column">
                <div className="card-title">
                    <strong>Create new discussion topic</strong>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex-box-column">
                        <div>
                            <input onChange={handleInputChange} id="title" type="text" placeholder="Post title" />
                        </div>
                        <div>
                            <textarea onChange={handleInputChange} id="content" className="form-text-area" placeholder="Write something here.."></textarea>
                        </div>

                        <div>
                            <button type="submit">Post</button>
                        </div>
                    </div>
                </form>
            </div>
            <p>
                {error && error}
            </p>
        </>
    );
}

export default NewPost;