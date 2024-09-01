import axios from 'axios';
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import PrivateRoute from '../../components/PrivateRoute';
import { TextField, Button, Box, List, ListItem, ListItemText, Select, MenuItem, FormControl, InputLabel, Divider } from '@mui/material';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5003/api/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5003/api/users', { username, password, role }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers([...users, response.data]);
      setUsername('');
      setPassword('');
      setRole('');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setUsername(user.username);
    setPassword('');
    setRole(user.role);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5003/api/users/${editingUser._id}`, { username, password, role }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(users.map(user => user._id === editingUser._id ? response.data : user));
      setEditingUser(null);
      setUsername('');
      setPassword('');
      setRole('');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <PrivateRoute>
      <AdminLayout>
        <h1>Users</h1>
        <Box component="form" onSubmit={editingUser ? handleUpdate : handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!editingUser}
          />
          <FormControl required>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="author">Author</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            {editingUser ? 'Update User' : 'Add User'}
          </Button>
        </Box>
        <List sx={{ mt: 2 }}>
          {users.map((user, index) => (
            <div key={user._id}>
              <ListItem button onClick={() => handleEdit(user)}>
                <ListItemText primary={user.username} secondary={user.role} />
              </ListItem>
              {index < users.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </AdminLayout>
    </PrivateRoute>
  );
};

export default Users;
