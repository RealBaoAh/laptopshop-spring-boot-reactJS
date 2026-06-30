package vn.baoanh.laptopshop.controller.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import vn.baoanh.laptopshop.domain.Cart;
import vn.baoanh.laptopshop.domain.CartDetail;
import vn.baoanh.laptopshop.domain.User;
import vn.baoanh.laptopshop.service.ProductService;
import vn.baoanh.laptopshop.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.*;

class CartAddRequest {
    private long productId;
    private long quantity;

    public long getProductId() {
        return productId;
    }
    public void setProductId(long productId) {
        this.productId = productId;
    }
    public long getQuantity() {
        return quantity;
    }
    public void setQuantity(long quantity) {
        this.quantity = quantity;
    }
}

class CartDetailUpdateRequest {
    private long id;
    private int quantity;

    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}

@RestController
@RequestMapping("/api/cart")
public class RestCartController {

    private final ProductService productService;
    private final UserService userService;

    public RestCartController(ProductService productService, UserService userService) {
        this.productService = productService;
        this.userService = userService;
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null) return null;
        return this.userService.getUserByEmail(authentication.getName());
    }

    @GetMapping
    public ResponseEntity<?> getCart(Authentication authentication) {
        User user = getCurrentUser(authentication);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        Cart cart = this.productService.fetchByUser(user);
        List<CartDetail> cartDetails = cart == null ? new ArrayList<>() : cart.getCartDetails();

        double totalPrice = 0;
        List<Map<String, Object>> items = new ArrayList<>();
        for (CartDetail cd : cartDetails) {
            totalPrice += cd.getPrice() * cd.getQuantity();
            Map<String, Object> item = new HashMap<>();
            item.put("id", cd.getId());
            item.put("price", cd.getPrice());
            item.put("quantity", cd.getQuantity());
            
            Map<String, Object> prod = new HashMap<>();
            prod.put("id", cd.getProduct().getId());
            prod.put("name", cd.getProduct().getName());
            prod.put("image", cd.getProduct().getImage());
            item.put("product", prod);
            
            items.add(item);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("items", items);
        response.put("totalPrice", totalPrice);
        response.put("sum", cart == null ? 0 : cart.getSum());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addProductToCart(
            Authentication authentication,
            @RequestBody CartAddRequest body,
            HttpServletRequest request) {

        User user = getCurrentUser(authentication);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        HttpSession session = request.getSession();
        this.productService.handleAddProductToCart(user.getEmail(), body.getProductId(), session, body.getQuantity());
        
        Cart cart = this.productService.fetchByUser(user);
        return ResponseEntity.ok(Map.of("success", true, "sum", cart == null ? 0 : cart.getSum()));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<?> removeItem(
            Authentication authentication,
            @PathVariable long id,
            HttpServletRequest request) {

        User user = getCurrentUser(authentication);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        HttpSession session = request.getSession();
        this.productService.handleRemoveCartDetail(id, session);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PutMapping("/items")
    public ResponseEntity<?> updateCartItems(
            Authentication authentication,
            @RequestBody List<CartDetailUpdateRequest> body) {

        User user = getCurrentUser(authentication);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        List<CartDetail> cartDetails = new ArrayList<>();
        for (CartDetailUpdateRequest req : body) {
            CartDetail cd = new CartDetail();
            cd.setId(req.getId());
            cd.setQuantity(req.getQuantity());
            cartDetails.add(cd);
        }

        this.productService.handleUpdateCartBeforeCheckout(cartDetails);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
