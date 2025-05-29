import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Snackbar, Alert } from '@mui/material';
import { postService } from '../services/postService';
import { Post } from '../types';
import { authService } from '../services/authService';
import PostDetailContent from '../components/PostDetailContent';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [commentTitle, setCommentTitle] = useState('');
  const [commentImage, setCommentImage] = useState<File | null>(null);
  const [commentImagePreview, setCommentImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);

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
    if (!post) {
      setError('Post not found');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', commentTitle);
      formData.append('text', comment);
      formData.append('parentId', post.id.toString());
      
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      formData.append('authorId', currentUser.id.toString());
      
      if (commentImage) {
        formData.append('image', commentImage);
      }

      await postService.createComment(post.id, formData);
      setComment('');
      setCommentTitle('');
      setCommentImage(null);
      setCommentImagePreview('');
      
      fetchComments(post.id);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Failed to submit comment. Please try again.');
      setShowError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: number, title: string, text: string) => {
    try {
      const commentToUpdate = comments.find(c => c.id === commentId);
      if (!commentToUpdate) {
        throw new Error('Comment not found');
      }

      const updatedComment = await postService.updatePost(commentId, {
        ...commentToUpdate,
        title,
        text
      });
      
      setComments(comments.map(comment => 
        comment.id === commentId ? updatedComment : comment
      ));
    } catch (error) {
      console.error('Error updating comment:', error);
      setError('Failed to update comment. Please try again.');
      setShowError(true);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await postService.deletePost(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment. Please try again.');
      setShowError(true);
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

  if (loading) {
    return <Typography>Loading post...</Typography>;
  }

  if (!post) {
    return <Typography>Post not found</Typography>;
  }

  return (
    <>
      <PostDetailContent
        post={post}
        comments={comments}
        comment={comment}
        commentTitle={commentTitle}
        commentImagePreview={commentImagePreview}
        error={error}
        onCommentChange={(e) => setComment(e.target.value)}
        onCommentTitleChange={(e) => setCommentTitle(e.target.value)}
        onCommentImageChange={handleCommentImageChange}
        onCommentSubmit={handleCommentSubmit}
        onBackClick={() => navigate(-1)}
        formatDate={formatDate}
        onClearImage={() => {
          setCommentImage(null);
          setCommentImagePreview('');
        }}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
      />
      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PostDetail; 