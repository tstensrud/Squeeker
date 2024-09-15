import { useEffect, useState } from 'react';
import useDelete from '../../hooks/useDelete.jsx';

import LoadingSpinner from "../components/LoadingSpinner.jsx";
import OldMessage from "./OldMessage.jsx";


function OldMessages({ oldMessageDataLoading, oldMessageData, currentUser }) {
    const { response: deleteResponse, setData: setDeleteData, loading, error: deleteError, deleteEntry } = useDelete(`messages/delete_all/`);
    const [allDeleted, setAllDeleted] = useState(false)

    useEffect(() => {
        if (deleteResponse?.success === true) {
            setAllDeleted(true);
        }
    }, [deleteResponse]);

    useEffect(() => {
        setDeleteData({uuid: currentUser});
    },[])

    // Handlers
    const handleDeleteAll = async () => {
        await deleteEntry();
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
                                                                        <OldMessage currentUser={currentUser} key={index} oldMessageData={oldMessageData.data[key]} />
                                                                    ))
                                                                }
                                                            </>
                                                        ) : (
                                                            <>
                                                                {oldMessageData?.message}
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