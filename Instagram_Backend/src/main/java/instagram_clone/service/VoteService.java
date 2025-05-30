package instagram_clone.service;

import instagram_clone.dto.ScoreDTO;
import instagram_clone.model.Vote;
import instagram_clone.model.VoteType;
import instagram_clone.model.User;
import instagram_clone.model.Content;
import instagram_clone.repository.VoteRepository;
import instagram_clone.repository.UserRepository;
import instagram_clone.repository.ContentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VoteService {
    private static final Logger logger = LoggerFactory.getLogger(VoteService.class);

    private final VoteRepository voteRepository;
    private final UserRepository userRepository;
    private final ContentRepository contentRepository;
    private final ScoreCalculationService scoreCalculationService;

    public VoteService(
            VoteRepository voteRepository,
            UserRepository userRepository,
            ContentRepository contentRepository,
            ScoreCalculationService scoreCalculationService
    ) {
        this.voteRepository = voteRepository;
        this.userRepository = userRepository;
        this.contentRepository = contentRepository;
        this.scoreCalculationService = scoreCalculationService;
    }

    @Transactional
    public Vote save(Vote vote) {
        // Validate user exists
        User user = userRepository.findById(vote.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + vote.getUser().getId()));

        // Validate content exists
        Content content = contentRepository.findById(vote.getContent().getId())
                .orElseThrow(() -> new RuntimeException("Content not found with id: " + vote.getContent().getId()));

        // Check if vote already exists
        Optional<Vote> existingVote = findByUserIdAndContentId(user.getId(), content.getId());
        if (existingVote.isPresent()) {
            throw new RuntimeException("Vote already exists for this user and content");
        }

        vote.setUser(user);
        vote.setContent(content);
        vote.setDateTime(LocalDateTime.now());
        return this.voteRepository.save(vote);
    }

    public Optional<Vote> findById(Long id) {
        return this.voteRepository.findById(id);
    }

    public List<Vote> findAll() {
        return this.voteRepository.findAll();
    }

    @Transactional
    public void deleteById(Long id) {
        if (!this.voteRepository.existsById(id)) {
            throw new RuntimeException("Vote not found with id: " + id);
        }
        this.voteRepository.deleteById(id);
    }

    public List<Vote> findByUserId(Long userId) {
        if (!this.userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        return this.voteRepository.findByUserId(userId);
    }

    public List<Vote> findByContentId(Long contentId) {
        if (!this.contentRepository.existsById(contentId)) {
            throw new RuntimeException("Content not found with id: " + contentId);
        }
        return this.voteRepository.findByContentId(contentId);
    }

    public Optional<Vote> findByUserIdAndContentId(Long userId, Long contentId) {
        return this.voteRepository.findByUserIdAndContentId(userId, contentId);
    }

    @Transactional
    public Vote updateVote(Long userId, Long contentId, VoteType newType) {
        // Validate user exists
        if (!this.userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        // Validate content exists
        if (!this.contentRepository.existsById(contentId)) {
            throw new RuntimeException("Content not found with id: " + contentId);
        }

        Optional<Vote> existingVote = findByUserIdAndContentId(userId, contentId);
        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();
            vote.setType(newType);
            vote.setDateTime(LocalDateTime.now());
            return this.voteRepository.save(vote);
        }
        throw new RuntimeException("Vote not found for user " + userId + " and content " + contentId);
    }
}