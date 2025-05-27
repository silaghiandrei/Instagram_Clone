import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Post } from '../types';
import PostCard from './PostCard';

interface UserPostsContentProps {
  posts: Post[];
  onVote: (postId: number, voteType: 'up' | 'down') => Promise<void>;
  onComment: (postId: number, comment: string) => Promise<void>;
  onDelete: (postId: number) => Promise<void>;
}

const UserPostsContent: React.FC<UserPostsContentProps> = ({
  posts,
  onVote,
  onComment,
  onDelete,
}) => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Posts
        </Typography>
        {posts.length === 0 ? (
          <Typography>You haven't created any posts yet.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {posts.map((post) => (
              <Box key={post.id}>
                <PostCard 
                  post={post} 
                  onVote={onVote}
                  onComment={onComment}
                  onDelete={onDelete}
                  showActions={true}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default UserPostsContent; 