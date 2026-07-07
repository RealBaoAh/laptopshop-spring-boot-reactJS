package vn.baoanh.laptopshop.controller.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import vn.baoanh.laptopshop.domain.User;
import vn.baoanh.laptopshop.domain.Product;
import vn.baoanh.laptopshop.domain.Order;
import vn.baoanh.laptopshop.domain.Role;
import vn.baoanh.laptopshop.service.UserService;
import vn.baoanh.laptopshop.service.ProductService;
import vn.baoanh.laptopshop.service.OrderService;
import vn.baoanh.laptopshop.service.UploadService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class RestAdminController {

    private final UserService userService;
    private final ProductService productService;
    private final OrderService orderService;
    private final UploadService uploadService;
    private final PasswordEncoder passwordEncoder;

    public RestAdminController(
            UserService userService,
            ProductService productService,
            OrderService orderService,
            UploadService uploadService,
            PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.productService = productService;
        this.orderService = orderService;
        this.uploadService = uploadService;
        this.passwordEncoder = passwordEncoder;
    }

    // === DASHBOARD ===
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("countUsers", this.userService.countUsers());
        stats.put("countProducts", this.userService.countProducts());
        stats.put("countOrders", this.userService.countOrders());
        return ResponseEntity.ok(stats);
    }

    // === USERS CRUD ===
    @GetMapping("/users")
    public ResponseEntity<?> getUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<User> usersPage = this.userService.getAllUsers(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("users", usersPage.getContent());
        response.put("currentPage", page);
        response.put("totalPages", usersPage.getTotalPages());
        response.put("totalElements", usersPage.getTotalElements());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserDetail(@PathVariable long id) {
        User user = this.userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(
            @RequestParam(value = "avatarFile", required = false) MultipartFile file,
            @RequestParam("email") String email,
            @RequestParam("fullName") String fullName,
            @RequestParam("password") String password,
            @RequestParam("address") String address,
            @RequestParam("phone") String phone,
            @RequestParam("roleName") String roleName) {

        if (this.userService.checkEmailExist(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists."));
        }

        User user = new User();
        user.setEmail(email);
        user.setFullName(fullName);
        user.setPassword(this.passwordEncoder.encode(password));
        user.setAddress(address);
        user.setPhone(phone);

        Role role = this.userService.getRoleByName(roleName);
        user.setRole(role);

        if (file != null && !file.isEmpty()) {
            String avatar = this.uploadService.handleSaveUploadFile(file, "avatar");
            user.setAvatar(avatar);
        }

        this.userService.handleSaveUser(user);
        return ResponseEntity.ok(Map.of("success", true, "message", "User created successfully."));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable long id,
            @RequestParam(value = "avatarFile", required = false) MultipartFile file,
            @RequestParam("fullName") String fullName,
            @RequestParam("address") String address,
            @RequestParam("phone") String phone,
            @RequestParam("roleName") String roleName) {

        User currentUser = this.userService.getUserById(id);
        if (currentUser == null) {
            return ResponseEntity.notFound().build();
        }

        currentUser.setFullName(fullName);
        currentUser.setAddress(address);
        currentUser.setPhone(phone);

        Role role = this.userService.getRoleByName(roleName);
        currentUser.setRole(role);

        if (file != null && !file.isEmpty()) {
            String avatar = this.uploadService.handleSaveUploadFile(file, "avatar");
            currentUser.setAvatar(avatar);
        }

        this.userService.handleSaveUser(currentUser);
        return ResponseEntity.ok(Map.of("success", true, "message", "User updated successfully."));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable long id) {
        User user = this.userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        this.userService.deleteAUser(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "User deleted successfully."));
    }

    // === PRODUCTS CRUD ===
    @GetMapping("/products")
    public ResponseEntity<?> getProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Product> productsPage = this.productService.fetchProducts(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("products", productsPage.getContent());
        response.put("currentPage", page);
        response.put("totalPages", productsPage.getTotalPages());
        response.put("totalElements", productsPage.getTotalElements());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProductDetail(@PathVariable long id) {
        Optional<Product> productOpt = this.productService.fetchProductById(id);
        if (productOpt.isPresent()) {
            return ResponseEntity.ok(productOpt.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/products")
    public ResponseEntity<?> createProduct(
            @RequestParam(value = "productFile", required = false) MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("price") double price,
            @RequestParam("detailDesc") String detailDesc,
            @RequestParam("shortDesc") String shortDesc,
            @RequestParam("quantity") long quantity,
            @RequestParam("factory") String factory,
            @RequestParam("target") String target) {

        Product pr = new Product();
        pr.setName(name);
        pr.setPrice(price);
        pr.setDetailDesc(detailDesc);
        pr.setShortDesc(shortDesc);
        pr.setQuantity(quantity);
        pr.setFactory(factory);
        pr.setTarget(target);

        if (file != null && !file.isEmpty()) {
            String image = this.uploadService.handleSaveUploadFile(file, "product");
            pr.setImage(image);
        }

        this.productService.createProduct(pr);
        return ResponseEntity.ok(Map.of("success", true, "message", "Product created successfully."));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable long id,
            @RequestParam(value = "productFile", required = false) MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("price") double price,
            @RequestParam("detailDesc") String detailDesc,
            @RequestParam("shortDesc") String shortDesc,
            @RequestParam("quantity") long quantity,
            @RequestParam("factory") String factory,
            @RequestParam("target") String target) {

        Optional<Product> productOpt = this.productService.fetchProductById(id);
        if (!productOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Product pr = productOpt.get();
        pr.setName(name);
        pr.setPrice(price);
        pr.setDetailDesc(detailDesc);
        pr.setShortDesc(shortDesc);
        pr.setQuantity(quantity);
        pr.setFactory(factory);
        pr.setTarget(target);

        if (file != null && !file.isEmpty()) {
            String image = this.uploadService.handleSaveUploadFile(file, "product");
            pr.setImage(image);
        }

        this.productService.createProduct(pr);
        return ResponseEntity.ok(Map.of("success", true, "message", "Product updated successfully."));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable long id) {
        Optional<Product> productOpt = this.productService.fetchProductById(id);
        if (!productOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        this.productService.deleteProduct(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Product deleted successfully."));
    }

    // === ORDERS CRUD ===
    @GetMapping("/orders")
    public ResponseEntity<?> getOrders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Order> ordersPage = this.orderService.fetchAllOrders(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("orders", ordersPage.getContent());
        response.put("currentPage", page);
        response.put("totalPages", ordersPage.getTotalPages());
        response.put("totalElements", ordersPage.getTotalElements());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<?> getOrderDetail(@PathVariable long id) {
        Optional<Order> orderOpt = this.orderService.fetchOrderById(id);
        if (orderOpt.isPresent()) {
            return ResponseEntity.ok(orderOpt.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/orders/{id}")
    public ResponseEntity<?> updateOrder(
            @PathVariable long id,
            @RequestBody Map<String, String> body) {
        Optional<Order> orderOpt = this.orderService.fetchOrderById(id);
        if (!orderOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Order order = orderOpt.get();
        if (body.containsKey("status")) {
            order.setStatus(body.get("status"));
        }
        this.orderService.updateOrder(order);
        return ResponseEntity.ok(Map.of("success", true, "message", "Order status updated successfully."));
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable long id) {
        Optional<Order> orderOpt = this.orderService.fetchOrderById(id);
        if (!orderOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        this.orderService.deleteOrderById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Order deleted successfully."));
    }
}
