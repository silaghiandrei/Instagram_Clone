import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { UserData } from '../types';
import ProfileContent from '../components/ProfileContent';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    navigate('/login');
                    return;
                }
                const userData = await userService.getUserById(parseInt(userId));
                setUser(userData);
                setFormData({
                    username: userData.username,
                    email: userData.email
                });
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!user) return;
            const updatedUser = await userService.updateUser(user.id, {
                ...user,
                ...formData
            });
            setUser(updatedUser);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleProfilePictureChange = async (file: File) => {
        try {
            if (!user) return;
            const formData = new FormData();
            formData.append('profilePicture', file);
            const updatedUser = await userService.updateProfilePicture(user.id, formData);
            setUser(updatedUser);
        } catch (error) {
            console.error('Error updating profile picture:', error);
        }
    };

    if (!user) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container>
            <ProfileContent
                user={user}
                isEditing={isEditing}
                formData={formData}
                onEditClick={() => setIsEditing(true)}
                onCancelClick={() => setIsEditing(false)}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onProfilePictureChange={handleProfilePictureChange}
            />
        </Container>
    );
};

export default Profile; 