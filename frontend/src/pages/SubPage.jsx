import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Post from './components/Post';
import NewPost from './components/NewPost';
import SubPageDoesNotExist from './components/SubPageDoesNotExist';

function SubPage() {
    const { subPageName } = useParams();
    const [existingSubPage, setExistingSubPage] = useState(false);
    const [subPageId, setSubPageId] = useState("");
    


    return (
        <>
            <br />
            {
                existingSubPage === false ? (
                    <><SubPageDoesNotExist subPageName={subPageName} /></>
                ) : (
                    <><NewPost subPageName={subPageName} /></>
                )
            }
        </>
    );
}

export default SubPage;