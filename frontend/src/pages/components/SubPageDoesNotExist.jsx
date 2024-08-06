import { Link } from "react-router-dom";

function SubPageDoesNotExist(props) {
    const subPageName = props.subPageName;
    return (
        <>
        <div className="content-card">
                <div className="content-card-grid-item-header">
                    The subpage "{subPageName}" does not exists.
                </div>
                <div className="content-card-grid-item-score">

                </div>
                <div className="content-card-grid-item-snippet">
                    <Link to="/subpage/create/">Click here</Link> to create a new subpage.

                </div>
                <div className="content-card-grid-item-sub-footer">

                </div>
                <div className="content-card-grid-item-footer">

                </div>
            </div>
        </>
    );
}

export default SubPageDoesNotExist;