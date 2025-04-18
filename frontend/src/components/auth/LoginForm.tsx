import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Container, Fade, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // TODO: Implement actual login logic
    console.log('Login attempt:', { email, password });
    // For now, just navigate to the game
    navigate('/');
  };

  const handleTempLogin = () => {
    setError('');
    localStorage.setItem('token', 'temp_token');
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                textAlign: 'center',
                color: 'primary.main',
                fontWeight: 'bold',
                mb: 4
              }}
            >
              Welcome to 2D Metaverse
            </Typography>

            {error && (
              <Fade in={!!error}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              </Fade>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ 
                  mt: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: 3,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                }}
              >
                Login
              </Button>
            </form>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Don't want to create an account?
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={handleTempLogin}
                size="large"
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Quick Start (Skip Login)
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
} 