import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import HeaderComponent from './components/HeaderComponent';
import LoadingSpinner from './components/LoadingSpinner'
import { BASE_URL } from '../utils/globalVariables';
import useFetchNoLogin from '../hooks/useFetchNoLogin';
import { AuthContext } from '../context/AuthContext';

function Subpages() {
    const { currentUser, idToken } = useContext(AuthContext);
    const { data, loading, error } = useFetchNoLogin(`${BASE_URL}/api/subpage/all/`, idToken)
    const subpageData = data && data.data || null;

    return (
        <>
            <h2 className="text-2xl mb-2">This lodge has many rooms..</h2>
            <p>
                Each alike, but occupied by different souls, night after night.
            </p>
            <div className="flex flex-col mt-5">
                {
                    loading && loading === true ? (
                        <>
                            <div className="loading-spinner-container">
                                <LoadingSpinner />
                            </div>
                        </>
                    ) : (
                        <>
                            {
                                subpageData ? (
                                    <>
                                        <div className="bg-card-bg-color p-3 rounded-lg">
                                            <p className="text-xl mb-3">Most populare rooms</p>
                                            <div className="flex flex-col w-full">
                                                {
                                                    subpageData && subpageData !== null && Object.entries(subpageData).map(([key, value], index) => (

                                                        <div className="flex flex-row" key={index}>
                                                            <div className="w-32 overflow-hidden">
                                                                <Link  to={`/room/${key}`}>{key}</Link> 
                                                            </div>
                                                            <div className="text-grey-text">/ {value}</div>
                                                        </div>

                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        No data :(
                                    </>
                                )}
                        </>
                    )}
            </div>
        </>
    );
}

export default Subpages;