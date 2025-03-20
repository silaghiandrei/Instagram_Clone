package instagram_clone.service;

import instagram_clone.model.Vote;
import instagram_clone.model.VoteType;
import instagram_clone.repository.VoteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VoteService {
    private final VoteRepository voteRepository;

    public VoteService(VoteRepository voteRepository) {
        this.voteRepository = voteRepository;
    }

    public Vote save(Vote vote) {
        vote.setDateTime(LocalDateTime.now());
        return this.voteRepository.save(vote);
    }

    public Optional<Vote> findById(Long id) {
        return this.voteRepository.findById(id);
    }

    public List<Vote> findAll() {
        return this.voteRepository.findAll();
    }

    public void deleteById(Long id) {
        this.voteRepository.deleteById(id);
    }

    public List<Vote> findByUserId(Long userId) {
        return this.voteRepository.findByUserId(userId);
    }

    public List<Vote> findByContentId(Long contentId) {
        return this.voteRepository.findByContentId(contentId);
    }

    public Optional<Vote> findByUserIdAndContentId(Long userId, Long contentId) {
        return this.voteRepository.findByUserIdAndContentId(userId, contentId);
    }

    public Vote updateVote(Long userId, Long contentId, VoteType newType) {
        Optional<Vote> existingVote = findByUserIdAndContentId(userId, contentId);
        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();
            vote.setType(newType);
            vote.setDateTime(LocalDateTime.now());
            return this.voteRepository.save(vote);
        }
        return null;
    }
} 