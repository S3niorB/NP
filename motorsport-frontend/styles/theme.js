import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ffcebf',
    },
    background: {
      default: 'linear-gradient(135deg, #e5e5e5 0%, #ddc8dc 100%)',
    },
    text: {
      primary: '#000000',
      secondary: '#999cae',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h6: {
      color: '#000000',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000',
          color: '#999cae',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          color: '#999cae',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffcebf',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#999cae',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#ddc8dc',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#999cae',
            },
          },
        },
      },
    },
  },
});

export default theme;
