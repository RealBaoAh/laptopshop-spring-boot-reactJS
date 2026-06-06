package vn.baoah.laptopshop.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import vn.baoah.laptopshop.domain.User;
import vn.baoah.laptopshop.service.UserService;

@Controller
public class UserController {

    private UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping("/")
    public String getHomePage(Model model){
        String test = this.userService.handleHello();
        model.addAttribute("baoanh", test);
        model.addAttribute("baoanh1", "this is bao anh");
        return "hello";
    }

    @RequestMapping("/admin/user")
    public String getUserPage(Model model){
        String test = this.userService.handleHello();
        model.addAttribute("newUser", new User());
        return "admin/user/create";
    }

    @RequestMapping(value = "/admin/user/create1", method = RequestMethod.POST)
    public String createUserPage(Model model, @ModelAttribute("newUser") User baoanh){
        System.out.println("run here " +  baoanh);
        return "hello";
    }
}

