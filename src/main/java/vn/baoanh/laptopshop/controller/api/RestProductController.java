package vn.baoanh.laptopshop.controller.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.baoanh.laptopshop.domain.Product;
import vn.baoanh.laptopshop.domain.Product_;
import vn.baoanh.laptopshop.domain.dto.ProductCriteriaDTO;
import vn.baoanh.laptopshop.service.ProductService;

import java.util.*;

@RestController
@RequestMapping("/api/products")
public class RestProductController {

    private final ProductService productService;

    public RestProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<?> getProducts(
            @RequestParam(required = false) String page,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) List<String> factory,
            @RequestParam(required = false) List<String> target,
            @RequestParam(required = false) List<String> price) {

        int pageNum = 1;
        try {
            if (page != null && !page.isBlank()) {
                pageNum = Integer.parseInt(page);
            }
        } catch (NumberFormatException e) {
            // keep 1
        }

        Pageable pageable = PageRequest.of(pageNum - 1, 10);
        if (sort != null && !sort.isBlank()) {
            if (sort.equals("gia-tang-dan")) {
                pageable = PageRequest.of(pageNum - 1, 10, Sort.by(Product_.PRICE).ascending());
            } else if (sort.equals("gia-giam-dan")) {
                pageable = PageRequest.of(pageNum - 1, 10, Sort.by(Product_.PRICE).descending());
            } else if (sort.equals("ban-chay")) {
                pageable = PageRequest.of(pageNum - 1, 10, Sort.by(Product_.SOLD).descending());
            } else if (sort.equals("moi-nhat")) {
                pageable = PageRequest.of(pageNum - 1, 10, Sort.by(Product_.ID).descending());
            }
        }

        ProductCriteriaDTO criteria = new ProductCriteriaDTO();
        criteria.setPage(Optional.ofNullable(page));
        criteria.setSort(Optional.ofNullable(sort));
        criteria.setFactory(Optional.ofNullable(factory));
        criteria.setTarget(Optional.ofNullable(target));
        criteria.setPrice(Optional.ofNullable(price));

        Page<Product> productPage = this.productService.fetchProductsWithSpec(pageable, criteria);

        Map<String, Object> response = new HashMap<>();
        response.put("products", productPage.getContent());
        response.put("currentPage", pageNum);
        response.put("totalPages", productPage.getTotalPages());
        response.put("totalElements", productPage.getTotalElements());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductDetail(@PathVariable long id) {
        Optional<Product> productOpt = this.productService.fetchProductById(id);
        if (productOpt.isPresent()) {
            return ResponseEntity.ok(productOpt.get());
        }
        return ResponseEntity.notFound().build();
    }
}
