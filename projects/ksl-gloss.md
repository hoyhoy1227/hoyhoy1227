# Case Study 02 · 한국어 → 한국수어 Gloss 모델 파인튜닝

**프로젝트:** X:AI 학회 팀 프로젝트 (2026.07–08)  
**저장소:** [adv-pj-a/llm](https://github.com/molba2see/adv-pj-a/tree/main/llm)

## Problem

한국어 문장을 paust/pko-t5-base 모델을 이용해 **한국수어 Gloss 주석 시퀀스**로 변환하는 모델을 실험했습니다. Gloss는 수어 영상이나 비수지·공간 문법 전체를 표현하는 완성형 번역 결과물이 아닙니다.

## Data Pipeline

모두의 말뭉치, GKLS 등에서 수집한 국립국어원 한국수어-한국어 병렬 말뭉치 2024/2025 자료, 재난안전 수어자료, GKSL3k를 활용했습니다.

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
| NIKL v2 · 동일 비교 셋 | 700 | 0.6485 | 0.4852 |
| NIKL v4 · repeat-safe | 700 | 0.6413 | 0.4903 |
| GKSL · 다중 정답 | 고유 입력 142 | 0.4602 | 0.6589 |

GKSL 0.4602는 **전체 데이터셋 점수가 아닙니다**. 두 평가의 표본과 방식이 달라 직접 성능 우열을 비교할 수 없습니다.

## Failure → Decision

초기 KE-T5 계열 실험에서 고빈도 토큰의 반복 출력과 일반화 문제가 발생했습니다. 최종적으로 pko-T5와 다른 학습·디코딩 구성을 검토했습니다. 문법 RAG 역시 특정 지표의 개선과 다른 지표 악화가 공존해 기본 번역 경로에 채택하지 않았습니다.

- 일부 테스트셋은 모델 선택 과정에서 반복적으로 참고했으므로 완전히 untouched인 독립 최종 검증이 아닙니다.
- 수어 전문가의 번역 품질 평가, 영상 생성, 제품 API 배포는 이 평가 범위 밖입니다.

## My Role / Evidence

학회 팀 프로젝트에서 **데이터 수집, 전처리 및 모델 파인튜닝에 참여**했습니다. 코드·실험은 공동 작업 결과이며, 개인 담당 범위는 팀 기록과 커밋을 확인해 구체화할 예정입니다.

[팀 README](https://github.com/molba2see/adv-pj-a/blob/main/llm/README.md) · [실험 기록](https://github.com/molba2see/adv-pj-a/blob/main/llm/docs/EXPERIMENTS.md) · [결과 표](https://github.com/molba2see/adv-pj-a/tree/main/llm/reports)

**다음 보강:** 본인이 작성한 전처리/학습 코드, 실제 번역 예시, 학습 곡선, 실험별 담당 및 역할 증거.
