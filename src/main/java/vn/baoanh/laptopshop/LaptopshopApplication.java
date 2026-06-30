package vn.baoanh.laptopshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.InputStream;
import java.util.Properties;

@SpringBootApplication
public class LaptopshopApplication {

	public static void main(String[] args) {
		try {
			Properties prop = new Properties();
			InputStream is = LaptopshopApplication.class.getClassLoader().getResourceAsStream("application.properties");
			if (is != null) {
				prop.load(is);
				System.out.println("=== CONFIG FOR DATABASE ===");
				System.out.println("spring.datasource.url: " + prop.getProperty("spring.datasource.url"));
				System.out.println("spring.datasource.username: " + prop.getProperty("spring.datasource.username"));
				System.out.println("spring.datasource.password: [" + prop.getProperty("spring.datasource.password") + "]");
				System.out.println("===========================");
			} else {
				System.out.println("=== ERROR: application.properties NOT FOUND IN CLASSPATH ===");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		SpringApplication.run(LaptopshopApplication.class, args);

	}

}
