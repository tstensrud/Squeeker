import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";

import PageHeader from './components/PageHeader';
import Card from './components/Card.jsx'

function About(props) {
    const { setSelectedIndex } = useContext(GlobalContext);
    
    useEffect(() => {
        setSelectedIndex(props.index);
    },[]);

    return (
        <>  
        <PageHeader headerText="Welcome to The lodge" subheaderText="" />
            <Card>
                <p>
                    This is a personal project and an attempt to make a reddit-clone. Most likely no one will ever use this
                    site, but I had a lot of fun making it. 
                </p>
                
                <p>
                    Sincerely, the Magician who longs to see.
                </p>
            </Card>
        </>
    );
}

export default About;