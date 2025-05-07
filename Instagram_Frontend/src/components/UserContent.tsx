import {
  Container,
  Typography,
  AppBar,
  Toolbar,
  Box,
  Paper,
  Button,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';

interface UserContentProps {
  filterType: string;
  anchorEl: HTMLElement | null;
  profileMenuAnchor: HTMLElement | null;
  onMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
  onMenuClose: () => void;
  onFilterSelect: (filter: string) => void;
  onProfileClick: (event: React.MouseEvent<HTMLElement>) => void;
  onProfileMenuClose: () => void;
  onProfileSelect: (action: string) => void;
}

const UserContent: React.FC<UserContentProps> = ({
  filterType,
  anchorEl,
  profileMenuAnchor,
  onMenuClick,
  onMenuClose,
  onFilterSelect,
  onProfileClick,
  onProfileMenuClose,
  onProfileSelect,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Avatar
            sx={{ width: 40, height: 40, mr: 2, cursor: 'pointer' }}
            onClick={onProfileClick}
          />
          <Menu
            anchorEl={profileMenuAnchor}
            open={Boolean(profileMenuAnchor)}
            onClose={onProfileMenuClose}
          >
            <MenuItem onClick={() => onProfileSelect('profile')}>Profile</MenuItem>
            <MenuItem onClick={() => onProfileSelect('logout')}>Log Out</MenuItem>
          </Menu>

          <Button
            variant="text"
            onClick={() => {}}
            sx={{ mr: 'auto' }}
          >
            Create Post
          </Button>

          <Button
            variant="text"
            onClick={onMenuClick}
          >
            Filter: {filterType}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onMenuClose}
          >
            <MenuItem onClick={() => onFilterSelect('All Posts')}>All Posts</MenuItem>
            <MenuItem onClick={() => onFilterSelect('My Posts')}>My Posts</MenuItem>
            <MenuItem onClick={() => onFilterSelect('By Tag')}>Filter by Tag</MenuItem>
            <MenuItem onClick={() => onFilterSelect('By Title')}>Search by Title</MenuItem>
            <MenuItem onClick={() => onFilterSelect('By User')}>Search by User</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth="sm" 
        sx={{ 
          flexGrow: 1, 
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h5">
          Your Posts
        </Typography>

        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            textAlign: 'center',
            border: '1px solid #e0e0e0'
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Posts will be displayed here
          </Typography>
        </Paper>
      </Container>

      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0,
          borderTop: '1px solid #e0e0e0',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} 
        elevation={0}
      >
        <Typography variant="body2" color="text.secondary">
          Bottom Navigation
        </Typography>
      </Paper>
    </Box>
  );
};

export default UserContent; 