package instagram_clone.dtoconverter;

import instagram_clone.dto.VoteDTO;
import instagram_clone.model.Vote;

public class VoteConverter {
    
    public static VoteDTO toDTO(Vote vote) {
        VoteDTO dto = new VoteDTO();
        dto.setId(vote.getId());
        dto.setUserId(vote.getUser().getId());
        dto.setUsername(vote.getUser().getUsername());
        dto.setContentId(vote.getContent().getId());
        dto.setContentTitle(vote.getContent().getTitle());
        dto.setType(vote.getType());
        dto.setDateTime(vote.getDateTime());
        return dto;
    }
} 