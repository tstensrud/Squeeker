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
            <div className="content-card-flex">
                <h2>This lodge has many rooms..</h2>
                <p>
                    Each alike, but occupied by different souls, night after night.
                </p>
            </div>
            <div className="content-card-flex">
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
                                        <h3>Most populare rooms</h3>
                                        <ul className="undecorated-list">
                                            {
                                                subpageData && subpageData !== null && Object.entries(subpageData).map(([key, value], index) => (
                                                    
                                                        <li key={index}>
                                                            <Link className="link-card" to={`/room/${key}`}>{key}</Link> / <span className="grey-info-text">{value}</span>
                                                        </li>
                                                    
                                                ))
                                            }
                                        </ul>
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