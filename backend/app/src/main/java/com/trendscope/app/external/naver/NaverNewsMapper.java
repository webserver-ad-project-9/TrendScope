package com.trendscope.app.external.naver;

import com.trendscope.app.domain.keyword.entity.Keyword;
import com.trendscope.app.domain.news.entity.NewsArticle;
import com.trendscope.app.global.util.DateTimeUtils;
import com.trendscope.app.global.util.TextCleaner;
import org.springframework.stereotype.Component;

@Component
public class NaverNewsMapper {

    public NewsArticle toEntity(Keyword keyword, NaverNewsResponse.Item item) {
        return new NewsArticle(
                keyword,
                TextCleaner.cleanNewsText(item.title()),
                item.originallink(),
                TextCleaner.cleanNewsText(item.description()),
                DateTimeUtils.parseNaverPubDate(item.pubDate())
        );
    }
}
