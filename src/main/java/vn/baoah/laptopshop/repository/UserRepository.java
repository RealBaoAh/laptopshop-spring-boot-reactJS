package vn.baoah.laptopshop.repository;

import org.springframework.stereotype.Repository;
import vn.baoah.laptopshop.domain.User;
import org.springframework.data.repository.CrudRepository;

@Repository
public interface UserRepository extends CrudRepository<User, Long>{
    User save(User baoanh);
}
