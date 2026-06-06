package vn.baoah.laptopshop.service;

import org.springframework.stereotype.Service;
import vn.baoah.laptopshop.domain.User;
import vn.baoah.laptopshop.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User handleSaveUser(User user) {
        User baoanh = this.userRepository.save(user);
        System.out.println(baoanh);
        return baoanh;
    }
}
