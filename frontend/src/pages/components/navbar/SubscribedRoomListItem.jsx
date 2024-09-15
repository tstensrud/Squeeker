import { Link } from "react-router-dom";

function SubscribedRoomListItem(props) {

    return (
        <li className="ml-2 sm:m-0">
            <Link
                to={props.url}
                className="flex flex-row mr-3 text-base mt-1 p-1 font-normal rounded-md tracking-wide text-navbar-link hover:text-primary-color">
                <div className="flex flex-row items-center w-full">
                    <div className="align-middle mr-2 w-6">

                    </div>
                    <div className="flex flex-auto">
                        {
                            props.name.length > 15 ? (
                                <>
                                    {props.name.slice(0, 15)}...
                                </>
                            ) : (
                                <>
                                    {props.name}
                                </>
                            )
                        }
                    </div>
                </div>
            </Link>
        </li>
    );
}

export default SubscribedRoomListItem;