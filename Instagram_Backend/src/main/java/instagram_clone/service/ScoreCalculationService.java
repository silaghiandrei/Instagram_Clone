package instagram_clone.service;

import instagram_clone.dto.ScoreDTO;
import instagram_clone.dto.ScoreRequestDTO;
import instagram_clone.dto.ScoreResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import instagram_clone.model.ContentType;
import instagram_clone.model.VoteType;

@Service
public class ScoreCalculationService {
    private static final Logger logger = LoggerFactory.getLogger(ScoreCalculationService.class);

    @Value("${score.service.url}")
    private String scoreServiceUrl;

    private final RestTemplate restTemplate;

    public ScoreCalculationService() {
        this.restTemplate = new RestTemplate();
    }

    public double calculateScore(ScoreDTO vote) {
        System.err.println("Calculating score for vote: " + vote);

        double baseScore = 0.0;

        if (vote.getContentType().equals(ContentType.POST.toString())) {
            if (vote.getVoteType().equals(VoteType.UPVOTE.toString())) {
                baseScore = 1.0;
            } else if (vote.getVoteType().equals(VoteType.DOWN_VOTE.toString())) {
                baseScore = -1.0;
            }
        } else if (vote.getContentType().equals(ContentType.COMMENT.toString())) {
            if (vote.getVoteType().equals(VoteType.UPVOTE.toString())) {
                baseScore = 2.0;
            } else if (vote.getVoteType().equals(VoteType.DOWN_VOTE.toString())) {
                baseScore = -2.0;
            }
        }

        System.err.println("Calculated score: " + baseScore);
        return baseScore;
    }
}