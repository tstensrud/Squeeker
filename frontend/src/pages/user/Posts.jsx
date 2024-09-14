import { Link } from "react-router-dom";
import Card from "../components/Card";

function Posts({ postData }) {

    return (
        <div className="mb-3">
        <Card>
            <div className="text-xl">
                <Link className="text-primary-color hover:text-accent-color" to={`/room/${postData.subpage_name}/post/${postData.uid}`}>{postData.title}</Link>
            </div>
            <div className="text-grey-text">
                {postData.post}
            </div>
            <div className="text-grey-text text-xs">
                Posted to: {postData.subpage_name} @ {postData.timestamp}
            </div>
        </Card>
        </div>
    );
}

export default Posts