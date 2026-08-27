# CLAUDE.md — 8체질의학회 영상 프로젝트 (Remotion)

8체질의학회 유튜브 채널의 영상을 Remotion(React)으로 제작하는 프로젝트.
현재 작업 중인 것은 **기본 시리즈 ① 목양·목음편** (11:07, 조립 완료·오디오 대기).

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

1. **`8ch_mok_spec_v5.md`** — 목양·목음편 확정 스펙(원장님 검수 반영본). 최상위.
   문안·소재 배제 목록·시리즈 구조(기본/오해/심화 3부)의 근거.
   ※ 176행 "(부제: 8체질 심화 ①)"은 재편 이전 잔재 — "8체질 기본 ①"이 맞음
2. **컴포넌트별 사양서 7종** — `*_spec.md` (2a_organ_array / safety_caption /
   person_typo_card / comparison_table / item_label_and_section2 /
   section1_hook / item_panel_template / blood_pressure_panel /
   self_diagnosis_warning). 각 컴포넌트의 "반드시 지켜야 할 규칙" 절은 불변 계약
3. **`episode_assembly_spec.md`** — 조립 사양 + **부록 A(구현 기록·미해결 이슈)**.
   새 세션은 부록 A부터 읽을 것
4. **`8체질의학_개괄영상_제작스펙_v5.md`** — 개괄편(기본 ⓞ) 스펙. 확정본 참고용

---

## 반드시 지켜야 할 제약

- **`CONTENT_MAX_Y = 686`** (EcmOverview/constants.ts) — 본문 그래픽은 애니메이션
  최대 이동 범위까지 포함해 y<686에서 끝난다. 그 아래는 안전 자막 슬롯
  (career/addiction 686~742, medical 762~842, disclaimer 862~910)과
  자막 안전 영역(920~, 내레이션 전용)
- **`CONSTITUTION_ACCENTS` 확정 8색** (원장님 확정): 목양 하양 / 목음 붉은색 /
  금양 초록 / 금음 노랑(#EFC93B) / 토양 검정 / 토음 청색 / 수양 진한 주황 /
  수음 연한 주황. **칩(ConstitutionName)은 4곳 한정**: EpisodeTitleCard ·
  ConstitutionTitleCard · ComparisonTable 헤더 · PersonTypoCard 체질명
  (+ 조립 사양서가 지정한 섹션2 도입). 본문 내 체질명은 기본 텍스트 —
  칩이 남발되면 강조 기능이 사라진다
- **출처 자막은 간략 표기** — 저자·기고문 제목 없이 매체·월호만
  (예: `출처: 빛과소금 94-5월호 · 95-5월호 / 월간조선 2011-5월호`).
  **어떤 경우에도 두 줄 금지** — SourceCaptions가 nowrap 강제 +
  `sourceFitsOneLine()`으로 검증, 초과 시 렌더 콘솔 경고
- **길이는 전부 외부 제어** — 컴포넌트에 프레임·타임코드 하드코딩 금지.
  단계 시각은 `stageStartsSec` 등 props, 편 전체는 `src/MokEpisode/timing.ts`가
  단일 원천(0.1초 단위 유지 — 프레임 반올림 무결성의 전제)
- **medical 자막은 어떤 경우에도 가려지지 않는다** (z-index 최상위).
  medical 구간에는 출처 자막이 bottom 330으로 상향(`raisedRanges`)
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

공통 유틸: SourceCaptions(출처, raisedRanges), ORGAN_SILHOUETTES(SVG 패스 —
liver/gallbladder 등록, 나머지 6장기는 항목 추가만 하면 됨).
편 본체: `src/MokEpisode/` (timing.ts + index.tsx). 각 컴포넌트는 Root.tsx에
단독 검수용 프리뷰 컴포지션이 등록돼 있고, `ConstitutionColors`로 8색 확인 가능.

---

## 미해결 이슈 (상세는 episode_assembly_spec.md 부록 A-5)

1. 오디오 미확보 — timing.ts가 임시 길이(5.5자/초 환산)
2. 4-i 정답+예고 문안 [가안] — 원장님 확정 대기
3. 목음 붉은색과 경고색(medical·과잉 화살표) 구분 — 실제 합성에서 재확인 필요
4. 개괄편과의 형식 불일치: 출처 표기(전체 vs 간략) / 출처 위치(우하단 고정,
   좌하단 이전안 보류)
5. 클로징 "구독 + 알림 설정" 문구가 확정 대본에 없음 — 원장님 판단 대기
6. 항목 명칭: 예고 "질병/건강법" 분리 vs 라벨 "질병·건강법" 병합
7. docs/CarnivoreColonCut2.mp4 — 참고 영상, 커밋 제외(미추적 유지 중)
