import { Link } from 'react-router-dom';

// Hooks and globals
import useFetch from '../../hooks/useFetch';

function Post({ postData }) {
    
        return (
        <>
            <div className="post-card">

                <div className="flex flex-col w-16 pt-3 items-center">
                    <div>{postData.total_votes}</div>
                    <div>pts</div>
                </div>

                <div className="flex flex-col">

                    <div className="w-full">
                        <Link className="post-card-title-link" to={`/room/${postData.subpage_name}/post/${postData.uid}/`}>
                        <h3>{postData.title}</h3>
                        </Link>
                    </div>

                    <div className="w-full text-base text-grey-text">
                        {postData.post.length > 30 ? <>{postData.post.slice(0,30)}(...)</> : <>{postData.post}</>}
                    </div>

                    <div className="w-full text-xs text-grey-text">
                        <ul className="p-0 list-none m-0">
                            <li className="inline mr-3 tracking-wide">
                                <span className="grey-info-text">Last modified at: {postData.event_timestamp}</span>
                            </li>
                            <li className="inline mr-3 tracking-wide">
                                <span className="grey-info-text">Posted by: {postData.author_name}</span>
                            </li>
                            <li className="inline mr-3 tracking-wide">
                                <span className="grey-info-text">Posted to: <Link to={`/room/${postData.subpage_name}`}>{postData.subpage_name}</Link></span>
                            </li>
                        </ul>
                    </div>
                    <div className="w-full text-xs text-grey-text">
                        <ul className="p-0 list-none m-0">
                            <li className="inline mr-3 tracking-wide">
                               <Link to={`/room/${postData.subpage_name}/post/${postData.uid}/`}> {postData.comment_count} comments</Link>
                            </li>
                            <li className="inline mr-3 tracking-wide">
                                <Link  to="">Share</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Post

