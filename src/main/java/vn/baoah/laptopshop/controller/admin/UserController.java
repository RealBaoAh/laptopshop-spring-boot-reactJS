package vn.baoah.laptopshop.controller.admin;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import vn.baoah.laptopshop.domain.User;
import vn.baoah.laptopshop.service.UploadService;
import vn.baoah.laptopshop.service.UserService;

@Controller
public class UserController {

    private final UserService userService;
    private final UploadService uploadService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService,
                        UploadService uploadService,
                        PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.uploadService = uploadService;
        this.passwordEncoder = passwordEncoder;
    }

    @RequestMapping("/")
    public String getHomePage(Model model){
        List<User> arrUsers = this.userService.getAllUsersByEmail("123@aa.com");
        System.out.println(arrUsers);
        model.addAttribute("baoanh", "test");
        model.addAttribute("baoanh1", "this is bao anh");
        return "hello";
    }

    @RequestMapping("/admin/user")
    public String getUserPage(Model model){
        List<User> users = this.userService.getAllUsers();
        model.addAttribute("users1", users);
        return "admin/user/show";
    }

    @GetMapping("/admin/user/{id}")
    public String getUserDetailPage(Model model, @PathVariable long id){
        User user = this.userService.getUserById(id);
        model.addAttribute("user", user);
        model.addAttribute("id", id);
        return "admin/user/detail";
    }

    @GetMapping("/admin/user/create")
    public String getCreateUserPage(Model model){
        model.addAttribute("newUser", new User());
        return "admin/user/create";
    }

    @PostMapping(value = "/admin/user/create")
    public String createUserPage(Model model, @ModelAttribute("newUser") User baoanh, @RequestParam("baoanhFile") MultipartFile file){
        String avatar = this.uploadService.handleSaveUploadFile(file, "avatar");
        String hashPassword = this.passwordEncoder.encode(baoanh.getPassword());
        baoanh.setAvata(avatar);
        baoanh.setPassword(hashPassword);
        baoanh.setRole(this.userService.getRoleByName(baoanh.getRole().getName()));
        this.userService.handleSaveUser(baoanh);
        return "redirect:/admin/user";
    }

    @RequestMapping("/admin/user/update/{id}")
    public String getUpdateUserPage(Model model, @PathVariable long id){
        User currentUser = this.userService.getUserById(id);
        model.addAttribute("newUser", currentUser);
        return "admin/user/update";
    }

    @PostMapping("/admin/user/update")
    public String postUpdateUser(Model model, @ModelAttribute("newUser") User baoanh){
        User currentUser = this.userService.getUserById(baoanh.getId());
        if(currentUser != null){
            currentUser.setAddress(baoanh.getAddress());
            currentUser.setFullName(baoanh.getFullName());
            currentUser.setPhone(baoanh.getPhone());
            this.userService.handleSaveUser(currentUser);
        }
        return "redirect:/admin/user";
    }

    @GetMapping("/admin/user/delete/{id}")
    public String getDeleteUserPage(Model model, @PathVariable long id){
        model.addAttribute("id", id);
        User user = new User();
        user.setId(id);
        model.addAttribute("newUser", new User());
        return "admin/user/delete";
    }

     @PostMapping("/admin/user/delete")
    public String postDeleteUser(Model model, @ModelAttribute("newUser") User baoanh){
        this.userService.deleteAUser(baoanh.getId());
        return "redirect:/admin/user";
    }
}

