package vn.baoah.laptopshop;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String index() {
        return "Hello World from Bao Anh";
    }

    @GetMapping("/user")
    public String userPage() {
        return "Hello World from User";
    }

    @GetMapping("/admin")
    public String adminPage() {
        return "Hello World from Admin";
    }
}
