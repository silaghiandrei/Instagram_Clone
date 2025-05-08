import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { authService } from '../services/authService';
import { LoginFormData } from '../types';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const formData: LoginFormData = {
                username: (e.target as HTMLFormElement).username.value,
                password: (e.target as HTMLFormElement).password.value
            };

            await authService.login(formData);
            navigate('/user');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <LoginForm onSubmit={handleSubmit} error={error} />
            </Box>
        </Container>
    );
};

export default Login; 