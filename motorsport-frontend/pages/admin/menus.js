import axios from 'axios';
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import PrivateRoute from '../../components/PrivateRoute';
import { TextField, Button, Box, List, ListItem, ListItemText } from '@mui/material';

const Menus = () => {
  const [menus, setMenus] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5003/api/menus', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMenus(response.data);
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    };

    fetchMenus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5003/api/menus', { name }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMenus([...menus, response.data]);
      setName('');
    } catch (error) {
      console.error('Error creating menu:', error);
    }
  };

  return (
    <PrivateRoute>
      <AdminLayout>
        <h1>Menus</h1>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Menu Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Add Menu
          </Button>
        </Box>
        <List sx={{ mt: 2 }}>
          {menus.map((menu) => (
            <ListItem key={menu._id}>
              <ListItemText primary={menu.name} />
            </ListItem>
          ))}
        </List>
      </AdminLayout>
    </PrivateRoute>
  );
};

export default Menus;
