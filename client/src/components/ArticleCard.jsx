import React from "react";
import './articleCard.css';
import { Link } from "react-router-dom";

const ArticleCard = ({ blog }) => {
    const { title, author_name, author_id, date, content, commentsCount, likes, _id } = blog;

    // Extract the first paragraph content
    const firstParagraphMatch = content.match(/<p>(.*?)<\/p>/);
    let firstParagraph = firstParagraphMatch ? firstParagraphMatch[1] : '';
    firstParagraph = firstParagraph.replace(/<[^>]+>/g, '');
    

    // Extract the first image URL
    const imageMatch = content.match(/<img src="(.*?)"/);
    const imageUrl = imageMatch ? imageMatch[1] : '';
    // console.log(_id);

    return(
        <div className="article-card">            
            <div className="card-content">
                <p><Link to={`/author-profile/${author_id}/${author_name}`}><strong>{author_name}</strong></Link><span>{new Date(date).toLocaleDateString()}</span></p>
                <Link to={`/blog/${_id}`}><h2>{title}</h2></Link>
                <div className="content">{firstParagraph}</div>
                <div className="meta">
                    <span>👍{likes}</span>
                    <span>🗨️{commentsCount}</span>
                </div>
            </div>
            <div className="card-img">
                {imageUrl && <img src={imageUrl} alt={title} />}
            </div>           
        </div>
    )
}

export default ArticleCard;