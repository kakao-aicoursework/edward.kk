# Kakao Developers helper BOT 만들기

기획서: https://docs.google.com/document/d/1uKUALDORJQDGZnfd0DjVyof0xwAhCGUC/edit

```shell
# node 18 환경이 필요
nvm use 18
```

```env
# .env
OPENAI_API_KEY=
```

```shell
bun install
bun dev
```

## 개발 히스토리 기록

### 23.09.19 (화)

https://github.com/kakao-aicoursework/edward.kk/assets/65283190/03e4d2ab-8fe0-4042-8803-59463aca0848

- `nextjs`로 프로젝트 리포멧팅 (~파이썬 커엇..!~)
- `openai` 활용하여 채팅 비서 만들기
- `langchain`활용해서 번역 챗봇 만들기

### 23.09.21 (목)

next.js에서 streaming + data load 환경 세팅에 많은 시간이 소요되었다.
vercel 공식문서는 edge 환경으로 소개하지만 langchain은 nodejs 환경 중심으로 소개하는데 좀 충돌되는 부분이 많았다.

텍스트 파일을 [retrieve](https://js.langchain.com/docs/expression_language/cookbook/retrieval) 하려했지만 검색된 내용이 너무 많은 것 같다..

```text
adRequestError: This model's maximum context length is 4097 tokens. However, your messages resulted in 10053 tokens. Please reduce the length of the messages
```
