import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { signOut } from "firebase/auth";
import { auth } from '../../utils/firebase';

import { AuthContext } from '../../context/AuthContext';

function Header({userData}) {

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
                    <ul className="horizontal-list">
                        <li className="horizontal-list-item">
                            Some</li>
                        <li className="horizontal-list-item">
                            Popular
                        </li>
                        <li className="horizontal-list-item">
                            Subpages
                        </li>
                        <li className="horizontal-list-item">
                            - <Link to="/subpage/create">Create new subpage</Link>
                        </li>
                    </ul>
                </div>
                <div className="right-aligned-container">
                <ul className="horizontal-list">
                    <li className="horizontal-list-item">
                        {userData.name}
                    </li>
                    <li className="horizontal-list-item">
                        <button className="logout-button" onClick={logOut}>Log out</button>
                    </li>
                </ul>
                </div>
            </div>
        </>
    );
}

export default Header;