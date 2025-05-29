import React, { useRef } from 'react';
import { Typography, Box, Paper, TextField, Button, Avatar, Grid, IconButton } from '@mui/material';
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
    onProfilePictureChange: (file: File) => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
    user,
    isEditing,
    formData,
    onEditClick,
    onCancelClick,
    onChange,
    onSubmit,
    onProfilePictureChange
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Add logging for profile picture
    React.useEffect(() => {
        console.log('User profile picture exists:', !!user.profilePicture);
        if (user.profilePicture) {
            console.log('Profile picture length:', user.profilePicture.length);
        }
    }, [user.profilePicture]);

    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onEditClick();
    };

    const handleChangePassword = () => {
        // TODO: Implement change password functionality
        console.log('Change password clicked');
    };

    const handleProfilePictureClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log('Selected file:', file.name, 'Size:', file.size, 'bytes');
            onProfilePictureChange(file);
        }
    };

    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ position: 'relative', mb: 2 }}>
                        <Avatar
                            sx={{ width: 100, height: 100 }}
                            src={user.profilePicture ? `data:image/jpeg;base64,${user.profilePicture}` : undefined}
                        >
                            {!user.profilePicture && user.username[0].toUpperCase()}
                        </Avatar>
                        {isEditing && (
                            <Button
                                variant="contained"
                                size="small"
                                onClick={handleProfilePictureClick}
                                sx={{
                                    position: 'absolute',
                                    bottom: -10,
                                    right: -10,
                                    minWidth: 'auto',
                                    width: 30,
                                    height: 30,
                                    borderRadius: '50%',
                                    p: 0
                                }}
                            >
                                +
                            </Button>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </Box>
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