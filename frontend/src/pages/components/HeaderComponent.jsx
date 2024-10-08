import { Link, useParams, useOutletContext } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/globalVariables';
import useSubmit from '../../hooks/useSubmit';

function HeaderComponent({ totalSubs, isSubscribed, subpageData }) {
    const { currentUser, idToken } = useContext(AuthContext);
    const { userSubscriptionsRefetch } = useOutletContext();

    const subData = subpageData;
    const subpageUid = subData && subData.uid
    const clientUid = currentUser && currentUser.uid;


    // Fetches and posts
    const { loading, response, error, submitData } = useSubmit(`api/subpage/subscribe/`);

    const [isSubbed, setIsSubbed] = useState();
    const [subscribeData, setSubscribeData] = useState({});
    const [totalSubsCounter, setTotalSubsCounter] = useState();

    useEffect(() => {
        setSubscribeData({
            ...subscribeData,
            clientUid: clientUid,
            subpageUid: subpageUid,
        });
        setIsSubbed(isSubscribed);
        setTotalSubsCounter(totalSubs);
    }, []);

    useEffect(() => {
        if (response?.success === true) {
            userSubscriptionsRefetch();
            if (isSubbed) {
                setTotalSubsCounter(totalSubsCounter - 1);
            } else {
                setTotalSubsCounter(totalSubsCounter + 1);
            }
            setIsSubbed(!isSubbed);

        }
    }, [response]);

    // Handlers
    const handleSubscribe = async (e) => {
        e.preventDefault();
        await submitData(subscribeData);
    }

    return (
        <div className="flex flex-col sm:flex-row mb-5 mt-5">
            
            <div className="flex flex-col">
                <h2>Welcome to {subpageData?.name}!</h2>
                <p className="text-grey-text">
                    {subpageData?.description}
                </p>
            </div>

            <div className="flex flex-1 flex-col items-start text-center sm:items-end sm:justify-end h-full mt-2">
                <div>
                    {
                        currentUser && idToken && (
                            <>
                                {
                                    isSubbed === false ? (
                                        <ul className="p-0 list-none m-0">
                                            <li className="inline mr-3 text-base tracking-wide">
                                                You are not subscribed.
                                            </li>
                                            <li className="inline mr-3 text-base tracking-wide">
                                                <Link to="#" onClick={handleSubscribe}>Subscribe</Link>
                                            </li>
                                        </ul>
                                    ) : (
                                        <ul className="p-0 list-none m-0">
                                            <li className="inline mr-3 text-base tracking-wide">

                                            </li>
                                            <li className="inline mr-3 text-base tracking-wide">
                                                <Link to="#" onClick={handleSubscribe}>Unsubscribe</Link>
                                            </li>
                                        </ul>
                                    )
                                }
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
                                    {totalSubsCounter}
                                </>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default HeaderComponent;