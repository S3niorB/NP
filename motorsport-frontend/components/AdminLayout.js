import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Box } from '@mui/material';
import { Dashboard, Article, Category, Tag, MenuBook, People } from '@mui/icons-material';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const drawerWidth = 240;

const AdminLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: `${drawerWidth}px 1fr`, gap: 2 }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
  variant={isMobile ? 'temporary' : 'permanent'}
  open
  sx={{
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      backgroundColor: '#000000',
      color: '#ffffff', // Szöveg színe fehér
    },
  }}
>
  <Toolbar />
  <Box sx={{ overflow: 'auto' }}>
    <List>
      <ListItem button component={Link} href="/admin">
        <ListItemIcon sx={{ color: '#ffffff' }}><Dashboard /></ListItemIcon>
        <ListItemText primary="Dashboard" sx={{ color: '#ffffff' }} />
      </ListItem>
      <ListItem button component={Link} href="/admin/articles">
        <ListItemIcon sx={{ color: '#ffffff' }}><Article /></ListItemIcon>
        <ListItemText primary="Articles" sx={{ color: '#ffffff' }} />
      </ListItem>
      <ListItem button component={Link} href="/admin/new-article">
        <ListItemIcon sx={{ color: '#ffffff' }}><Article /></ListItemIcon>
        <ListItemText primary="New Article" sx={{ color: '#ffffff' }} />
      </ListItem>
      <ListItem button component={Link} href="/admin/categories">
        <ListItemIcon sx={{ color: '#ffffff' }}><Category /></ListItemIcon>
        <ListItemText primary="Categories" sx={{ color: '#ffffff' }} />
      </ListItem>
      <ListItem button component={Link} href="/admin/tags">
        <ListItemIcon sx={{ color: '#ffffff' }}><Tag /></ListItemIcon>
        <ListItemText primary="Tags" sx={{ color: '#ffffff' }} />
      </ListItem>
      <ListItem button component={Link} href="/admin/menus">
        <ListItemIcon sx={{ color: '#ffffff' }}><MenuBook /></ListItemIcon>
        <ListItemText primary="Menus" sx={{ color: '#ffffff' }} />
      </ListItem>
      <ListItem button component={Link} href="/admin/users">
        <ListItemIcon sx={{ color: '#ffffff' }}><People /></ListItemIcon>
        <ListItemText primary="Users" sx={{ color: '#ffffff' }} />
      </ListItem>
    </List>
  </Box>
</Drawer>


      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: 'linear-gradient(135deg, #e5e5e5 0%, #ddc8dc 100%)',
          borderRadius: '8px',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
