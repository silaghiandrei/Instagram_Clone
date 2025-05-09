import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { Post } from '../types';
import UserPostsContent from '../components/UserPostsContent';

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
            console.log(`Voting ${voteType} on post ${postId}`);
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const handleComment = async (postId: number, comment: string) => {
        try {
            console.log(`Commenting on post ${postId}: ${comment}`);
        } catch (error) {
            console.error('Error commenting:', error);
        }
    };

    const handleDeleteClick = async (postId: number) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await postService.deletePost(postId);
                setPosts(posts.filter(post => post.id !== postId));
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <UserPostsContent
            posts={posts}
            onVote={handleVote}
            onComment={handleComment}
            onDelete={handleDeleteClick}
        />
    );
};

export default UserPosts; 