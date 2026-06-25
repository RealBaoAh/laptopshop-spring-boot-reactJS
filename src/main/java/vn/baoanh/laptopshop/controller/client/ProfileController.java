package vn.baoanh.laptopshop.controller.client;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import vn.baoanh.laptopshop.domain.User;
import vn.baoanh.laptopshop.service.UploadService;
import vn.baoanh.laptopshop.service.UserService;

@Controller
public class ProfileController {

    private final UserService userService;
    private final UploadService uploadService;

    public ProfileController(UserService userService, UploadService uploadService) {
        this.userService = userService;
        this.uploadService = uploadService;
    }

    @GetMapping("/profile")
    public String getProfilePage(Model model, HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("id") == null) {
            return "redirect:/login";
        }

        long id = (long) session.getAttribute("id");
        User currentUser = this.userService.getUserById(id);
        
        model.addAttribute("user", currentUser);
        return "client/auth/profile";
    }

    @PostMapping("/profile/update")
    public String postUpdateProfile(HttpServletRequest request,
            @RequestParam("fullName") String fullName,
            @RequestParam("phone") String phone,
            @RequestParam("address") String address,
            @RequestParam(value = "avatarFile", required = false) MultipartFile file,
            RedirectAttributes redirectAttributes) {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("id") == null) {
            return "redirect:/login";
        }

        long id = (long) session.getAttribute("id");
        User currentUser = this.userService.getUserById(id);

        if (currentUser != null) {
            currentUser.setFullName(fullName);
            currentUser.setPhone(phone);
            currentUser.setAddress(address);

            if (file != null && !file.isEmpty()) {
                String avatar = this.uploadService.handleSaveUploadFile(file, "avatar");
                currentUser.setAvatar(avatar);
                session.setAttribute("avatar", avatar);
            }

            this.userService.handleSaveUser(currentUser);
            
            session.setAttribute("fullName", currentUser.getFullName());
            
            redirectAttributes.addFlashAttribute("successMessage", "Cập nhật thông tin thành công!");
        }

        return "redirect:/profile";
    }
}