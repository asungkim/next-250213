package com.example.next.domain.post.post.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum SearchKeywordType {
    title("title"),
    content("content");

    private final String value;
}
