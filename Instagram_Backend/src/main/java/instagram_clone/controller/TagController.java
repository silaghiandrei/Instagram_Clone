package instagram_clone.controller;

import instagram_clone.model.Tag;
import instagram_clone.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/tags"})
public class TagController {
    private final TagService tagService;

    @Autowired
    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping({"/create"})
    public ResponseEntity<Tag> createTag(@RequestBody Tag tag) {
        return ResponseEntity.ok(this.tagService.save(tag));
    }

    @GetMapping({"/get/{id}"})
    public ResponseEntity<Tag> getTagById(@PathVariable Long id) {
        return (ResponseEntity)this.tagService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping({"/getAll"})
    public ResponseEntity<List<Tag>> getAllTags() {
        return ResponseEntity.ok(this.tagService.findAll());
    }

    @PutMapping({"/update/{id}"})
    public ResponseEntity<Tag> updateTag(@PathVariable Long id, @RequestBody Tag tag) {
        return this.tagService.findById(id).isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(this.tagService.save(tag));
    }

    @DeleteMapping({"/delete/{id}"})
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        if (this.tagService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            this.tagService.deleteById(id);
            return ResponseEntity.ok().build();
        }
    }
}
