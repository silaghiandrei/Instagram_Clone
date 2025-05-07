import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material';

const Start: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={0}
        sx={{ 
          p: 4,
          border: '1px solid #e0e0e0',
          maxWidth: 400,
          mx: 'auto',
          mt: 8,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" sx={{ mb: 4 }}>
          Instagram Clone
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="text"
            fullWidth
            onClick={() => navigate('/login')}
            sx={{ py: 1.5 }}
          >
            Log In
          </Button>

          <Button
            variant="text"
            fullWidth
            onClick={() => navigate('/register')}
            sx={{ py: 1.5 }}
          >
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Start; 