package instagram_clone.dto;

import lombok.Data;

@Data
public class ScoreDTO {
    private Long voterId;
    private Long contentId;
    private String contentType;
    private String voteType;
    private Long authorId;
    private Double score;

    @Override
    public String toString() {
        return "ScoreDTO{" +
                "voterId=" + voterId +
                ", contentId=" + contentId +
                ", contentType='" + contentType + '\'' +
                ", voteType='" + voteType + '\'' +
                ", authorId=" + authorId +
                ", score=" + score +
                '}';
    }
}

