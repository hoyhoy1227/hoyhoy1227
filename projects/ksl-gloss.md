# 01 · 한국어 → 한국수어(KSL) Gloss

**한국어 문장을 한국수어 Gloss로 변환하고, 문법서 근거를 담은 설명을 함께 제공하는 모델을 개발했습니다.**

> **참여 역할** · 데이터 수집·전처리 · 모델 파인튜닝  
> X:AI 학회 팀 프로젝트

## 한국어와 한국수어의 어순

| 한국어 문장 | 한국수어 Gloss · 문법서 예시 |
| --- | --- |
| **왜** 아직 도착하지 않았나요? | [도착하다] [아직] **[왜]** |

한국어 예시에서 앞에 있던 ‘왜’가 수어 예시에서는 문장 끝에 옵니다. 눈썹을 올리고 눈을 크게 뜨는 표정도 의문을 나타냅니다. 한국어 문장은 예문의 뜻을 풀어 썼습니다. [국립국어원 《2020 한국수어 문법 연구》 90쪽](https://www.korean.go.kr/front/reportData/reportDataView.do?mn_id=207&report_seq=1042)

## Gloss 변환과 문법 설명

입력의 문법 특성을 감지해 관련 문법서 항목과 쪽수를 별도 설명으로 제공합니다. 위 한국어 문장을 공개 감지 코드에 넣으면 ‘부정’과 ‘의문’이 잡힙니다. [문법 특성 감지 코드](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/core/retriever.py)

**실험 기록의 모델 출력** · “친구가 같이 가자고 말했어요.” → `친구1 함께1 가다1 말하다1`

**함께 제공하는 문법 설명** · 인용과 청유를 감지하고, ‘함께 하자’고 제안하는 표현의 근거로 문법서 3.4절 ‘청유문’ 175쪽을 제시합니다. [합성 문장 실험 기록](https://github.com/molba2see/adv-pj-a/tree/llm2-v4-to-v8-improvements/llm#문법-설명-계층-개선)

[초기 출력 오류와 대응](development-cases.md)

## 모델을 만들고 발전시킨 과정

### 한국어 문장을 Gloss로 변환하는 모델

한국어 언어 모델 pko-T5에 LoRA와 출력층 학습을 적용했습니다. 같은 한국어 문장이 학습과 평가에 겹치지 않도록 문장 단위로 묶어 나누고, 번호형 NIKL과 번호 없는 GKSL의 표기를 분리했습니다. 기본 번역에는 문법 검색 결과를 넣지 않고, 설명에만 사용했습니다. [모델 구조와 학습 코드](https://github.com/molba2see/adv-pj-a/tree/llm2-v4-to-v8-improvements/llm)

### v4 · 2024 문장으로 번호형 모델 개선

기존 번호형 어댑터를 NIKL 2024 학습 자료 706행으로 이어서 학습해 v4를 만들었습니다. 2024 평가로 먼저 확인한 뒤, 2024·2025 혼합 평가를 거쳐 공통 번호형 모델로 선택했습니다. pko-T5 기반 어댑터에 LoRA와 출력층 학습을 적용해 3 epoch 추가 학습했습니다. 당시 2024 단일 정답 평가 90행에서 기존 v2 대비 WER가 0.8643에서 0.8462로 내려갔습니다. 이후 혼합 700행의 별도 평가에서도 오류율이 낮아져 공통 경로로 채택했습니다. [v4 학습 설정](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/configs/nikl_v4.run_config.json) · [2024 모델 선택](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/reports/model_selection_v4.json) · [공통 경로 선택](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/reports/model_selection_general_nikl_v1.json)

### v8 · 2025 문장까지 학습 범위 확장

2025 자료를 더해 학습 범위를 넓혔습니다. RSLoRA와 번호 보정을 적용하고, 2024 학습 문장의 괄호 주석을 정리해 자료별 학습 비중을 조정한 뒤 v8로 재학습했습니다. 2025 비중이 큰 평가에 맞춰 자료 범위를 넓히고, 2024 문장의 수형·화자 주석은 전처리로 정리했습니다. [단계별 실험 기록](https://github.com/molba2see/adv-pj-a/blob/3c94045f6a65020dbd12d38206a499adcbe48615/llm/reports/llm2_progression_v4_to_v8.json)

## v8까지 개선한 과정

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

## Problem

한국어 문장을 paust/pko-t5-base 모델을 이용해 **한국수어 Gloss 주석 시퀀스**로 변환하는 모델을 실험했습니다. Gloss는 수어 영상이나 비수지·공간 문법 전체를 표현하는 완성형 번역 결과물이 아닙니다.

## Data Pipeline

**NIKL 출처:** [국립국어원 모두의 말뭉치](https://kli.korean.go.kr/corpus/)의 **「한국수어-한국어 병렬 말뭉치」**(2024·2025 자료)입니다. 재난안전 자료와 GKSL3k의 텍스트 주석도 처리했습니다.

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
| 주말에 전시를 보러 갈래요. | 초기 KE-T5에서 입력이 달라도 `지시1` 한 토큰으로 수렴 | 빔 설정 비교와 소량 암기 진단, 새 문장 일반화를 분리해 확인. 데이터·표기·학습 구성 재검토 |
| 동료가 없어 혼자 점심을 먹었어요. | 초기 KE-T5 진단에서 입력에 없는 `할아버지1` 생성 | Gloss 형식과 의미 보존을 구분. 소량 암기 성공을 일반화 성능으로 제시하지 않음 |
| 손짓의 뜻을 설명해 줄래요? | 최종 pko-T5 v4 저장 예측에 `제스처 제스처`가 남음 | 번호형 표기 이탈·짧은 반복이 남아 있으며 해결 완료로 표현하지 않음 |

**모델 단계 구분:** 초기 KE-T5의 출력 붕괴·인물 치환과 최종 pko-T5 v4의 잔여 오류는 서로 다른 단계입니다. 최종 구성은 pko-T5 + LoRA/`lm_head`, 표기 체계별 어댑터, 기본 no-RAG이며, 여러 변경을 함께 적용했으므로 하나의 변경만으로 오류가 해결됐다고 단정하지 않습니다.

입력 뒤 추론이 시작되지 않은 사례도 있었습니다. 초기 체크포인트의 `lm_head` 크기 `[64128, 512]`와 모델의 `[64100, 512]`가 달라 `size mismatch`로 중단됐고, 학습 시 토크나이저·확장 어휘 크기를 반영한 뒤 어댑터를 로드하도록 순서를 고쳤습니다.

오류 사례는 당시 터미널 기록과 최종 패키지의 저장 예측을 바탕으로 정리했습니다. [오류 사례와 대응 과정](development-cases.md)에 상세 기록을, [CPU·합성 검증](../verification/2026-11-01/README.md)에 보조 근거를 두었습니다.

일부 test는 모델 선택에 반복 참고했습니다. 수어 전문가의 품질 평가·영상 생성·제품 API 배포는 평가 범위 밖입니다.

## My Role / Evidence

학회 팀 프로젝트에서 **데이터 수집, 전처리 및 모델 파인튜닝에 참여**했습니다. 코드·실험은 공동 작업 결과이며, 개인 담당 범위는 팀 기록과 커밋을 확인해 구체화할 예정입니다.

[팀 README](https://github.com/molba2see/adv-pj-a/blob/main/llm/README.md) · [실험 기록](https://github.com/molba2see/adv-pj-a/blob/main/llm/docs/EXPERIMENTS.md) · [결과 표](https://github.com/molba2see/adv-pj-a/tree/main/llm/reports)

집계 근거: [전처리 보고서](https://github.com/molba2see/adv-pj-a/blob/main/llm/reports/data_prepare_v2.json) · [NIKL 700행](https://github.com/molba2see/adv-pj-a/blob/main/llm/reports/nikl_v4_repeat_safe_test700.json) · [v2/v4 비교](https://github.com/molba2see/adv-pj-a/blob/main/llm/reports/model_selection_general_nikl_v1.json) · [GKSL 다중 정답](https://github.com/molba2see/adv-pj-a/blob/main/llm/reports/gksl_v1_multiref.json)

구현 근거: [원본 보존·문장 그룹 분할](https://github.com/molba2see/adv-pj-a/blob/main/llm/data_processing/prepare_ksl_text_data.py) · [다중 참조 평가 코드](https://github.com/molba2see/adv-pj-a/blob/main/llm/evaluation/evaluate_multiref.py) · [최종 학습 설정](https://github.com/molba2see/adv-pj-a/blob/main/llm/configs/nikl_v4.run_config.json)

**다음 보강:** 최종 가중치로 직접 작성한 입력의 실제 출력·실패를 확인하고 별도 미사용 평가셋·수어 전문가 검수를 추가합니다. 


</details>
