import ArticleCard from "./ArticleCard";
import TopBar from "./TopBar";
import CategoryBar from "./CategoryBar";
import SideBar from "./SideBar";
import "./homePage.css"
import { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {

  const [ blogs, setBlogs ] = useState([]);
  const [ sideBarData, setSideBarData ] = useState(null);
  const [ selectedCategory, setSelectedCategory ] = useState('For you');

  const fetchBlogs = async () =>{
    try {
      // let url = `/get-blogs`;
      let url = "http://localhost:3535/get-blogs";
      
      // console.log(url);
      // console.log(selectedCategory);
      if(selectedCategory !== 'For you') {
        url = `http://localhost:3535/get-blogs-by-category/${selectedCategory}`;
        // url = `/get-blogs-by-category/${selectedCategory}`;
      }
      const response = await axios.get(url);
      // console.log('response.data :', response.data);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const fetchSideBarData = async () => {
    try {
      const response = await axios.get('http://localhost:3535/sidebar-data', { withCredentials: true });
      setSideBarData(response.data);
    } catch (error) {
      console.error('Error fetching sidebar data:', error);
    }
  }

  useEffect(() => {
    fetchSideBarData();
    fetchBlogs();    
  }, [selectedCategory]);


    // const sideBarData = {
    //     "editorsPicks": [
    //       {
    //         "id": 1,
    //         "author": "Torsten Walbaum",
    //         "category": "Towards Data Science",
    //         "title": "What 10 Years at Uber, Meta and Startups Taught Me About Data Analytics",
    //         "image": "https://robohash.org/you.png?set=set5"
    //       },
    //       {
    //         "id": 2,
    //         "author": "Jeffery Smith",
    //         "title": "The Impact of Remote Work on My Children",
    //         "image": "https://robohash.org/you.png?set=set8"
    //       },
    //       {
    //         "id": 3,
    //         "author": "Grace Loh Prasad",
    //         "category": "Asian American Book Club",
    //         "title": "It's OK If Your Writing Isn't for Everyone",
    //         "image": "https://robohash.org/you.png?set=set6"
    //       }
    //     ],
    //     "recommendedTopics": [
    //       "Data Science",
    //       "Self Improvement",
    //       "Writing",
    //       "Relationships",
    //       "Cryptocurrency",
    //       "Productivity"
    //     ],
    //     "whoToFollow": [
    //       {
    //         "_id": 1,
    //         "name": "Kevin Beaumont",
    //         "bio": "Everything here is my personal work and opinions.",
    //         "profilePic": "https://robohash.org/you.png?set=set9"
    //       },
    //       {
    //         "_id": 2,
    //         "name": "Ignacio de Gregorio",
    //         "bio": "I break down frontier AI systems in easy-to-understand ways.",
    //         "profilePic": "https://robohash.org/you.png?set=set10"
    //       }
    //     ]
    //   }
      

    return(
        <div className="home-page">
            <TopBar />
            <div className="main-container">
                <div className="article-cards">
                    <CategoryBar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                    {blogs.map(blog => (
                        <ArticleCard key={blog._id} blog={blog}/>
                    ))}
                </div>
                {/* <SideBar data = {sideBarData} /> */}
                {sideBarData && <SideBar data={sideBarData} />}
            </div>
        </div>
    )
}

export default HomePage;