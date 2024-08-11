import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import useRegisterSubpage from '../hooks/useRegisterSubpage';
import { BASE_URL } from '../utils/globalVariables';
import { useNavigate } from 'react-router-dom';

function CreateSubPage() {
    const { currentUser, idToken } = useContext(AuthContext);
    const [pageData, setPageData] = useState({ "public": true, "nsfw": false });
    const [creationError, setCreationError] = useState("");
    const { data, loading, error, registerSubpage } = useRegisterSubpage(`${BASE_URL}/api/subpage/create/`, idToken);
    const [publicChecked, setPublicChecked] = useState(true);
    const [nsfwChecked, setNsfwChecked] = useState(false);
    const navigate = useNavigate();

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
        await registerSubpage(pageData);
        console.log(data)
        if (data.success === true) {
            navigate(`/subpage/${pageData.name}`);
        } else {
            setCreationError(data.message);
        }
    }

    return (
        <>
            <div className="content-card-flex">
                <h3>Create new subpage</h3>
                {
                    idToken ? (
                        <>
                            <form onSubmit={handleSubmit}>
                                &nbsp;Subpage name <span className="grey-info-text">(max 50 chars)</span><br/>
                                <input id="name" onChange={handleInputChange} type="text" placeholder="Subpage name" />
                                <br />
                                &nbsp;Description <span className="grey-info-text">(Max 500 chars)</span> <br/>
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
                            <p>
                                {creationError && creationError}
                                {error && error}
                            </p>
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