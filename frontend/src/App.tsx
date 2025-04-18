import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { GameScene } from './components/game/GameScene';
import { LoginForm } from './components/auth/LoginForm';
import { Box, Button, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Simple auth check
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
}

function Header() {
  const navigate = useNavigate();

  const handleQuickStart = () => {
    localStorage.setItem('token', 'temp_token');
    navigate('/');
  };

  return (
    <Box 
      component="header" 
      sx={{ 
        p: 2, 
        bgcolor: 'primary.main', 
        color: 'white',
        boxShadow: 3,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          py: 1
        }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h5" 
              component="h1"
              sx={{ 
                fontWeight: 'bold',
                letterSpacing: 1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              2D Metaverse
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              variant="contained" 
              color="secondary"
              onClick={handleQuickStart}
              sx={{ 
                ml: 2,
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                py: 1,
                boxShadow: 2,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}
            >
              Quick Start Game
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          bgcolor: '#f5f5f5'
        }}>
          <Header />
          <Box component="main" sx={{ flex: 1, p: 2 }}>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <GameScene />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
