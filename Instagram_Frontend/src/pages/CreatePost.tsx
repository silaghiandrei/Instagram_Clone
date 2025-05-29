import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Alert, Snackbar } from '@mui/material';
import CreatePostForm from '../components/CreatePostForm';
import { postService } from '../services/postService';
import { tagService } from '../services/tagService';
import { Tag } from '../types';
import { authService } from '../services/authService';

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        setError('You must be logged in to create a post');
        setShowError(true);
        navigate('/login');
      }
    };
    checkAuth();
    fetchTags();
  }, [navigate]);

  const fetchTags = async () => {
    try {
      setIsLoadingTags(true);
      const fetchedTags = await tagService.getAllTags();
      setAvailableTags(fetchedTags);
    } catch (err) {
      setError('Failed to load tags');
      setShowError(true);
      console.error('Error fetching tags:', err);
    } finally {
      setIsLoadingTags(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateTag = async () => {
    if (newTagName.trim()) {
      try {
        const createdTag = await tagService.createTag(newTagName.trim());
        setTags([...tags, createdTag]);
        setAvailableTags([...availableTags, createdTag]);
        setNewTagName('');
        setIsTagDialogOpen(false);
      } catch (err) {
        setError('Failed to create tag');
        setShowError(true);
        console.error('Error creating tag:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        setError('You must be logged in to create a post');
        setShowError(true);
        navigate('/login');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('text', content);
      formData.append('type', 'POST');
      formData.append('isCommentable', 'true');
      formData.append('status', 'JUST_POSTED');
      formData.append('authorId', currentUser.id.toString());
      
      if (tags && tags.length > 0) {
        formData.append('tags', JSON.stringify(tags.map(tag => tag.name)));
      }

      if (image) {
        formData.append('image', image);
      }

      const createdPost = await postService.createPost(formData);
      if (createdPost) {
        navigate('/user');  // Navigate to user posts page instead of home
      }
    } catch (error: any) {
      console.error('Error creating post:', error);
      if (error.message.includes('session has expired') || error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setError('Failed to create post. Please try again.');
      }
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <CreatePostForm
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        image={image}
        setImage={setImage}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        tags={tags}
        setTags={setTags}
        availableTags={availableTags}
        isTagDialogOpen={isTagDialogOpen}
        setIsTagDialogOpen={setIsTagDialogOpen}
        newTagName={newTagName}
        setNewTagName={setNewTagName}
        isLoadingTags={isLoadingTags}
        isSubmitting={isSubmitting}
        error={error}
        onImageChange={handleImageChange}
        onCreateTag={handleCreateTag}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/user')}
      />

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

export default CreatePost; 