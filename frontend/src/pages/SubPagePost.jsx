import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/globalVariables';

// Components
import NewComment from './components/NewComment';
import LoadingSpinner from './components/LoadingSpinner';

// SVG import
import ArrowUp from '../assets/svg/ArrowUp.svg?react';
import ArrowDown from '../assets/svg/ArrowDown.svg?react';

function SubPagePost() {

    const { subPageName, postId } = useParams();
    const { currentUser, idToken } = useContext(AuthContext);
    const { data: subpageData, loading: subpageDataLoading, error: subpageDataError } = useFetch(`${BASE_URL}/api/subpage/${subPageName}/`, idToken);
    const { data: commentData, loading: commentDataLoading, error: commentDataError } = useFetch(`${BASE_URL}/api/subpage/post/${postId}/comments/`, idToken);
    const { data: postData, loading: postDataLoading, error: postDataError } = useFetch(
        postId ? `${BASE_URL}/api/subpage/post/${postId}/` : null, idToken);
    
    const [subpageUid, setSubpageUid] = useState("");

    useEffect(() => {
        setSubpageUid(subpageData && subpageData.data.uid)
    },[subpageData])
    
    console.log("Comment datakj: ", commentData);


    return (
        <>
            {
                postDataLoading && postDataLoading === true ? (
                    <>
                        <LoadingSpinner />
                    </>) : (
                    <>
                        <div className="content-card">
                            <div className="content-card-grid-item-header">
                                {postData && postData.data.title}
                            </div>
                            <div className="content-card-grid-item-score">
                                <div><ArrowUp /></div>
                                <div>{postData && postData.data.total_votes}</div>
                                <div><ArrowDown /></div>
                            </div>
                            <div className="content-card-grid-item-snippet">
                                {postData && postData.data.post}
                            </div>
                            <div className="content-card-grid-item-sub-footer">
                                <ul className="horizontal-list">
                                    <li className="horizontal-list-item">
                                        <span className="grey-info-text">Submitted at: {postData && postData.data.timestamp}</span>
                                    </li>
                                    <li className="horizontal-list-item">
                                        <span className="grey-info-text">Posted by: {postData && postData.data.author_name}</span>
                                    </li>
                                    <li className="horizontal-list-item">
                                        <span className="grey-info-text">Posted to: {subPageName}</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="content-card-grid-item-footer">

                            </div>
                        </div>
                        <NewComment subpageUid={subpageUid} postId={postId} subPageName={subPageName} />
                    </>
                )
            }


            COMMENTS!
        </>
    );
}

export default SubPagePost;