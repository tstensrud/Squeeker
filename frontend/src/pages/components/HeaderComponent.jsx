import { Link, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/globalVariables';
import useSubpagePost from '../../hooks/useSubpagePost';
import useFetch from '../../hooks/useFetch';
import useFetchDemand from '../../hooks/useFetchDemand';

function HeaderComponent({ subpageData }) {
    const { currentUser, idToken } = useContext(AuthContext);
    const subData = subpageData;
    const subpageUid = subData && subData.uid
    const clientUid = currentUser.uid;


    // Fetches and posts
    const { loading, data, error, subpagePost } = useSubpagePost(`${BASE_URL}/api/subpage/subscribe/`, idToken);
    const { data: isSubedData, refetch } = useFetch(`${BASE_URL}/api/subpage/is_subscribed/${subpageUid}/${clientUid}/`, idToken);
    const { data: totalSubsData, refetch: refetchSubs } = useFetch(`${BASE_URL}/api/subpage/total_subs/${subpageUid}/`, idToken);
    //const {data: refetchSubedData } = useFetchDemand(`${BASE_URL}/api/subpage/is_subscribed/${subpageUid}/${clientUid}/`, idToken);

    const [isSubbed, setIsSubbed] = useState(false);
    const [subscribeData, setSubscribeData] = useState({});
    const [totalSubs, setTotalSubs] = useState("");

    useEffect(() => {
        setSubscribeData({
            ...subscribeData,
            clientUid: clientUid,
            subpageUid: subpageUid,
        });
    }, []);

    useEffect(() => {
        if (data && data.success === true) {
            setIsSubbed(!isSubbed);
        }
    }, [data]);

    useEffect(() => {
        if (totalSubsData && totalSubsData.success === true) {
            setTotalSubs(totalSubsData.data);
        }
    }, [totalSubsData])

    //console.log(subscribeData);
    //console.log(data)
    // Handlers
    const handleSubscribe = async (e) => {
        e.preventDefault();
        await subpagePost(subscribeData);
        refetch();
        refetchSubs();
    }

    return (
        <>
            <div className="header-container">
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <h2>Welcome to {subpageData && subpageData.name}!</h2>
                    <p>
                        {subpageData && subpageData.description}
                    </p>
                </div>
                <div style={{ display: "flex", flex: "1", flexDirection: "column", alignItems: "flex-end", textAlign: "flex-end", justifyContent: "flex-end", height: "100%" }}>
                    <div>
                        {
                            isSubedData ? (
                                <>
                                    {
                                        isSubedData.data === false ? (
                                            <>
                                                <ul className="horizontal-list">
                                                    <li className="horizontal-list-item">
                                                        You are not subscribed.
                                                    </li>
                                                    <li className="horizontal-list-item">
                                                        <Link className="link-card" to="#" onClick={handleSubscribe}>Subscribe</Link>
                                                    </li>
                                                </ul>
                                            </>
                                        ) : (
                                            <>
                                                <ul className="horizontal-list">
                                                    <li className="horizontal-list-item">

                                                    </li>
                                                    <li className="horizontal-list-item">
                                                        <Link className="link-card" to="#" onClick={handleSubscribe}>Unsubscribe</Link>
                                                    </li>
                                                </ul>
                                            </>
                                        )
                                    }
                                </>
                            ) : (
                                <>
                                </>
                            )
                        }

                    </div>
                    <div>
                        <ul className="horizontal-list">
                            <li className="horizontal-list-item">
                                Total subs:
                            </li>
                            <li className="horizontal-list-item">
                                {
                                    <>
                                        {totalSubs}
                                    </>

                                }
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HeaderComponent;