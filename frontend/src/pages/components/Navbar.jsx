import { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { signOut } from "firebase/auth";
import { auth } from '../../utils/firebase';

import { AuthContext } from '../../context/AuthContext';

// SVG imports
import AppIcon from '../../assets/svg/AppIcon.svg?react'
import HomeIcon from '../../assets/svg/HomeIcon';
import ArrowDown from '../../assets/svg/ArrowDown.svg?react';
import Login from '../../assets/svg/Login.svg?react';
import Logout from '../../assets/svg/Logout.svg?react';
import User from '../../assets/svg/User.svg?react';
import NewSubpage from '../../assets/svg/NewSubpage.svg?react';

function Navbar(props) {

    const { currentUser } = useContext(AuthContext);
    const [selectedIndex, setSelectexIndex] = useState(0);

    const mainNavbarItems = [
        { name: "Frontpage", url: "/", svg: <HomeIcon /> },
        { name: "Subpages", url: "#", svg: <ArrowDown /> },
        { name: "Create new subpage", url: "/subpage/create", svg: <NewSubpage /> }
    ];

    const logOut = async (e) => {
        e.preventDefault();
        await signOut(auth).then(() => {
            navigate("/");
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleNavbarClick = (index) => {
        setSelectexIndex(index);
    }

    return (
        <>
            <div className="navbar-header-container">
                <div className="navbar-header-icon-container">
                    <AppIcon />
                </div>
                <h3>Squeek!</h3>
            </div>
            <div className="navbar-section-container">
                <ul className="navbar-list">
                    {
                        mainNavbarItems.map((item, index) => (

                            <li key={index} className={selectedIndex === index ? "navbar-list-item-active" : "navbar-list-item"}>
                                <Link to={item.url} onClick={() => handleNavbarClick(index)}>
                                    <div className="navbar-item-container">
                                        <div className="navbar-item-container">
                                            {item.svg}
                                        </div>
                                        <div className="navbar-item-container">
                                            {item.name}
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className="navbar-section-container">
                {
                    props.idToken ? (
                        <>
                            <ul className="navbar-list">
                                <li className="navbar-list-item">
                                    <Link to="/">
                                        <div className="navbar-item-container">
                                            <div className="navbar-item-container">
                                                <User />
                                            </div>
                                            <div className="navbar-item-container">
                                                username
                                            </div>
                                        </div>
                                    </Link>
                                </li>

                                <li className="navbar-list-item">
                                    <Link to="#">
                                        <div className="navbar-item-container" onClick={logOut}>
                                            <div className="navbar-item-container">
                                                <Logout />
                                            </div>
                                            <div className="navbar-item-container" onClick={logOut}>
                                                Log out
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </>
                    ) : (
                        <>
                            <ul className="navbar-list">
                                <li className="navbar-list-item">
                                    <div className="navbar-item-container">
                                        <Login />
                                    </div>
                                    <div className="navbar-item-container">
                                        <Link className="a-header-menu" to="/subpage/create">Log in</Link>
                                    </div>
                                </li>
                            </ul>
                        </>)}
            </div>
        </>
    );
}

export default Navbar;