import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { signOut } from "firebase/auth";
import { auth } from '../../utils/firebase';

import { AuthContext } from '../../context/AuthContext';

function Header(props) {

    const {currentUser} = useContext(AuthContext);

    const logOut = async (e) => {
        e.preventDefault();
        await signOut(auth).then(() => {
            navigate("/");
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <>
            <div className="header-top-bar">
                <div className="left-aligned-container">
                    <ul className="header-menu-list">
                    <li className="header-menu-list-item">
                            <Link className="a-header-menu" to="/">Frontpage</Link>
                        </li>
                        <li className="header-menu-list-item">
                            <Link className="a-header-menu" to="/subpage/create">Some</Link>
                        </li>
                        <li className="header-menu-list-item">
                            <Link className="a-header-menu" to="/subpage/create">Popular</Link>
                        </li>
                        <li className="header-menu-list-item">
                            <Link className="a-header-menu" to="/subpage/create">Subpages</Link>
                        </li>
                        <li className="header-menu-list-item">
                            # <Link className="a-header-menu" to="/subpage/create">Create new subpage</Link>
                        </li>
                    </ul>
                </div>
                <div className="right-aligned-container">
                <ul className="header-menu-list">
                    <li className="header-menu-list-item">
                    <Link className="a-header-menu" to="/subpage/create">username</Link>
                    </li>
                    <li className="header-menu-list-item">
                        {
                            props.idToken ? (<><a href="#" className="a-header-menu" onClick={logOut}>Log out</a></>) : (<>Log in</>)
                        }
                        
                    </li>
                </ul>
                </div>
            </div>
        </>
    );
}

export default Header;