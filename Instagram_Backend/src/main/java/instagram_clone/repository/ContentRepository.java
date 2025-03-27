package instagram_clone.repository;

import java.util.List;

import instagram_clone.model.Content;
import instagram_clone.model.ContentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {
    List<Content> findByType(ContentType type);

    List<Content> findByParentId(Long parentId);

    List<Content> findByAuthorIdAndType(Long authorId, ContentType type);

}