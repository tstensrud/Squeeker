import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../utils/firebase';

import Post from './components/Post';
import NewPost from './components/NewPost';
import SubPageDoesNotExist from './components/SubPageDoesNotExist';

function SubPage() {
    const { subPageName } = useParams();
    const [existingSubPage, setExistingSubPage] = useState(false);
    const [subPageId, setSubPageId] = useState("");
    useEffect(() => {
        getSubPageData();
    }, [])

    const getSubPageData = async () => {
        const q = query(collection(db, "subpages"), where("subpageName", "==", subPageName));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("This subpage does not exists");
            setExistingSubPage(false);
        } else {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, "=>", doc.data());
                setSubPageId(doc.id);
                setExistingSubPage(true);
                getSubPagePosts();
            });

        }
    }

    const getSubPagePosts = async () => {
        const q = query(collection(db, "subpagePost"), where("subpageId", "==", subPageId));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log("No posts yet")
        } else {
            querySnapshot.forEach((doc) => {
                console.log(dov.id, "=>", doc.data());
            });
        }
    }


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