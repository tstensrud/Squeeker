import { useEffect, useState } from 'react';
import { BASE_URL } from '../../utils/globalVariables';
import useDelete from '../../hooks/useDelete.jsx';

import LoadingSpinner from "../components/LoadingSpinner.jsx";
import OldMessage from "./OldMessage.jsx";


function OldMessages({ oldMessageDataLoading, oldMessageData, idToken, currentUser }) {
    const { response, loading, error, deleteEntry } = useDelete(`${BASE_URL}/messages/delete_all/${currentUser}/`, idToken);
    const [allDeleted, setAllDeleted] = useState(false)

    useEffect(() => {
        if (response?.success === true) {
            setAllDeleted(true);
        }
    }, [response])

    // Handlers
    const handleDeleteAll = async () => {
        await deleteEntry({});
    }

    return (
        <>
            {
                oldMessageDataLoading === true ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <div className="w-full flex flex-col">
                            <div className="flex w-full justify-end mb-3">
                                <span onClick={handleDeleteAll} className="mr-1 text-accent-color cursor-pointer">
                                    Clear all messages
                                </span>
                            </div>
                            {
                                loading === true ? (
                                    <LoadingSpinner />
                                ) : (
                                    <>
                                        {
                                            !allDeleted && (
                                                <div>
                                                    {
                                                        oldMessageData?.success === true ? (
                                                            <>
                                                                {
                                                                    oldMessageData?.data && Object.keys(oldMessageData.data).map((key, index) => (
                                                                        <OldMessage idToken={idToken} key={index} oldMessageData={oldMessageData.data[key]} />
                                                                    ))
                                                                }
                                                            </>
                                                        ) : (
                                                            <>
                                                                {oldMessageData.message}
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            )
                                        }
                                    </>
                                )
                            }

                        </div>
                    </>
                )

            }
        </>
    );
}

export default OldMessages;