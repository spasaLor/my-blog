import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import UserLogin from '../components/UserLogin.jsx';
import '../src/style.css';
import UserRegistration from '../components/UserRegistration.jsx';
import AuthorInfo from '../components/AuthorInfo.jsx';
import AuthorRegistration from '../components/AuthorRegistration.jsx';
import ReadPost from '../components/readPost.jsx';
import Blog from '../components/Blog.jsx';
import App from './App.jsx';
import PrivateArea from '../components/PrivateArea.jsx';
import AuthorLogin from '../components/AuthorLogin.jsx';
import NewPost from '../components/NewPost.jsx';
import AllPosts from '../components/AllPosts.jsx';
import Unpublished from '../components/Unpublished.jsx';
import ErrorPage from '../components/ErrorPage.jsx';

const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[{index:true,element:<Blog/>},{path:"author/:authorId",element:<AuthorInfo/>},{path:"author_signup",element:<AuthorRegistration/>},{path:"/post/:postId",element:<ReadPost/>}],
    errorElement:<ErrorPage/>
  },
  {
    path:"login",
    element: <UserLogin/>
  },
  {
    path:"register",
    element: <UserRegistration/>
  },
  {
    path:"personal",
    element:<PrivateArea/>,
    children:[{path:"new_post",element:<NewPost/>},{path:"all_posts",element:<AllPosts/>},{path:"unpublished_posts",element: <Unpublished/>}]
  },
  {
    path:"login_author",
    element:<AuthorLogin/>
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
