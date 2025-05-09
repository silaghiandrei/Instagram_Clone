import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
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
      formData.append('title', 'Comment');
      formData.append('text', comment);
      formData.append('authorId', currentUser.id.toString());
      
      if (commentImage) {
        formData.append('image', commentImage);
      }

      await postService.createComment(post.id, formData);
      
      setComment('');
      setCommentImage(null);
      setCommentImagePreview('');
      
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

  if (loading) {
    return <Typography>Loading post...</Typography>;
  }

  if (!post) {
    return <Typography>Post not found</Typography>;
  }

  return (
    <PostDetailContent
      post={post}
      comments={comments}
      comment={comment}
      commentImagePreview={commentImagePreview}
      error={error}
      onCommentChange={(e) => setComment(e.target.value)}
      onCommentImageChange={handleCommentImageChange}
      onCommentSubmit={handleCommentSubmit}
      onBackClick={() => navigate(-1)}
      formatDate={formatDate}
      onClearImage={() => {
        setCommentImage(null);
        setCommentImagePreview('');
      }}
    />
  );
};

export default PostDetail; 