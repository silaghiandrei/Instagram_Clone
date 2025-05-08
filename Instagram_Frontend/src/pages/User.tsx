import React, { useState } from 'react';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import UserContent from '../components/UserContent';

const User: React.FC = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>('All Posts');
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleFilterSelect = (filter: string) => {
    setFilterType(filter);
    handleFilterMenuClose();
  };

  const handleProfileSelect = (action: string) => {
    handleProfileMenuClose();
    if (action === 'logout') {
      authService.logout();
      navigate('/login');
    } else if (action === 'profile') {
      navigate('/profile');
    }
  };

  return (
    <Container>
      <UserContent
        filterType={filterType}
        profileMenuAnchor={profileMenuAnchor}
        filterMenuAnchor={filterMenuAnchor}
        onProfileClick={handleProfileClick}
        onProfileMenuClose={handleProfileMenuClose}
        onFilterClick={handleFilterClick}
        onFilterMenuClose={handleFilterMenuClose}
        onFilterSelect={handleFilterSelect}
        onProfileSelect={handleProfileSelect}
      />
    </Container>
  );
};

export default User; 