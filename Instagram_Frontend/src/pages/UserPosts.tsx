import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { Post } from '../types';
import PostCard from '../components/PostCard';

const UserPosts: React.FC = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editText, setEditText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    navigate('/login');
                    return;
                }
                const userPosts = await postService.getPostsByUserId(parseInt(userId));
                console.log('Loaded posts:', userPosts);
                // Update isCommentable based on status
                const updatedPosts = userPosts.map(post => ({
                    ...post,
                    isCommentable: post.status !== 'OUTDATED'
                }));
                const sortedPosts = updatedPosts.sort((a, b) => {
                    const dateA = a.dateTime ? new Date(a.dateTime).getTime() : 0;
                    const dateB = b.dateTime ? new Date(b.dateTime).getTime() : 0;
                    return dateB - dateA;
                });
                setPosts(sortedPosts);
            } catch (error) {
                console.error('Error fetching user posts:', error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [navigate]);

    const handleVote = async (postId: number, voteType: 'up' | 'down') => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('User not authenticated');
                return;
            }

            const voteTypeEnum = voteType === 'up' ? 'UPVOTE' : 'DOWN_VOTE';
            const updatedPost = await postService.votePost(postId, parseInt(userId), voteTypeEnum);
            
            setPosts(posts.map(post =>
                post.id === postId ? {
                    ...post,
                    upvotes: updatedPost.upvotes,
                    downvotes: updatedPost.downvotes
                } : post
            ));
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

    const handleEditClick = (post: Post) => {
        console.log('Editing post:', post);
        setEditingPost(post);
        setEditTitle(post.title);
        setEditText(post.text);
    };

    const handleEditSubmit = async () => {
        if (!editingPost) return;

        try {
            setIsSubmitting(true);
            setError(null);
            
            const updatedPostData = {
                ...editingPost,
                title: editTitle,
                text: editText
            };
            
            console.log('Submitting updated post:', updatedPostData);
            const updatedPost = await postService.updatePost(editingPost.id, updatedPostData);
            console.log('Post updated successfully:', updatedPost);

            setPosts(posts.map(post =>
                post.id === updatedPost.id ? {
                    ...post,
                    title: updatedPost.title,
                    text: updatedPost.text
                } : post
            ));
            setEditingPost(null);
        } catch (error: any) {
            console.error('Error updating post:', error);
            setError(error.message || 'Failed to update post. Please try again.');
            setShowError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditCancel = () => {
        setEditingPost(null);
        setEditTitle('');
        setEditText('');
    };

    const handleCloseError = () => {
        setShowError(false);
    };

    const handleToggleComments = async (postId: number, isCommentable: boolean) => {
        try {
            const post = posts.find(p => p.id === postId);
            if (!post) return;

            // Get comments for this post first
            const comments = await postService.getCommentsByPost(postId);
            
            // Determine the new status based on commentable state and comment count
            let newStatus: 'JUST_POSTED' | 'FIRST_REACTIONS' | 'OUTDATED';
            if (isCommentable) {
                newStatus = comments.length > 0 ? 'FIRST_REACTIONS' : 'JUST_POSTED';
            } else {
                newStatus = 'OUTDATED';
            }

            // Update the post's status first
            await postService.updatePostStatus(postId, newStatus);

            // Then update the post's commentable status
            const updatedPost = await postService.updatePost(postId, {
                ...post,
                isCommentable: isCommentable
            });

            // Update the posts list with the new status and commentable state
            setPosts(posts.map(p => 
                p.id === postId ? {
                    ...p,
                    isCommentable: isCommentable,
                    status: newStatus
                } : p
            ));
        } catch (error: any) {
            console.error('Error toggling comments:', error);
            setError(error.message || 'Failed to update post. Please try again.');
            setShowError(true);
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h4" gutterBottom>
                    My Posts
                </Typography>
                {posts.length === 0 ? (
                    <Typography>You haven't created any posts yet.</Typography>
                ) : (
                    posts.map((post) => (
                        <Box key={post.id}>
                            <PostCard 
                                post={post} 
                                onVote={handleVote}
                                onComment={handleComment}
                                onDelete={handleDeleteClick}
                                onEdit={handleEditClick}
                                onToggleComments={handleToggleComments}
                                showActions={true}
                            />
                        </Box>
                    ))
                )}
            </Box>

            <Dialog open={!!editingPost} onClose={handleEditCancel} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Post</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            fullWidth
                            required
                            error={!editTitle}
                            helperText={!editTitle ? 'Title is required' : ''}
                        />
                        <TextField
                            label="Content"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            fullWidth
                            required
                            multiline
                            rows={4}
                            error={!editText}
                            helperText={!editText ? 'Content is required' : ''}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditCancel} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleEditSubmit} 
                        variant="contained" 
                        disabled={!editTitle || !editText || isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={showError} 
                autoHideDuration={6000} 
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default UserPosts; 