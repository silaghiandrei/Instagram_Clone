import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { postService } from '../services/postService';
import { Post } from '../types';
import { authService } from '../services/authService';
import PostCard from '../components/PostCard';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [commentImage, setCommentImage] = useState<File | null>(null);
  const [commentImagePreview, setCommentImagePreview] = useState<string>('');

  useEffect(() => {
    if (!id) {
      setError('No post ID provided');
      setLoading(false);
      return;
    }

    const postId = parseInt(id, 10);
    if (isNaN(postId) || postId <= 0) {
      setError('Invalid post ID');
      setLoading(false);
      return;
    }

    fetchPost(postId);
    fetchComments(postId);
  }, [id]);

  const fetchPost = async (postId: number) => {
    try {
      setLoading(true);
      const fetchedPost = await postService.getPostById(postId);
      setPost(fetchedPost);
      setError(null);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: number) => {
    try {
      const fetchedComments = await postService.getCommentsByPost(postId);
      // Sort comments by date, newest first
      const sortedComments = fetchedComments.sort((a, b) => {
        const dateA = a.dateTime ? new Date(a.dateTime).getTime() : 0;
        const dateB = b.dateTime ? new Date(b.dateTime).getTime() : 0;
        return dateB - dateA;
      });
      setComments(sortedComments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleCommentImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setCommentImage(file);
      setCommentImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !comment.trim()) return;

    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      setError('You must be logged in to comment');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', 'Comment'); // Comments don't need a title
      formData.append('text', comment);
      formData.append('authorId', currentUser.id.toString());
      
      if (commentImage) {
        formData.append('image', commentImage);
      }

      await postService.createComment(post.id, formData);
      
      // Clear form
      setComment('');
      setCommentImage(null);
      setCommentImagePreview('');
      
      // Refresh comments
      fetchComments(post.id);
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post comment');
    }
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

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      {loading ? (
        <Typography>Loading post...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : post ? (
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

            <form onSubmit={handleCommentSubmit}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="comment-image-upload"
                  type="file"
                  onChange={handleCommentImageChange}
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
                      onClick={() => {
                        setCommentImage(null);
                        setCommentImagePreview('');
                      }}
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
                          {comment.author.username[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {comment.author.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(comment.dateTime)}
                          </Typography>
                        </Box>
                      </Box>

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
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          </Paper>
        </Box>
      ) : (
        <Typography>Post not found</Typography>
      )}
    </Container>
  );
};

export default PostDetail; 