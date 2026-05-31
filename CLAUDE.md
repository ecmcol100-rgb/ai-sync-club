# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 계산기 (Calculator)

단일 파일 HTML 계산기. `calculator.html`을 브라우저에서 직접 열면 됨.  
**스택:** HTML / CSS / Vanilla JavaScript

---

## 코드 규칙
- [ ] 커밋 메시지 한글 작성
- [ ] 함수마다 JSDoc 주석
- [ ] 테스트 코드 필수

## 중요 규칙
- 세션 시작 시 HANDOFF.md가 있으면 반드시 먼저 읽을 것
- 내용이 없으면 절대 임의로 채우지 말 것
- 모르는 정보는 반드시 먼저 질문할 것

---

## 아키텍처

`calculator.html` 한 파일에 상태·뷰·이벤트 모두 포함.

| 상태 변수 | 역할 |
|-----------|------|
| `cur` | 현재 입력값 |
| `prev` | 이전 피연산자 |
| `op` | 대기 중인 연산자 |
| `resetNext` | 다음 입력 시 cur 덮어쓰기 여부 |

| 주요 함수 | 역할 |
|-----------|------|
| `inputNum` / `inputDot` | 숫자·소수점 입력 |
| `inputOp` | 연산자 저장 (연속 연산 지원) |
| `calculate` | 계산 실행, 연타 무시 |
| `clearAll` / `toggleSign` / `percent` | 유틸리티 |
| 키보드 핸들러 | Enter/Escape/Backspace 매핑 |

> `resetNext`: 계산 완료 후 `true` → 다음 숫자 입력 시 cur 교체, `=` 입력 시 무시

---

## 참고
- `KakaoTalk*.txt` — 채팅 로그, 수정 대상 아님
