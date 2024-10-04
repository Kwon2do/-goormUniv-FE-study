애플리케이션의 페이지 중 직접 작업한 밸런스 게임 파일이다. 백엔드에서 밸런스 게임 리스트들을 받아서 유저에게 하나씩 제시해주는 것이다. 작업 당시 리스트 안에 있는 항목들은 고정되어 있었고, 리스트를 모두 순회하면 다시 나왔던 게임들이 나오게 되는 메커니즘이어서 자동으로 캐싱해주는 React Query를 사용해서 렌더링 시간을 줄이는게 적절하다는 판단을 했다.

```jsx
import React, { useState, useEffect } from 'react';
import { LargeButton } from 'components/Button/Button';
import NavBar from 'components/NavBar';
import Description from 'components/ToolTips/Description';
import EtcBox from 'components/box/EtcBox';
import { useQuery } from 'react-query';
import { BalancegameResponse } from 'types/BalancegameResponse';
import { getBalancegames } from 'hooks/useBalance';
import { Balancegame } from 'types/Balancegame.type';

// React Query 사용
const BalanceGame: React.FC = () => {
  const { data, error, isLoading } = useQuery<BalancegameResponse, Error>('games', getBalancegames);

  /*
  이 부분을 대체
  const [balanceGame, setBalanceGame] = useState([]);
  useEffect(() => {
	  (async () => {
	  const response = await axios("...");
	  setBalanceGame(response);
	  ...
	  })();
  }, []);
  */

  if (error) {
    console.log(error.message);
  }

  if (data) {
    console.log(data);
  }

  const [balanceList, setBalanceList] = useState<Balancegame[]>([]);

  useEffect(() => {
    if (data) {
      setBalanceList(data.games);
    }
  }, [data]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleNextQuestion = () => {
    if (balanceList) {
      setCurrentQuestion((prev) => (prev + 1) % balanceList?.length);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col w-[375px] h-[860px] p-4 bg-background_color relative">
        <div className="mt-[30px]">
          <NavBar subject="vs" />
          <div className="flex flex-col justify-center items-center ">
            <div className="h-[196px]">
              <EtcBox
                subject="balance"
                color="main"
                balance={balanceList[currentQuestion]?.question_a}
              />
            </div>
            <img src="/assets/red-vs.svg" alt="red-vs" className="h-[48px] w-[48px]" />
            <div className="h-[196px]">
              <EtcBox
                subject="balance"
                color="main"
                balance={balanceList[currentQuestion]?.question_b}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="absolute flex flex-col justify-center items-center w-[350px] bottom-[70px]">
              <Description text="어떤 걸 고를까요?" />
              <img className="mb-[-45px]" src="/assets/GoormCharacter.svg" alt="goorm-character" />
              <LargeButton text="다른 게임 할래요" onClick={handleNextQuestion} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceGame;
```

&nbsp;

여기서 데이터를 가져올 때의 방식이 독특했다. 먼저 HTTP 요청을 수행하는 API 클라이언트를 설정하는 코드를 작성했다. 그리고 .env 파일에 저장한 서버 URL을 baseURL로 설정하고, 사용자가 로그인 상태를 유지할 수 있게 Axios 요청 시 쿠키가 자동으로 포함되도록 설정했다. 그리고 Axios 인스턴스를 생성함으로써 모든 HTTP 요청을 설정한 baseURL로 가도록 했다.

```tsx
// defaultAxios.ts 파일

import axios, { AxiosInstance } from "axios";

// API 요청의 기본 URL을 지정
interface DefaultConfigure {
  baseURL: string | undefined;
}

// .env 파일에 저장된 서버 URL
const defaultConfigure: DefaultConfigure = {
  baseURL: process.env.REACT_APP_API_SERVER_URL,
};

// 인증이 필요한 요청에서 쿠키를 자동으로 포함해 서버와 통신하도록 Axios 설정
axios.defaults.withCredentials = true;

// Axios 인스턴스 생성
const defaultAxios: AxiosInstance = axios.create(defaultConfigure);

// defaultAxios 내보내기
export { defaultAxios };
```

&nbsp;

그리고 페이지 별로 각 페이지에 해당하는 API 엔드포인트만 작성하면 각 페이지에 필요한 데이터를 가져오는 getBalancegames라는 비동기 함수를 따로 빼서 관리하도록 했다.

```tsx
// useBalance.tsx 파일

import { defaultAxios } from "../axios/defaultAxios"; // 상대 경로로 수정
import { BalancegameResponse } from "types/BalancegameResponse";

//  API 엔드포인트에서 데이터를 가져오는 비동기 함수
export const getBalancegames = async (): Promise<BalancegameResponse> => {
  const response = await defaultAxios.get<BalancegameResponse>(
    `/api/v1/balance-game`
  );
  return response.data;
};
```

&nbsp;

하지만, 백엔드에서 데이터를 가져오는데는 성공(status은 200인 것 확인)했지만, 오류 발생가 발생했다.

```tsx
// GPT 검색 내용
`Uncaught TypeError: Cannot read properties of undefined (reading '0')` 오류는 주로 `balanceList` 배열이 비어 있거나 정의되지 않았을 때, 해당 배열의 요소에 접근하려고 할 때 발생합니다. 이 오류를 해결하기 위해, 다음과 같은 방법을 사용할 수 있습니다:

1. **초기 상태 설정**: `balanceList`의 초기 상태를 빈 배열로 설정합니다. 이미 그렇게 설정하셨으니 이 부분은 올바릅니다.
2. **조건부 렌더링**: 컴포넌트가 렌더링될 때 `balanceList`가 비어 있거나 `undefined`가 아닐 때만 질문을 표시하도록 조건부 렌더링을 사용합니다. `currentQuestion` 인덱스가 `balanceList.length`보다 작은지 확인하여 배열에 접근합니다.

추가 에러 메시지

:

react-dom.development.js:18704 The above error occurred in the <BalanceGame> component:

    at BalanceGame (http://localhost:3000/static/js/bundle.js:2454:60)
    at Route (http://localhost:3000/static/js/bundle.js:42790:29)
    at Switch (http://localhost:3000/static/js/bundle.js:42959:29)
    at AppRoutes
    at Router (http://localhost:3000/static/js/bundle.js:42462:30)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:42126:35)
    at QueryClientProvider (http://localhost:3000/static/js/bundle.js:40804:21)
    at div
    at div
    at App

에러 메시지에서 `BalanceGame` 컴포넌트에서 오류가 발생했음을 알 수 있습니다. 이 문제는 여러 가지 원인으로 발생할 수 있으며, 특히 `balanceList` 배열에 접근할 때 배열의 길이를 확인하지 않았거나, `data`가 로드되기 전에 접근하려고 할 때 발생할 수 있습니다.
```

&nbsp;

이 문제의 해결 방법은 결국 “타입” 에 있었다. 경험이 부족한 것도 있었겠지만, API 명세서의 데이터 타입과 실제 서버에 존재하는 데이터의 타입과 변수명이 달라서 발생한 문제였다. 타입스크립트를 사용한 만큼 데이터 타입에 대해 신중해야 한다는 것을 다시 한번 깨달았다.

&nbsp;

그렇게 때문에 틈틈이 데이터가 어떻게 생겼는지 체크하는 것이 바람직할 것 같다. 알아차리긴 조금 힘들었지만, 결국 앞서 발생한 문제도 콘솔에 찍어보고 API 명세서와 비교하면 되는 해결되는 문제였기 때문이다.

```jsx
import { SmalltalkResponse } from "types/SmalltalkResponse";
import { defaultAxios } from "../axios/defaultAxios"; // 상대 경로로 수정

export const getSmalltalks = async (): Promise<SmalltalkResponse> => {
  const response =
    (await defaultAxios.get) < SmalltalkResponse > `/api/v1/talk_subject`;

  //  이런 식으로 response.data 찍어보기
  if (response.data) {
    console.log(response.data);
  }
  return response.data;
};
```
