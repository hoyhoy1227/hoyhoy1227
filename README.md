# 이호영 | 한국어 데이터 · AI 대화

**한국어 문장과 대화를 살피고, 문제의 원인을 찾아 고칩니다.**

국민대학교 AI빅데이터융합경영학과 / 데이터사이언스융합전공. 학습 문장 정리, 언어 모델 실험, AI 대화의 맥락 검토를 경험했습니다.

[hoyhoy1227@gmail.com](mailto:hoyhoy1227@gmail.com) · [전체 포트폴리오 PDF](portfolio/Lee_Hoyoung_Portfolio.pdf) · [Notion](https://app.notion.com/p/4091f16ffcf08115a1a7f27daf54e656)  
ADsP · SQLD · OPIc AL

## 01 · [한국어 → 한국수어(KSL) Gloss](https://github.com/hoyhoy1227/hoyhoy1227/blob/main/projects/ksl-gloss.md)

한국어 문장을 수어의 글 표기인 Gloss로 변환하고, 관련 문법 근거를 함께 보여 주는 모델을 개발했습니다.

> **참여 역할** · 데이터 수집·전처리 · 모델 파인튜닝  
> X:AI 학회 팀 프로젝트

- **다른 문장에도 같은 단어가 나옴** · 초기 모델이 ‘지시1’ 같은 출력으로 수렴했습니다. 소량 암기와 새 문장 변환을 나누어 확인하고, pko-T5에 LoRA와 출력층 학습을 적용했습니다.
- **형식은 맞아도 뜻이 달라짐** · 입력에 없는 인물을 뜻하는 단어가 섞였습니다. Gloss 형식과 의미 보존을 따로 살피며 누락·추가된 의미를 기록했습니다.
- **한 자료에 맞춘 모델의 약점** · 2024 중심 학습과 2025 비중이 큰 평가의 차이가 드러났습니다. 2024 추가 학습 모델(v4)에서 2025 자료까지 범위를 넓히고, 입력 주석·학습 비중·어댑터 방식을 다듬어 v8로 발전시켰습니다.

변환 모델을 개발하고, 문장과 자료의 특성에 맞춰 학습을 보완했습니다. Gloss 출력과 함께 문법 특성·관련 문법서 근거를 제공합니다.

[구현과 상세 기록](https://github.com/hoyhoy1227/hoyhoy1227/blob/main/projects/ksl-gloss.md)

## 02 · [사기방지위원회](https://github.com/hoyhoy1227/hoyhoy1227/blob/main/projects/whatfraud.md)

가상의 스마트폰에서 연락과 기록을 비교하며 선택하는 금융사기 체험 웹 게임입니다. 제작 중 이상 답변과 무응답을 플레이 맥락에서 검토했습니다.

> **참여 역할** · 기획 · 기능·스토리 구성 · Suno 음악 작업  
> 2인 공동 개발

- **실제 친구가 다시 본인 확인을 권함** · 대화 상대의 정체성과 일반적인 예방 안내가 충돌했습니다. 인물이 아는 사실과 이미 끝낸 행동을 문맥에 넣고, 전달한 첨부에 먼저 반응하도록 보완했습니다.
- **첨부를 보내면 답변이 막힘** · 화면과 서버의 첨부 허용 목록이 달랐습니다. 막힌 위치를 추적해 화면·서버·답변 처리가 같은 목록을 사용하도록 맞췄습니다.

Gemini의 대화 생성과 게임 진행을 분리하고, 답변 실패에도 이어지는 흐름을 구성했습니다. 웹 데모에서 직접 플레이할 수 있습니다.

[구현과 상세 기록](https://github.com/hoyhoy1227/hoyhoy1227/blob/main/projects/whatfraud.md) · [게임 실행](https://whatfraud.hoyhoy1227.chatgpt.site/)

## 03 · [증권사 텍스트 데이터 분석](https://github.com/hoyhoy1227/hoyhoy1227/blob/main/projects/financial-text-analysis.md)

국내 5개 증권사의 뉴스·회사 블로그·종목토론을 비교한 팀 분석입니다.

> **참여 역할** · 텍스트 분석 팀 프로젝트 참여  
> 4인 팀

- **감성과 추천을 같은 뜻으로 읽기 어려움** · 감성 점수와 추천·댓글은 서로 다른 반응을 나타냅니다. 분석 목적에 맞춰 전처리와 지표를 나누고, 회사별 수집 기간을 고려해 결과를 해석했습니다.

키워드·반복 주제·감성 표현·이용자 반응을 나눠 매체별 관점의 차이를 정리했습니다.

[구현과 상세 기록](https://github.com/hoyhoy1227/hoyhoy1227/blob/main/projects/financial-text-analysis.md)

## 사용 기술

Python · pandas · PyTorch · Transformers · LoRA / RSLoRA · Gemini API · React · SQL · Git / GitHub  
Selenium · Kiwi · soynlp · scikit-learn · TF-IDF / LDA · pyLDAvis · JavaScript / TypeScript

NIKL 출처는 국립국어원 모두의 말뭉치 **「한국수어-한국어 병렬 말뭉치」**입니다. 평가 수치·조건과 코드 검토는 각 프로젝트 상세 기록에 정리했습니다.
