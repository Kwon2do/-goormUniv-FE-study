**43.1 Ajax란?**

**_“Ajax(Asynchronous JavaScript and XML)”_** 는 자바스크립트를 사용해서 **브라우저가 서버에게 “비동기 방식” 으로 데이터를 요청하고,** 서버가 응답한 데이터를 수신하여 웹페이지를 동적으로 갱신하는 프로그래밍 방식을 뜻한다. Ajax는 브라우저에서 제공하는 Web API인 XMLHttpRequest 객체를 기반으로 동작한다. 이 객체는 HTTP 비동기 통신을 위한 메서드와 프로퍼티를 제공한다.

예전의 웹페이지는 완전한 HTML을 서버로부터 전송 받아서 웹페이지 전체를 처음부터 다시 렌더링하는 방식으로 동작했다. 이는 변경할 필요가 없는 데이터까지 매번 다시 전송받아 처음부터 다시 렌더링하기 때문에 화면이 순간적으로 깜박이는 현상이 발생한다. 또한, 클라이언트와 서버와의 통신이 **_“동기 방식”_** 으로 동작하기 때문에 서버로부터 응답이 있을 때까지 다음 처리는 블로킹된다.

Ajax가 등장하고 서버로부터 웹페이지의 변경에 필요한 데이터만 **_“비동기 방식”_** 으로 전송받아 웹페이지를 변경할 필요가 있는 부분만 한정적으로 렌더링하는 방식이 가능해졌다. 이를 통해 브라우저에서도 데스크톱 애플리케이션과 유사한 빠른 퍼포먼스와 부드러운 화면 전환이 가능해졌다.

&nbsp;

**43.2 JSON**

“JSON(JavaScript Object Notation)” 은 클라이언트와 서버 간의 HTTP 통신을 위한 텍스트 데이터 포맷이다. JSON은 객체와 유사하게 “키와 값” 으로 구성된 순수한 텍스트다.

```json
{
  "name": "Lee",
  "age": 20,
  "alive": true,
  "hobby": ["traveling", "tennis"]
}
```

JSON.stringify 메서드를 통해 객체를 JSON 포맷의 문자열로 변환할 수 있다. 클라이언트가 서버로 객체를 전송하려면 객체를 문자열화해야 하는데 이를 **_“직렬화(Serializing)”_** 라 한다.

```jsx
const obj = {
  name: "Lee",
  age: 20,
  alive: true,
  hobby: ["traveling", "tennis"],
};

//  객체를 JSON 포맷의 문자열로 변환
const json = JSON.stringify(obj);
console.log(json);
//  string {"name":"Lee", "age":20, "alive":true, "hobby":["traveling", "tennis"] }

//  replacer 함수를 통해 값의 타입에 따라 데이터를 필터링할 수도 있다.
const filter = (key, value) => {
  return typeof value === "number" ? undefined : value;
};

const strFilteredObject = JSON.stringify(obj, filter, 2);
console.log(typeof strFilteredObject, strFilteredObject);

/*
string {
	"name":"Lee",
	"age" : 20,
	"alive" : true,
	"hobby" : [
		"traveling",
		"tennis"
	]
}
*/

//  JSON.stringify 메서드는 배열도 JSON 포맷의 문자열로 변환이 가능하다.
```

JSON.parse 메서드를 통해 JSON 포맷의 문자열을 객체로 다시 변환할 수도 있다. 이 메서드를 통해 서버로부터 받아온 JSON 데이터를 다시 사용할 수 있다. 이 과정을 **_“역직렬화(Deserializing)”_** 라 한다.

```jsx
const obj = {
  name: "Lee",
  age: 20,
  alive: true,
  hobby: ["traveling", "tennis"],
};

//  직렬화 과정
const json = JSON.stringify(obj);

//  역직렬화 과정
const parsed_json = JSON.parse(json);
console.log(typeof parsed_json, parsed_json);
//  object {"name" : "Lee", "age" : 20, "alive" : true, "hobby" : ["traveling", "tennis"]}
```

&nbsp;

**43.3 XMLHttpRequest**

위에서 언급했듯이 자바스크립트를 사용해서 HTTP 요청을 전송하려면 XMLHttpRequest 객체를 사용해야 한다. 이 객체는 HTTP 요청 전송과 HTTP 응답 수신을 위한 다양한 메서드와 프로퍼티를 제공한다.

HTTP 요청을 전송하는 코드를 살펴보자.

```jsx
//  XMLHttpRequest 객체 생성
const xhr = new XMLHttpRequest();

//  서버에 전송할 HTTP 요청 초기화
xhr.open("GET", "/users");

//  HTTP 요청의 헤더 값을 설정
//  클라이언트가 서버로 전송할 데이터의 MIME 타입 지정: json
xhr.setRequestHeader("content-type", "application/json");

//  HTTP 요청을 서버로 전송
xhr.send();
```

이후에 서버로부터 받은 응답을 처리하려면 XMLHttpRequest 객체가 발생시키는 이벤트를 캐치해야 한다. XMLHttpRequest 객체는 onreadystatechange, onload, onerror 같은 이벤트 핸들러 프로퍼티를 갖는데 이 중에서 HTTP 요청의 현재 상태를 나타내는 readyState 프로퍼티 값이 변경된 경우 발생하는 readystatechange 이벤트를 캐치해서 아래와 같이 HTTP 응답을 처리할 수 있다.

```jsx
//  XMLHttpRequest 객체 생성
const xhr = new XMLHttpRequest();

//  서버에 전송할 HTTP 요청 초기화
xhr.open("GET", "https://jsonplaceholder.typicode.com/todos/1");

xhr.send();

xhr.onreadystatechange = () => {
  if (xhr.readyState !== XMLHttpRequest.DONE) return;

  if (xhr.status === 200) {
    console.log(JSON.parse(xhr.response));
  } else {
    console.error("Error", xhr.status, xhr.statusText);
  }
};
```

![ajax](https://github.com/user-attachments/assets/41b409a5-bec1-44d8-93da-a0493155f431)

send 메서드를 통해 HTTP 요청을 서버에 전송하면 서버는 응답을 반환하는데 언제 응답이 클라이언트에 도달하는지는 알 수 없다. 따라서 **readystatechange 이벤트를 통해 HTTP 요청의 현재 상태를 확인**해야 한다. readystatechange 이벤트는 HTTP 요청의 현재 상태를 나타내는 readyState 프로퍼티가 변경될 때마다 발생한다.

onreadystatechange 이벤트 핸들러 프로퍼티에 할당한 이벤트 핸들러는 HTTP 요청의 현재 상태를 나타내는 xhr.readyState가 XMLHttpRequest.DONE 인지 확인해서 서버의 응답이 완료되었는지 확인한다.

서버의 응답이 완료되면 HTTP 요청에 대한 응답 상태를 나타내는 xhr.status가 **_“200”_** 인지 확인해서 정상 처리와 에러 처리를 구분한다. HTTP 요청에 대한 응답이 정상적으로 도착했다면 요청에 대한 응답 몸체를 나타내는 xhr.response 에서 서버가 전송한 데이터를 뽑아낸다. 만약 xhr.status가 200이 아니라면 에러가 발생한 상태이므로 필요한 에러 처리를 하면 된다.

readystatechange 이벤트 대신에 load 이벤트를 캐치해도 좋다. load 이벤트는 HTTP 요청이 성공적으로 완료된 경우 발생한다. 따라서 이 이벤트를 캐치하면 xhr.readyState가 XMLHttpRequest.DONE 인지 확인할 필요가 없다.

```jsx
const xhr = new XMLHttpRequest();
xhr.open("GET", "https://jsonplaceholder.typicode.com/todos/1");

xhr.send();

xhr.onload = () => {
  if (xhr.status === 200) {
    console.log(JSON.parse(xhr.response));
  } else {
    console.error("Error", xhr.status, xhr.statusText);
  }
};

//  위의 readystatechange 이벤트를 캐치하는 경우와 결과가 동일하다.
```
