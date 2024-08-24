function NavbarListItem(props) {
    return (
        <>

                <li className={props.selectedIndex === props.index ? "flex flex-row mr-3 text-base mt-1 p-1 font-normal stroke-navbar-active-link-text bg-navbar-link-active-bg rounded-md text-navbar-active-link-text tracking-wide" : "group flex flex-row mr-3 mt-1 text-base p-1 font-normal tracking-wide text-header-link hover:text-header-link-hover transition-colors duration-200"}>
                    <div className="flex flex-row items-center w-full">
                        <div className="align-middle mr-2 w-6">
                            {props.svg}
                        </div>
                        <div className="flex-1">
                            {props.name}
                        </div>
                    </div>
                </li>

        </>
    );
}

export default NavbarListItem;