package com.trendscope.app.domain.trendanalysis.entity;

import com.trendscope.app.domain.keyword.entity.Keyword;
import com.trendscope.app.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "trend_analyses")
public class TrendAnalysis extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "keyword_id", nullable = false)
    private Keyword keyword;

    @Column(nullable = false)
    private LocalDate analysisDate;

    @Column(nullable = false)
    private double trendScore;

    protected TrendAnalysis() {
    }

    public TrendAnalysis(Keyword keyword, LocalDate analysisDate, double trendScore) {
        this.keyword = keyword;
        this.analysisDate = analysisDate;
        this.trendScore = trendScore;
    }

    public double getTrendScore() {
        return trendScore;
    }
}
