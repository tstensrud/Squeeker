// Components
import NewMessage from './NewMessage.jsx';
import LoadingSpinner from "../components/LoadingSpinner.jsx";

function NewMessages({ messageLoading, messageData, idToken, currentUser }) {


    return (
        <>
            {
                messageLoading === true ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        {
                            messageData?.success === true ? (
                                <>
                                
                                    {
                                         messageData?.data && Object.keys(messageData.data).map((key, index) => (
                                            <NewMessage key={index} messageData={messageData.data[key]} idToken={idToken} currentUser={currentUser} />
                                        ))
                                    }
                                </>
                            ) : (
                                <>
                                    {messageData?.message}
                                </>
                            )
                        }
                    </>
                )

            }
        </>
    );
}

export default NewMessages;