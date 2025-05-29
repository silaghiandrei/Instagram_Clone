import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Divider,
  Avatar,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Post } from '../types';
import PostCard from './PostCard';
import { authService } from '../services/authService';

interface PostDetailContentProps {
  post: Post;
  comments: Post[];
  comment: string;
  commentTitle: string;
  commentImagePreview: string;
  error: string | null;
  onCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCommentTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCommentImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCommentSubmit: (e: React.FormEvent) => void;
  onBackClick: () => void;
  formatDate: (dateString?: string) => string;
  onClearImage: () => void;
  onEditComment?: (commentId: number, title: string, text: string) => Promise<void>;
  onDeleteComment?: (commentId: number) => Promise<void>;
}

const PostDetailContent: React.FC<PostDetailContentProps> = ({
  post,
  comments,
  comment,
  commentTitle,
  commentImagePreview,
  error,
  onCommentChange,
  onCommentTitleChange,
  onCommentImageChange,
  onCommentSubmit,
  onBackClick,
  formatDate,
  onClearImage,
  onEditComment,
  onDeleteComment,
}) => {
  const [editingComment, setEditingComment] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id: number } | null>(null);

  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  const handleEditClick = (comment: Post) => {
    setEditingComment(comment);
    setEditTitle(comment.title);
    setEditText(comment.text);
  };

  const handleEditSubmit = async () => {
    if (editingComment && onEditComment) {
      await onEditComment(editingComment.id, editTitle, editText);
      setEditingComment(null);
    }
  };

  const handleDeleteClick = async (commentId: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      if (onDeleteComment) {
        await onDeleteComment(commentId);
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Button
        variant="outlined"
        onClick={onBackClick}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box>
          <PostCard
            post={post}
            onVote={() => {}}
            onComment={() => {}}
          />

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Comments
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {post.status === 'OUTDATED' ? (
              <Box sx={{ 
                p: 2, 
                bgcolor: 'grey.100', 
                borderRadius: 1,
                textAlign: 'center'
              }}>
                <Typography color="text.secondary">
                  Comments are disabled for this post
                </Typography>
              </Box>
            ) : (
              <form onSubmit={onCommentSubmit}>
                <TextField
                  fullWidth
                  label="Title"
                  value={commentTitle}
                  onChange={onCommentTitleChange}
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={onCommentChange}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ mb: 2 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="comment-image-upload"
                    type="file"
                    onChange={onCommentImageChange}
                  />
                  <label htmlFor="comment-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      size="small"
                      sx={{ mr: 2 }}
                    >
                      Add Image
                    </Button>
                  </label>
                  {commentImagePreview && (
                    <Box sx={{ mt: 2, position: 'relative', display: 'inline-block' }}>
                      <img
                        src={commentImagePreview}
                        alt="Preview"
                        style={{ maxHeight: 100, maxWidth: 100, objectFit: 'contain' }}
                      />
                      <IconButton
                        size="small"
                        onClick={onClearImage}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          backgroundColor: 'background.paper',
                        }}
                      >
                        ×
                      </IconButton>
                    </Box>
                  )}
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={!comment.trim()}
                >
                  Post Comment
                </Button>
              </form>
            )}

            <Box sx={{ mt: 4 }}>
              {comments.length === 0 ? (
                <Typography color="text.secondary" align="center">
                  No comments yet. Be the first to comment!
                </Typography>
              ) : (
                comments.map((comment) => (
                  <Card key={comment.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ mr: 2 }}>
                          {comment.author?.username?.[0]?.toUpperCase() || '?'}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2">
                            {comment.author?.username || 'Unknown User'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(comment.dateTime)}
                          </Typography>
                        </Box>
                        {currentUser && comment.author?.id === currentUser.id && (
                          <Box>
                            <Button
                              size="small"
                              onClick={() => handleEditClick(comment)}
                              sx={{ mr: 1 }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(comment.id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        )}
                      </Box>

                      <Typography variant="h6" gutterBottom>
                        {comment.title}
                      </Typography>

                      <Typography variant="body1" paragraph>
                        {comment.text}
                      </Typography>

                      {comment.image && (
                        <CardMedia
                          component="img"
                          height="200"
                          image={`data:image/jpeg;base64,${comment.image}`}
                          alt="Comment image"
                          sx={{ objectFit: 'contain', mb: 2 }}
                        />
                      )}

                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          mt: 2 
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => {}}
                          >
                            Upvote
                          </Button>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => {}}
                          >
                            Downvote
                          </Button>
                          <Typography variant="body1" sx={{ minWidth: '2rem', textAlign: 'center' }}>
                            0
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          </Paper>
        </Box>
      )}

      <Dialog open={!!editingComment} onClose={() => setEditingComment(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Content"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              fullWidth
              required
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingComment(null)}>
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit}
            variant="contained"
            disabled={!editTitle || !editText}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PostDetailContent; 