import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import useRegisterSubpage from '../hooks/useRegisterSubpage';
import { BASE_URL } from '../utils/globalVariables';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';

function CreateSubPage(props) {
    const { currentUser, idToken } = useContext(AuthContext);
    const { setSelectedIndex } = useContext(GlobalContext);

    const { data, loading, error, registerSubpage } = useRegisterSubpage(`${BASE_URL}/api/subpage/create/`, idToken);
    
    const [pageData, setPageData] = useState({ "public": true, "nsfw": false });
    const [creationError, setCreationError] = useState("");
    const [publicChecked, setPublicChecked] = useState(true);
    const [nsfwChecked, setNsfwChecked] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        setSelectedIndex(props.index);
    },);

    // Handlers
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
        //console.log(data)
        if (data.success === true) {
            navigate(`/subpage/${pageData.name}`);
        } else {
            setCreationError(data.message);
        }
    }

    return (
        <>
            <h2>Create a new room</h2>
            <div className="card">

                {
                    idToken ? (
                        <>
                            <div className="mt-4">
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        Room name <span className="text-grey-text text-sm">(max 50 chars)</span><br />
                                    </div>
                                    <div className="mb-3 mt-1">
                                        <input id="name" onChange={handleInputChange} type="text" placeholder="The great timber room.." />
                                    </div>
                                    <div>
                                        Description <span className="text-grey-text text-sm">(Max 500 chars)</span> <br />
                                    </div>
                                    <div>
                                        <input onChange={handleInputChange} type="text" placeholder="Where gatherings are held" />
                                    </div>
                                    <div className="mt-4">
                                        <ul className="p-0 list-none m-0">
                                            <li className="inline mr-3 text-base tracking-wide">
                                                <div className="flex flex-row">
                                                    <div className="flex items-center mr-3">
                                                        Public
                                                    </div>
                                                    <div>
                                                        <input id="public" className="default-checkbox" onChange={handleCheckboxChange} type="checkbox" checked={publicChecked} />
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                        <ul className="inline p-0 list-none m-0">
                                            <li className="inline mr-3 text-base tracking-wide">
                                                <div className="flex flex-row">
                                                    <div className="flex items-center mr-3">
                                                        NSFW?
                                                    </div>
                                                    <div>
                                                        <input id="nsfw" className="default-checkbox" onChange={handleCheckboxChange} type="checkbox" checked={nsfwChecked} />
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <button className="standard-button" type="submit">Create!</button>
                                    </div>
                                </form>

                                <p>
                                    {creationError && creationError}
                                    {error && error}
                                </p>
                                {/* fetchError && JSON.stringify(fetchError) */}
                            </div>
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