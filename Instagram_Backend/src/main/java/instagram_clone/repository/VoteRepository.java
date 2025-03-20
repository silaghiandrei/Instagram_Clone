package instagram_clone.repository;

import instagram_clone.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    List<Vote> findByUserId(Long userId);
    List<Vote> findByContentId(Long contentId);
    Optional<Vote> findByUserIdAndContentId(Long userId, Long contentId);
}
