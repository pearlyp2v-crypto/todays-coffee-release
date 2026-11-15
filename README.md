# 오늘의 커피 · 배포용 실행본

이 저장소는 공개 웹앱 실행 파일만 관리합니다. 개발 원본은 별도 저장소에서 관리하며 여기서 직접 HTML을 수정하지 않습니다.

- `release.json`: 앱 버전·소스 커밋·배포 파일 SHA256.
- `index.html` + `manifest.webmanifest` + `sw.js` + `icons/`: 반드시 함께 배포합니다.
- 설정 → 앱 설치·업데이트. iPhone은 Safari 공유 → 홈 화면에 추가, Android는 Chrome 설치 메뉴를 사용합니다.
- 최초 온라인 실행 후 오프라인 준비 완료를 확인하세요. OCR은 인터넷이 필요합니다.
- 기록과 사진은 사용자 브라우저에 저장됩니다. 개인 백업 JSON은 이 저장소에 올리지 않습니다.
- Pages의 실제 공개 여부/주소는 Settings → Pages 및 Actions 성공 결과에서 확인합니다.
