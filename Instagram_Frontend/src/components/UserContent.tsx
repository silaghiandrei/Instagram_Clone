import React, { useEffect, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import PostCard from './PostCard';
import { postService } from '../services/postService';
import { authService } from '../services/authService';
import { Post } from '../types';

interface UserContentProps {
  filterType: string;
  profileMenuAnchor: HTMLElement | null;
  filterMenuAnchor: HTMLElement | null;
  onProfileClick: (event: React.MouseEvent<HTMLElement>) => void;
  onProfileMenuClose: () => void;
  onFilterClick: (event: React.MouseEvent<HTMLElement>) => void;
  onFilterMenuClose: () => void;
  onFilterSelect: (filter: string) => void;
  onProfileSelect: (action: string) => void;
}

const UserContent: React.FC<UserContentProps> = ({
  filterType,
  profileMenuAnchor,
  filterMenuAnchor,
  onProfileClick,
  onProfileMenuClose,
  onFilterClick,
  onFilterMenuClose,
  onFilterSelect,
  onProfileSelect,
}) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await postService.getAllPosts();
      console.log('Fetched posts:', fetchedPosts);
      // Sort posts by dateTime in descending order (newest first)
      const sortedPosts = fetchedPosts.sort((a, b) => {
        const dateA = a.dateTime ? new Date(a.dateTime).getTime() : 0;
        const dateB = b.dateTime ? new Date(b.dateTime).getTime() : 0;
        return dateB - dateA;
      });
      setPosts(sortedPosts);
      setError(null);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId: number, voteType: 'up' | 'down') => {
    try {
      // TODO: Implement vote functionality
      console.log(`Voting ${voteType} on post ${postId}`);
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  const handleComment = async (postId: number, comment: string) => {
    try {
      // TODO: Implement comment functionality
      console.log(`Commenting on post ${postId}: ${comment}`);
    } catch (err) {
      console.error('Error commenting:', err);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar sx={{ minHeight: 80, py: 2 }}>
          <Avatar
            sx={{ width: 60, height: 60, mr: 2, cursor: 'pointer' }}
            onClick={onProfileClick}
          />
          <Menu
            anchorEl={profileMenuAnchor}
            open={Boolean(profileMenuAnchor)}
            onClose={onProfileMenuClose}
          >
            <MenuItem onClick={() => navigate('/profile')}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => navigate('/my-posts')}>
              Posts
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              Log Out
            </MenuItem>
          </Menu>

          <Button
            variant="text"
            onClick={onFilterClick}
            sx={{ ml: 'auto' }}
          >
            {filterType}
          </Button>
          <Menu
            anchorEl={filterMenuAnchor}
            open={Boolean(filterMenuAnchor)}
            onClose={onFilterMenuClose}
          >
            <MenuItem onClick={() => onFilterSelect('All Posts')}>All Posts</MenuItem>
            <MenuItem onClick={() => onFilterSelect('My Posts')}>My Posts</MenuItem>
            <MenuItem onClick={() => onFilterSelect('By Tag')}>Search by Tag</MenuItem>
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
          gap: 2,
          overflow: 'auto'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">
            {filterType}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/create-post')}
          >
            Create Post
          </Button>
        </Box>

        {loading ? (
          <Typography>Loading posts...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : posts.length === 0 ? (
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              textAlign: 'center',
              border: '1px solid #e0e0e0'
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No posts found
            </Typography>
          </Paper>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onVote={handleVote}
              onComment={handleComment}
            />
          ))
        )}
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
      />
    </Box>
  );
};

export default UserContent; 