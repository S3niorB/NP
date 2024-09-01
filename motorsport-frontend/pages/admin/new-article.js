import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import dynamic from 'next/dynamic';
import AdminLayout from '../../components/AdminLayout';
import PrivateRoute from '../../components/PrivateRoute';
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl, Grid, Chip } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import dayjs from 'dayjs';

const AdvancedQuillEditor = dynamic(() => import('../../components/QuillEditor'), { ssr: false });

const NewArticle = () => {
  const router = useRouter();
  const [article, setArticle] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: '',
    tags: [],
    author: '',
    publishDate: dayjs().startOf('hour').add(1, 'hour'),
  });
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchCategoriesAndUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const [categoriesResponse, usersResponse] = await Promise.all([
        axios.get('http://localhost:5003/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5003/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setCategories(categoriesResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Error fetching categories and users:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesAndUsers();
  }, [fetchCategoriesAndUsers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (value) => {
    setArticle(prev => ({ ...prev, content: value }));
  };

  const handleDateTimeChange = (newValue) => {
    setArticle(prev => ({ ...prev, publishDate: newValue }));
  };

  const handleFileUpload = (file) => {
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setArticle(prev => ({ ...prev, featuredImage: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a JPG or PNG image.');
    }
  };

  const handleCreateArticle = async (e) => {
    if (e) {
      e.preventDefault();
    }
    // Perform manual validation
    if (!article.title || !article.content) {
      alert('Please fill in all required fields');
      return;
    }
    const newArticle = {
      ...article,
      publishDate: article.publishDate.toISOString()
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5003/api/articles', newArticle, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert('Article created successfully!');
      router.push('/admin/articles');
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Error creating article. Please try again.');
    }
  };

  const handleAddTag = (tag) => {
    if (tag && !article.tags.includes(tag)) {
      setArticle(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setArticle(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToDelete) }));
  };

  return (
    <PrivateRoute>
      <AdminLayout>
        <h1>New Article</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              {['title', 'slug', 'excerpt'].map((field) => (
                <Grid item xs={12} sm={field === 'excerpt' ? 12 : 6} key={field}>
                  <TextField
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    value={article[field]}
                    onChange={handleChange}
                    required={field === 'title'}
                    fullWidth
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <AdvancedQuillEditor 
                  value={article.content} 
                  onChange={handleQuillChange}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 6 }}>
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    backgroundColor: '#ffcebf',
                    color: '#000000',
                    '&:hover': {
                      backgroundColor: '#feda31',
                    },
                  }}
                >
                  Upload Image
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                  />
                </Button>
                {article.featuredImage && <img src={article.featuredImage} alt="Featured" style={{ maxWidth: '100%', marginTop: '10px' }} />}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl required fullWidth variant="outlined">
                  <InputLabel shrink>Category</InputLabel>
                  <Select
                    name="category"
                    value={article.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    <MenuItem value=""><em>Select Category</em></MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl required fullWidth variant="outlined">
                  <InputLabel shrink>Author</InputLabel>
                  <Select
                    name="author"
                    value={article.author}
                    onChange={handleChange}
                    label="Author"
                  >
                    <MenuItem value=""><em>Select Author</em></MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user._id} value={user.username}>{user.username}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimeField
                  label="Publish Date and Time"
                  value={article.publishDate}
                  onChange={handleDateTimeChange}
                  format="YYYY-MM-DD HH:mm"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {article.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                    />
                  ))}
                </Box>
                <TextField
                  label="Add Tag"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  fullWidth
                  sx={{ mt: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button onClick={handleCreateArticle} variant="contained" color="primary" fullWidth>
                  Create Article
                </Button>
              </Grid>
            </Grid>
          </Box>
        </LocalizationProvider>
      </AdminLayout>
    </PrivateRoute>
  );
};

export default NewArticle;