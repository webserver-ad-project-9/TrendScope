# 컴포넌트 및 모듈 문서 - TrendScope-front

프로젝트 단위를 어떻게 분리하고 재사용하는지 기록한다.

## 분리 기준
- 공통 단위:
- 기능 전용 단위:
- Service/Application 단위:
- Repository/Adapter 단위:
- UI 또는 Presentation 단위:

## 계약 규칙
- Props 또는 입력 모델 규칙:
- 출력/result 모델 규칙:
- 재사용 기준:
- 소유 경계:

## 프로필 메모

### React
- 컴포넌트 안에서 fetch/axios 호출을 직접 수행하지 않는다.
- 복잡한 상태 전이는 hook 또는 store action으로 분리한다.
- 공통 UI 컴포넌트와 기능 전용 컴포넌트를 분리한다.
- API 타입과 UI view model의 변환 위치를 명확히 둔다.
