import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import HeaderComponent from './components/HeaderComponent';
import LoadingSpinner from './components/LoadingSpinner'
import { BASE_URL } from '../utils/globalVariables';
import useFetch from '../hooks/useFetch';
import { AuthContext } from '../context/AuthContext';

function Subpages() {
    const { currentUser, idToken } = useContext(AuthContext);
    const { data, loading, error } = useFetch(`${BASE_URL}/api/subpage/all/`, idToken)
    const subpageData = data && data.data || null;
    //console.log(subpageData)
    return (
        <>
            <HeaderComponent description={"Chose a subpage that suites your interests"} title={"Subpages"} />
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
                                    <h3>Most populare subpages</h3>
                                    <ul className="undecorated-list">
                                        {
                                            subpageData && subpageData !== null && Object.entries(subpageData).map(([key, value], index) => (
                                                <>
                                                    <li key={index}>
                                                        <Link className="link-card" to={`/subpage/${key}`}>{key}</Link> / <span className="grey-info-text">{value}</span>
                                                    </li>
                                                </>
                                            ))
                                        }
                                        </ul>
                                    </>
                                ) : (
                                    <>
                                        No data :()
                                    </>
                                )}
                        </>
                    )}
            </div>
        </>
    );
}

export default Subpages;