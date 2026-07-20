# HS.Portfolio

**H.S. Hwang** · Web Publishing & Design Portfolio

HTML, CSS, JavaScript로 제작한 멀티페이지 정적 포트폴리오입니다. Publishing 프로젝트와 Figma·Photoshop Design Works를 Entry에서 구분하고, 반응형 탐색 구조와 접근성 상태를 함께 정리했습니다.

## 주요 구조

### Entry

`index.html`에서 Publishing과 Design 영역으로 진입합니다.

### Publishing Home

`home.html`은 포트폴리오의 Publishing overview입니다.

- Hero와 PC·Mobile mockup
- Profile summary
- HS.Portfolio featured project
- Design Works 진입
- Contact CTA

### Projects

- `projects.html` — HS.Portfolio 대표 프로젝트 showcase
- `project-hs-portfolio.html` — 역할, 기술, Publishing Point, 결과를 정리한 case study

### Profile

`profile.html`에서 H.S. Hwang의 Introduction, Journey, Focus, Tools, Direction을 소개합니다.

### Design

`design.html`은 Figma / Photoshop visual gateway와 Selected Works를 제공합니다.

### Figma

- `design-figma.html` — NewSen 작업 진입
- `design-figma-newsen.html` — NewSen 상세와 이미지 lightbox

### Photoshop

`design-photoshop.html`은 7개 작업을 제공하는 image-first gallery입니다.

- 카드형 / 목록형을 같은 페이지에서 전환
- featured 1개와 나머지 작업의 시각 계층
- 각 작업의 image-first detail page

### Contact

`contact.html`은 공개 이메일과 활동 정보를 제공하는 Contact 페이지입니다. Projects / Publishing Home 복귀 동선과 이메일 문의 CTA를 안내합니다.

## 사이트맵 (18)

### Entry / Publishing

| 파일 | 역할 |
|---|---|
| `index.html` | Publishing / Design Entry |
| `home.html` | Publishing Home |
| `profile.html` | Introduction, Journey, Focus, Tools, Direction |
| `projects.html` | HS.Portfolio project showcase |
| `project-hs-portfolio.html` | Publishing case study |
| `contact.html` | Public contact information |

### Design / Figma

| 파일 | 역할 |
|---|---|
| `design.html` | Figma / Photoshop gateway와 Selected Works |
| `design-figma.html` | Figma Works |
| `design-figma-newsen.html` | NewSen detail + lightbox |

### Photoshop

| 파일 | 역할 |
|---|---|
| `design-photoshop.html` | 7개 작업 gallery + card/list toggle |
| `design-agreable.html` | Agreable detail |
| `design-car-camping.html` | 취향저격 차박캠핑 detail |
| `design-peeling-gel.html` | Pure Skin Peeling Gel detail |
| `design-film.html` | Film Graphic detail |
| `design-review-coupon.html` | 리뷰 쿠폰 이벤트 배너 detail |
| `design-summer-sale.html` | SUMMER SALE detail |
| `design-pet-banner.html` | 반려동물 소개 배너 detail |

### Legacy

| 파일 | 역할 |
|---|---|
| `design-photoshop-list.html` | 직접 접근용 Legacy 안내 페이지 |

`design-photoshop-list.html`은 삭제되거나 자동 redirect되지 않습니다. 주요 사용자 동선에서는 노출하지 않으며, 목록형 보기는 `design-photoshop.html` 내부 toggle을 사용합니다.

## 기술 스택

- HTML
- CSS
- JavaScript
- AOS 2.3.1
- GitHub Pages
- Figma
- Photoshop

## 구현 기능

- 멀티페이지 정적 포트폴리오
- Desktop / tablet / mobile 반응형 레이아웃
- Desktop dropdown navigation
- Mobile offcanvas navigation과 keyboard focus 순환
- AOS animation과 로드 실패 fallback
- `prefers-reduced-motion` 대응
- Home hero mockup tilt
- Photoshop card/list view toggle
- Figma image lightbox
- Keyboard focus와 ARIA 상태 보정
- Image-first gallery / detail presentation

## 로컬 실행

저장소를 다운로드하거나 제공된 저장소 URL로 clone한 뒤 프로젝트 루트에서 정적 서버를 실행합니다.

Python 3가 있는 경우:

```bash
python -m http.server 8000
```

그다음 브라우저에서 다음 주소로 진입합니다.

```text
http://localhost:8000/index.html
```

VS Code Live Server 등 다른 정적 서버를 사용해도 됩니다. Git이 없는 환경에서는 압축 파일을 내려받아 같은 방식으로 확인할 수 있습니다.

## 배포

별도 빌드 과정이 없는 정적 사이트 구조이며 GitHub Pages에 배포할 수 있습니다. 배포 자동화 스크립트는 포함하지 않습니다.

공개 배포 아티팩트에는 루트 HTML, `css/`, `js/`, `images/`와 필요한 공개 문서만 포함하고 내부 작업 메모는 제외합니다.

## 외부 의존성

AOS 2.3.1의 CSS와 JavaScript를 CDN에서 불러옵니다.

- 네트워크가 차단되거나 CDN 로드가 실패하면 기존 fallback이 AOS 대상 콘텐츠를 표시합니다.
- `prefers-reduced-motion` 환경에서는 과도한 움직임을 줄입니다.
- 완전한 오프라인 배포가 필요하면 AOS 파일의 로컬 자산화를 별도로 검토할 수 있습니다.

## 배포 전 확인 항목

| 항목 | 현재 상태 |
|---|---|
| `index.html` Entry | QA 완료 |
| 내부 링크 | 오류 0 |
| 로컬 이미지 경로 | 오류 0 |
| 390px 모바일 overflow | 오류 0 |
| Desktop navigation | QA 완료, 실기기 최종 확인 권장 |
| Mobile offcanvas | focus 보정 완료, 실기기 최종 확인 권장 |
| Photoshop card/list toggle | QA 완료 |
| Figma lightbox | QA 완료 |
| AOS CDN / fallback | 코드 확인 완료, 배포 네트워크 재확인 권장 |
| Contact 공개 채널 | 공개 이메일·활동 정보 안내 |
| `design-photoshop-list.html` | Legacy / 주요 동선 미노출 |

## 공개 정보

- 공개명: **H.S. Hwang**
- 로고·축약 표기: **HS**
- 공개 연락은 Contact 페이지에서 안내합니다.
- 전화번호·상세 주소·비공개 계정 정보는 포함하지 않습니다.
