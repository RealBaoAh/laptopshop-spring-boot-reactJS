package vn.baoanh.laptopshop.controller.client;

import java.util.Optional;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import vn.baoanh.laptopshop.domain.Order;
import vn.baoanh.laptopshop.repository.OrderRepository;

@Controller
public class PaymentController {

    private final OrderRepository orderRepository;

    public PaymentController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping("/payment/vnpay")
    public String getVnPayMockPage(
            @RequestParam("orderId") long orderId,
            @RequestParam("amount") long amount,
            Model model) {
        model.addAttribute("orderId", orderId);
        model.addAttribute("amount", amount);
        return "client/cart/vnpay_mock";
    }

    @GetMapping("/payment/vnpay-return")
    public String handleVnPayReturn(
            @RequestParam("orderId") long orderId,
            @RequestParam("status") String status) {
        Optional<Order> orderOptional = this.orderRepository.findById(orderId);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            if ("success".equals(status)) {
                order.setPaymentStatus("PAYMENT_SUCCESS");
                this.orderRepository.save(order);
                return "redirect:/thanks";
            } else {
                order.setPaymentStatus("PAYMENT_FAILED");
                this.orderRepository.save(order);
                // Return to cart or show error
                return "redirect:/cart?payment=failed";
            }
        }
        return "redirect:/";
    }
}
