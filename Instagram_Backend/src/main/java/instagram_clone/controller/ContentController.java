package instagram_clone.controller;

import instagram_clone.model.Content;
import instagram_clone.service.ContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/contents"})
public class ContentController {
    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @PostMapping
    public ResponseEntity<Content> createContent(@RequestBody Content content) {
        return ResponseEntity.ok(this.contentService.save(content));
    }

    @GetMapping({"/{id}"})
    public ResponseEntity<Content> getContentById(@PathVariable Long id) {
        return this.contentService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Content>> getAllContents() {
        return ResponseEntity.ok(this.contentService.findAll());
    }

    @GetMapping({"/posts"})
    public ResponseEntity<List<Content>> getAllPosts() {
        return ResponseEntity.ok(this.contentService.findAllPosts());
    }

    @GetMapping({"/comments"})
    public ResponseEntity<List<Content>> getAllComments() {
        return ResponseEntity.ok(this.contentService.findAllComments());
    }

    @GetMapping({"/comments/parent/{parentId}"})
    public ResponseEntity<List<Content>> getCommentsByParent(@PathVariable Long parentId) {
        return ResponseEntity.ok(this.contentService.findCommentsByParentId(parentId));
    }

    @GetMapping({"/author/{authorId}"})
    public ResponseEntity<List<Content>> getContentsByAuthor(@PathVariable Long authorId) {
        return ResponseEntity.ok(this.contentService.findByAuthorId(authorId));
    }

    @PutMapping({"/{id}"})
    public ResponseEntity<Content> updateContent(@PathVariable Long id, @RequestBody Content content) {
        if (this.contentService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            content.setId(id);
            return ResponseEntity.ok(this.contentService.save(content));
        }
    }

    @DeleteMapping({"/{id}"})
    public ResponseEntity<Void> deleteContent(@PathVariable Long id) {
        if (this.contentService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            this.contentService.deleteById(id);
            return ResponseEntity.ok().build();
        }
    }
}