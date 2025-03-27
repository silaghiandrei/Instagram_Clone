package instagram_clone.dtoconverter;

import instagram_clone.dto.TagDTO;
import instagram_clone.model.Tag;

public class TagConverter {

    public static TagDTO toDTO(Tag tag) {
        TagDTO tagDTO = new TagDTO();
        tagDTO.setName(tag.getName());
        return tagDTO;
    }

    public static Tag toEntity(TagDTO tagDTO) {
        Tag tag = new Tag();
        tag.setName(tagDTO.getName());
        return tag;
    }
}
