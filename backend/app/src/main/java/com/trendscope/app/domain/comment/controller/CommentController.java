package com.trendscope.app.domain.comment.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comments")
@Tag(name = "Comment", description = "게시글 댓글 API")
public class CommentController {
}
