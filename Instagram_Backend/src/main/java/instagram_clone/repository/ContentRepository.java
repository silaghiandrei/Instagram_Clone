package instagram_clone.repository;

import java.util.List;

import instagram_clone.model.Content;
import instagram_clone.model.ContentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {
    @Query("SELECT DISTINCT c FROM Content c LEFT JOIN FETCH c.tags WHERE c.type = :type")
    List<Content> findByType(ContentType type);

    @Query("SELECT t.name FROM Tag t JOIN t.contents c WHERE c.id = :postId")
    List<Object[]> findTagsForPost(@Param("postId") Long postId);

    List<Content> findByParentId(Long parentId);

    List<Content> findByAuthorIdAndType(Long authorId, ContentType type);

}