package com.trendscope.app.domain.trendanalysis.service;

import org.springframework.stereotype.Component;

@Component
public class TrendScoreCalculator {

    public double calculate(long articleCount, long relatedKeywordCount) {
        return articleCount * 1.0 + relatedKeywordCount * 0.2;
    }
}
