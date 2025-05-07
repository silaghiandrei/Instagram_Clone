import React from 'react';
import {Paper, TextField, Button, Typography, Box, Link,} from '@mui/material';
import { LoginFormData } from '../types';

interface LoginFormProps {
  formData: LoginFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onSignUpClick: () => void;
  onBackClick: () => void;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  onSignUpClick,
  onBackClick,
  error,
}) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3,
        border: '1px solid #e0e0e0',
        maxWidth: 400,
        mx: 'auto',
        mt: 4
      }}
    >
      <Button
        variant="text"
        onClick={onBackClick}
        sx={{ mb: 2 }}
      >
        ← Back
      </Button>

      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
        Instagram Clone
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          margin="normal"
          variant="outlined"
          error={!!error}
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          margin="normal"
          variant="outlined"
          error={!!error}
          helperText={error}
        />
        <Button
          fullWidth
          variant="text"
          type="submit"
          sx={{ mt: 2 }}
        >
          Log In
        </Button>
      </form>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={onSignUpClick}
            sx={{ textDecoration: 'none' }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
};

export default LoginForm; 