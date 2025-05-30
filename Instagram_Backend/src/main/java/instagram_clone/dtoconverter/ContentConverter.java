package instagram_clone.dtoconverter;

import instagram_clone.dto.ContentDTO;
import instagram_clone.dto.TagDTO;
import instagram_clone.model.Content;
import instagram_clone.model.ContentType;
import instagram_clone.model.User;
import instagram_clone.model.PostStatus;
import instagram_clone.model.VoteType;

import java.util.HashSet;
import java.util.Set;

public class ContentConverter {

    public static ContentDTO toDTO(Content content) {
        ContentDTO dto = new ContentDTO();
        dto.setId(content.getId());
        
        User author = content.getAuthor();
        if (author != null) {
            User authorInfo = new User();
            authorInfo.setId(author.getId());
            authorInfo.setUsername(author.getUsername());
            authorInfo.setEmail(author.getEmail());
            authorInfo.setRole(author.getRole());
            authorInfo.setScore(author.getScore());
            authorInfo.setBanned(author.getBanned());
            authorInfo.setProfilePicture(author.getProfilePicture());
            dto.setAuthor(authorInfo);
        }
        
        dto.setType(content.getType());
        dto.setTitle(content.getTitle());
        dto.setText(content.getText());
        dto.setImage(content.getImage());
        dto.setDateTime(content.getDateTime());
        dto.setStatus(content.getStatus());
        dto.setCommentable(content.isCommentable());

        if (content.getVotes() != null) {
            long upvotes = content.getVotes().stream()
                .filter(vote -> vote.getType() == VoteType.UPVOTE)
                .count();
            long downvotes = content.getVotes().stream()
                .filter(vote -> vote.getType() == VoteType.DOWN_VOTE)
                .count();
            dto.setUpvotes((int) upvotes);
            dto.setDownvotes((int) downvotes);
        }

        if (content.getType() == ContentType.COMMENT && content.getParent() != null) {
            Content parent = new Content();
            parent.setId(content.getParent().getId());
            parent.setTitle(content.getParent().getTitle());
            parent.setText(content.getParent().getText());
            parent.setType(content.getParent().getType());
            dto.setParent(parent);
        } else {
            dto.setParent(null);
        }

        Set<TagDTO> tagDTOs = new HashSet<>();
        if (content.getTags() != null) {
            content.getTags().forEach(tag -> {
                TagDTO tagDTO = new TagDTO();
                tagDTO.setName(tag.getName());
                tagDTOs.add(tagDTO);
            });
        }
        dto.setTags(tagDTOs);

        return dto;
    }

    public static Content toEntity(ContentDTO dto) {
        Content content = new Content();
        
        // Convert type string to enum if needed
        if (dto.getType() != null) {
            content.setType(dto.getType());
        }
        
        content.setTitle(dto.getTitle());
        content.setText(dto.getText());
        content.setImage(dto.getImage());
        content.setDateTime(dto.getDateTime());
        
        // Convert status string to enum if needed
        if (dto.getStatus() != null) {
            try {
                PostStatus status = PostStatus.valueOf(dto.getStatus().name());
                content.setStatus(status);
            } catch (IllegalArgumentException e) {
                // If invalid status, default to JUST_POSTED
                content.setStatus(PostStatus.JUST_POSTED);
            }
        }
        
        content.setCommentable(dto.isCommentable());

        if (dto.getParent() != null) {
            content.setParent(dto.getParent());
        }

        return content;
    }
}
