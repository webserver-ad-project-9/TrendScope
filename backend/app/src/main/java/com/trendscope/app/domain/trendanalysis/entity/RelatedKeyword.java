package com.trendscope.app.domain.trendanalysis.entity;

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
import java.util.UUID;

@Entity
@Table(name = "related_keywords")
public class RelatedKeyword extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trend_analysis_id", nullable = false)
    private TrendAnalysis trendAnalysis;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false)
    private int frequency;

    protected RelatedKeyword() {
    }
}
