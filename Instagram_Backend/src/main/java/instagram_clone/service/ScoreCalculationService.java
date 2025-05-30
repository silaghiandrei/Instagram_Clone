package instagram_clone.service;

import instagram_clone.dto.ScoreDTO;
import instagram_clone.dto.ScoreRequestDTO;
import instagram_clone.dto.ScoreResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;

@Service
public class ScoreCalculationService {
    @Value("${score.service.url}")
    private String scoreServiceUrl;

    private final RestTemplate restTemplate;

    public ScoreCalculationService() {
        this.restTemplate = new RestTemplate();
    }

    public double calculateScore(ScoreDTO vote) {
        ScoreRequestDTO request = new ScoreRequestDTO();
        request.setVote(vote);

        ResponseEntity<ScoreResponseDTO> response = restTemplate.postForEntity(
            scoreServiceUrl + "/calculate",
            request,
            ScoreResponseDTO.class
        );

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return response.getBody().getScore();
        }
        throw new RuntimeException("Failed to calculate score from service");
    }
}