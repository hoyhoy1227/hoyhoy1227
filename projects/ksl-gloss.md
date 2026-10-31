# Case Study 02 · 한국어 → 한국수어 Gloss 모델 파인튜닝

**프로젝트:** X:AI 학회 팀 프로젝트 (2026.07–08)  
**저장소:** [adv-pj-a/llm](https://github.com/molba2see/adv-pj-a/tree/main/llm)

## Problem

한국어 문장을 paust/pko-t5-base 모델을 이용해 **한국수어 Gloss 주석 시퀀스**로 변환하는 모델을 실험했습니다. Gloss는 수어 영상이나 비수지·공간 문법 전체를 표현하는 완성형 번역 결과물이 아닙니다.

## Data Pipeline

**NIKL 출처:** [국립국어원 모두의 말뭉치](https://kli.korean.go.kr/corpus/)의 **「한국수어-한국어 병렬 말뭉치」**(2024·2025 자료)입니다. 재난안전 자료와 GKSL3k의 텍스트 주석도 처리했습니다.

**공개 범위:** 처리 코드·정규화/중복 제거/문장 그룹 분할 절차·설정·집계 결과만 공개합니다. 원본 데이터, 원문 한국어 문장–Gloss 쌍, 원문을 복원할 수 있는 행 단위 가공 자료는 포트폴리오에 공개하거나 첨부하지 않습니다. 원본은 제공기관에서 별도로 확보해 로컬에서만 처리합니다. 기존 코드·집계의 내부 식별자(NIKL 2024/2025)는 호환성을 위해 유지합니다.

| 구분 | 원본 행 | 중복 제거 후 |
| --- | ---: | ---: |
| NIKL 2024 | 956 | 896 |
| NIKL 2025 | 23,534 | 23,534 |
| 재난안전 | 27 | 27 |
| GKSL3k | 3,052 | 2,570 |
| **합계** | **27,569** | **27,027** |

`NFKC 정규화 → 문장/Gloss 중복 제거 → 문장 그룹 단위 분할 → 표기 체계 분리 → 학습`으로 구성했습니다. 같은 한국어 입력이 서로 다른 데이터 분할에 들어가지 않게 처리했습니다.

## Model & Evaluation

- **Base:** `paust/pko-t5-base`
- **Fine-tuning:** LoRA(`r=16`, `alpha=32`, `dropout=0.05`) + `lm_head` 학습
- **Targets:** `q,k,v,o,wi_0,wi_1,wo`
- **Convention:** NIKL 번호형 / GKSL 번호 없는 Gloss에 대해 다른 어댑터 사용
- **RAG:** 최종 기본 번역은 **no-RAG**; 문법 RAG는 별도 설명 계층

| 평가 범위 | 표본 | WER ↓ | Token F1 ↑ |
| --- | ---: | ---: | ---: |
| NIKL v2 · 동일 700행·repeat-safe | 700 | 0.6485 | 0.4852 |
| NIKL v4 · 동일 700행·repeat-safe | 700 | 0.6413 | 0.4903 |
| GKSL · 다중 정답 | 고유 입력 142 | 0.4602 | 0.6589 |

GKSL 0.4602는 **전체 데이터셋 점수가 아닙니다**. 두 평가의 표본과 방식이 달라 직접 성능 우열을 비교할 수 없습니다.

**정확한 평가 조건**

- **NIKL:** 전체 번호형 test 2,557행 중 700행의 층화 부분집합입니다. v2·v4를 동일 집합과 repeat-safe 디코딩(beam 4, length penalty 1.0, repetition penalty 1.03, 3-gram 반복 차단)으로 비교했습니다.
- **GKSL:** 고유 한국어 입력 142개를 한 번씩 평가하며 이 중 다중 참조 그룹은 23개입니다. 동일 입력의 참조 중 gloss 토큰 편집거리가 가장 작은 참조를 선택합니다. 동률이면 token F1, 길이 차이 순으로 결정하며, WER는 선택된 참조의 전체 토큰 수 대비 전체 편집거리 합계입니다.
- **Token F1:** 토큰 순서를 무시한 bag-of-gloss F1의 샘플 평균으로, 어순·수어 문법 전체의 번역 정확도와 같지 않습니다.
- **모델 경로:** 최종 NIKL v4는 2024·2025 공통 번호형 경로, GKSL v1은 번호 없는 표기 경로입니다. 기본 번역은 no-RAG이고 문법 근거는 별도 설명에 사용합니다.
- 위 수치는 보존된 집계 JSON에서 확인한 기록이며 이번 통합 검토에서 모델을 재학습·재평가한 결과는 아닙니다.

## Failure → Decision

초기 KE-T5 계열 실험에서 고빈도 토큰의 반복 출력과 일반화 문제가 발생했습니다. 최종적으로 pko-T5와 다른 학습·디코딩 구성을 검토했습니다. 문법 RAG 역시 특정 지표의 개선과 다른 지표 악화가 공존해 기본 번역 경로에 채택하지 않았습니다.

- 일부 테스트셋은 모델 선택 과정에서 반복적으로 참고했으므로 완전히 untouched인 독립 최종 검증이 아닙니다.
- 수어 전문가의 번역 품질 평가, 영상 생성, 제품 API 배포는 이 평가 범위 밖입니다.

## My Role / Evidence

학회 팀 프로젝트에서 **데이터 수집, 전처리 및 모델 파인튜닝에 참여**했습니다. 코드·실험은 공동 작업 결과이며, 개인 담당 범위는 팀 기록과 커밋을 확인해 구체화할 예정입니다.

[팀 README](https://github.com/molba2see/adv-pj-a/blob/main/llm/README.md) · [실험 기록](https://github.com/molba2see/adv-pj-a/blob/main/llm/docs/EXPERIMENTS.md) · [결과 표](https://github.com/molba2see/adv-pj-a/tree/main/llm/reports)

집계 근거: [전처리 보고서](https://github.com/molba2see/adv-pj-a/blob/main/llm/reports/data_prepare_v2.json) · [NIKL 700행](https://github.com/molba2see/adv-pj-a/blob/main/llm/reports/nikl_v4_repeat_safe_test700.json) · [v2/v4 비교](https://github.com/molba2see/adv-pj-a/blob/main/llm/reports/model_selection_general_nikl_v1.json) · [GKSL 다중 정답](https://github.com/molba2see/adv-pj-a/blob/main/llm/reports/gksl_v1_multiref.json)

구현 근거: [원본 보존·문장 그룹 분할](https://github.com/molba2see/adv-pj-a/blob/main/llm/data_processing/prepare_ksl_text_data.py) · [다중 참조 평가 코드](https://github.com/molba2see/adv-pj-a/blob/main/llm/evaluation/evaluate_multiref.py) · [최종 학습 설정](https://github.com/molba2see/adv-pj-a/blob/main/llm/configs/nikl_v4.run_config.json)

**다음 보강:** 직접 작성·합성한 입력으로 만든 출력·실패 예시(원본 말뭉치 문장–Gloss 쌍 제외), 본인 커밋과 역할 연결, 별도 미사용 평가셋·수어 전문가 검수, 최종 가중치 계보와 재현 환경 기록.
