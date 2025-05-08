package instagram_clone.controller;

import instagram_clone.dto.VoteDTO;
import instagram_clone.dtoconverter.VoteConverter;
import instagram_clone.model.Vote;
import instagram_clone.model.VoteType;
import instagram_clone.service.VoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/votes")
public class VoteController {
    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createVote(@RequestBody Vote vote) {
        try {
            Vote savedVote = this.voteService.save(vote);
            return ResponseEntity.status(HttpStatus.CREATED).body(VoteConverter.toDTO(savedVote));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getVoteById(@PathVariable Long id) {
        try {
            return this.voteService.findById(id)
                    .map(vote -> ResponseEntity.ok(VoteConverter.toDTO(vote)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<VoteDTO>> getAllVotes() {
        List<VoteDTO> votes = this.voteService.findAll().stream()
                .map(VoteConverter::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(votes);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getVotesByUser(@PathVariable Long userId) {
        try {
            List<VoteDTO> votes = this.voteService.findByUserId(userId).stream()
                    .map(VoteConverter::toDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(votes);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/content/{contentId}")
    public ResponseEntity<?> getVotesByContent(@PathVariable Long contentId) {
        try {
            List<VoteDTO> votes = this.voteService.findByContentId(contentId).stream()
                    .map(VoteConverter::toDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(votes);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/update/{userId}/{contentId}")
    public ResponseEntity<?> updateVote(
            @PathVariable Long userId,
            @PathVariable Long contentId,
            @RequestParam VoteType type) {
        try {
            Vote updatedVote = this.voteService.updateVote(userId, contentId, type);
            return ResponseEntity.ok(VoteConverter.toDTO(updatedVote));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteVote(@PathVariable Long id) {
        try {
            this.voteService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
} 