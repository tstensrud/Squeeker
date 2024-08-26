import { Link } from "react-router-dom";


function Comments(props) {
    
    return (
        <>
            <div className="card">
                <div className="text-xs">
                   Commented @ {props.data.timestamp} in <Link to={`/room/${props.data.subpage_name}/post/${props.data.post_uid}`}>{props.data.subpage_name}</Link>
                </div>
                <div className="text-grey-text">
                    {props.data.comment}
                </div>
                <div className="text-grey-text text-xs font-bold">
                    {props.data.total_votes} pts.
                </div>
            </div>
        </>
    );
}

export default Comments;