import { signOut } from "firebase/auth";
import { auth } from '../../utils/firebase';

function Header() {

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
                            Some
                        </li>
                        <li className="horizontal-list-item">
                            Popular
                        </li>
                        <li className="horizontal-list-item">
                            Subpages
                        </li>
                    </ul>
                </div>
                <div className="right-aligned-container">
                    <button className="logout-button" onClick={logOut}>Log out</button>
                </div>
            </div>
        </>
    );
}

export default Header;