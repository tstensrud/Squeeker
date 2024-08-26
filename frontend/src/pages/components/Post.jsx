import { Link } from 'react-router-dom';


function Post({ postData }) {

    return (
        <>
            <div className="post-card">

                <div className="flex flex-col w-16 items-center">
                    <div>{postData.total_votes}</div>
                    <div>pts</div>
                </div>

                <div className="flex flex-col">

                    <div className="w-full">
                        <h3>{postData.title}</h3>
                    </div>

                    <div className="w-full text-base text-grey-text">
                        {postData.post}
                    </div>

                    <div className="w-full text-xs text-grey-text">
                        <ul className="p-0 list-none m-0">
                            <li className="inline mr-3 tracking-wide">
                                <span className="grey-info-text">Submitted at: {postData.timestamp}</span>
                            </li>
                            <li className="inline mr-3 tracking-wide">
                                <span className="grey-info-text">Posted by: {postData.author_name}</span>
                            </li>
                            <li className="inline mr-3 tracking-wide">
                                <span className="grey-info-text">Posted to: {postData.subpage_name}</span>
                            </li>
                        </ul>
                    </div>
                    <div className="w-full text-xs text-grey-text">
                        <ul className="p-0 list-none m-0">
                            <li className="inline mr-3 tracking-wide">
                                <Link  to={`/room/${postData.subpage_name}/post/${postData.uid}/`}>Comments</Link>
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