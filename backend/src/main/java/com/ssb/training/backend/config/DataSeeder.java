package com.ssb.training.backend.config;

import com.ssb.training.backend.entity.SSBQuestion;
import com.ssb.training.backend.repository.SSBQuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedQuestions(SSBQuestionRepository repository) {
        return args -> {
            // WAT Seed
            if (repository.countByType("WAT") < 60) {
                repository.deleteByType("WAT");
                seedWat(repository);
            }
            // SRT Seed
            if (repository.countByType("SRT") < 60) {
                repository.deleteByType("SRT");
                seedSrt(repository);
            }
            // PPDT Seed - Force unique identifier to avoid any old data collision
            repository.deleteByType("PPDT_SCREENING");
            seedSpecificImage(repository, "PPDT_SCREENING", "screening_bench.png", "PPDT Bench Scene blur-[3px]");
            
            // TAT Seed - Force unique identifier
            repository.deleteByType("TAT_THEMATIC");
            seedSpecificImage(repository, "TAT_THEMATIC", "thematic_panchayat.png", "TAT Village Scene");
        };
    }

    private void seedSpecificImage(SSBQuestionRepository repo, String type, String filename, String content) {
        String baseDir = "c:/Users/HP/.gemini/antigravity/scratch/ssb-training-system/frontend/public/assets/";
        try {
            Path path = Paths.get(baseDir + filename);
            if (Files.exists(path)) {
                byte[] data = Files.readAllBytes(path);
                SSBQuestion q = new SSBQuestion(null, type, content, data, "mission_critical");
                repo.save(q);
            } else {
                System.err.println("❌ ERROR: Mission Asset Missing: " + path.toString());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void seedWat(SSBQuestionRepository repo) {
        List<String> words = Arrays.asList(
            "Ability", "Accept", "Achieve", "Active", "Adopt", "Advance", "Advise", "Agree", "Aim", "Alert",
            "Ambition", "Attack", "Authority", "Aware", "Balance", "Believe", "Bold", "Bound", "Brave", "Brief",
            "Bright", "Care", "Cause", "Chance", "Change", "Character", "Check", "Choice", "Clean", "Clear",
            "Cooperate", "Courage", "Danger", "Dare", "Death", "Decide", "Defeat", "Defend", "Degree", "Delay",
            "Desire", "Devotion", "Difficult", "Direct", "Discipline", "Distance", "Duty", "Eager", "Earn", "Easy",
            "Effort", "Enemy", "Enjoy", "Enough", "Equal", "Escape", "Example", "Exercise", "Expect", "Experience"
        );
        words.forEach(w -> repo.save(new SSBQuestion(null, "WAT", w, null, "standard")));
    }

    private void seedSrt(SSBQuestionRepository repo) {
        List<String> situations = Arrays.asList(
            "He was traveling by train and a thief snatched his bag. He...",
            "While going for an interview, his scooter broke down. He...",
            "He found a child lost in a crowded fair. He...",
            "His team was losing a match in the final minutes. He...",
            "He saw thick smoke coming from his neighbor's house. He...",
            "Subordinates refused to work on a project. He...",
            "He was lost in a jungle while trekking. He...",
            "A fast moving car hit a pedestrian. He...",
            "He disagreed with the Principal on some rules. He...",
            "They were crossing a river and the boat started leaking. He...",
            "Shortage of water in the locality. He...",
            "Parents were forcing him to marry against his wish. He...",
            "He forgot his wallet in the cafe after eating. He...",
            "Electricity went off during an important online exam. He...",
            "His sister was teased by some goons. He...",
            "Bridge collapsed during heavy rains. He...",
            "Promised to help a friend but fell ill. He...",
            "Snake in the room at night. He...",
            "Wild animal entered the camp. He...",
            "Found high-deno currency note on road. He...",
            "Train was late and interview was soon. He...",
            "Friend met with an accident before exam. He...",
            "Lost way in a new city. He...",
            "Shortage of food in relief camp. He...",
            "Subordinates were lazy. He...",
            "Boss was angry for no reason. He...",
            "Saw a pickpocket in bus. He...",
            "Hostel food was bad. He...",
            "He had to choose between two good jobs. He...",
            "Villagers were fighting for water. He...",
            "Borewell was left open. He...",
            "He was accused of a mistake he didn't do. He...",
            "Forest fire was spreading. He...",
            "Child fallen in water. He...",
            "Old man struggling to cross road. He...",
            "Exams cancelled. He...",
            "Selection failed. He...",
            "He found some situation. He...",
            "Mobile lost. He...",
            "Rain spoiled the plans. He...",
            "Terrorist activity suspected. He...",
            "Room partner was smoking. He...",
            "Borrowed book lost. He...",
            "Pet was ill. He...",
            "Late for work. He...",
            "Traffic jam. He...",
            "Gift for mother. He...",
            "Money short for fees. He...",
            "Teacher was wrong. He...",
            "Internet down. He...",
            "Cyclone warning. He...",
            "Stuck in lift. He...",
            "Keys lost. He...",
            "Laptop crashed. He...",
            "Stranger asked for help at night. He...",
            "Bag forgotten in bus. He...",
            "Dog bit a child. He...",
            "He was offered a bribe. He...",
            "Someone was drowning. He...",
            "His friend betrayed him. He..."
        );
        situations.forEach(s -> repo.save(new SSBQuestion(null, "SRT", s, null, "standard")));
    }
}
