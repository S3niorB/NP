import axios from 'axios';
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import PrivateRoute from '../../components/PrivateRoute';
import { TextField, Button, Box, List, ListItem, ListItemText } from '@mui/material';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5003/api/tags', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5003/api/tags', { name }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTags([...tags, response.data]);
      setName('');
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  return (
    <PrivateRoute>
      <AdminLayout>
        <h1>Tags</h1>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
          <TextField
            label="Tag Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Add Tag
          </Button>
        </Box>
        <List sx={{ marginTop: 2 }}>
          {tags.map((tag) => (
            <ListItem key={tag._id}>
              <ListItemText primary={tag.name} />
            </ListItem>
          ))}
        </List>
      </AdminLayout>
    </PrivateRoute>
  );
};

export default Tags;
