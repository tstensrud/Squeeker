import { Link } from "react-router-dom";

function SubPageDoesNotExist(props) {
    const subPageName = props.subPageName;
    return (
            <div className="flex flex-col w-full h-full justify-center items-center text-center">
                <div>
                    <h2 className="text-2xl">This room is yet to be built.</h2>
                </div>
                <div>
                    {subPageName} does not exists.
                </div>
                <div>
                    <Link className="link-card" to="/room/create/">Click here</Link> to create a new subpage.
                </div>

            </div>
    );
}

export default SubPageDoesNotExist;