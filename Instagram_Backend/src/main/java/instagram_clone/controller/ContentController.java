package instagram_clone.controller;

import instagram_clone.dto.ContentDTO;
import instagram_clone.service.ContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contents")
public class ContentController {
    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @PostMapping("/create")
    public ResponseEntity<ContentDTO> createContent(@RequestBody ContentDTO contentDTO) {
        ContentDTO savedContent = this.contentService.create(contentDTO);
        return ResponseEntity.ok(savedContent);
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
    public ResponseEntity<ContentDTO> updateContent(@PathVariable Long id, @RequestBody ContentDTO contentDTO) {
        ContentDTO content = this.contentService.update(id, contentDTO);
        return ResponseEntity.ok(content);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteContent(@PathVariable Long id) {
        this.contentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
