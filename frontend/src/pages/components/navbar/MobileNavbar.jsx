import { useState, useContext } from "react";
import { AuthContext } from '../../../context/AuthContext';

// Components
import NavbarListItem from "./NavbarListItem.jsx";
import SubscribedRoomListItem from "./SubscribedRoomListItem.jsx";
import LogOutNavitem from "./LogoutNavItem.jsx";
import LoginRegister from "./LoginRegister.jsx";

function MobilNavbar({ mainNavbarItems, loggedInNavbarItems, userSubscriptionsData, openLoginContainer, openRegisterContainer }) {
    const { currentUser, idToken } = useContext(AuthContext);

    const [showMenu, setShowMenu] = useState(false);
    const [showSubTree, setShowSubTree] = useState(false);
    return (
        <>
            <div onClick={() => setShowMenu(!showMenu)} className="pt-2 pl-2 cursor-pointer flex flex-row sticky">
                <div>
                    <svg className="stroke-primary-color" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </div>
                <div className="flex flex-1 justify-end pr-2 text-center items-center">
                    <h3>The lodge</h3>
                </div>
            </div>
            <div className="flex flex-row">
                <div className="flex flex-col pl-2 overflow-y-auto">
                    <div className={showMenu ? "max-h-[250px] transition-all duration-700 ease-in-out overflow-y-auto" : "max-h-0 overflow-hidden transition-all duration-700 ease-in-out"}>
                        <ul className="list-none mt-1 w-full p-0">
                            {
                                mainNavbarItems.map((item, index) => (
                                    <>
                                        {
                                            item.name === "Subscriptions" ? (
                                                <>
                                                    {currentUser && idToken && <NavbarListItem key={item.url} showSubTree={showSubTree} setShowSubTree={setShowSubTree} url={item.url} name={item.name} svg={item.svg} index={index} />}
                                                    <div className={showSubTree ? "max-h-[100px] transition-all duration-700 ease-in-out" : "max-h-0 overflow-hidden transition-all duration-700 ease-in-out"}>
                                                        <ul className="list-none w-full p-0 m-0">
                                                            {
                                                                userSubscriptionsData !== undefined && userSubscriptionsData.map((sub, index) =>
                                                                    <SubscribedRoomListItem key={`${sub}+${index}`} name={sub} url={`/room/${sub}/`} />
                                                                )
                                                            }
                                                        </ul>
                                                    </div>
                                                </>
                                            ) : (
                                                <NavbarListItem key={item.url} url={item.url} name={item.name} svg={item.svg} index={index} />
                                            )
                                        }
                                    </>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                <div className={showMenu ? "max-h-[250px] transition-all duration-700 ease-in-out overflow-hidden" : "max-h-0 overflow-hidden transition-all duration-700 ease-in-out"}>
                    {
                        currentUser && idToken ? (
                            <div>
                                <ul className="list-none mt-1 w-full p-0">
                                    {
                                        loggedInNavbarItems.map((item, index) => (
                                            <NavbarListItem key={item.url} url={item.url} name={item.name} svg={item.svg} index={index + mainNavbarItems.length} />
                                        ))
                                    }
                                    <LogOutNavitem />
                                </ul>
                            </div>
                        ) : (
                            <LoginRegister openLoginContainer={openLoginContainer} openRegisterContainer={openRegisterContainer} />
                        )
                    }
                </div>
            </div>
        </>
    );
}

export default MobilNavbar;