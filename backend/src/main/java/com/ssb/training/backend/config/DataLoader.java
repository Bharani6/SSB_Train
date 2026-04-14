package com.ssb.training.backend.config;

import com.ssb.training.backend.entity.User;
import com.ssb.training.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(UserRepository repository) {
        return args -> {
            if (repository.findByEmail("admin@ssb.train").isEmpty()) {
                User admin = new User();
                admin.setName("System Administrator");
                admin.setEmail("admin@ssb.train");
                admin.setPassword("admin1234");
                admin.setEntryType("ADMIN");
                admin.setCreatedAt(LocalDateTime.now());
                repository.save(admin);
                System.out.println("✅ Default Admin User Created: admin@ssb.train / admin1234");
            }
        };
    }
}
