import axios from 'axios';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit, Visibility, Delete } from '@mui/icons-material';
import AdminLayout from '../../components/AdminLayout';
import PrivateRoute from '../../components/PrivateRoute';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5003/api/articles', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Rendezés a legújabb cikkek előre helyezéséhez
        const sortedArticles = response.data.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        setArticles(sortedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5003/api/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setArticles(articles.filter(article => article._id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  return (
    <PrivateRoute>
      <AdminLayout>
        <h1>Admin - Articles</h1>
        <TableContainer component={Paper} style={{ marginTop: '24px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Published on</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles.map(article => (
                <TableRow key={article._id}>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>{new Date(article.publishDate).toLocaleString()}</TableCell>
                  <TableCell>{article.tags.join(', ')}</TableCell>
                  <TableCell>{article.author}</TableCell>
                  <TableCell>
                    <IconButton component="a" href={`/admin/edit-article/${article._id}`}>
                      <Edit />
                    </IconButton>
                    <IconButton component="a" href={`/articles/${article.slug}`} target="_blank">
                      <Visibility />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(article._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AdminLayout>
    </PrivateRoute>
  );
};

export default AdminArticles;
