# 44장 REST API

---

REST는 HTTP를 기반으로 클라이언트가 서버의 리소스에 접근하는 방식을 규정한 아키텍처고, REST API는 REST를 기반으로 서비스 API를 구현한 것을 뜻한다.

&nbsp;

**44.1 REST API의 구성**

REST API는 자원(Resource), 행위(Verb), 표현(Representations)의 3가지 요소로 구성된다. REST는 자체 표현 구조로 구성되어 REST API만으로 HTTP 요청의 내용을 이해할 수 있다.

| 구성 요소 | 내용                           | 표현 방법        |
| --------- | ------------------------------ | ---------------- |
| 자원      | 자원                           | URI(엔드포인트)  |
| 행위      | 자원에 대한 행위               | HTTP 요청 메서드 |
| 표현      | 자원에 대한 행위의 구체적 내용 | 페이로드         |

&nbsp;

**44.2 REST API 설계 원칙**

REST에서 가장 중요한 원칙은 **_“URI는 리소스를 표현하는 데 집중하고 행위에 대한 정의는 HTTP 요청 메서드를 통해 하는 것”_** 이다.

1. URI는 리소스를 표현하는 데 집중해야 한다. 리소스를 식별할 수 있는 이름은 동사보다는 명사를 사용한다.
2. 리소스에 대한 행위는 HTTP 요청 메서드로 표현한다. HTTP 요청 메서드는 클라이언트가 서버에게 요청의 종류와 목적(리소스에 대한 행위)을 알리는 방법이다.

&nbsp;

**44.3 JSON Server를 이용한 REST API 실습**

JSON Server를 사용해서 가상 REST API 서버를 구축하여 HTTP 요청을 전송하고 응답을 받는 실습 내용이다.

먼저 JSON Server를 설치하고 리소스를 제공하는 데이터베이스 역할을 수행할 db.json 파일을 생성했다.

```json
//  db.json 파일
{
  "todos": [
    {
      "id": 1,
      "content": "HTML",
      "completed": true
    },
    {
      "id": 2,
      "content": "CSS",
      "completed": false
    },
    {
      "id": 3,
      "content": "JavaScript",
      "completed": true
    }
  ]
}
```

$ json-server —watch db.json 명령어를 통해 JSON Server를 실행해보면 3개의 리소스가 잘 들어간 것을 확인할 수 있다.

![rest1](https://github.com/user-attachments/assets/4231cc95-94b6-4f10-873f-5da292b02b0a)

이제 todos 리소스에서 모든 todo를 취득(index)해보자. 그러기 위해 public 폴더에 get_index.html을 추가하고 JSON Server를 실행하도록 했다.

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <pre></pre>
    <script>
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "/todos");

      //  HTTP GET 요청 전송
      xhr.send();

      xhr.onload = () => {
        if (xhr.status === 200) {
          document.querySelector("pre").textContent = xhr.response;
        } else {
          console.error("Error", xhr.status, xhr.statusText);
        }
      };
    </script>
  </body>
</html>
```

![rest2](https://github.com/user-attachments/assets/07cc2f4f-147b-4197-aa0a-62e48ea621ca)

보다시피 모든 리소스를 취득한 것을 확인할 수 있다. 특정한 리소스를 취득하고 싶다면 **_“xhr.open(’GET’, ‘/todos/1’)”_** 처럼 취득하고 싶은 리소스를 특정 지으면 된다.

만약 todos 리소스에 새로운 todo를 생성하고 싶다면, POST 요청을 수행하면 된다. POST 요청 시에는 setRequestHeader 메서드를 이용해서 요청 몸체에 담아 서버로 전송할 페이로드의 MIME 타입을 지정하면 된다.

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <pre></pre>
    <script>
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/todos");

      //  요청 몸체에 담아 서버로 전송할 페이로드의 MIME 타입을 지정
      xhr.setRequestHeader("content-type", "application/json");

      //  HTTP POST 요청 전송
      xhr.send(JSON.stringify({ id: 4, content: "React", completed: false }));

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          document.querySelector("pre").textContent = xhr.response;
        } else {
          console.error("Error", xhr.status, xhr.statusText);
        }
      };
    </script>
  </body>
</html>
```

![rest3](https://github.com/user-attachments/assets/d191cf01-6a20-4a36-92b3-33b57006e072)

특정 리소스 전체를 교체하고 싶으면 PUT 요청을 하면 된다. 아래 코드는 todos 리소스에서 id가 4인 todo를 특정해서 id를 제외한 리소스 전체를 교체한다.

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <pre></pre>
    <script>
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", "/todos/4");

      //  요청 몸체에 담아 서버로 전송할 페이로드의 MIME 타입을 지정
      xhr.setRequestHeader("content-type", "application/json");

      //  HTTP PUT 요청 전송(content와 completed 리소스 교체)
      xhr.send(JSON.stringify({ id: 4, content: "Angular", completed: true }));

      xhr.onload = () => {
        if (xhr.status === 200) {
          document.querySelector("pre").textContent = xhr.response;
        } else {
          console.error("Error", xhr.status, xhr.statusText);
        }
      };
    </script>
  </body>
</html>
```

![rest4](https://github.com/user-attachments/assets/f211ea11-03ed-4fde-ae8e-4987e7b10551)

다음으로, 특정 리소스의 일부를 수정할 때는 PATCH 메서드를 사용하면 된다. 아래 코드는 todos의 리소스의 id로 todo를 특정해서 completed만 수정한다.

```html
<html lang="en">
  <body>
    <pre></pre>
    <script>
      const xhr = new XMLHttpRequest();
      xhr.open("PATCH", "/todos/4");

      //  요청 몸체에 담아 서버로 전송할 페이로드의 MIME 타입을 지정
      xhr.setRequestHeader("content-type", "application/json");

      //  HTTP PATCH 요청 전송(completed 리소스만 수정)
      xhr.send(JSON.stringify({ completed: false }));

      xhr.onload = () => {
        if (xhr.status === 200) {
          document.querySelector("pre").textContent = xhr.response;
        } else {
          console.error("Error", xhr.status, xhr.statusText);
        }
      };
    </script>
  </body>
</html>
```

마지막으로 리소스를 삭제하고 싶을 경우 DELETE 메서드를 사용한다. 아래 코드는 todos에서 id가 4인 todo 리소스를 삭제한다.

```html
<html lang="en"></html>
<body>
  <pre></pre>
  <script>
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/todos/4');

    //  HTTP DELETE 요청 전송
    xhr.send();

    xhr.onload = () => {
      if (xhr.status === 200) {
        document.querySelector('pre').textContent = xhr.response;
      } else {
        console.error('Error', xhr.status, xhr.statusText);
      }
    };
  </script>
</body>
</html>
```
