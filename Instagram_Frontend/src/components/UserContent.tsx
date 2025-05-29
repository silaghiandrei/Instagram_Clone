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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PostCard from './PostCard';
import { postService } from '../services/postService';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { Post, UserData } from '../types';

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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [user, setUser] = useState<UserData | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        
        // First try to get the current user
        const currentUser = await authService.getCurrentUser();
        
        // If no ID is provided, use the current user
        if (!id) {
          if (!currentUser) {
            throw new Error('No user ID provided and no authenticated user found');
          }
          setUser(currentUser);
          setIsCurrentUser(true);
        } else {
          // If ID is provided, fetch that user
          const userId = parseInt(id);
          if (isNaN(userId)) {
            throw new Error('Invalid user ID');
          }

          const userData = await userService.getUserById(userId);
          setUser(userData);
          setIsCurrentUser(currentUser?.id === userId);
        }

        // Fetch posts regardless of which user we're viewing
        const fetchedPosts = await postService.getAllPosts();
        console.log('Fetched posts:', fetchedPosts);
        // Sort posts by dateTime in descending order (newest first)
        const sortedPosts = fetchedPosts.sort((a, b) => {
          const dateA = a.dateTime ? new Date(a.dateTime).getTime() : 0;
          const dateB = b.dateTime ? new Date(b.dateTime).getTime() : 0;
          return dateB - dateA;
        });
        setAllPosts(sortedPosts);
        setPosts(sortedPosts);
        setError(null);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    if (filterType === 'By Tag') {
      setTagFilter('');
      setTitleFilter('');
      setUserFilter('');
    } else if (filterType === 'By Title') {
      setTagFilter('');
      setTitleFilter('');
      setUserFilter('');
    } else if (filterType === 'By User') {
      setTagFilter('');
      setTitleFilter('');
      setUserFilter('');
    } else {
      setPosts(allPosts);
    }
  }, [filterType, allPosts]);

  const handleTagFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tag = event.target.value;
    setTagFilter(tag);
    if (tag.trim() === '') {
      setPosts(allPosts);
    } else {
      const filteredPosts = allPosts.filter(post => 
        post.tags?.some(t => t.name?.toLowerCase().includes(tag.toLowerCase()))
      );
      setPosts(filteredPosts);
    }
  };

  const handleTitleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    setTitleFilter(title);
    if (title.trim() === '') {
      setPosts(allPosts);
    } else {
      const filteredPosts = allPosts.filter(post => 
        post.title?.toLowerCase().includes(title.toLowerCase())
      );
      setPosts(filteredPosts);
    }
  };

  const handleUserFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const username = event.target.value;
    setUserFilter(username);
    if (username.trim() === '') {
      setPosts(allPosts);
    } else {
      const filteredPosts = allPosts.filter(post => 
        post.author?.username?.toLowerCase().includes(username.toLowerCase())
      );
      setPosts(filteredPosts);
    }
  };

  const handleVote = async (postId: number, voteType: 'up' | 'down') => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User not authenticated');
        return;
      }

      const voteTypeEnum = voteType === 'up' ? 'UPVOTE' : 'DOWN_VOTE';
      const updatedPost = await postService.votePost(postId, parseInt(userId), voteTypeEnum);
      
      // Update the posts list with the new vote counts
      setPosts(posts.map(post => 
        post.id === postId ? {
          ...post,
          upvotes: updatedPost.upvotes,
          downvotes: updatedPost.downvotes
        } : post
      ));
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

  const handleEditProfile = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container maxWidth="sm">
        <Box mt={4}>
          <Typography color="error" align="center">
            {error || 'User not found'}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar sx={{ minHeight: 80, py: 2 }}>
          <Avatar
            sx={{ width: 60, height: 60, mr: 2, cursor: 'pointer' }}
            onClick={onProfileClick}
            src={user?.profilePicture ? `data:image/jpeg;base64,${user.profilePicture}` : undefined}
          >
            {!user?.profilePicture && user?.username[0].toUpperCase()}
          </Avatar>
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

        {filterType === 'By Tag' && (
          <TextField
            fullWidth
            label="Enter tag"
            value={tagFilter}
            onChange={handleTagFilterChange}
            placeholder="Type to filter by tag..."
            sx={{ mb: 2 }}
          />
        )}

        {filterType === 'By Title' && (
          <TextField
            fullWidth
            label="Enter title"
            value={titleFilter}
            onChange={handleTitleFilterChange}
            placeholder="Type to filter by title..."
            sx={{ mb: 2 }}
          />
        )}

        {filterType === 'By User' && (
          <TextField
            fullWidth
            label="Enter username"
            value={userFilter}
            onChange={handleUserFilterChange}
            placeholder="Type to filter by username..."
            sx={{ mb: 2 }}
          />
        )}

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
              {filterType === 'By Tag' && tagFilter ? 
                `No posts found with tag "${tagFilter}"` : 
                filterType === 'By Title' && titleFilter ?
                `No posts found with title containing "${titleFilter}"` :
                filterType === 'By User' && userFilter ?
                `No posts found by user "${userFilter}"` :
                'No posts found'}
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
    </Box>
  );
};

export default UserContent; 