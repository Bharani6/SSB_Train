package com.ssb.training.backend;

import com.ssb.training.backend.entity.User;
import com.ssb.training.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(UserRepository userRepository) {
        return args -> {
            userRepository.findByEmail("admin@ssb.train").ifPresentOrElse(
                admin -> {
                    admin.setPassword("admin1234");
                    admin.setName("Admin User");
                    admin.setEntryType("NDA");
                    userRepository.save(admin);
                    System.out.println("Admin user password forced to: admin1234");
                },
                () -> {
                    User admin = new User();
                    admin.setName("Admin User");
                    admin.setEmail("admin@ssb.train");
                    admin.setPassword("admin1234");
                    admin.setEntryType("NDA");
                    userRepository.save(admin);
                    System.out.println("Admin user created: admin@ssb.train / admin1234");
                }
            );
        };
    }
}
