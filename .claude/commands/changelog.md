다음 단계로 CHANGELOG.md를 생성하거나 업데이트한다.

1. `git describe --tags --abbrev=0` 으로 마지막 태그를 확인한다. 태그가 없으면 전체 히스토리를 사용한다.
2. `git log <last-tag>..HEAD --pretty=format:"%h %s"` 로 태그 이후 커밋 목록을 가져온다.
3. 커밋 메시지를 아래 카테고리로 분류한다:
   - **추가 (Added):** feat, add, 추가
   - **수정 (Fixed):** fix, bug, 수정, 버그
   - **변경 (Changed):** refactor, update, 변경, 개선
   - **제거 (Removed):** remove, delete, 제거, 삭제
   - **기타:** 위에 해당하지 않는 커밋
4. 프로젝트 루트의 `CHANGELOG.md`에 아래 형식으로 새 항목을 **맨 위에 추가**한다. 기존 내용은 유지한다.

```
## [Unreleased] - YYYY-MM-DD

### 추가
- 커밋 요약 (커밋 해시)

### 수정
- 커밋 요약 (커밋 해시)

### 변경
- 커밋 요약 (커밋 해시)

### 제거
- 커밋 요약 (커밋 해시)

### 기타
- 커밋 요약 (커밋 해시)
```

5. 완료 후 CHANGELOG.md 경로와 추가된 커밋 수를 알려준다.
6. 커밋이 없으면 "마지막 태그 이후 새 커밋이 없습니다"라고 알려준다.
