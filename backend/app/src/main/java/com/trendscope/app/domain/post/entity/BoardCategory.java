package com.trendscope.app.domain.post.entity;

public enum BoardCategory {
    POLITICS("정치"),
    ECONOMY("경제"),
    IT_SCIENCE("IT/과학"),
    SOCIETY("사회"),
    WORLD("세계"),
    SPORTS("스포츠"),
    ENTERTAINMENT("연예");

    private final String label;

    BoardCategory(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
