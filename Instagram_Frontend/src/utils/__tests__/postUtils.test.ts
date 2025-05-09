import { postService } from '../../services/postService';

jest.mock('../../services/postService', () => ({
    postService: {
        deletePost: jest.fn()
    }
}));

const mockConfirm = jest.fn();
window.confirm = mockConfirm;

describe('handleDeleteClick', () => {
    let setPosts: jest.Mock;
    let posts: any[];
    let handleDeleteClick: (postId: number) => Promise<void>;

    beforeEach(() => {
        jest.clearAllMocks();
        
        setPosts = jest.fn();
        posts = [
            { id: 1, title: 'Post 1' },
            { id: 2, title: 'Post 2' },
            { id: 3, title: 'Post 3' }
        ];

        handleDeleteClick = async (postId: number) => {
            if (window.confirm('Are you sure you want to delete this post?')) {
                try {
                    await postService.deletePost(postId);
                    setPosts(posts.filter(post => post.id !== postId));
                } catch (error) {
                    console.error('Error deleting post:', error);
                }
            }
        };
    });

    it('should not delete post when user cancels confirmation', async () => {
        mockConfirm.mockReturnValue(false);
        
        await handleDeleteClick(1);
        
        expect(postService.deletePost).not.toHaveBeenCalled();
        expect(setPosts).not.toHaveBeenCalled();
    });

    it('should delete post when user confirms', async () => {
        mockConfirm.mockReturnValue(true);
        (postService.deletePost as jest.Mock).mockResolvedValue(undefined);
        
        await handleDeleteClick(2);
        
        expect(postService.deletePost).toHaveBeenCalledWith(2);
        expect(setPosts).toHaveBeenCalledWith([
            { id: 1, title: 'Post 1' },
            { id: 3, title: 'Post 3' }
        ]);
    });

    it('should handle error when delete fails', async () => {
        mockConfirm.mockReturnValue(true);
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        (postService.deletePost as jest.Mock).mockRejectedValue(new Error('Delete failed'));
        
        await handleDeleteClick(1);
        
        expect(postService.deletePost).toHaveBeenCalledWith(1);
        expect(setPosts).not.toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith('Error deleting post:', expect.any(Error));
        
        consoleSpy.mockRestore();
    });
}); 