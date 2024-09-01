import axios from 'axios';
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import PrivateRoute from '../../components/PrivateRoute';
import { TextField, Button, Box, List, ListItem, ListItemText } from '@mui/material';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5003/api/categories', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5003/api/categories', { name }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCategories([...categories, response.data]);
      setName('');
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <PrivateRoute>
      <AdminLayout>
        <h1>Categories</h1>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Add Category
          </Button>
        </Box>
        <List sx={{ mt: 2 }}>
          {categories.map((category) => (
            <ListItem key={category._id}>
              <ListItemText primary={category.name} />
            </ListItem>
          ))}
        </List>
      </AdminLayout>
    </PrivateRoute>
  );
};

export default Categories;
