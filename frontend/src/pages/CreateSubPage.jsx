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
            <div className="flex flex-col bg-card-bg-color mt-5 p-3 rounded-lg">

                {
                    idToken ? (
                        <>
                            <div className="mt-4">
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        Room name <span className="text-grey-text text-sm">(max 50 chars)</span><br />
                                    </div>
                                    <div className="mb-3 mt-1">
                                        <input className="h-10 w-80 bg-app-bg-color p-3 text-header-link-hover rounded-lg border text-sm border-border-color focus:border-form-focus outline-none hover:border-form-hover" id="name" onChange={handleInputChange} type="text" placeholder="The great timber room.." />
                                    </div>
                                    <div>
                                        Description <span className="text-grey-text text-sm">(Max 500 chars)</span> <br />
                                    </div>
                                    <div>
                                        <input className="h-10 w-80 bg-app-bg-color p-3 text-header-link-hover rounded-lg border text-sm border-border-color focus:border-form-focus outline-none hover:border-form-hover" onChange={handleInputChange} type="text" placeholder="Where gatherings are held" />
                                    </div>
                                    <div className="mt-4">
                                        <ul className="p-0 list-none m-0">
                                            <li className="inline mr-3 text-base tracking-wide">
                                                <div className="flex flex-row">
                                                    <div className="flex items-center mr-3">
                                                        Public
                                                    </div>
                                                    <div>
                                                        <input id="public" onChange={handleCheckboxChange} type="checkbox" checked={publicChecked} />
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
                                                        <input id="nsfw" onChange={handleCheckboxChange} type="checkbox" checked={nsfwChecked} />
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <button className="bg-app-bg-color cursor-pointer border rounded-lg border-border-color p-1 h-10 w-24 text-grey-text hover:border-link-green transition:all 0.3 ease-in" type="submit">Create!</button>
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