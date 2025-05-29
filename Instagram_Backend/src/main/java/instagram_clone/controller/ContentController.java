package instagram_clone.controller;

import instagram_clone.dto.ContentCreateDTO;
import instagram_clone.dto.ContentDTO;
import instagram_clone.dto.ContentUpdateDTO;
import instagram_clone.model.ContentType;
import instagram_clone.model.PostStatus;
import instagram_clone.model.VoteType;
import instagram_clone.service.ContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/contents")
public class ContentController {
    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public ResponseEntity<ContentDTO> createContent(
            @RequestParam("title") String title,
            @RequestParam("text") String text,
            @RequestParam("type") String type,
            @RequestParam("isCommentable") boolean isCommentable,
            @RequestParam("authorId") Long authorId,
            @RequestParam(value = "parentId", required = false) Long parentId,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam(value = "status", required = false) String status) {
        
        try {
            System.out.println("Received type: " + type);
            System.out.println("Received status: " + status);
            ContentCreateDTO contentCreateDTO = new ContentCreateDTO();
            contentCreateDTO.setTitle(title);
            contentCreateDTO.setText(text);
            contentCreateDTO.setCommentable(isCommentable);
            contentCreateDTO.setAuthorId(authorId);
            contentCreateDTO.setParentId(parentId);
            contentCreateDTO.setContentType(ContentType.valueOf(type));
            
            if (status != null) {
                try {
                    PostStatus postStatus = PostStatus.valueOf(status);
                    System.out.println("Converted status to enum: " + postStatus);
                    contentCreateDTO.setStatus(postStatus);
                } catch (IllegalArgumentException e) {
                    System.err.println("Failed to convert status: " + status);
                    e.printStackTrace();
                }
            }
            
            System.out.println("ContentType: " + contentCreateDTO.getContentType());
            System.out.println("Final status in DTO: " + contentCreateDTO.getStatus());
            
            if (image != null && !image.isEmpty()) {
                contentCreateDTO.setImage(image.getBytes());
            }
            
            if (tags != null && !tags.isEmpty()) {
                System.out.println("Received tags: " + tags);
                contentCreateDTO.setTags(tags);
            } else {
                System.out.println("No tags received in request");
                contentCreateDTO.setTags("[]"); // Set empty array as default
            }
            
            ContentDTO savedContent = this.contentService.create(contentCreateDTO);
            return ResponseEntity.ok(savedContent);
        } catch (Exception e) {
            System.err.println("Error creating content: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create content: " + e.getMessage(), e);
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ContentDTO> getContentById(@PathVariable Long id) {
        ContentDTO content = this.contentService.findById(id);
        return ResponseEntity.ok(content);
    }

    @GetMapping("/posts")
    public ResponseEntity<List<ContentDTO>> getAllPosts() {
        List<ContentDTO> posts = this.contentService.findAllPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/comments/parent/{parentId}")
    public ResponseEntity<List<ContentDTO>> getCommentsByParent(@PathVariable Long parentId) {
        List<ContentDTO> comments = this.contentService.findAllCommentsByParentId(parentId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/posts/author/{authorId}")
    public ResponseEntity<List<ContentDTO>> getPostsByAuthor(@PathVariable Long authorId) {
        List<ContentDTO> posts = this.contentService.findPostsByAuthorId(authorId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/comments/author/{authorId}")
    public ResponseEntity<List<ContentDTO>> getCommentsByAuthor(@PathVariable Long authorId) {
        List<ContentDTO> comments = this.contentService.findCommentsByAuthorId(authorId);
        return ResponseEntity.ok(comments);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ContentDTO> updateContent(@PathVariable Long id, @RequestBody ContentUpdateDTO contentUpdateDTO) {
        try {
            ContentDTO content = this.contentService.update(id, contentUpdateDTO);
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update content: " + e.getMessage(), e);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteContent(@PathVariable Long id) {
        this.contentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<ContentDTO> updatePostStatus(
            @PathVariable Long id,
            @RequestParam("status") String status) {
        try {
            PostStatus newStatus = PostStatus.valueOf(status);
            ContentDTO updatedContent = this.contentService.updatePostStatus(id, newStatus);
            return ResponseEntity.ok(updatedContent);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }

    @PostMapping("/{contentId}/vote")
    public ResponseEntity<ContentDTO> addVote(
            @PathVariable Long contentId,
            @RequestParam Long userId,
            @RequestParam String voteType) {
        try {
            VoteType type = VoteType.valueOf(voteType);
            ContentDTO content = this.contentService.addVote(contentId, userId, type);
            return ResponseEntity.ok(content);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid vote type: " + voteType);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to process vote: " + e.getMessage(), e);
        }
    }

    @DeleteMapping("/{contentId}/vote")
    public ResponseEntity<ContentDTO> removeVote(
            @PathVariable Long contentId,
            @RequestParam Long userId) {
        ContentDTO content = this.contentService.removeVote(contentId, userId);
        return ResponseEntity.ok(content);
    }
}
