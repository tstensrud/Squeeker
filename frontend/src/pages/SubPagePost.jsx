import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/globalVariables';
import LoadingSpinner from './components/LoadingSpinner';

// SVG import
import ArrowUp from '../assets/svg/ArrowUp.svg?react';
import ArrowDown from '../assets/svg/ArrowDown.svg?react';

function SubPagePost() {

    const { subPageName, postId } = useParams();
    const { currentUser, idToken } = useContext(AuthContext);
    const { data: subpageData, loading: subpageDataLoading, error: subpageDataError } = useFetch(`${BASE_URL}/api/subpage/${subPageName}/`, idToken);
    const { data: postData, loading: postDataLoading, error: postDataError } = useFetch(
        postId ? `${BASE_URL}/api/subpage/post/${postId}/` : null, idToken);
    
    //console.log("ppost data:", postData)



    return (
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

            COMMENTS!
        </>
    );
}

export default SubPagePost;