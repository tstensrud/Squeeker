import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

    const { dispatch, currentUser, idToken } = useContext(AuthContext);
    const [selectedIndex, setSelectexIndex] = useState(0);
    const navigate = useNavigate();
    let userData = props.userData && props.userData;

    console.log("userdata aladbfladfl:", userData);
    //console.log("userData", userData);
    const mainNavbarItems = [
        { name: "Frontpage", url: "/", svg: <HomeIcon /> },
        { name: "Subpages", url: "/subpages", svg: <ArrowDown /> },
        { name: "Create new subpage", url: "/subpage/create", svg: <NewSubpage /> }
    ];

    const logOut = async (e) => {
        e.preventDefault();
        await signOut(auth).then(() => {
            dispatch({type:"LOGOUT"});
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
                                        <div className="navbar-item-icon-container">
                                            {item.svg}
                                        </div>
                                        <div className="navbar-item-label-container">
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
                    idToken !== null && props.idToken === idToken ? (
                        <>
                            <ul className="navbar-list">
                                <li className="navbar-list-item">
                                    <Link to="#">
                                        <div className="navbar-item-container">
                                            <div className="navbar-item-icon-container">
                                                <User />
                                            </div>
                                            <div className="navbar-item-label-container">
                                                {userData && userData.data.username}
                                            </div>
                                        </div>
                                    </Link>
                                </li>

                                <li className="navbar-list-item">
                                    <Link to="#" onClick={logOut}>
                                        <div className="navbar-item-container">
                                            <div className="navbar-item-icon-container">
                                                <Logout />
                                            </div>
                                            <div className="navbar-item-label-container">
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
                                    <Link to="/login">
                                        <div className="navbar-item-container">
                                            <div className="navbar-item-icon-container">
                                                <Login />
                                            </div>
                                            <div className="navbar-item-label-container">
                                                Log in
                                            </div>
                                        </div>
                                    </Link>
                                </li>

                                <li className="navbar-list-item">
                                    <Link to="/register">
                                        <div className="navbar-item-container">
                                            <div className="navbar-item-icon-container">
                                                <Login />
                                            </div>
                                            <div className="navbar-item-label-container">
                                                Register
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </>
                    )}
            </div >
        </>
    );
}

export default Navbar;