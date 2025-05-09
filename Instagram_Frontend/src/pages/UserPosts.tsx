import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { Post } from '../types';
import PostCard from '../components/PostCard';

const UserPosts: React.FC = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    navigate('/login');
                    return;
                }
                const userPosts = await postService.getPostsByUserId(parseInt(userId));
                setPosts(userPosts);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [navigate]);

    const handleVote = async (postId: number, voteType: 'up' | 'down') => {
        try {
            // TODO: Implement vote functionality
            console.log(`Voting ${voteType} on post ${postId}`);
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const handleComment = async (postId: number, comment: string) => {
        try {
            // TODO: Implement comment functionality
            console.log(`Commenting on post ${postId}: ${comment}`);
        } catch (error) {
            console.error('Error commenting:', error);
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container>
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    My Posts
                </Typography>
                {posts.length === 0 ? (
                    <Typography>You haven't created any posts yet.</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {posts.map((post) => (
                            <Grid item xs={12} sm={6} md={4} key={post.id}>
                                <PostCard 
                                    post={post} 
                                    onVote={handleVote}
                                    onComment={handleComment}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Container>
    );
};

export default UserPosts; 