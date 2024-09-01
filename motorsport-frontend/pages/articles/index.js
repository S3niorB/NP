import axios from 'axios';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/articles');
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const handleContentChange = (value) => {
    setContent(value);
  };

  return (
    <div>
      <h1>Articles</h1>
      <ul>
        {articles.map(article => (
          <li key={article._id}>{article.title}</li>
        ))}
      </ul>
      <ReactQuill value={content} onChange={handleContentChange} />
    </div>
  );
};

export default Articles;
