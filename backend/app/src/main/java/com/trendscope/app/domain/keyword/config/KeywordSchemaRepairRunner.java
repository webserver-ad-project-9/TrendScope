package com.trendscope.app.domain.keyword.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Profile({"local", "docker"})
public class KeywordSchemaRepairRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(KeywordSchemaRepairRunner.class);

    private final JdbcTemplate jdbcTemplate;

    public KeywordSchemaRepairRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!tableExists("onboarding_keywords") || !columnExists("onboarding_keywords", "active")) {
            return;
        }

        if (!columnExists("onboarding_keywords", "is_active")) {
            jdbcTemplate.execute("ALTER TABLE onboarding_keywords ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE");
        }

        jdbcTemplate.execute("UPDATE onboarding_keywords SET is_active = active");
        jdbcTemplate.execute("ALTER TABLE onboarding_keywords DROP COLUMN active");
        log.info("Repaired onboarding_keywords schema: migrated legacy active column to is_active");
    }

    private boolean tableExists(String tableName) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?",
                Integer.class,
                tableName
        );
        return count != null && count > 0;
    }

    private boolean columnExists(String tableName, String columnName) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?",
                Integer.class,
                tableName,
                columnName
        );
        return count != null && count > 0;
    }
}
