React의 포인트는 무엇일까? **_바로 UI를 아주 간단한 방식으로 interactive하게 만들어 준다._** 버튼을 몇 번 클릭했는지 보여주는 어플을 자바스크립트 방식과 React 방식을 비교해보면 자바스크립트는 HTML을 먼저 만들고, element를 가져온 후, event를 감지하고 데이터를 업데이트한다.

&nbsp;

```html
<!DOCTYPE html>
<html>
  <body>
    <span>Total clicks: 0</span>
    <button id="btn">Click me!</button>
  </body>
  <script>
    const button = document.getElementById("btn");
    let counter = 0;
    function handleClick() {
      const span = document.querySelector("span");
      console.log("I have been clicked...");
      counter += 1;
      span.innerText = `Total clicks: ${counter}`;
    }

    button.addEventListener("click", handleClick);
  </script>
</html>
```

&nbsp;

순수 React는 HTML을 직접 작성하지 않는 대신, 자바스크립트 코드를 사용한다.

```jsx
const span = React.createElement("span");
```

&nbsp;

순수 React는 이런 방식으로 span이라는 React 컴포넌트를 생성한다. 이제 컴포넌트를 생성했으니 HTML body 안에 컴포넌트를 배치시켜야 하는데 바로 이때 React-DOM을 사용해야 한다.

```jsx
const span = React.createElement(
  "span",
  { id: "span", style: { color: "tomato" } },
  "Hello, I'm a span!"
); //  element를 만들고 id 부여하기

const root = document.getElementById("root");
ReactDOM.render(span, root); //  root 안에 넣기
```

&nbsp;

정리하자면, 자바스크립트에서는 HTML을 먼저 만들고 그걸 가져 와서 HTML을 수정하는 방식이었지만, React에서는 모든 게 자바스크립트로 시작해서 HTML로 끝나는 것이다.

&nbsp;

하지만, 코드를 보면 전혀 간단해지지 않은 것처럼 보인다. JSX를 사용해보자.

```jsx
const Title = (
  <h3 id="title" onMouseEnter={() => console.log("Mouse enter!")}>
    Hello I'm a title
  </h3>
);
```

보다시피 일반적인 HTML과 거의 똑같이 생겼다. 하지만 이 코드를 브라우저에서 실행해보면 에러가 발생하는데, 그 이유는 브라우저가 온전히 JSX를 이해하지 못해서 발생하는 문제다.

여기서 Babel을 이용해서 JSX로 작성한 코드를 브라우저가 이해할 수 있는 형태로 바꿔줘야 한다. JSX 코드를 변환해보면 아까 위에서 했던 어려운 방식으로 코드가 변환된다.

&nbsp;

그럼 이제 JSX를 React 컴포넌트를 작성하고 나서 어떻게 배치해야 하는지에 대한 문제가 남아 있다. 매우 간단하다. 함수로 작성된 React 컴포넌트를 일반적인 HTML 태그인 것처럼 사용하면 된다. 다만, 일반 HTML 코드와 구별해주기 위해서 컴포넌트의 첫 글자는 반드시 대문자여야 한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>
  </body>
  <script src="https://unpkg.com/react@17.0.2/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script type="text/babel">
    const root = document.getElementById("root");

    const Title = () => (
      <h3 id="title" onMouseEnter={() => console.log("Mouse enter!")}>
        Hello I'm a title!
      </h3>
    );

    const Button = () => (
      <button
        style={{
          backgroundColor: "tomato",
        }}
        onClick={() => console.log("I'm clicked...")}
      >
        Click me
      </button>
    );

    const Container = () => (
      <div>
        <Title></Title> // Component의 첫 글자는 대문자
        <Button></Button> // Component의 첫 글자는 대문자
      </div>
    );

    ReactDOM.render(<Container />, root);
  </script>
</html>
```

추가로, React 컴포넌트들은 div나 Fragment(<>) 안에 렌더링 되어야 한다. 왜냐하면 React의 컴포넌트가 하나의 단일한 부모 요소를 반환해야 하기 때문이다.

리액트는 컴포넌트를 렌더링할 때 DOM 요소들을 계층적으로 구조화해서 렌더링한다. 이 구조에서는 하나의 컴포넌트는 반드시 하나의 부모 요소를 반환해야만 정상적으로 동작한다.

&nbsp;

---

**_<React의 State>_**

State는 데이터가 저장되는 곳이다. 먼저 아래의 코드를 살펴보자.

```jsx
const Container = () => {
  <div>
    <h3>Total clicks : 0</h3>
    <button onClick={countUp}>Click me</button>
  </div>;
};

let counter = 0;
function countUp() {
  counter = counter + 1;
}

ReactDOM.render(<Container />, root);
```

&nbsp;

이 코드는 EventListener가 동작해서 클릭 수는 올라가지만, UI가 업데이트되지 않는다. 왜냐하면 컴포넌트를 딱 한번만 렌더링하기 때문이다. 위의 코드로는 React에 상태 변화가 있다는 것을 알려줄 방법이 없다.

&nbsp;

React에게 데이터를 어디에 담을 건지 알려주면서, 그 데이터를 조작할 수 있었으면 좋겠다. 이때 **_“useState hook”_** 을 사용하는 것이다.

```jsx
const data = React.useState();
```

콘솔로 data를 찍어보면, [undefined, f]와 같이 배열 하나를 얻을 수 있다. 여기서 undefined가 데이터가 담길 공간이고, f가 그 데이터를 조작할 때 사용될 함수다.

&nbsp;

이 둘을 효율적으로 다루기 위해 "구조 분해 할당" 을 사용하도록 하자.

```jsx
import React, { useState } from "react";

const Container = () => {
  const [counter, setCounter] = useState(0); //  counter의 초깃값은 0

  const onClick = () => {
    setCounter(counter + 1); //  counter 숫자 하나 증가시켜주기
  };

  return (
    <div>
      <h3>Total clicks: {counter}</h3>
      <button onClick={onClick}>Click me!</button> // 이벤트 리스너 onClick
    </div>
  );
};

export default Container;
```

&nbsp;

---

**_<React의 Props>_**

Props는 부모 컴포넌트로부터 자식 컴포넌트에 데이터를 보낼 수 있게 해주는 일종의 방식이다.

```jsx
//  Btn Component 하나 만들기

function Btn({ text }) {
  return (
    <button
      style={{
        backgroundColor: tomato,
        color: white,
        border: 0,
      }}
    >
      {text}
    </button>
  );
}

//  사용하고 싶은 곳에 Btn Component 사용
function App() {
  return;
  <div>
    <Btn text="Save Changes" /> // text를 Btn에게 보낸다.
    <Btn text="Continue" /> // text를 Btn에게 보낸다.
  </div>;
}
```

&nbsp;

syntax로 Btn 컴포넌트에게 데이터를 전달해서 설정하고 재사용할 수 있다는 의미다. 내가 만들고 사용하는 모든 컴포넌트들은, 현재 Btn 컴포넌트에서 argument(인자)를 받는다. 저 argument 이름이 바로 Props다. 추가로 Props는 Object다. 현재는 text만 전달했지만, 원한다면 더 많은 데이터를 전달할 수 있다.

&nbsp;

---

지금까지 봤듯이 React에서 State가 변화할 때 모든 컴포넌트들은 다시 실행되고, 모든 코드들도 다시 실행돼서 업데이트된 데이터들을 보게 될 것이다. 하지만, 경우에 따라 컴포넌트가 처음 렌더링될 때만 코드가 실행되기를 원할 수도 있다.

&nbsp;

이때 **_“useEffect hook”_** 을 사용하면 된다.

```jsx
import { useState, useEffect } from "react";

function App() {
  const [counter, setValue] = useState(0);
  const onClick = () => setValue((prev) => prev + 1);
  console.log("I run all the time");
  useEffect(() => {
    console.log("Call the API...");
  }, []);
  return (
    <div>
      <h1>{counter}</h1>
      <button onClick={onClick}>Click me!</button>
    </div>
  );
}

export default App;
```

useEffect의 첫 번째 argument는 실행하고 싶은 코드이고, 두 번째 argument는 "Dependency" 라는 array인데 어떤 값이 변할 때 코드를 실행할 것인지 React에게 말해주는 대상이다.

위의 코드를 실행하면 "I run all the time"은 컴포넌트가 렌더링될 때마다 실행되는 반면, "Call the API..."는 딱 한번만 실행되게 된다.
