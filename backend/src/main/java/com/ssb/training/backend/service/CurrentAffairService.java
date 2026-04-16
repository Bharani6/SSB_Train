package com.ssb.training.backend.service;

import com.ssb.training.backend.entity.CurrentAffair;
import com.ssb.training.backend.repository.CurrentAffairRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class CurrentAffairService {

    @Autowired
    private CurrentAffairRepository repository;

    @PostConstruct
    public void seedDataIfNeeded() {
        if (repository.count() == 0) {
            System.out.println("Seeding Current Affairs data...");
            List<CurrentAffair> dummyData = generateDummyData();
            repository.saveAll(dummyData);
        }
    }

    public List<CurrentAffair> getLast10DaysRecords() {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(10);
        return repository.findByDateBetweenOrderByDateDesc(start, end);
    }

    private List<CurrentAffair> generateDummyData() {
        List<CurrentAffair> records = new ArrayList<>();
        LocalDate today = LocalDate.now();
        Random random = new Random();

        String[] newsTitles = {
                "India commissions new stealth frigate", "DRDO tests new BVR missile", "PM inaugurates large solar plant",
                "India signs deal for Rafale Marine", "ISRO demonstrates RLV technology", "Defence budget increased by 10%"
        };
        String[] defenceTitles = {
                "Army Exercise Talon Saber concludes", "Agni-V MIRV successfully tested", "BrahMos exported to new ally",
                "HAL Tejas Mk-1A inducted", "AI drones deployed on LAC", "Operation Sindoor showcases precision strike"
        };
        String[] aiTitles = {
                "National AI Mission launched", "Autonomous systems in modern warfare", "New multimodal AI released",
                "DRDO deploys AI for mine detection", "AI used for satellite imagery analysis", "Cyber command integrates AI defences"
        };
        String[] studyTitles = {
                "15 Officer Like Qualities Explained", "TAT Mastery Strategy", "GTO Group Tasks Guide",
                "Defence Acquisitions 2024-25", "Frequent PI Questions", "SRT Time Management"
        };

        String[] colors = {"#0ea5e9", "#f43f5e", "#eab308", "#a855f7", "#10b981", "#f97316"};

        // 10 days
        for (int i = 0; i <= 10; i++) {
            LocalDate date = today.minusDays(i);

            // 6 news per day (mix of categories)
            records.add(new CurrentAffair(date, "news", "Navy", newsTitles[random.nextInt(newsTitles.length)], "Detailed summary...", "The Hindu", colors[random.nextInt(colors.length)], "https://news.com", null, null));
            records.add(new CurrentAffair(date, "news", "Tech", newsTitles[random.nextInt(newsTitles.length)], "Detailed summary...", "Times of India", colors[random.nextInt(colors.length)], "https://news.com", null, null));
            records.add(new CurrentAffair(date, "defence", "Exercise", defenceTitles[random.nextInt(defenceTitles.length)], "Defence details...", null, colors[random.nextInt(colors.length)], null, null, null));
            records.add(new CurrentAffair(date, "defence", "Missile", defenceTitles[random.nextInt(defenceTitles.length)], "Defence details...", null, colors[random.nextInt(colors.length)], null, null, null));
            records.add(new CurrentAffair(date, "ai", "AI", aiTitles[random.nextInt(aiTitles.length)], "AI Impact details...", null, colors[random.nextInt(colors.length)], null, "High", "🤖"));
            records.add(new CurrentAffair(date, "study", "Psychology", studyTitles[random.nextInt(studyTitles.length)], "Study materials for SSB...", null, colors[random.nextInt(colors.length)], null, null, "📚"));
        }

        return records;
    }
}
