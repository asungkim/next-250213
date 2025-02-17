package com.example.next.domain.member.member.dto;

import com.example.next.domain.member.member.entity.Member;
import lombok.Getter;
import org.springframework.lang.NonNull;

@Getter
public class MemberDto {

    @NonNull
    private long id;
    @NonNull
    private String nickname;

    public MemberDto(Member member) {
        this.id = member.getId();
        this.nickname = member.getNickname();
    }
}
