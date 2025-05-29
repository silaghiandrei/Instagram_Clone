package instagram_clone.repository;

import java.util.List;
import java.util.Optional;

import instagram_clone.model.Content;
import instagram_clone.model.ContentType;
import instagram_clone.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {
    @Query("SELECT DISTINCT c FROM Content c LEFT JOIN FETCH c.tags WHERE c.type = :type")
    List<Content> findByType(ContentType type);

    @Query("SELECT DISTINCT t FROM Tag t JOIN t.contents c WHERE c.id = :postId")
    List<Tag> findTagsForPost(@Param("postId") Long postId);

    @Query("SELECT DISTINCT c FROM Content c LEFT JOIN FETCH c.tags WHERE c.id = :id")
    Optional<Content> findById(@Param("id") Long id);

    List<Content> findByParentId(Long parentId);

    @Query("SELECT DISTINCT c FROM Content c LEFT JOIN FETCH c.tags WHERE c.author.id = :authorId AND c.type = :type")
    List<Content> findByAuthorIdAndType(@Param("authorId") Long authorId, @Param("type") ContentType type);
}