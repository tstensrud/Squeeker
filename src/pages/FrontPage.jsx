import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from '../utils/firebase';
import Post from './components/Post';
import NewPost from "./components/NewPost";
import Header from "./components/Header";

function FrontPage() {
  const navigate = useNavigate();



  return (
    <>
      <div className="page-wrapper">
        <div className="header-container">
          <Header />
        </div>
        <div className="content-container">
          <NewPost />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
        </div>
      </div>
    </>
  );
}

export default FrontPage;