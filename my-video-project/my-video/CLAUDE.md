# CLAUDE.md — 8체질의학회 영상 프로젝트 (Remotion)

8체질의학회 유튜브 채널의 영상을 Remotion(React)으로 제작하는 프로젝트.
현재 작업은 **이사회 승인 샘플 3편** — ⓞ 개괄편 재조립 / ① 목양·목음편(11:20, 조립·자막
완료) / 오해① 첫 조립. 제작 순서는 **선 영상(ElevenLabs 가이드 트랙) → 이사회 승인 →
원장님 직접 녹음 → 리맵**이다(제작표준 ★v13). 편 작업은 **한 세션에 한 편**만 한다.

**스택**: Remotion 4.0.507 / React 19 / TypeScript. 1920×1080, 30fps.

```bash
npm run dev        # Remotion 스튜디오 (사이드바에서 컴포지션 선택)
npm run lint       # eslint + tsc — 커밋 전 필수 통과
npx remotion render MokEpisode out/MokEpisode.mp4   # 편 본체 렌더
```

**세션 첫 줄 규칙**: 어느 편을 작업하는지 선언하고, 그 편 접두어의 문서만 읽는다
(`8ch_mok_*` / `8ch_overview_*` / `8ch_misc01_*` · `8ch_misconception_*`).
다른 편 문서는 열지 않는다(검색·인용 혼선 방지).

`out/`은 gitignore 대상(렌더 결과물). 커밋 메시지는 한글.

---

## 문서 위치와 우선순위

전부 `docs/`에 있다. **충돌 시 위가 이긴다.** 제작표준·편별 스펙은 **Claude 프로젝트
지식이 원본, `docs/`는 사본**이다 — 두 곳이 어긋나면 프로젝트 지식을 따르고 사본을 갱신한다.

### 편별 조립 지시서 (편 작업은 여기서 시작)

| 편 | 시작 문서 | 함께 읽을 것 |
|---|---|---|
| ⓞ 개괄편 재조립 | `docs/8ch_overview_assembly_brief_v1.md` | `8ch_overview_spec_v7.md` · `8ch_overview_recording_script_v1.md` |
| 오해① 조립 | `docs/8ch_misc01_assembly_brief_v1.md` | `8ch_misc01_spec_v4.md` · `8ch_misconception_01_script_v2.md` · `8ch_misc01_recording_script_v1.md` |
| ① 목·목음편 | `episode_assembly_spec.md` 부록 A | 아래 1·2번 |

### 공통 우선순위

1. **`8ch_mok_spec_v11.md`** — 목양·목음편 확정 스펙(v11: 인물 배지·대조표 규격·
   직접 녹음 전환, 변경 이력 45~83항 누적 수록). 최상위. 문안·소재 배제 목록·시리즈 구조
   (기본/오해/심화 3부)의 근거
2. **`8ch_mok_tts_v7.md`** — 확정 낭독 대본(ElevenLabs 입력용, 낭독 문안은
   v6와 동일·표기 보정판). **내레이션 자막의 원천** — 화면 자막 cue 문안은
   이 문서에서만 가져온다
3. **`8ch_series_standard.md`** — 시리즈 제작 표준 **v13**(예고 단일화·클로징 표준
   구조·소재 소비 대장·★v13 제작 순서·이사회 샘플 규격·§14-0 리맵 절차).
   시리즈 공통 규칙은 이 문서가 기준
4. **컴포넌트별 사양서 7종** — `*_spec.md` (2a_organ_array / safety_caption /
   person_typo_card / comparison_table / item_label_and_section2 /
   section1_hook / item_panel_template / blood_pressure_panel /
   self_diagnosis_warning). 각 컴포넌트의 "반드시 지켜야 할 규칙" 절은 불변 계약
5. **`episode_assembly_spec.md`** — 조립 사양 + **부록 A(구현 기록·미해결 이슈)**.
   새 세션은 부록 A부터 읽을 것
6. **`8ch_overview_spec_v7.md`** — 개괄편(기본 ⓞ) **재제작** 스펙.
   구 `8체질의학_개괄영상_제작스펙_v5.md`는 폐기(v5 렌더는 git 태그 `overview-v5`로만 보존)
7. **`8ch_misc01_spec_v4.md`** — 오해① 스펙. 기본 시리즈와 형식이 다르다
   (9항목·대조표·체질 타이틀 카드 없음). 신규 컴포넌트 4종은 지시서 §2

---

## 반드시 지켜야 할 제약

- **`CONTENT_MAX_Y = 686`** (bottomLayout.ts, constants.ts가 재수출) — 본문 그래픽은
  애니메이션 최대 이동 범위까지 포함해 y<686에서 끝난다. 그 아래는 하단 자막 스택
  (`src/EcmOverview/bottomLayout.ts`가 단일 원천): **항목 행** 686~734
  (career/addiction 좌 + 출처 우) → **disclaimer** 744~786 → **내레이션 자막**
  798~ (60px 2줄 상자 204px, 바닥 여백 78). 검수는 `BottomLayout` 컴포지션
  (눈금선 + DOM 실측 OK/NG)
- **medical 띠는 예약 슬롯이 아니다** — 혈압 구간에만 본문 바로 아래(596~676)에
  선다. 그래서 **BloodPressurePanel만 `MEDICAL_CONTENT_MAX_Y = 580`** 적용
  (카드 top 140). medical 띠 자체(80px·32px·3px 테두리)는 **압축 금지**,
  z-index 최상위 — 어떤 경우에도 가려지지 않는다. 출처는 항목 행에 있어
  medical과 구조적으로 겹치지 않는다 (예전 `raisedRanges` 상향 이동은 폐지)
- **개괄영상(EcmOverview)의 `LEGACY_LAYOUT`은 폐지** (2026-09-11, 재제작 결정) — 재조립
  시 `BottomLayoutContext.Provider`를 제거하고 시리즈 프로파일(`bottomLayout.ts`)을
  그대로 쓴다. v5 렌더를 되돌려야 할 일이 있으면 git 태그 `overview-v5`에서 꺼낸다
- **`CONSTITUTION_ACCENTS` 확정 8색** (원장님 확정): 목양 하양 / 목음 붉은색 /
  금양 초록 / 금음 노랑(#EFC93B) / 토양 검정 / 토음 청색 / 수양 진한 주황 /
  수음 연한 주황. **칩(ConstitutionName) 적용 기준** (2026-09-06 확정):
  "제목·도입·마무리에서 체질을 소개하는 자리에만" — 본문 서술 중 체질명이
  스쳐 지나가는 경우에는 쓰지 않는다(기본 텍스트, 칩이 남발되면 강조 기능이
  사라진다). 목·목음편 사용처(참고, 7곳): 편 타이틀 / 섹션2 도입 /
  체질 타이틀 카드 / 대조표 헤더 / 인물 카드 / 4-i 질문 화면 / 클로징
  마무리. ※ 목록은 참고용 — 늘어나도 규칙 위반이 아니며 판단은 기준으로
  한다. 체질명 나열 표기는 가운데점(v6 54항, "목양체질 · 목음체질"),
  조사가 붙는 문장은 예외(클로징 문구 유지 — 2026-09-05 결정)
- **출처 자막은 간략 표기** — 저자·기고문 제목 없이 매체·월호만
  (예: `출처: 빛과소금 94-5월호 · 95-5월호 / 월간조선 2011-5월호`).
  **개괄편 재조립도 이 규칙을 따른다** — v5의 "출처 1개면 전체 표기"는 폐기
  (미해결 이슈 3 종료).
  시리즈 프로파일은 24px(사진 크레딧 20px), 한 줄 폭 상한 1000px.
  **어떤 경우에도 두 줄 금지** — SourceCaptions가 nowrap 강제 +
  `sourceFitsOneLine()`으로 검증, 초과 시 렌더 콘솔 경고
- **길이는 전부 외부 제어** — 컴포넌트에 프레임·타임코드 하드코딩 금지.
  단계 시각은 `stageStartsSec` 등 props, 편 전체는 `src/MokEpisode/timing.ts`가
  단일 원천(0.1초 단위 유지 — 프레임 반올림 무결성의 전제)
- **ItemPanel의 같은 항목 3·4 쌍은 같은 `sizeTier`** — 섹션 대칭이 편의 뼈대

## 내용 원칙 (도메인 규칙)

- **근거 없는 문안 금지** — 화면 문구는 스펙·원자료(빛과소금 기고문 등)와
  대조해서만 넣는다. 스펙에 없는 문구는 [가안]으로 명시하고 확정을 받는다
- **인과 방향: 구조가 먼저** — 8체질의학은 장기 구조가 원인, 식성이 결과
  ("대장이 짧다 → 그래서 육식동물이 되었다"). 역방향 서술 금지
- **부정이 아니라 확장** — 앞 내용에 X·지우기·회색 처리 금지 (2-b, 자가진단 등)
- 효과 단정("치료"·"완치") 금지 / "최강·최약 **체질**" 표현 금지("최강장기"는 허용
  술어) / 인물 사진·초상 금지(타이포만, 실사는 맥진 손 클로즈업 등 예외만) —
  **개괄편만 예외**(스펙 v7 인물 자산표의 사진·배지 규격) / 수치·의료 기준값
  금지(혈압) / 공포 연출 금지(자가진단·안전 자막 톤 규칙) / 인물 배지는
  `권도원 박사님 진맥` · `추정` 두 종만
- **이사회 샘플 렌더는 `BOARD_SAMPLE` 플래그로** 상단에 "이사회 검토용 샘플 · 임시
  음성"을 고정 표시한다. 승인 후 최종 렌더에서 플래그만 내린다. 플레이스홀더
  (오해① 클로징 ② 예고)는 샘플에서 숨기지 않는다
- 강조는 화면당 1개 이하, 시리즈 강조색은 gold

## 건드리지 말 것

- ~~개괄영상 씬 `src/EcmOverview/scenes/Section01~06`~~ — **해제** (2026-09-11).
  재조립 대상. 착수 전 `git tag overview-v5`로 v5 상태를 남긴 뒤 수정한다.
  체질 컷 색은 자체 톤을 버리고 `CONSTITUTION_ACCENTS`로 교체
- `src/Lecture/`, `src/IntroOutro/`, `src/SongLyrics/` — 별도 완성 영상
- 확정 문안(예: BloodPressurePanel의 MOK_BLOOD_PRESSURE) — 줄바꿈 조판 외 수정 금지

---

## 컴포넌트 17종 (`src/EcmOverview/components/`)

시리즈 공통 — 다른 편(금·토·수)은 데이터만 교체하고 로직은 수정하지 않는 것이 설계 목표.

| 컴포넌트 | 역할 |
|---|---|
| EpisodeTitleCard | 섹션 0 편 타이틀 (체질명 칩 2색) |
| Section1Hook | 섹션 1 후킹 — 채식의 역설(카운트업) + 항목 예고 8개 |
| OrganArrayTransition | 2-a 장기 강약 배열 전환 (5.3초 고정 타임라인 — 축소 금지) |
| Section2bDiagram | 2 담즙·길항 도식 (좌우 대칭 음식 칩, green=보강/red=과잉) |
| Section2cGraphic | 2 온수욕·부교감신경 (coreIsWarm 반전으로 수편 재활용) |
| CarnivoreColonCut · FoodListPanel | 2 보조 컷 (Section2Cutaways.tsx 한 파일) |
| ConstitutionTitleCard | 3-a/4-a 체질 타이틀 카드 (장기 실루엣 배경) |
| ItemLabel | 3·4 항목 라벨 (좌상단, 섹션 대칭 자동 보장) |
| ItemPanel | 3·4 항목 설명 템플릿 ×10화면 (MOK_PANELS, sizeTier 쌍 일치) |
| BloodPressurePanel | 3-f 혈압 문단 — 근거 층위 병치, ①강조 금지·④는 medical 담당 |
| PersonTypoCard | 3-g/4-g 인물 타이포 카드 (사진 금지, SVG 장기 실루엣) |
| EmphasisCaption | 강조 자막 (체형 반례 — 섹션 5와 수미상관) |
| SafetyCaption | 안전 자막 4종 (disclaimer/career/addiction/medical) — 고정 슬롯 |
| ComparisonTable | 4-h 9항목 대조표 (20초 무음 정지, 스크린샷·썸네일 지점, **전용 상한 TABLE_MAX_Y=880** — 자막 없는 구간이라 y<686 예외) |
| SelfDiagnosisWarning | 섹션 5 자가진단 경계 (공포 금지, 경고→조언 톤 전환) |
| ClosingScene | 섹션 6 클로징 (다음 편 예고 + 구독 CTA) |
| ConstitutionName (공통) | 체질명 칩 렌더러 (CONSTITUTION_TITLE_COLORS) |

공통 유틸: SourceCaptions(출처, 항목 행 우측) · Subtitles(내레이션 자막, 프로파일
적용) · BottomLayoutSheet(하단 레이아웃 검수 시트) · ORGAN_SILHOUETTES(SVG 패스 —
liver/gallbladder 등록, 나머지 6장기는 항목 추가만 하면 됨).
편 본체: `src/MokEpisode/` (timing.ts + index.tsx). 각 컴포넌트는 Root.tsx에
단독 검수용 프리뷰 컴포지션이 등록돼 있고, `ConstitutionColors`로 8색 확인 가능.

---

## 미해결 이슈 (상세는 episode_assembly_spec.md 부록 A-5)

1. 오디오 — **이사회 샘플은 ElevenLabs 가이드 트랙**으로 만든다(선 영상·후 녹음).
   목·목음편은 `8ch_mok_tts_v7.md`로 가이드 트랙 생성 → 실측 → timing.ts 교체.
   승인 후 원장님 녹음 → 제작표준 §14-0 리맵(비례 재배분 + 예외 3종 수동)
2. 목음 붉은색과 경고색(medical·과잉 화살표) 구분 — 실제 합성에서 재확인 필요
3. ~~개괄편과의 형식 불일치~~ — **종료.** 개괄편 재조립에서 출처 간략 표기·항목 행
   슬롯·확정 8색·배지로 통일
4. 항목 명칭: 예고 "질병/건강법" 분리 vs 라벨 "질병·건강법" 병합 — v10에서도
   양표기 병존(라벨 자막 행 분리 / 비주얼 행 병합), 미해결
5. docs/CarnivoreColonCut2.mp4 — 참고 영상, 커밋 제외(미추적 유지 중)

*v6 화면 수정은 2026-09-05(A-5-1), v7~v9 화면 수정은 2026-09-06(A-5-2)
반영 완료. 4-i 도입은 질문 타이포 + 칩 밀착 → 벌어짐 연출(2026-09-06,
클로징 마무리 gap 200과 같은 모티프).
결정 2건: 4-f 강조는 하복부 보온만(화면당 1개 규칙 유지) / 클로징 문장의
체질명은 조사 표기("목양체질과 목음체질을") 유지*
