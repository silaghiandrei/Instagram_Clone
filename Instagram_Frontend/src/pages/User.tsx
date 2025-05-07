import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContent from '../components/UserContent';

const User: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterType, setFilterType] = useState<string>('All Posts');
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (filter: string) => {
    setFilterType(filter);
    handleMenuClose();
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleProfileSelect = (action: string) => {
    handleProfileMenuClose();
    if (action === 'logout') {
      localStorage.removeItem('token');
      navigate('/login');
    } else if (action === 'profile') {
    }
  };

  return (
    <UserContent
      filterType={filterType}
      anchorEl={anchorEl}
      profileMenuAnchor={profileMenuAnchor}
      onMenuClick={handleMenuClick}
      onMenuClose={handleMenuClose}
      onFilterSelect={handleFilterSelect}
      onProfileClick={handleProfileClick}
      onProfileMenuClose={handleProfileMenuClose}
      onProfileSelect={handleProfileSelect}
    />
  );
};

export default User; 