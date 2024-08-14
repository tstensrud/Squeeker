import { Link } from 'react-router-dom';

// SVG import
import ArrowUp from '../../assets/svg/ArrowUp.svg?react';
import ArrowDown from '../../assets/svg/ArrowDown.svg?react';

function Post({postData}) {
    //console.log(postData)
    return (
        <>
            <div className="content-card">
                <div className="content-card-grid-item-header">
                    {postData.title}
                </div>
                <div className="content-card-grid-item-score">
                    <div><ArrowUp /></div>
                    <div>{postData.total_votes}</div>
                    <div><ArrowDown /></div>
                </div>
                <div className="content-card-grid-item-snippet">
                    {postData.post}
                </div>
                <div className="content-card-grid-item-sub-footer">
                    <ul className="horizontal-list">
                        <li className="horizontal-list-item">
                            <span className="grey-info-text">Submitted at: {postData.timestamp}</span>
                        </li>
                        <li className="horizontal-list-item">
                            <span className="grey-info-text">Posted by: {postData.author_name}</span>
                        </li>
                        <li className="horizontal-list-item">
                            <span className="grey-info-text">Posted to: {postData.subpage_name}</span>
                        </li>
                    </ul>
                </div>
                <div className="content-card-grid-item-footer">
                    <ul className="horizontal-list">
                        <li className="horizontal-list-item">
                            <Link className="link-card" to={`/subpage/${postData.subpage_name}/post/${postData.uid}/`}>Comments</Link>
                        </li>
                        <li className="horizontal-list-item">
                            <Link className="link-card" to="">Share</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Post