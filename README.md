# 이호영 | AI & Software Developer

**AI 모델의 가능성을 실험하고, 실제로 동작하는 소프트웨어로 연결합니다.**

국민대학교 AI빅데이터융합경영학과 / 데이터사이언스융합전공에서 AI·데이터를 공부하고 있습니다. 생성형 AI의 서비스 통합, 자연어 처리 모델 파인튜닝, 실험 결과에 근거한 문제 해결에 관심이 있습니다.

> **Problem → Approach → Implementation → Validation → Lessons Learned**

## Featured Projects

### 01 · [사기방지위원회 — AI 기반 금융사기 예방 인터랙티브 게임](projects/whatfraud.md)

**Generative AI · Software Engineering · Interactive Game**

[실행 데모](https://whatfraud.hoyhoy1227.chatgpt.site/) · [GitHub 코드](https://github.com/hoyhoy1227/whatfraud) · [기술 사례 읽기](projects/whatfraud.md)

- 금융사기 상황을 게임에서 직접 경험하고 판단하도록 하는 **2인 개발 프로젝트**입니다.
- **Gemini API**를 연결해 특정 장면에서 상황에 맞는 캐릭터 답변을 생성하도록 구성했습니다.
- AI가 생성하는 대화와 별도로 게임 상태 엔진이 **사건·행동·가상 거래·결말**을 관리합니다.
- 인물별 대화 맥락, 입력·응답 검증, 호출 제한, **내장 대사 fallback**으로 AI의 불확실성에 대응했습니다.

**핵심 경험:** LLM을 호출하는 기능보다, 모델이 실패해도 게임이 안정적으로 이어지는 **시스템 경계와 오류 처리**를 고민했습니다.

### 02 · [한국어 → 한국수어 Gloss 모델 파인튜닝](projects/ksl-gloss.md)

**NLP · Seq2Seq · Fine-tuning · Evaluation**

[팀 프로젝트 코드](https://github.com/molba2see/adv-pj-a/tree/main/llm) · [실험·평가 상세](projects/ksl-gloss.md)

- 한국어 문장을 한국수어의 **Gloss 주석 시퀀스**로 변환하는 학회 팀 프로젝트입니다.
- 수어 데이터 수집·전처리와 **pko-T5 기반 LoRA + `lm_head` 파인튜닝**에 참여했습니다.
- 원본 27,569행에서 완전 중복을 제거한 **27,027쌍**의 데이터 처리 흐름을 정리했습니다.
- GKSL의 142개 고유 입력 **다중 정답 평가에서 WER 0.4602**를 기록했습니다. 이 점수는 전체 데이터에 대한 평가가 아닙니다.

**핵심 경험:** 초기 반복 출력 문제, 서로 다른 Gloss 표기 체계, 데이터 누수와 평가 조건을 검토하며 **점수와 한계를 함께 설명하는 실험 습관**을 익혔습니다.

### 03 · [증권사 텍스트 데이터 분석](projects/financial-text-analysis.md)

**Text Mining · NLP · Exploratory Analysis**

[분석 과정·결과·한계](projects/financial-text-analysis.md) · [Notion 포트폴리오](https://app.notion.com/p/4091f16ffcf08115a1a7f27daf54e656)

- 국내 5개 증권사의 **뉴스·회사 블로그·종목토론방**을 비교한 프로젝트입니다.
- 원본 기록 기준 증권사별 뉴스 **1,000건**, 종목토론방 게시글 **1,560건 이상**을 수집하고 블로그 자료와 함께 분석했습니다.
- **Selenium·네이버 API·Kiwi**를 활용한 수집·전처리와 워드클라우드·토픽·KNU 기반 감성분석을 정리했습니다.
- 텍스트 감성, 추천·비추천, 시간대별 총반응량과 글당 평균을 구분했습니다. 회사별 수집 기간 차이와 재현 조건의 한계도 함께 제시합니다.

**핵심 경험:** 분석 목적에 따라 전처리와 지표의 의미를 구분하고, 관찰 결과와 해석을 분리했습니다. 상세 문서는 원본 요약의 본문·표를 근거로 하며 원시 데이터·실행 코드를 재검증한 결과는 아닙니다.

## Additional Experience

**LG Aimers · 야구 데이터 예측 모델 실험**

야구 경기의 득점권·후반 상황, 1·2군 기록 등의 도메인 특성을 반영할 수 있는 변수를 제안하고 모델 대안을 비교했습니다. 성능 개선이 확인되지 않은 대안은 채택하지 않았습니다. 실험 수치와 세부 개인 기여는 원본 로그를 확인한 후 보강할 예정입니다.


## Tech Stack

| 분야 | 도구 및 기술 |
| --- | --- |
| Programming | Python, Java, SQL, JavaScript / TypeScript |
| AI / NLP | PyTorch, Hugging Face Transformers, PEFT / LoRA, scikit-learn |
| Software | React, REST API Integration, Git / GitHub |
| Analysis & Experiments | pandas, NumPy, Jupyter Notebook, Google Colab |
| Text Mining | Selenium, 네이버 API, Kiwi, KNU 기반 감성분석 |

## Links

- [GitHub Repository 목록](https://github.com/hoyhoy1227?tab=repositories)
- [사기방지위원회 플레이](https://whatfraud.hoyhoy1227.chatgpt.site/)

<sub>프로젝트별 상세 페이지는 확인 가능한 구현 근거, 평가 범위, 팀 프로젝트 내 역할을 구분해 작성했습니다.</sub>
