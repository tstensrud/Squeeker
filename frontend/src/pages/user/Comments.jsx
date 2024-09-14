import { Link } from "react-router-dom";
import Card from "../components/Card";


function Comments(props) {

    return (
        <div className="mb-3">
            <Card>
                <div className="text-xs">
                    Commented @ {props.data.timestamp} in <Link to={`/room/${props.data.subpage_name}/post/${props.data.post_uid}`}>{props.data.subpage_name}</Link>
                </div>
                <div className="text-grey-text">
                    {props.data.comment}
                </div>
                <div className="text-grey-text text-xs font-bold">
                    {props.data.total_votes} pts.
                </div>
            </Card>
        </div>
    );
}

export default Comments;