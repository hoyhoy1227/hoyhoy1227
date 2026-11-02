# 01 · 한국어 → 한국수어 Gloss

**한국어 문장을 수어의 글 표기인 Gloss로 바꾸는 언어 모델 실험입니다.**

X:AI 학회 팀 프로젝트

## S · 배경

한국어 문장과 수어 표기는 어순·표현 방식이 다르고, 자료마다 표기 체계도 달랐습니다.

## T · 목표

학습에 쓸 문장 쌍을 정리하고, 입력의 의미를 유지하는 변환 모델을 학습·평가하는 것이 목표였습니다.

## A · 실행

- 원본 27,569행을 정규화·중복 제거해 27,027쌍으로 정리했습니다.
- 같은 한국어 문장이 학습·평가에 겹치지 않도록 나누고, 표기 체계에 맞춰 pko-T5를 LoRA로 학습했습니다.
- 입력이 달라도 같은 단어가 나오는 오류, 의미가 바뀌는 오류, 최종 모델의 표기·반복 오류를 구분해 검토했습니다.

## R · 결과와 확인 범위

GKSL 고유 입력 142개·다중 정답 평가에서 WER 0.4602를 기록했습니다. NIKL 번호형 경로는 혼합 test 2,557행 중 700행에서 WER 0.6413입니다.

WER는 낮을수록 좋은 단어 오류 지표입니다. 서로 다른 평가셋의 점수는 직접 비교할 수 없고, test를 모델 선택에 반복 참고한 한계가 있습니다.

**참여 범위:** 데이터 수집·전처리·파인튜닝 참여. 학회 팀 공동 결과입니다. 기능별 개인 기여의 상세 근거는 추후 보강합니다.

**NIKL 출처: 국립국어원 모두의 말뭉치 「한국수어-한국어 병렬 말뭉치」(2024·2025). 원본·원문 문장–Gloss 쌍·복원 가능한 행 단위 자료는 비공개하며 처리 방법과 집계만 공유합니다.**

[코드](https://github.com/molba2see/adv-pj-a/tree/main/llm) · [공식 제공처](https://kli.korean.go.kr/corpus/) · [실제 오류와 설명용 예시](development-cases.md)

<details>
<summary>처리 과정·평가 조건·원본 근거 자세히 보기</summary>

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
| NIKL 경로 v2 · 혼합 test·repeat-safe | 700 | 0.6485 | 0.4852 |
| NIKL 경로 v4 · 혼합 test·repeat-safe | 700 | 0.6413 | 0.4903 |
| GKSL · 다중 정답 | 고유 입력 142 | 0.4602 | 0.6589 |

GKSL 0.4602는 **전체 데이터셋 점수가 아닙니다**. 두 평가의 표본과 방식이 달라 직접 성능 우열을 비교할 수 없습니다.

**정확한 평가 조건**

- **NIKL 번호형 경로:** 혼합 test 2,557행 중 700행의 층화 부분집합입니다. **국립국어원 2024 자료 90행·2025 자료 608행·재난안전 자료 2행**으로 구성됩니다. v2·v4를 동일 집합과 repeat-safe 디코딩(beam 4, length penalty 1.0, repetition penalty 1.03, 3-gram 반복 차단)으로 비교했습니다.
- **GKSL:** 고유 한국어 입력 142개를 한 번씩 평가하며 이 중 다중 참조 그룹은 23개입니다. 동일 입력의 참조 중 gloss 토큰 편집거리가 가장 작은 참조를 선택합니다. 동률이면 token F1, 길이 차이 순으로 결정하며, WER는 선택된 참조의 전체 토큰 수 대비 전체 편집거리 합계입니다.
- **Token F1:** 토큰 순서를 무시한 bag-of-gloss F1의 샘플 평균으로, 어순·수어 문법 전체의 번역 정확도와 같지 않습니다.
- **모델 경로:** 최종 NIKL v4는 2024·2025 공통 번호형 경로, GKSL v1은 번호 없는 표기 경로입니다. 기본 번역은 no-RAG이고 문법 근거는 별도 설명에 사용합니다.
- 위 수치는 보존된 집계 JSON에서 확인한 기록이며 이번 통합 검토에서 모델을 재학습·재평가한 결과는 아닙니다.

## 실제 추론 오류와 유사 입력 예시

입력 원문과 정답 Gloss는 공개하지 않고 **오류 유형을 설명하는 문장**을 새로 썼습니다. 아래 예문을 실행해 오른쪽 결과가 나왔다는 뜻은 아닙니다. 오류 부분은 당시 실제 추론 로그와 최종 패키지의 저장 예측에서 확인했습니다.

| 새로 쓴 유사 입력 · 설명용 | 실제 관찰한 오류 | 대응·남은 한계 |
| --- | --- | --- |
| 주말에 전시를 보러 갈래요. | 초기 KE-T5에서 입력이 달라도 `지시1` 한 토큰으로 수렴 | 빔 설정 비교와 소량 암기 진단, 새 문장 일반화를 분리해 확인. 데이터·표기·학습 구성 재검토 |
| 동료가 없어 혼자 점심을 먹었어요. | 초기 KE-T5 진단에서 입력에 없는 `할아버지1` 생성 | Gloss 형식과 의미 보존을 구분. 소량 암기 성공을 일반화 성능으로 제시하지 않음 |
| 손짓의 뜻을 설명해 줄래요? | 최종 pko-T5 v4 저장 예측에 `제스처 제스처`가 남음 | 번호형 표기 이탈·짧은 반복이 남아 있으며 해결 완료로 표현하지 않음 |

**모델 단계 구분:** 초기 KE-T5의 출력 붕괴·인물 치환과 최종 pko-T5 v4의 잔여 오류는 서로 다른 단계입니다. 최종 구성은 pko-T5 + LoRA/`lm_head`, 표기 체계별 어댑터, 기본 no-RAG이며, 여러 변경을 함께 적용했으므로 하나의 변경만으로 오류가 해결됐다고 단정하지 않습니다.

입력 뒤 추론이 시작되지 않은 사례도 있었습니다. 초기 체크포인트의 `lm_head` 크기 `[64128, 512]`와 모델의 `[64100, 512]`가 달라 `size mismatch`로 중단됐고, 학습 시 토크나이저·확장 어휘 크기를 반영한 뒤 어댑터를 로드하도록 순서를 고쳤습니다.

이번에는 당시 터미널 기록과 제공된 최종 ZIP의 저장 예측을 확인했습니다. 새 모델 추론 결과가 아니며 원본 말뭉치·정답·행별 예측 파일을 게시하지 않았습니다. [오류 사례와 대응 과정](development-cases.md)에 상세 기록을, [CPU·합성 검증](../verification/2026-11-01/README.md)에 보조 근거를 두었습니다.

일부 test는 모델 선택에 반복 참고했습니다. 수어 전문가의 품질 평가·영상 생성·제품 API 배포는 평가 범위 밖입니다.

## My Role / Evidence

학회 팀 프로젝트에서 **데이터 수집, 전처리 및 모델 파인튜닝에 참여**했습니다. 코드·실험은 공동 작업 결과이며, 개인 담당 범위는 팀 기록과 커밋을 확인해 구체화할 예정입니다.

[팀 README](https://github.com/molba2see/adv-pj-a/blob/main/llm/README.md) · [실험 기록](https://github.com/molba2see/adv-pj-a/blob/main/llm/docs/EXPERIMENTS.md) · [결과 표](https://github.com/molba2see/adv-pj-a/tree/main/llm/reports)

집계 근거: [전처리 보고서](https://github.com/molba2see/adv-pj-a/blob/main/llm/reports/data_prepare_v2.json) · [NIKL 700행](https://github.com/molba2see/adv-pj-a/blob/main/llm/reports/nikl_v4_repeat_safe_test700.json) · [v2/v4 비교](https://github.com/molba2see/adv-pj-a/blob/main/llm/reports/model_selection_general_nikl_v1.json) · [GKSL 다중 정답](https://github.com/molba2see/adv-pj-a/blob/main/llm/reports/gksl_v1_multiref.json)

구현 근거: [원본 보존·문장 그룹 분할](https://github.com/molba2see/adv-pj-a/blob/main/llm/data_processing/prepare_ksl_text_data.py) · [다중 참조 평가 코드](https://github.com/molba2see/adv-pj-a/blob/main/llm/evaluation/evaluate_multiref.py) · [최종 학습 설정](https://github.com/molba2see/adv-pj-a/blob/main/llm/configs/nikl_v4.run_config.json)

**다음 보강:** 최종 가중치로 직접 작성한 입력의 실제 출력·실패를 확인하고 별도 미사용 평가셋·수어 전문가 검수를 추가합니다. 개인 기여 근거는 추후 추가합니다.


</details>
