import React from 'react';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
    onSubmit: (e: React.FormEvent) => void;
    error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, error }) => {
    const navigate = useNavigate();

    return (
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
            />
            {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                </Typography>
            )}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Sign In
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/register')}
                >
                    Don't have an account? Sign Up
                </Link>
                <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/')}
                >
                    Back to Home
                </Link>
            </Box>
        </Box>
    );
};

export default LoginForm; 