import React from 'react';
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
import { Post } from '../types';
import PostCard from './PostCard';

interface PostDetailContentProps {
  post: Post;
  comments: Post[];
  comment: string;
  commentImagePreview: string;
  error: string | null;
  onCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCommentImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCommentSubmit: (e: React.FormEvent) => void;
  onBackClick: () => void;
  formatDate: (dateString?: string) => string;
  onClearImage: () => void;
}

const PostDetailContent: React.FC<PostDetailContentProps> = ({
  post,
  comments,
  comment,
  commentImagePreview,
  error,
  onCommentChange,
  onCommentImageChange,
  onCommentSubmit,
  onBackClick,
  formatDate,
  onClearImage,
}) => {
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

            <form onSubmit={onCommentSubmit}>
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
      )}
    </Container>
  );
};

export default PostDetailContent; 