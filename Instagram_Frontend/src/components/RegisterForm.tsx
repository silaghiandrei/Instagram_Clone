import React from 'react';
import { TextField, Button, Box, Link } from '@mui/material';
import { RegisterFormData } from '../types';

interface RegisterFormProps {
    formData: RegisterFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    error: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ formData, onChange, onSubmit, error }) => {
    return (
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={onChange}
                error={!!error}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={onChange}
                error={!!error}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={onChange}
                error={!!error}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={onChange}
                error={!!error}
                helperText={error}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Register
            </Button>
            <Box sx={{ textAlign: 'center' }}>
                <Link href="/login" variant="body2">
                    {"Already have an account? Sign in"}
                </Link>
            </Box>
        </Box>
    );
};

export default RegisterForm; 