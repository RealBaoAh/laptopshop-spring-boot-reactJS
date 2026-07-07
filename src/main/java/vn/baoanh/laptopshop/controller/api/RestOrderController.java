package vn.baoanh.laptopshop.controller.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import vn.baoanh.laptopshop.domain.Order;
import vn.baoanh.laptopshop.domain.OrderDetail;
import vn.baoanh.laptopshop.domain.User;
import vn.baoanh.laptopshop.service.OrderService;
import vn.baoanh.laptopshop.service.ProductService;
import vn.baoanh.laptopshop.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.*;

class PlaceOrderRequest {
    private String receiverName;
    private String receiverAddress;
    private String receiverPhone;
    private String paymentMethod;

    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }
    public String getReceiverAddress() { return receiverAddress; }
    public void setReceiverAddress(String receiverAddress) { this.receiverAddress = receiverAddress; }
    public String getReceiverPhone() { return receiverPhone; }
    public void setReceiverPhone(String receiverPhone) { this.receiverPhone = receiverPhone; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}

@RestController
@RequestMapping("/api/orders")
public class RestOrderController {

    private final ProductService productService;
    private final OrderService orderService;
    private final UserService userService;

    public RestOrderController(ProductService productService, OrderService orderService, UserService userService) {
        this.productService = productService;
        this.orderService = orderService;
        this.userService = userService;
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null) return null;
        return this.userService.getUserByEmail(authentication.getName());
    }

    @GetMapping
    public ResponseEntity<?> getOrderHistory(Authentication authentication) {
        User user = getCurrentUser(authentication);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        List<Order> orders = this.orderService.fetchOrderByUser(user);
        List<Map<String, Object>> responseList = new ArrayList<>();

        for (Order order : orders) {
            Map<String, Object> orderMap = new HashMap<>();
            orderMap.put("id", order.getId());
            orderMap.put("receiverName", order.getReceiverName());
            orderMap.put("receiverAddress", order.getReceiverAddress());
            orderMap.put("receiverPhone", order.getReceiverPhone());
            orderMap.put("status", order.getStatus());
            orderMap.put("totalPrice", order.getTotalPrice());
            orderMap.put("paymentMethod", order.getPaymentMethod());
            orderMap.put("paymentStatus", order.getPaymentStatus());
            
            List<Map<String, Object>> details = new ArrayList<>();
            for (OrderDetail od : order.getOrderDetails()) {
                Map<String, Object> detailMap = new HashMap<>();
                detailMap.put("id", od.getId());
                detailMap.put("price", od.getPrice());
                detailMap.put("quantity", od.getQuantity());
                
                Map<String, Object> prod = new HashMap<>();
                prod.put("id", od.getProduct().getId());
                prod.put("name", od.getProduct().getName());
                prod.put("image", od.getProduct().getImage());
                detailMap.put("product", prod);
                
                details.add(detailMap);
            }
            orderMap.put("orderDetails", details);
            responseList.add(orderMap);
        }

        return ResponseEntity.ok(responseList);
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(
            Authentication authentication,
            @RequestBody PlaceOrderRequest body,
            HttpServletRequest request) {

        User user = getCurrentUser(authentication);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        HttpSession session = request.getSession();
        Order order = this.productService.handlePlaceOrder(
                user,
                session,
                body.getReceiverName(),
                body.getReceiverAddress(),
                body.getReceiverPhone(),
                body.getPaymentMethod()
        );

        if (order == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Could not place order"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("orderId", order.getId());
        response.put("totalPrice", order.getTotalPrice());
        response.put("paymentMethod", order.getPaymentMethod());

        return ResponseEntity.ok(response);
    }
}
