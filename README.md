# Ad Performance Report

### 실행 방법
yarn install \
yarn build \
yarn start

---

### 기술스팩
- ES6
- Next.js
- React.js
- Redux
- Redux-saga
- styled-components

API는 express로 웹 서버를 띄우고, Next.js 에서 커스텀한 express 서버로 바꿔서 띄웁니다.

data는 'static/csv/*.csv' 파일에서 가져오며,

데이터 GET API는 단 한개로 '/api/data'
query string

- data : Json string Array

빈 어레이 일시, 모든 csv 파일 정보 GET