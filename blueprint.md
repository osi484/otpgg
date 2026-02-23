# Focus Flow - Zen Productivity Tool

## 1. 개요 (Overview)
사용자가 집중력을 유지하고 정서적 안정을 찾을 수 있도록 돕는 미니멀한 생산성 도구입니다. 뽀모도로 타이머와 백색 소음 믹서가 결합된 형태입니다.

## 2. 디자인 및 기능 명세 (Detailed Outline)

### 디자인 시스템 (Zen Aesthetic)
- **색상 팔레트 (OKLCH 기준):**
  - Background: `oklch(25% 0.02 240)` (심해의 차분한 네이비)
  - Surface: `oklch(95% 0.01 100 / 0.1)` (반투명한 유리 질감)
  - Accent (Forest): `oklch(75% 0.1 150)` (부드러운 세이지 그린)
  - Accent (Focus): `oklch(80% 0.12 30)` (따뜻한 테라코타 오렌지 - 집중용)
- **타이포그래피:** 가독성이 좋고 현대적인 Sans-serif 폰트 (Inter)
- **시각 효과:** 
  - Glassmorphism 적용 완료
  - SVG 필터를 이용한 Subtle Noise Texture 배경 적용 완료

### 핵심 기능
1. **Zen Timer (뽀모도로):** [구현 완료]
   - 25분 / 5분 / 15분 모드 지원.
   - SVG Circle 기반의 시각적 프로그레스 바.
2. **Ambient Mixer:** [구현 완료]
   - 4가지 환경음(빗소리, 숲, 파도, 불꽃) 믹싱 기능.
   - 개별 볼륨 조절 및 재생/정지 제어.
3. **Simple Tasks:** [구현 완료]
   - LocalStorage 연동 할 일 목록.
   - 작업 추가, 체크, 삭제 기능.
4. **Full Screen Mode:** [구현 완료]
   - 브라우저 Fullscreen API 연동.

## 3. 현재 작업 계획 (Current Plan)
- [x] 기초 구조 설정 (`index.html`, `style.css`, `main.js`)
- [x] 배경 및 레이아웃 (Glassmorphism 적용) 구현
- [x] `FocusTimer` 웹 컴포넌트 개발
- [x] `SoundMixer` 웹 컴포넌트 개발
- [x] 할 일 목록 UI 및 로직 구현
- [ ] 반응형 레이아웃 세부 튜닝 및 애니메이션 강화
- [ ] 브라우저 알림(Notification API) 추가 (선택 사항)
