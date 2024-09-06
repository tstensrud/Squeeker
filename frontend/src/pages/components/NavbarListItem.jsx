import { useEffect } from "react";
import { Link } from "react-router-dom";

function NavbarListItem({ setShowSubTree, showSubTree, setSelectedIndex, url, name, selectedIndex, svg, index, notification }) {

    const handleClick = (e) => {
        if (name === "Subscriptions") {
            e.preventDefault();
            setShowSubTree(!showSubTree);
        } else {
            setSelectedIndex(index);
        }
    }
    //console.log(name, index, selectedIndex)

    return (
        <li>
            {
                selectedIndex === index ? (
                    <Link
                        onClick={handleClick}
                        to={url}
                        className="group fill-none stroke-navbar-active-link-text flex flex-row mr-3 text-base mt-1 p-1 font-normal bg-navbar-link-active-bg rounded-md text-navbar-active-link-text tracking-wide hover:text-accent-color">
                        <div className="flex flex-row items-center w-full">
                            <div className="align-middle mr-2 w-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-accent-color hover:stroke-accent-color">
                                    {svg}
                                </svg>
                            </div>
                            <div className="flex flex-auto">
                                {name}
                            </div>
                            <div>
                                {
                                    name === "Messages" && (
                                        notification === true &&
                                        <div className="text-xs bg-navbar-link-active-bg text-primary-color p-1 rounded-lg">
                                            New!
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </Link>
                ) : (
                    <Link
                        onClick={handleClick}
                        to={url}
                        className="group fill-none flex flex-row mr-3 mt-1 text-base p-1 font-normal tracking-wide text-navbar-link hover:text-primary-color transition-colors duration-200">
                        <div className="flex flex-row items-center w-full">
                            <div className="align-middle mr-2 w-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    className="stroke-navbar-link group-hover:stroke-primary-color transition-colors duration-200">
                                    {svg}
                                </svg>
                            </div>
                            <div className="flex flex-auto">
                                {name}
                            </div>
                            <div>
                                {
                                    name === "Messages" && (
                                        notification === true &&
                                        <div className="text-xs bg-navbar-link-active-bg text-primary-color p-1 rounded-lg">
                                            New!
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </Link>
                )
            }
        </li>
    );
}

export default NavbarListItem;