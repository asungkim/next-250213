package com.example.next.domain.member.member.controller;

import com.example.next.domain.member.member.dto.MemberDto;
import com.example.next.domain.member.member.entity.Member;
import com.example.next.domain.member.member.service.MemberService;
import com.example.next.global.Rq;
import com.example.next.global.dto.Empty;
import com.example.next.global.dto.RsData;
import com.example.next.global.exception.ServiceException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@SecurityRequirement(name = "bearerAuth")
@Tag(name = "ApiV1MemberController", description = "회원 관련 API")
@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class ApiV1MemberController {

    private final MemberService memberService;
    private final Rq rq;

    record JoinReqBody(@NotBlank String username,
                       @NotBlank String password,
                       @NotBlank String nickname) {
    }

    @Operation(summary = "회원 가입")
    @PostMapping("/join")
    public RsData<MemberDto> join(@Valid @RequestBody JoinReqBody body) {

        memberService.findByUsername(body.username())
                .ifPresent(_ -> {
                            throw new ServiceException("409-1", "이미 사용중인 아이디입니다.");
                        }
                );

        Member member = memberService.join(body.username(), body.password(), body.nickname());
        return new RsData<>(
                "201-1",
                "회원가입이 완료되었습니다.",
                new MemberDto(member));
    }

    record LoginReqBody(@NotBlank
                        String username,
                        @NotBlank
                        String password) {
    }

    record LoginResBody(@NonNull MemberDto item,
                        @NonNull String apiKey,
                        @NonNull String accessToken) {
    }

    @Operation(summary = "로그인", description = "로그인 성공 시 ApiKey와 AccessToken 반환. 쿠키로도 반환")
    @PostMapping("/login")
    public RsData<LoginResBody> login(@Valid @RequestBody LoginReqBody body, HttpServletResponse response) {
        Member member = memberService.findByUsername(body.username()).orElseThrow(
                () -> new ServiceException("401-1", "존재하지 않는 아이디입니다.")
        );

        String accessToken = memberService.genAccessToken(member);

        rq.addCookie("accessToken", accessToken);
        rq.addCookie("apiKey", member.getApiKey());

        if (!member.getPassword().equals(body.password())) {
            throw new ServiceException("401-1", "비밀번호가 일치하지 않습니다.");
        }

        return new RsData<>(
                "200-1",
                "%s님 환영합니다.".formatted(member.getNickname()),
                new LoginResBody(
                        new MemberDto(member),
                        member.getApiKey(),
                        accessToken)
        );
    }

    @Operation(summary = "로그아웃", description = "로그아웃 시 쿠키 삭제")
    @DeleteMapping("/logout")
    public RsData<Empty> logout() {
        rq.removeCookie("accessToken");
        rq.removeCookie("apiKey");

        return new RsData<>("200-1", "로그아웃 되었습니다.");
    }


    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "내 정보 조회")
    @GetMapping("/me")
    public RsData<MemberDto> me() {

        Member actor = rq.getActor();

        return new RsData<>(
                "200-1",
                "내 정보 조회가 완료되었습니다.",
                new MemberDto(actor)
        );
    }
}
