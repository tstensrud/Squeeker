import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import { GlobalContext } from '../context/GlobalContext';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/globalVariables';

// Components
import HeaderComponent from './components/HeaderComponent';
import LoadingSpinner from './components/LoadingSpinner';
import LoadingBar from './components/LoadingBar';
import useFetchNoLogin from '../hooks/useFetchNoLogin';
import PageHeader from './components/PageHeader';

function Subpages(props) {
    const { currentUser, idToken } = useContext(AuthContext);
    const { setSelectedIndex } = useContext(GlobalContext);
    const { data, loading, error } = useFetchNoLogin(`${BASE_URL}/api/subpage/all/`, idToken)
    const subpageData = data && data.data || null;

    useEffect(() => {
        setSelectedIndex(props.index);
    }, []);

    return (
        <>
            <PageHeader headerText="This lodge has many rooms.." subheaderText="Each alike, but occupied by different souls, night after night." />
            <div className="flex flex-col mt-5">
                {
                    loading && loading === true ? (
                        <div className="loading-spinner-container">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            {
                                subpageData ? (
                                    <div className="card">
                                        <p className="text-xl mb-3">Most populare rooms</p>
                                        <div className="flex flex-col w-full">
                                            {
                                                subpageData && subpageData !== null && Object.entries(subpageData).map(([key, value], index) => (

                                                    <div className="flex flex-col" key={index}>
                                                        <div className="w-96 overflow-hidden">
                                                            <Link to={`/room/${key}`}>{key}</Link>
                                                        </div>
                                                        <div className="text-grey-text mb-2">/ {value}</div>
                                                    </div>

                                                ))
                                            }
                                        </div>
                                    </div>
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