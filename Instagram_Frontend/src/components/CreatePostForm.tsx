import React from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/material/Icon';
import CloseIcon from '@mui/material/Icon';
import ImageIcon from '@mui/material/Icon';
import { Tag } from '../services/tagService';

interface CreatePostFormProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  image: File | null;
  setImage: (image: File | null) => void;
  imagePreview: string;
  setImagePreview: (preview: string) => void;
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  availableTags: Tag[];
  isTagDialogOpen: boolean;
  setIsTagDialogOpen: (isOpen: boolean) => void;
  newTagName: string;
  setNewTagName: (name: string) => void;
  isLoadingTags: boolean;
  isSubmitting: boolean;
  error: string | null;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateTag: () => void;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({
  title,
  setTitle,
  content,
  setContent,
  image,
  setImage,
  imagePreview,
  setImagePreview,
  tags,
  setTags,
  availableTags,
  isTagDialogOpen,
  setIsTagDialogOpen,
  newTagName,
  setNewTagName,
  isLoadingTags,
  isSubmitting,
  error,
  onImageChange,
  onCreateTag,
  onSubmit,
  onCancel,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create New Post
      </Typography>

      <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          mb: 3
        }}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <TextField
            fullWidth
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            multiline
            rows={4}
            disabled={isSubmitting}
          />

          <Box>
            <Autocomplete
              multiple
              freeSolo
              options={availableTags}
              getOptionLabel={(option) => 
                typeof option === 'string' ? option : option.name
              }
              value={tags}
              onChange={(_, newValue) => {
                setTags(newValue as Tag[]);
              }}
              disabled={isSubmitting}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  helperText="Type to search existing tags or create new ones"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingTags ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setIsTagDialogOpen(true)}
                            disabled={isSubmitting}
                          >
                            <AddIcon>add</AddIcon>
                          </IconButton>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    color="primary"
                    variant="outlined"
                  />
                ))
              }
            />
          </Box>

          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 300,
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 2,
            bgcolor: '#fafafa'
          }}>
            {!imagePreview ? (
              <>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={onImageChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<ImageIcon>image</ImageIcon>}
                    size="large"
                    disabled={isSubmitting}
                  >
                    Upload Image
                  </Button>
                </label>
              </>
            ) : (
              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: 8
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  }}
                  onClick={() => {
                    setImage(null);
                    setImagePreview('');
                  }}
                  disabled={isSubmitting}
                >
                  <CloseIcon>close</CloseIcon>
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            fullWidth
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!title || !content || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Creating Post...' : 'Create Post'}
          </Button>
        </Box>
      </Box>

      <Dialog open={isTagDialogOpen} onClose={() => setIsTagDialogOpen(false)}>
        <DialogTitle>Create New Tag</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tag Name"
            fullWidth
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onCreateTag();
              }
            }}
            disabled={isSubmitting}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsTagDialogOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={onCreateTag}
            disabled={!newTagName.trim() || isSubmitting}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CreatePostForm; 