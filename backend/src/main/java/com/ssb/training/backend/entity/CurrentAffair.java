package com.ssb.training.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import java.time.LocalDate;

@Entity
public class CurrentAffair {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private String category; // 'news', 'defence', 'ai', 'study'
    private String typeTag;  // specific tag like 'Navy', 'Missile', 'Space'
    
    @Column(length = 500)
    private String title;
    
    @Column(length = 2000)
    private String summary;
    
    private String source;
    private String color;
    private String link;
    private String impact; // Only for AI
    private String icon; // Icon or emoji

    public CurrentAffair() {}

    public CurrentAffair(LocalDate date, String category, String typeTag, String title, String summary, String source, String color, String link, String impact, String icon) {
        this.date = date;
        this.category = category;
        this.typeTag = typeTag;
        this.title = title;
        this.summary = summary;
        this.source = source;
        this.color = color;
        this.link = link;
        this.impact = impact;
        this.icon = icon;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getTypeTag() { return typeTag; }
    public void setTypeTag(String typeTag) { this.typeTag = typeTag; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
    public String getImpact() { return impact; }
    public void setImpact(String impact) { this.impact = impact; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
