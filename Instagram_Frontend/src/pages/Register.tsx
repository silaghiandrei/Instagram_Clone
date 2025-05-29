import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import RegisterForm from '../components/RegisterForm';
import { authService } from '../services/authService';
import { RegisterFormData } from '../types';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const registerData = {
                ...formData,
                role: 'USER',
                banned: false,
                score: 0
            };
            await authService.register(registerData);
            navigate('/user');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        }
    };

    const [formData, setFormData] = useState<RegisterFormData>({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

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
                    Register
                </Typography>
                <RegisterForm
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    error={error}
                />
            </Box>
        </Container>
    );
};

export default Register; 