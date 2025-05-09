import React from 'react';
import { Typography, Box, Paper, TextField, Button, Avatar, Grid } from '@mui/material';
import { UserData } from '../types';

interface ProfileContentProps {
    user: UserData;
    isEditing: boolean;
    formData: {
        username: string;
        email: string;
    };
    onEditClick: () => void;
    onCancelClick: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
    user,
    isEditing,
    formData,
    onEditClick,
    onCancelClick,
    onChange,
    onSubmit
}) => {
    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onEditClick();
    };

    const handleChangePassword = () => {
        // TODO: Implement change password functionality
        console.log('Change password clicked');
    };

    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                        sx={{ width: 100, height: 100, mb: 2 }}
                        src={user.profilePicture}
                    />
                    <Box component="form" onSubmit={onSubmit} sx={{ width: '100%', maxWidth: 600 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Username"
                                        name="username"
                                        value={formData.username}
                                        onChange={onChange}
                                        required
                                    />
                                ) : (
                                    <Box sx={{ p: 1 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Username
                                        </Typography>
                                        <Typography variant="body1">
                                            {user.username}
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={onChange}
                                        required
                                    />
                                ) : (
                                    <Box sx={{ p: 1 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Email
                                        </Typography>
                                        <Typography variant="body1">
                                            {user.email}
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                                    {isEditing ? (
                                        <>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                sx={{ minWidth: 120 }}
                                            >
                                                Save Changes
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                onClick={onCancelClick}
                                                sx={{ minWidth: 120 }}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="contained"
                                                onClick={handleEditClick}
                                                type="button"
                                                sx={{ minWidth: 120 }}
                                            >
                                                Edit Profile
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                onClick={handleChangePassword}
                                                type="button"
                                                sx={{ minWidth: 120 }}
                                            >
                                                Change Password
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default ProfileContent; 