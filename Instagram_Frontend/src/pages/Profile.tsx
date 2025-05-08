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
        email: '',
        bio: ''
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
                    email: userData.email,
                    bio: userData.bio || ''
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
            />
        </Container>
    );
};

export default Profile; 