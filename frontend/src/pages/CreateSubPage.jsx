import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import useRegisterSubpage from '../hooks/useRegisterSubpage';
import { BASE_URL } from '../utils/globalVariables';

function CreateSubPage() {
    const { currentUser, idToken } = useContext(AuthContext);
    const [pageData, setPageData] = useState({ "public": true, "nsfw": false });
    //const [error, setError] = useState("");
    const { data, loading, error, registerSubpage } = useRegisterSubpage(`${BASE_URL}/api/subpage/create/`, idToken);
    const [publicChecked, setPublicChecked] = useState(true);
    const [nsfwChecked, setNsfwChecked] = useState(false);

    console.log(BASE_URL)

    const handleInputChange = (e) => {
        setPageData({
            ...pageData,
            [e.target.id]: e.target.value,
        })
    }

    const handleCheckboxChange = (e) => {
        if (e.target.id === "public") {
            setPageData({
                ...pageData,
                [e.target.id]: !publicChecked,
            })
            setPublicChecked(!publicChecked);
        }

        if (e.target.id === "nsfw") {
            setPageData({
                ...pageData,
                [e.target.id]: !nsfwChecked,
            })
            setNsfwChecked(!nsfwChecked);
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(pageData);
        registerSubpage(pageData)
    }

    return (
        <>
            <div className="content-card-flex">
                <h3>Create new subpage</h3>
                {
                    idToken ? (
                        <>
                            <form onSubmit={handleSubmit}>
                                <input id="name" onChange={handleInputChange} type="text" placeholder="Subpage name" />
                                <br />
                                <input id="description" onChange={handleInputChange} type="text" placeholder="Subpage description" />
                                <br />
                                <ul className="horizontal-list">
                                    <li className="horizontal-list-item">
                                        <div className="checkbox-container">
                                            Public <input id="public" onChange={handleCheckboxChange} type="checkbox" checked={publicChecked} />
                                        </div>
                                    </li>
                                </ul>
                                <ul className="horizontal-list">
                                    <li className="horizontal-list-item">
                                        <div className="checkbox-container">
                                            NSFW? <input id="nsfw" onChange={handleCheckboxChange} type="checkbox" checked={nsfwChecked} />
                                        </div>
                                    </li>
                                </ul>
                                <br />

                                <button type="submit">Create!</button>
                            </form>
                            <br />
                            {error && error}
                            {/* fetchError && JSON.stringify(fetchError) */}
                        </>
                    ) : (
                        <>
                            You need an account and to be logged in to create subpages.
                        </>
                    )
                }

            </div>
        </>
    );
}

export default CreateSubPage;