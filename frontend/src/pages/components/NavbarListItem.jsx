import { Link } from "react-router-dom";

function NavbarListItem(props) {

    const navbarClick = () => {
        props.handleNavbarClick(props.index);
    }
    return (
        <li>
            <Link
                onClick={navbarClick}
                to={props.url}
                className={
                    props.selectedIndex === props.index
                        ? "group fill-none stroke-navbar-active-link-text flex flex-row mr-3 text-base mt-1 p-1 font-normal bg-navbar-link-active-bg rounded-md text-navbar-active-link-text tracking-wide"
                        : "group fill-none flex flex-row mr-3 mt-1 text-base p-1 font-normal tracking-wide text-header-link hover:text-header-link-hover transition-colors duration-200"}>
                <div className="flex flex-row items-center w-full">
                    <div className="align-middle mr-2 w-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className={props.selectedIndex === props.index ? "" : "stroke-svg-icon-color group-hover:stroke-header-link-hover transition-colors duration-200"}>
                            {props.svg}
                        </svg>
                    </div>
                    <div className="flex flex-auto">
                        {props.name}
                    </div>
                </div>
            </Link>
        </li>
    );
}

export default NavbarListItem;