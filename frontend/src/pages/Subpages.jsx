import { Link } from 'react-router-dom';
import { useEffect, useContext } from 'react';

import { GlobalContext } from '../context/GlobalContext';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/globalVariables';

// Components
import LoadingSpinner from './components/LoadingSpinner';
import useFetch from '../hooks/useFetch';
import PageHeader from './components/PageHeader';
import Card from './components/Card.jsx'

function Subpages(props) {
    const { setSelectedIndex } = useContext(GlobalContext);
    const { data, loading, error } = useFetch(`api/subpage/all/`)
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
                                    <Card>
                                        <p className="text-xl mb-3">Most populare rooms</p>
                                        <div className="flex flex-col w-full">
                                            {
                                                subpageData && subpageData !== null && Object.entries(subpageData).map(([key, value], index) => (

                                                    <div className="flex flex-col" key={index}>
                                                        <div className="w-96 overflow-hidden">
                                                            <Link to={`/room/${key}`}>{key}</Link>
                                                        </div>
                                                        <div className="text-grey-text mb-2">{value}</div>
                                                    </div>

                                                ))
                                            }
                                        </div>
                                    </Card>
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