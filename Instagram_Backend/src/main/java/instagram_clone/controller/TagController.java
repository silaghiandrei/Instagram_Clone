package instagram_clone.controller;

import instagram_clone.dto.TagDTO;
import instagram_clone.dtoconverter.TagConverter;
import instagram_clone.model.Tag;
import instagram_clone.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/tags"})
public class TagController {
    private final TagService tagService;

    @Autowired
    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping({"/create"})
    public ResponseEntity<TagDTO> createTag(@RequestBody TagDTO tagDTO) {
        Tag tag = TagConverter.toEntity(tagDTO);
        Tag savedTag = this.tagService.save(tag);
        return ResponseEntity.ok(TagConverter.toDTO(savedTag));
    }

    @GetMapping({"/get/{id}"})
    public ResponseEntity<TagDTO> getTagById(@PathVariable Long id) {
        return this.tagService.findById(id)
                .map(tag -> ResponseEntity.ok(TagConverter.toDTO(tag)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping({"/getAll"})
    public ResponseEntity<List<TagDTO>> getAllTags() {
        List<TagDTO> tags = this.tagService.findAll()
                .stream()
                .map(TagConverter::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tags);
    }

    @PutMapping({"/update/{id}"})
    public ResponseEntity<TagDTO> updateTag(@PathVariable Long id, @RequestBody TagDTO tagDTO) {
        if (this.tagService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Tag tag = TagConverter.toEntity(tagDTO);
        tag.setId(id);
        Tag updatedTag = this.tagService.save(tag);
        return ResponseEntity.ok(TagConverter.toDTO(updatedTag));
    }

    @DeleteMapping({"/delete/{id}"})
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        if (this.tagService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        this.tagService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
