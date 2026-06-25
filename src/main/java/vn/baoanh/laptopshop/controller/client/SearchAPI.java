package vn.baoanh.laptopshop.controller.client;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.baoanh.laptopshop.domain.Product;
import vn.baoanh.laptopshop.service.ProductService;

@RestController
public class SearchAPI {

    private final ProductService productService;

    public SearchAPI(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/api/products/search")
    public ResponseEntity<List<Map<String, Object>>> searchProducts(@RequestParam("q") String query) {
        List<Product> products = this.productService.searchProductByName(query);
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (Product p : products) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("image", p.getImage());
            map.put("price", p.getPrice());
            result.add(map);
        }
        
        return ResponseEntity.ok(result);
    }
}
