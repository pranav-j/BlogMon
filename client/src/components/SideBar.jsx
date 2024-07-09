import { Link } from "react-router-dom";
import './sideBar.css';

const SideBar = ({ data })  => {

    const { editorsPicks = [], recommendedTopics = [], whoToFollow = [] } = data;

    return (
        <div className="side-bar">
            <h3>Editor's Picks</h3>
            <div className="editors-picks">
                {editorsPicks.map(pick => (
                    <div key={pick.id} className="pick">

                        <div className="author">
                            <img src={pick.image} alt={pick.author} />
                            <p>{pick.author}</p>
                        </div>
                        <div className="text">
                            <Link to={`/blog/${pick._id}`}><h2>{pick.title}</h2></Link>
                            {/* <h2>{pick.title}</h2> */}
                        </div>
                    </div>
                ))}
            </div>
            <h3>Recommended topics</h3>
            <div className="topics">
                {recommendedTopics.map((topic, index) => (
                    <button key={index}>{topic}</button>
                ))}
                {/* <a href="#">See more topics</a> */}
            </div>
            <h3>Who to follow</h3>
            <div className="who-to-follow">
                {whoToFollow.map(follow => (
                    <div key={follow._id} className="follow">
                        <img src={follow.profilePic} alt={follow.name} />
                        <div className="text">
                            <Link to={`/author-profile/${follow._id}/${follow.name}`}><h2><strong>{follow.name}</strong></h2></Link>
                            {/* <h2><strong>{follow.name}</strong></h2> */}
                            <p>{follow.bio}</p>
                        </div>
                        <button>Follow</button>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default SideBar;