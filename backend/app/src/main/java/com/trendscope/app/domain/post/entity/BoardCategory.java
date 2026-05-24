package com.trendscope.app.domain.post.entity;

public enum BoardCategory {
    POLITICS("정치"),
    ECONOMY("경제"),
    SOCIETY("사회"),
    LIFE("생활"),
    CULTURE("문화"),
    IT_SCIENCE("IT/과학"),
    WORLD("세계"),
    SPORTS("스포츠"),
    ENTERTAINMENT("엔터");

    private final String label;

    BoardCategory(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
