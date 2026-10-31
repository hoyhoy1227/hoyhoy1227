# 이호영 | AI & Software Developer

**AI 모델을 실험하고, 동작하는 소프트웨어로 연결합니다.**

국민대학교 AI빅데이터융합경영학과 / 데이터사이언스융합전공에서 AI·데이터를 공부하고 있습니다. 생성형 AI의 서비스 통합, 자연어 처리 모델 파인튜닝, 실험 결과에 근거한 문제 해결에 관심이 있습니다.

**Contact** · [hoyhoy1227@gmail.com](mailto:hoyhoy1227@gmail.com)  
**Portfolio** · [Notion](https://app.notion.com/p/4091f16ffcf08115a1a7f27daf54e656) · [Figma · 본편 14장](https://www.figma.com/design/bIHsCT2RsHy4EvsFIcacor?node-id=3-2) · [GitHub](https://github.com/hoyhoy1227)  
**Qualifications** · ADsP · SQLD · OPIc AL

> **Problem → Approach → Implementation → Validation → Lessons Learned**

## Featured Projects

### 01 · [사기방지위원회 — 금융사기 체험 웹 게임](projects/whatfraud.md)

**Generative AI · Software Engineering · Interactive Game**

[실행 데모](https://whatfraud.hoyhoy1227.chatgpt.site/) · [GitHub 코드](https://github.com/hoyhoy1227/whatfraud) · [기술 사례 읽기](projects/whatfraud.md)

- 가상의 스마트폰에서 연락·기록을 비교하고 답장·보류·차단·가상 송금으로 대응하는 **2인 공동 개발 웹 게임**입니다. 보고서와 되감기로 다른 선택을 돌아봅니다.
- **Gemini API**를 연결해 특정 장면에서 상황에 맞는 캐릭터 답변을 생성하도록 구성했습니다.
- AI가 생성하는 대화와 별도로 게임 상태 엔진이 **사건·행동·가상 거래·결말**을 관리합니다.
- 인물별 대화 맥락, 입력·응답 검증, 게임 내 AI 사용 한도(사건별 2/2/1회·회차 최대 5회), 요청당 최대 1회 응답 교정, **내장 대사 fallback**을 적용했습니다. 5회는 외부 API 호출 수의 상한이 아닙니다.
- 기획·구현 전반, 기능·스토리 구성과 **Suno 음악 작업**에 참여했습니다. 구현은 팀 공동 결과입니다.

**핵심 경험:** LLM을 호출하는 기능보다, 모델이 실패해도 게임이 안정적으로 이어지는 **시스템 경계와 오류 처리**를 고민했습니다.

### 02 · [한국어 → 한국수어 Gloss 모델 파인튜닝](projects/ksl-gloss.md)

**NLP · Seq2Seq · Fine-tuning · Evaluation**

[팀 프로젝트 코드](https://github.com/molba2see/adv-pj-a/tree/main/llm) · [실험·평가 상세](projects/ksl-gloss.md)

- 한국어 문장을 한국수어의 **Gloss 주석 시퀀스**로 변환하는 학회 팀 프로젝트입니다.
- 수어 데이터 수집·전처리와 **pko-T5 기반 LoRA + `lm_head` 파인튜닝**에 참여했습니다.
- 원본 27,569행에서 완전 중복을 제거한 **27,027쌍**의 데이터 처리 흐름을 정리했습니다.
- GKSL의 142개 고유 입력 **다중 정답 평가에서 WER 0.4602**를 기록했습니다. 이 점수는 전체 데이터에 대한 평가가 아닙니다.

- **NIKL 출처:** 국립국어원 모두의 말뭉치 **「한국수어-한국어 병렬 말뭉치」**입니다. 원본 데이터·원문 문장–Gloss 쌍은 비공개하며 처리 코드·절차·설정·집계만 공개합니다.
- NIKL v4는 전체 test 2,557행 중 700행을 repeat-safe 조건으로 평가해 **WER 0.6413**을 기록했습니다. GKSL과 표본·방식이 달라 직접 성능을 비교하지 않습니다.

**핵심 경험:** 초기 반복 출력 문제, 서로 다른 Gloss 표기 체계, 데이터 누수와 평가 조건을 검토하며 **점수와 한계를 함께 설명하는 실험 습관**을 익혔습니다.

### 03 · [증권사 텍스트 데이터 분석](projects/financial-text-analysis.md)

**Text Mining · NLP · Exploratory Analysis · 4인 팀**

[분석 과정·결과·한계](projects/financial-text-analysis.md) · [Notion 포트폴리오](https://app.notion.com/p/4091f16ffcf08115a1a7f27daf54e656)

- 국내 5개 증권사의 **뉴스·회사 블로그·종목토론방**을 비교했습니다. 실제 저장량은 뉴스 **1,286행**, 블로그 **14,279행**, 종목토론 **7,880행**입니다.
- Selenium·네이버 API로 수집하고, 목적에 따라 Kiwi 전처리와 **soynlp → TF-IDF → LDA**를 분리했습니다. 5개 회사의 34개 토픽을 pyLDAvis로 살폈습니다.
- KNU 기반 텍스트 감성과 추천·비추천 반응을 분리하고, 반응 점수·강한 우세 기준(±5)·시간대별 합계와 평균을 명시했습니다.
- 원본 PDF·9개 노트북·저장 CSV·시각화 출력을 대조했습니다. 수집 건수·미국 포함 조건·반응 지표는 CSV에서 재계산했으며 전체 모델을 재학습한 결과는 아닙니다.

**핵심 경험:** 목적별 전처리와 지표를 설계하고 관찰과 해석을 구분했습니다. 의사라벨 분류 결과를 사람 정답 정확도로 제시하지 않고, TF-IDF를 분할 전에 적합한 평가 누수와 데이터 기간·중복 문제도 함께 기록했습니다. 팀 공동 결과이며 세부 개인 담당 범위는 원본에서 구분되지 않습니다.

## Tech Stack

| 분야 | 도구 및 기술 |
| --- | --- |
| Programming | Python, Java, SQL, JavaScript / TypeScript |
| AI / NLP | PyTorch, Hugging Face Transformers, PEFT / LoRA, scikit-learn |
| Software | React, Next.js 호환 구조, Vinext / Vite, TypeScript, Gemini API, REST API, Git / GitHub |
| Analysis & Experiments | pandas, NumPy, Jupyter Notebook, Google Colab |
| Text Mining | Selenium, 네이버 API, Kiwi, soynlp, TF-IDF, scikit-learn LDA, pyLDAvis, KNU 기반 감성분석 |
| Planning & Audio | 기능·스토리 구성, Suno |

## Links

- [GitHub Repository 목록](https://github.com/hoyhoy1227?tab=repositories)
- [사기방지위원회 플레이](https://whatfraud.hoyhoy1227.chatgpt.site/)

<sub>프로젝트별 상세 페이지는 확인 가능한 구현 근거, 평가 범위, 팀 프로젝트 내 역할을 구분해 작성했습니다.</sub>
