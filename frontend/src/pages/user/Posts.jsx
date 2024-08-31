import { Link } from "react-router-dom";

function Posts({ postData }) {

    return (
        <div className="card mb-3">
            <div className="text-xl">
                <Link to={`/room/${postData.subpage_name}/post/${postData.uid}`}>{postData.title}</Link>
            </div>
            <div className="text-grey-text">
                {postData.post}
            </div>
            <div className="text-grey-text text-xs">
                Posted to: {postData.subpage_name} @ {postData.timestamp}
            </div>
        </div>
    );
}

export default Posts