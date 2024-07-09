import './categoryBar.css';

const categories = [
    "For you",
    "Cryptocurrency",
    "Cybersecurity",
    "Artificial Intelligence",
    "Space",
    "Machine Learning",
    "Blockchain",
    "Manufacturing",
    "Robotics"
  ];

const CategoryBar = ({ selectedCategory, setSelectedCategory }) => {
    return (
        <div className="category-bar">
            {categories.map(category => (
                <div key={category}
                onClick={() => setSelectedCategory(category)}
                className={`category-item ${selectedCategory === category ? 'selected' : ''}`}
                >
                    {category}
                </div>
            ))}           
        </div>
    )
};

export default CategoryBar;