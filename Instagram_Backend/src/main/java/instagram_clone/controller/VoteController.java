package instagram_clone.controller;

import instagram_clone.model.Vote;
import instagram_clone.model.VoteType;
import instagram_clone.service.VoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/votes")
public class VoteController {
    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @PostMapping("/create")
    public ResponseEntity<Vote> createVote(@RequestBody Vote vote) {
        return ResponseEntity.ok(this.voteService.save(vote));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Vote> getVoteById(@PathVariable Long id) {
        return this.voteService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Vote>> getAllVotes() {
        return ResponseEntity.ok(this.voteService.findAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Vote>> getVotesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(this.voteService.findByUserId(userId));
    }

    @GetMapping("/content/{contentId}")
    public ResponseEntity<List<Vote>> getVotesByContent(@PathVariable Long contentId) {
        return ResponseEntity.ok(this.voteService.findByContentId(contentId));
    }

    @PutMapping("/update/{userId}/{contentId}")
    public ResponseEntity<Vote> updateVote(
            @PathVariable Long userId,
            @PathVariable Long contentId,
            @RequestParam VoteType type) {
        Vote updatedVote = this.voteService.updateVote(userId, contentId, type);
        return updatedVote != null ? ResponseEntity.ok(updatedVote) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteVote(@PathVariable Long id) {
        if (this.voteService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            this.voteService.deleteById(id);
            return ResponseEntity.ok().build();
        }
    }
} 