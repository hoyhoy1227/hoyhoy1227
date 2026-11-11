# 01 · [한국어 → 한국수어(KSL) Gloss](https://github.com/molba2see/adv-pj-a/tree/llm2-v4-to-v8-improvements)

한국어 문장을 수어 단어의 글 표기인 Gloss로 바꾸는 모델을 개발했습니다. 어떤 문법이 쓰였는지도 문법서 근거와 함께 설명합니다.

> **참여 역할** · 데이터 수집·정리 · 모델 파인튜닝  
> X:AI 학회 팀 프로젝트
> **활동 기간** · 2026.07 ~ 2026.08

### 한국어와 수어는 어순이 어떻게 다를까

| 한국어 문장 | 한국수어 Gloss · 문법서 예시 |
| --- | --- |
| **왜** 아직 도착하지 않았나요? | [도착하다] [아직] **[왜]** |

한국어 예시에서 앞에 있던 ‘왜’가 수어 예시에서는 문장 끝에 옵니다. 눈썹을 올리고 눈을 크게 뜨는 표정도 의문을 나타냅니다. 한국어 문장은 예문의 뜻을 풀어 썼습니다. [국립국어원 《2020 한국수어 문법 연구》 90쪽](https://www.korean.go.kr/front/reportData/reportDataView.do?mn_id=207&report_seq=1042)

### 모델이 바꾼 문장과 함께 제공하는 설명

| 한국어 입력 | 모델의 Gloss 출력 |
| --- | --- |
| 친구가 같이 가자고 말했어요. | `친구1 함께1 가다1 말하다1` |

직접 만든 문장의 실험 기록입니다. ‘친구가 말했다’는 인용과 ‘같이 가자’는 제안을 찾고, 문법서 3.4절 ‘청유문’ 175쪽을 근거로 보여 줍니다. 문장에서 부정·의문 같은 표현을 찾아 관련 문법서 항목과 쪽수를 제공하는 기능도 만들었습니다. [모델 출력과 문법 설명 기록](https://github.com/molba2see/adv-pj-a/tree/llm2-v4-to-v8-improvements/llm#문법-설명-계층-개선)

### 다른 문장에도 같은 단어가 나왔다

입력은 실제 오류를 설명할 수 있는 비슷한 문장으로 바꿨습니다. 출력은 당시 기록의 일부입니다.

| 입력 예시 → 관찰된 출력 조각 | 문제와 점검한 내용 |
| --- | --- |
| “주말에 전시를 보러 갈래요.” → `지시1` | 초기 KE-T5에서 문장과 무관한 한 단어만 나왔습니다. 학습 문장을 외운 것인지, 새 문장도 바꿀 수 있는지 나눠 확인했습니다. |
| “동료가 없어 혼자 점심을 먹었어요.” → `할아버지1` | 초기 KE-T5에서 입력에 없는 인물이 등장했습니다. 표기가 맞는지와 입력의 뜻을 담았는지를 따로 살폈습니다. |
| “손짓의 뜻을 설명해 줄래요?” → `제스처 제스처` | pko-T5 v4에서 번호가 빠지고 같은 단어가 반복됐습니다. 남은 오류를 기록하고 다음 학습에서 살펴볼 항목으로 삼았습니다. |

### 모델을 만들고 학습 범위를 넓힌 과정

1. **변환 모델 개발** · 초기 출력 문제를 살펴본 뒤 pko-T5에 LoRA를 적용하고, 결과 단어를 고르는 출력층도 학습했습니다. 같은 한국어 문장이 학습과 평가에 겹치지 않도록 나눴습니다. 번호가 붙는 자료와 번호 없는 자료는 나눠 처리했습니다.
2. **v4 개발** · 기존 번호형 모델에 NIKL 2024 자료를 더해 추가 학습했습니다. 평가를 거쳐 2024·2025 자료를 처리하는 공통 번호형 모델로 선택했습니다.
3. **v8 개선** · 2025 문장까지 학습 범위를 넓혔습니다. 2024 학습 문장의 주석을 정리하고, 자료별 학습 비중과 학습 방식, Gloss 번호 보정을 조정해 다시 학습했습니다.

NIKL 출처는 국립국어원 모두의 말뭉치 **「한국수어-한국어 병렬 말뭉치」**(2024·2025)입니다.

[원본 모델 코드](https://github.com/molba2see/adv-pj-a/tree/llm2-v4-to-v8-improvements/llm) · [오류와 대응](https://github.com/hoyhoy1227/hoyhoy1227/blob/main/projects/ksl-gloss-errors.md) · [공식 제공처](https://kli.korean.go.kr/corpus/)

<details>
<summary>학습 설정·평가 수치·원본 근거 자세히 보기</summary>

## 모델을 만들고 발전시킨 과정

### 한국어 문장을 Gloss로 변환하는 모델

기존 언어 모델 pko-T5를 수어 표기에 맞춰 추가 학습했습니다(LoRA·출력층 학습). 같은 한국어 문장이 학습과 평가에 겹치지 않도록 나눴습니다. 번호가 붙는 NIKL과 번호 없는 GKSL은 서로 다른 설정으로 처리했습니다. 문법서 검색 결과는 번역에 섞지 않고 설명할 때만 사용했습니다. [모델 구조와 학습 코드](https://github.com/molba2see/adv-pj-a/tree/llm2-v4-to-v8-improvements/llm)

### v4 · 2024 문장으로 번호형 모델 개선

기존 번호형 모델에 NIKL 2024 학습 자료 706행을 더해 LoRA와 출력층을 3 epoch 추가 학습한 버전이 v4입니다. 2024 단일 정답 평가 90행에서 v2 대비 WER가 0.8643에서 0.8462로 낮아졌습니다. 혼합 700행 평가도 확인한 뒤, 2024·2025 자료를 처리하는 공통 번호형 모델로 선택했습니다. [v4 학습 설정](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/configs/nikl_v4.run_config.json) · [2024 모델 선택](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/reports/model_selection_v4.json) · [공통 경로 선택](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/reports/model_selection_general_nikl_v1.json)

### v8 · 2025 문장까지 학습 범위 확장

평가에 많이 포함된 2025 문장도 학습하도록 자료를 늘렸습니다. 2024 학습 문장의 수형·화자 주석을 정리하고, 자료별 학습 비중과 RSLoRA·번호 보정을 조정해 v8로 다시 학습했습니다. [단계별 실험 기록](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/reports/llm2_progression_v4_to_v8.json)

## 바꾼 내용과 평가 결과

| 단계 | 바꾼 점 | WER ↓ | Token F1 ↑ |
| --- | --- | ---: | ---: |
| v4 기준선 | NIKL 2024 자료로 학습 | 0.6400 | 0.4934 |
| 2025 자료 추가 | 통합 번호형 데이터로 LoRA 재학습 | 0.6045 | 0.5384 |
| 학습 방식 비교 | RSLoRA(r32, alpha 64) 채택과 번호 재교정 | 0.5800 | 0.5649 |
| 2024 입력 정리 | 학습 문장의 괄호 주석 제거와 제곱근 기준 코퍼스 균형 | 0.5731 | 0.5778 |
| v8 | 3 epoch, dropout 0.1, 학습률 2e-4, 조기 종료와 최적 체크포인트 복원 | **0.5391** | **0.6162** |

동일한 NIKL 일반 700문장 다중 정답 벤치마크에서 고유 입력 695개(2025 608개, 2024 85개, 재난안전 2개)를 비교했습니다. 반복 억제 디코딩은 beam 4, length penalty 1.0, repetition penalty 1.03, 3-gram 반복 차단입니다. WER는 단어 단위 편집 오류를, Token F1은 순서를 제외한 토큰 일치를 요약합니다. 이 벤치마크는 모델 개선 중 반복해서 참고했습니다. [실험 집계](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/reports/llm2_progression_v4_to_v8.json)

- **데이터 분포** · 2025 자료를 추가한 뒤 전체 F1은 올랐지만 2024 F1은 0.3181에서 0.2636으로 내려갔습니다. 2024 입력 정리와 자료 균형 조정 이후 v8에서 0.3920까지 회복했습니다. 같은 2024 부분집합의 WER는 v4 0.8389, v8 0.8447로, 지표에 따라 변화가 달랐습니다. [전처리 코드](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/data_processing/clean_nikl2024_meta.py) · [코퍼스별 결과](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/reports/llm2_progression_v4_to_v8.json)
- **학습 방식** · 검증 집계에서 단순 rank 증가와 DoRA보다 RSLoRA의 Token F1이 높았습니다. 최종 v8 점수는 데이터·번호 후처리·학습 설정을 함께 변경한 결과입니다. [LoRA 변형 비교](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/reports/llm2_lora_variant_experiments.json)
- **별도 평가** · GKSL은 고유 입력 142개의 기존 다중 정답 평가에서 WER 0.4602를 기록했습니다. 과거 NIKL WER 0.6413은 혼합 test 2,557행 중 700행의 행 단위 기록입니다. [GKSL 기록](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/reports/gksl_v1_multiref.json) · [기존 NIKL 기록](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/reports/nikl_v4_repeat_safe_test700.json)

<details>
<summary>공개 코드에서 확인한 재현 범위</summary>

- 공개 학습 CLI의 LoRA 설정에는 RSLoRA 옵션이 없으며, 기본 NIKL 모델 선택은 v4를 가리킵니다. v8 수치는 실험 보고서의 집계입니다. [학습 코드](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/training/train.py) · [모델 선택 코드](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/core/model_router.py)
- 문법 설명 보고서는 자질 감지 recall 0.90을 기록합니다. 같은 커밋의 추출 규칙과 공개 검증 문장 20개로 확인한 값은 0.6667(30개 중 20개 감지)이며, 자체 작성한 “어디에 계세요?”도 의문과 명령·청유에 함께 잡혔습니다. 설명 검색 평가는 이 확인 범위에서 제외했습니다. [검증 코드](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/evaluation/validate_explanation.py) · [감지 규칙](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/core/retriever.py) · [설명 보고서](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/reports/llm2_explanation_validation.json)

</details>

**출처** · 국립국어원 모두의 말뭉치 「한국수어-한국어 병렬 말뭉치」(2024·2025). [공식 제공처](https://kli.korean.go.kr/corpus/)

<details>
<summary>v4 이전 데이터 처리·기존 평가 기록</summary>

## 처음 만든 모델

paust/pko-t5-base로 한국어 문장을 **한국수어 Gloss 단어열**로 바꾸는 모델을 실험했습니다. Gloss는 수어 단어를 글로 적은 표기입니다. 표정·몸짓·공간 활용까지 담는 수어 영상과는 표현 범위가 다릅니다.

## 데이터를 학습 자료로 만드는 과정

**NIKL 출처:** [국립국어원 모두의 말뭉치](https://kli.korean.go.kr/corpus/)의 **「한국수어-한국어 병렬 말뭉치」**(2024·2025 자료)입니다. 재난안전 자료와 GKSL3k의 텍스트 주석도 처리했습니다.

NIKL 원문 데이터는 공개하지 않습니다. 처리 코드와 집계 결과, 직접 만든 유사 예시만 공유합니다.

| 구분 | 원본 행 | 중복 제거 후 |
| --- | ---: | ---: |
| NIKL 2024 | 956 | 896 |
| NIKL 2025 | 23,534 | 23,534 |
| 재난안전 | 27 | 27 |
| GKSL3k | 3,052 | 2,570 |
| **합계** | **27,569** | **27,027** |

`NFKC 정규화 → 문장/Gloss 중복 제거 → 문장 그룹 단위 분할 → 표기 체계 분리 → 학습`으로 구성했습니다. 같은 한국어 입력이 서로 다른 데이터 분할에 들어가지 않게 처리했습니다.

## 기존 모델과 평가

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

유사 입력으로 재구성한 오류 유형입니다. 출력은 당시 기록에서 발췌한 부분입니다.

| 새로 쓴 유사 입력 · 설명용 | 실제 관찰한 오류 | 대응·남은 한계 |
| --- | --- | --- |
| 주말에 전시를 보러 갈래요. | 초기 KE-T5에서 입력이 달라도 `지시1` 한 단어만 반복 | 빔 설정 비교와 소량 암기 진단, 새 문장 일반화를 분리해 확인. 데이터·표기·학습 구성 재검토 |
| 동료가 없어 혼자 점심을 먹었어요. | 초기 KE-T5 진단에서 입력에 없는 `할아버지1` 생성 | 표기가 맞는지와 뜻을 담았는지를 따로 확인. 소량 암기 성공을 일반화 성능으로 제시하지 않음 |
| 손짓의 뜻을 설명해 줄래요? | 최종 pko-T5 v4 저장 예측에 `제스처 제스처`가 남음 | 번호형 표기 이탈·짧은 반복이 남아 있으며 해결 완료로 표현하지 않음 |

**모델 단계 구분:** 초기 KE-T5의 출력 붕괴·인물 치환과 최종 pko-T5 v4의 잔여 오류는 서로 다른 단계입니다. 최종 구성은 pko-T5 + LoRA/`lm_head`, 표기 체계별 어댑터, 기본 no-RAG이며, 여러 변경을 함께 적용했으므로 하나의 변경만으로 오류가 해결됐다고 단정하지 않습니다.

입력 뒤 추론이 시작되지 않은 사례도 있었습니다. 초기 체크포인트의 `lm_head` 크기 `[64128, 512]`와 모델의 `[64100, 512]`가 달라 `size mismatch`로 중단됐고, 학습 시 토크나이저·확장 어휘 크기를 반영한 뒤 어댑터를 로드하도록 순서를 고쳤습니다.

오류 사례는 당시 터미널 기록과 최종 패키지의 저장 예측을 바탕으로 정리했습니다. [오류 사례와 대응 과정](ksl-gloss-errors.md)에 상세 기록을, [CPU·합성 검증](../verification/2026-11-01/README.md)에 보조 근거를 두었습니다.

일부 test는 모델 선택에 반복 참고했습니다. 수어 전문가의 품질 평가·영상 생성·제품 API 배포는 평가 범위 밖입니다.

## 참여 역할과 근거

학회 팀 프로젝트에서 **데이터 수집·정리와 모델 추가 학습에 참여**했습니다. 코드와 실험은 팀 공동 결과입니다.

[팀 README](https://github.com/molba2see/adv-pj-a/blob/main/llm/README.md) · [실험 기록](https://github.com/molba2see/adv-pj-a/blob/main/llm/docs/EXPERIMENTS.md) · [결과 표](https://github.com/molba2see/adv-pj-a/tree/main/llm/reports)

집계 근거: [전처리 보고서](https://github.com/molba2see/adv-pj-a/blob/main/llm/reports/data_prepare_v2.json) · [NIKL 700행](https://github.com/molba2see/adv-pj-a/blob/main/llm/reports/nikl_v4_repeat_safe_test700.json) · [v2/v4 비교](https://github.com/molba2see/adv-pj-a/blob/main/llm/reports/model_selection_general_nikl_v1.json) · [GKSL 다중 정답](https://github.com/molba2see/adv-pj-a/blob/main/llm/reports/gksl_v1_multiref.json)

구현 근거: [원본 보존·문장 그룹 분할](https://github.com/molba2see/adv-pj-a/blob/main/llm/data_processing/prepare_ksl_text_data.py) · [다중 참조 평가 코드](https://github.com/molba2see/adv-pj-a/blob/main/llm/evaluation/evaluate_multiref.py) · [최종 학습 설정](https://github.com/molba2see/adv-pj-a/blob/main/llm/configs/nikl_v4.run_config.json)

**다음 확인:** 최종 모델에 직접 쓴 문장을 넣어 결과와 오류를 확인하고, 개발 중 사용하지 않은 평가 자료와 수어 전문가 검토를 추가합니다. 


</details>

</details>
