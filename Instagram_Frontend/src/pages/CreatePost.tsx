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
    fetchTags();
  }, []);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!authService.getCurrentUser()) {
      setError('You must be logged in to create a post');
      setShowError(true);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('text', content);
      formData.append('type', 'POST');
      formData.append('isCommentable', 'true');
      formData.append('authorId', authService.getCurrentUser()?.id.toString() || '');
      formData.append('tags', JSON.stringify(tags.map(tag => tag.name)));
      
      if (image) {
        formData.append('image', image);
      }

      await postService.createPost(formData);
      navigate('/user');
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
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