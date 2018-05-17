![logo alt >](https://ho4040.github.io/ho-lang/res/logo.png)

# ho-lang



간단한 공식을 계산 할 수 있는 라이브러리 입니다.

JS로 제작한 간단한 언어 입니다. 데모는 [이곳](https://ho4040.github.io/ho-lang/) 에서 볼 수 있습니다.

# 라이브러리 사용법

### bower 로 설치

```bash
$ bower install holang
```

### 스크립트 로드 

```html
<script src="bower_components/ho-lang/dist/holang.min.js"></script>
```

### ho-lang 코드 실행

스크립트가 로드되면 전역 'holang' 객체가 만들어집니다.

```javascript
var code = `사과=10;수박=20;합=사과+수박*2;`
var result = holang.parse(code);
console.log(result);
```

setContext 메소드를 이용하여 컨텍스트를 미리 지정하여 사용 할 수 있습니다.

```javascript
holang.setContext({"수박":"10"});
var code = `사과=수박+2`
var result = holang.parse(code);
console.log(result);
```


# ho-lang 문법

`=` 연산자를 통해 변수에 값을 대입 합니다. 

문장의 끝에는 세미콜론 `;` 이 옵니다.

```
사과=1;
배=사과+1;
```

사칙연산을 지원하며 괄호를 통해 연산순서를 조절 할 수 있습니다.

```
삼=3;
사겠죠=삼+1;
마이너스팔=사겠죠*-2;
마이너스사=마이너스팔/2;
십이=(사겠죠+2)*2;
```

거듭제곱은 `^` 연산자를 이용합니다. 나머지 연산은 `%` 을 이용합니다.

```
아마도팔=2^3;
아마도삼=아마도팔%5;
```

---

# 개발 프로세스

ho-lang 은 [jison](https://zaa.ch/jison/) 을 기반으로 하고 있습니다. 

```bash
$ npm install jison -g
```

jison 을 설치했으면, holang.jison 파일을 수정하고 빌드 할 수 있습니다.

```bash
$ jison holang.jison
```

수정한 스펙을 테스트를 하기 위해서는 관련 라이브러리를 셋팅해야 합니다.

```bash
$ npm install
```

이제 다음을 통해 브라우져를 켜고 테스트 할 수 있습니다. 

```bash
$ gulp www
```


---

# TODO

* 제어문
* 반복문
* 배열
* 구조체
* IO
* log
* e, Pi
* import
