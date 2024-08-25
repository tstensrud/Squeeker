import { Link, useParams, useOutletContext } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/globalVariables';
import useSubpagePost from '../../hooks/useSubpagePost';
import useFetch from '../../hooks/useFetch';
import useFetchDemand from '../../hooks/useFetchDemand';

function HeaderComponent({ subpageData }) {
    const { currentUser, idToken } = useContext(AuthContext);
    const { userSubscriptionsRefetch } = useOutletContext();

    const subData = subpageData;
    const subpageUid = subData && subData.uid
    const clientUid = currentUser && currentUser.uid;


    // Fetches and posts
    const { loading, data, error, subpagePost } = useSubpagePost(`${BASE_URL}/api/subpage/subscribe/`, idToken);
    const { data: isSubedData, refetch } = useFetch(
        clientUid ? `${BASE_URL}/api/subpage/is_subscribed/${subpageUid}/${clientUid}/` : null, idToken);

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
        userSubscriptionsRefetch();
    }

    return (
        <>
            <div className="flex flex-row mb-5 mt-4">
                <div className="flex flex-col">
                    <h2>Welcome to {subpageData && subpageData.name}!</h2>
                    <p className="text-grey-text">
                        {subpageData && subpageData.description}
                    </p>
                </div>
                
                <div className="flex flex-1 flex-col items-end text-center justify-end h-full">
                    <div>
                        {
                            isSubedData ? (
                                <>
                                    {
                                        isSubedData.data === false ? (
                                            <>
                                                <ul className="p-0 list-none m-0">
                                                    <li className="inline mr-3 text-base tracking-wide">
                                                        You are not subscribed.
                                                    </li>
                                                    <li className="inline mr-3 text-base tracking-wide">
                                                        <Link  to="#" onClick={handleSubscribe}>Subscribe</Link>
                                                    </li>
                                                </ul>
                                            </>
                                        ) : (
                                            <>
                                                <ul className="p-0 list-none m-0">
                                                    <li className="inline mr-3 text-base tracking-wide">

                                                    </li>
                                                    <li className="inline mr-3 text-base tracking-wide">
                                                        <Link  to="#" onClick={handleSubscribe}>Unsubscribe</Link>
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
                        <ul className="p-0 list-none m-0">
                            <li className="inline mr-3 text-base tracking-wide">
                                Total subs:
                            </li>
                            <li className="inline mr-3 text-base tracking-wide">
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