package vn.baoah.laptopshop.repository;

import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.baoah.laptopshop.domain.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
    User save(User baoanh);

    void deleteById(long id);


    List<User> findByEmail(String email);

    List<User> findAll();

    User findById(long id);
}
