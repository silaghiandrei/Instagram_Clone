import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Post } from '../types';
import { authService } from '../services/authService';

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'JUST_POSTED':
      return 'info';
    case 'FIRST_REACTIONS':
      return 'success';
    case 'OUTDATED':
      return 'warning';
    default:
      return 'default';
  }
};

interface PostCardProps {
  post: Post;
  onVote: (postId: number, voteType: 'up' | 'down') => void;
  onComment: (postId: number, comment: string) => void;
  onDelete?: (postId: number) => void;
  onEdit?: (post: Post) => void;
  onToggleComments?: (postId: number, isCommentable: boolean) => void;
  showActions?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onVote, 
  onComment,
  onDelete,
  onEdit,
  onToggleComments,
  showActions = false
}) => {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUserId(user?.id || null);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleCardClick = () => {
    if (!post.id) {
      console.error('Post ID is missing. Post data:', post);
      return;
    }
    navigate(`/post/${post.id}`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const isAuthor = currentUserId === post.author.id;

  return (
    <Card 
      sx={{ 
        mb: 3, 
        width: '100%',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6
        }
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ mr: 2 }}
            src={post.author.profilePicture ? `data:image/jpeg;base64,${post.author.profilePicture}` : undefined}
          >
            {!post.author.profilePicture && post.author.username[0].toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">
              {post.author.username}
              <Typography 
                component="span" 
                variant="body2" 
                color="primary" 
                sx={{ ml: 1, fontWeight: 'bold' }}
              >
                {post.author.score || 0}
              </Typography>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(post.dateTime)}
            </Typography>
          </Box>
          {post.status && (
            <Chip 
              label={post.status} 
              color={getStatusColor(post.status) as any}
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Box>

        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>

        {post.image && (
          <CardMedia
            component="img"
            height="300"
            image={`data:image/jpeg;base64,${post.image}`}
            alt={post.title}
            sx={{ objectFit: 'contain', mb: 2 }}
          />
        )}

        <Typography variant="body1" paragraph>
          {post.text}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {post.tags?.map((tag, index) => (
            <Chip 
              key={index} 
              label={tag.name} 
              size="small" 
              variant="outlined"
              color="primary"
            />
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2 
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {!isAuthor && (
              <>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => onVote(post.id!, 'up')}
                >
                  Upvote
                </Button>
                <Typography variant="body2" color="text.secondary">
                  {post.upvotes || 0}
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => onVote(post.id!, 'down')}
                >
                  Downvote
                </Button>
                <Typography variant="body2" color="text.secondary">
                  {post.downvotes || 0}
                </Typography>
                <Typography 
                  variant="body2" 
                  color={(post.upvotes || 0) - (post.downvotes || 0) >= 0 ? 'success.main' : 'error.main'}
                  sx={{ ml: 1, fontWeight: 'bold' }}
                >
                  {`${(post.upvotes || 0) - (post.downvotes || 0)} votes`}
                </Typography>
              </>
            )}
            {isAuthor && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="body2" color="success.main">
                  {`${post.upvotes || 0} upvotes`}
                </Typography>
                <Typography variant="body2" color="error.main">
                  {`${post.downvotes || 0} downvotes`}
                </Typography>
                <Typography 
                  variant="body2" 
                  color={(post.upvotes || 0) - (post.downvotes || 0) >= 0 ? 'success.main' : 'error.main'}
                  sx={{ fontWeight: 'bold' }}
                >
                  {`• ${(post.upvotes || 0) - (post.downvotes || 0)} total`}
                </Typography>
              </Box>
            )}
          </Box>
          {showActions && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(post);
                }}
              >
                Edit
              </Button>
              {onToggleComments && (
                <Button 
                  variant="outlined" 
                  color={!post.isCommentable ? "success" : "warning"}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComments(post.id!, !post.isCommentable);
                  }}
                >
                  {!post.isCommentable ? "Enable Comments" : "Disable Comments"}
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(post.id);
                  }}
                >
                  Delete
                </Button>
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCard; 