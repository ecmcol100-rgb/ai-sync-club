# CLAUDE.md — 8체질의학회 영상 프로젝트 (Remotion)

8체질의학회 유튜브 채널의 영상을 Remotion(React)으로 제작하는 프로젝트.
현재 작업 중인 것은 **기본 시리즈 ① 목양·목음편** (약 11:22, 조립 완료·오디오 대기).

**스택**: Remotion 4.0.507 / React 19 / TypeScript. 1920×1080, 30fps.

```bash
npm run dev        # Remotion 스튜디오 (사이드바에서 컴포지션 선택)
npm run lint       # eslint + tsc — 커밋 전 필수 통과
npx remotion render MokEpisode out/MokEpisode.mp4   # 편 본체 렌더
```

`out/`은 gitignore 대상(렌더 결과물). 커밋 메시지는 한글.

---

## 문서 위치와 우선순위

전부 `docs/`에 있다. **충돌 시 위가 이긴다.**

1. **`8ch_mok_spec_v9.md`** — 목양·목음편 확정 스펙(클로징 문안까지 확정,
   변경 이력 45~73항 누적 수록). 최상위. 문안·소재 배제 목록·시리즈 구조
   (기본/오해/심화 3부)의 근거
2. **`8ch_mok_tts_v6.md`** — 확정 낭독 대본(ElevenLabs 입력용, 약 11:22).
   **내레이션 자막의 원천** — 화면 자막 cue 문안은 이 문서에서만 가져온다
3. **`8ch_series_standard.md`** — 시리즈 제작 표준(예고 단일화·클로징 표준
   구조·소재 소비 대장 등). 시리즈 공통 규칙은 이 문서가 기준
4. **컴포넌트별 사양서 7종** — `*_spec.md` (2a_organ_array / safety_caption /
   person_typo_card / comparison_table / item_label_and_section2 /
   section1_hook / item_panel_template / blood_pressure_panel /
   self_diagnosis_warning). 각 컴포넌트의 "반드시 지켜야 할 규칙" 절은 불변 계약
5. **`episode_assembly_spec.md`** — 조립 사양 + **부록 A(구현 기록·미해결 이슈)**.
   새 세션은 부록 A부터 읽을 것
6. **`8체질의학_개괄영상_제작스펙_v5.md`** — 개괄편(기본 ⓞ) 스펙. 확정본 참고용

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
- **개괄영상(EcmOverview)은 `LEGACY_LAYOUT`으로 고정** — EcmOverview/index.tsx의
  `BottomLayoutContext.Provider`가 v5 확정 렌더의 하단 값(내레이션 40px·출처
  31px)을 보존한다. 이 Provider를 빼면 확정 렌더가 바뀐다
- **`CONSTITUTION_ACCENTS` 확정 8색** (원장님 확정): 목양 하양 / 목음 붉은색 /
  금양 초록 / 금음 노랑(#EFC93B) / 토양 검정 / 토음 청색 / 수양 진한 주황 /
  수음 연한 주황. **칩(ConstitutionName)은 6곳 한정**: EpisodeTitleCard ·
  ConstitutionTitleCard · ComparisonTable 헤더 · PersonTypoCard 체질명 ·
  섹션2 도입(v6 57항) · 클로징 ① 마무리 화면(v9 섹션6 연출 메모). 기준: "제목·도입에서 체질을 소개하는
  자리에만" — 본문 내 체질명은 기본 텍스트, 칩이 남발되면 강조 기능이
  사라진다. 체질명 나열 표기는 가운데점(v6 54항, "목양체질 · 목음체질"),
  조사가 붙는 문장은 예외(클로징 문구 유지 — 2026-09-05 결정)
- **출처 자막은 간략 표기** — 저자·기고문 제목 없이 매체·월호만
  (예: `출처: 빛과소금 94-5월호 · 95-5월호 / 월간조선 2011-5월호`).
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
- 효과 단정("치료"·"완치") 금지 / "최강·최약 체질" 표현 금지 / 인물 사진·초상
  금지(타이포만, 실사는 맥진 손 클로즈업 등 예외만) / 수치·의료 기준값 금지(혈압) /
  공포 연출 금지(자가진단·안전 자막 톤 규칙) / 추정 등급 인물은 `추정` 태그 병기
- 강조는 화면당 1개 이하, 시리즈 강조색은 gold

## 건드리지 말 것

- **개괄영상 씬 `src/EcmOverview/scenes/Section01~06`** — v5 확정 렌더.
  체질 컷 색도 자체 톤(확정 8색과 별개)으로 고정돼 있음
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
| ComparisonTable | 4-h 9항목 대조표 (20초 무음 정지, 스크린샷·썸네일 지점) |
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

1. 오디오 미확보 — timing.ts가 임시 길이(5.5자/초 환산).
   대본은 `8ch_mok_tts_v6.md`(확정, 약 11:22)로 확보, TTS 생성·실측 대기.
   실측 시 문단 단위 재분배도 함께 처리
2. 목음 붉은색과 경고색(medical·과잉 화살표) 구분 — 실제 합성에서 재확인 필요
3. 개괄편과의 형식 불일치: 출처 표기(전체 vs 간략) / 출처 위치(우하단 고정,
   좌하단 이전안 보류)
4. 항목 명칭: 예고 "질병/건강법" 분리 vs 라벨 "질병·건강법" 병합 — v9에서도
   양표기 병존(라벨 자막 행 분리 / 비주얼 행 병합), 미해결
5. docs/CarnivoreColonCut2.mp4 — 참고 영상, 커밋 제외(미추적 유지 중)

*v6 화면 수정은 2026-09-05(A-5-1), v7~v9 화면 수정은 2026-09-06(A-5-2)
반영 완료. 4-i 도입은 질문 타이포 + 칩 밀착 → 벌어짐 연출(2026-09-06,
클로징 마무리 gap 200과 같은 모티프).
결정 2건: 4-f 강조는 하복부 보온만(화면당 1개 규칙 유지) / 클로징 문장의
체질명은 조사 표기("목양체질과 목음체질을") 유지*
