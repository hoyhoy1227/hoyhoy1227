# 자동·모의 실행과 재현의 보조 기록

포트폴리오의 실제 제작·추론 오류는 [제작 중 실제 오류와 대응](../../projects/development-cases.md)에 정리했습니다. 아래 기록은 자동·모의 검사 자료이며, 당시 실제 응답 사례를 대신하지 않습니다.

검증일: **2026-11-01**. 개인 기여 세분화는 추후 추가합니다. 금융 프로젝트는 기존 Notion·코드·PDF의 분석 내용을 유지하며, 추가 실험 결과를 포트폴리오에 반영하지 않았습니다.

## 확인 결과

| 프로젝트 | 이번에 실행한 범위 | 결과 |
| --- | --- | --- |
| 사기방지위원회 | 콘텐츠·대사 검사 2개 + 상태/화면/API/예산 검사 9개 명령 | **11개 명령 통과**. 상태 경로 80가지·내장 대사 후보 48개 포함 |
| 게임 정상·실패 사례 | 원본 API 테스트의 고정 응답을 주입해 실제 route 처리 실행 | 정상, 1회 교정, 정책 거부, 품질 fallback, 시간 초과, 할당량 초과 **6가지 결과 기록** |
| 한국수어 Gloss | 원본 CPU 회귀 검사 | **45개 통과·1개 건너뜀**. Windows 심볼릭 링크 생성 불가로 1개 제외 |
| 수어 처리·평가 절차 | 직접 작성한 형식 검사용 데이터로 원본 전처리 CLI·평가 함수 실행 | 102행 → 중복 1개 제거 → 101행, 분할 간 문장 그룹 교집합 0. 원본 내부 출력 경로 거부 확인 |

게임 검사는 외부 Gemini 호출을 모의 응답으로 대체했습니다. JSON의 `provider: gemini`는 원본 route가 선택한 분기 이름이며, 실제 Gemini 응답이나 품질 측정이 아닙니다. 수어의 CPU 검사 중 추론 경로 검사도 모델 로딩·생성을 대체하는 fixture 검사입니다. 이번 검증에서 실제 학습 가중치의 번역 출력, 기존 WER 성능, 전문가 품질을 새로 측정했다고 주장하지 않습니다.

## 게임: 실행한 정상·실패 경로

원본 [API 검사](https://github.com/hoyhoy1227/whatfraud/blob/a4289958c7c66724df7d25b6475aacc7328b1c46/tools/tests/test-ai-chat.mjs)의 자체 작성 입력·고정 응답을 사용했습니다. 원본 route를 TypeScript 변환 후 실행하고, 외부 fetch·공유 예산 경계를 원본 테스트와 같은 방식으로 대체했습니다.

| 상황 | 주입한 응답/오류 | 실제 관찰 | 모의 provider 호출 |
| --- | --- | --- | ---: |
| 정상 | 계약을 만족하는 답장 | HTTP 200 · 답장 유지 | 1 |
| 첨부 조건 교정 | 삭제된 질문 첨부에 잘못된 focus → 올바른 focus | HTTP 200 · 교정 응답 채택 | 2 |
| 정책 위반 지속 | ‘환급 완료했습니다.’를 계속 반환 | HTTP 502 · `unsafe_response` / `reply_policy` | 2 |
| 알려진 신원 누락 | 지인 캐릭터가 새 계정 사칭 사실을 명확히 부인하지 않는 응답 | HTTP 200 · `scripted` / `reply_quality`, 내장 대사 전환 | 2 |
| 시간 초과 | `AbortError` | HTTP 504 · `provider_timeout` | 1 |
| 할당량 초과 | provider HTTP 429 | HTTP 429 · `provider_quota` | 1 |

신원 누락 사례의 최종 내장 대사는 **“내 이름이지만 그 새 계정은 내가 쓰는 게 아니야. 나한테 먼저 보여 줘서 다행이야.”**였습니다. 정상·오류 처리 전체 JSON은 [game_examples.json](results/game_examples.json)에 있습니다. API의 정책 거부와 품질 fallback은 서로 다른 관찰 결과이므로 모든 실패가 서버에서 HTTP 200으로 바뀐다고 설명하지 않습니다.

[검사 실행 로그](results/game_checks.json)에는 상태 저장·복원, 가상 송금 중복, 늦은 응답 취소, 계약·개인정보 검사, 공유 예산의 동시 예약 등의 원본 회귀 검사 결과가 있습니다. UI 검사는 서버 렌더링 기반이며 실브라우저·모바일 실기기 QA와 다릅니다. 최초 복사에서 빠진 원본 음원 자산을 복원한 뒤 UI 검사를 다시 실행해 통과했습니다.

## 수어: 데이터 없이 확인한 처리·평가와 실패

**NIKL 출처:** [국립국어원 모두의 말뭉치](https://kli.korean.go.kr/corpus/) **「한국수어-한국어 병렬 말뭉치」**(2024·2025 자료). 원본 데이터·원문 한국어 문장–Gloss 쌍·복원 가능한 행 단위 자료는 공개하지 않습니다. 처리 코드·절차·설정·집계만 공개합니다.

직접 작성한 `SYN_A`, `SYN_B`, `SYN_C`는 **평가 계산을 설명하는 가상 토큰**입니다. 수어 정답이나 모델 생성 출력이 아닙니다. [실행 결과](results/gloss_reproduction.json):

| 참조 `A B C`에 대한 가상 예측 | WER | Token F1 | 확인한 성질 |
| --- | ---: | ---: | --- |
| A B C | 0.0000 | 1.0000 | 완전 일치 |
| B A C | 0.6667 | 1.0000 | F1은 토큰 순서 오류를 반영하지 않음 |
| A C | 0.3333 | 0.8000 | 삭제 1개 |
| 빈 출력 | 1.0000 | 0.0000 | 전체 토큰 누락 |

다중 정답 `A B C`, `A C`에 예측 `A C`를 주면 원본 `best_reference`가 `A C`를 선택해 WER 0이 됩니다. 전처리 CLI에서는 새 출력 폴더로만 쓰도록 강제하고, 입력 폴더 내부로 출력을 지정하면 `ValueError`로 거부하며 출력 폴더를 만들지 않았습니다. 입력 fixture의 파일 지문도 실행 전후 동일했습니다.

[45개 통과·1개 건너뜀의 상세 목록](results/gloss_checks.json)은 문장 그룹 분할·생성 라벨의 train 전용 처리·라우팅·누수 방어·자원 복원·고정 test preset 검사 등을 포함합니다. **이 구현 검사 수를 번역 정확도로 해석하지 않습니다.**

### 기존 성능 기록에서 확인한 조건과 실패 집계

기존 “NIKL 700행”은 **NIKL 번호형 경로의 혼합 test 2,557행 중 700행**입니다. 구성은 **국립국어원 2024 자료 90행 + 2025 자료 608행 + 재난안전 자료 2행**입니다. v4의 저장 기록은 WER 0.6413, Token F1 0.4903이며, 같은 700행의 v2는 0.6485 / 0.4852입니다.

같은 [저장 집계](https://github.com/molba2see/adv-pj-a/blob/6a744e67e9ee061b6ba44b22d4888643d0b78065/llm/reports/nikl_v4_repeat_safe_test700.json)에서 **빈 출력 0건·연속 3회 반복 0건·표기 체계 검사 불일치 4건**을 확인했습니다. NIKL 2024 90행의 WER는 0.8462로 세부 집단의 어려움도 남아 있습니다. 이는 과거 집계 확인이며 이번에 모델을 다시 돌려 얻은 결과가 아닙니다.

beam 4, length penalty 1.0, repetition penalty 1.03, 3-gram 반복 차단 조건을 유지합니다. 고유 입력 그룹 695개의 기존 paired bootstrap에서 WER 차이의 95% CI는 `[-0.013205, -0.001457]`, Token F1 차이는 `[-0.001662, 0.010368]`입니다. F1 차이는 0을 포함합니다. test를 모델 선택에 반복 참고했으므로 미사용 독립 최종 검증으로 제시하지 않습니다. [원본 비교 집계](https://github.com/molba2see/adv-pj-a/blob/6a744e67e9ee061b6ba44b22d4888643d0b78065/llm/reports/nikl_v4_bootstrap_test700.json)

GKSL의 기존 고유 입력 142개·다중 참조 23그룹에 대한 WER 0.4602 / Token F1 0.6589 역시 저장 기록입니다. NIKL과 평가 표본·참조 선택 방식이 달라 직접 우열 비교하지 않습니다.

## 재현 방법과 범위

**확인한 버전:** Windows, Node 24.22.1, TypeScript 5.9.3, React / React DOM 19.2.8, Python 3.12.14. CPU 검사용 Python 버전은 [requirements-review.txt](requirements-review.txt)에 고정했습니다. [전체 실행 환경 목록](environment-review.txt)도 기록했습니다.

게임 원본 텍스트 파일 101개와 사용한 음원 자산, 수어 `llm/` 파일 68개의 Git blob 지문이 지정 커밋과 모두 일치했습니다. [소스 검증 결과](results/source_verification.json)

### 게임 회귀 검사

```sh
git clone https://github.com/hoyhoy1227/whatfraud.git
cd whatfraud
git checkout a4289958c7c66724df7d25b6475aacc7328b1c46
corepack pnpm install --frozen-lockfile
corepack pnpm content:check
corepack pnpm dialogue:check
corepack pnpm test
```

이번 검증은 동일한 원본 Node 명령 11개를 직접 실행했습니다. 실제 서비스 배포·브라우저 빌드·외부 Gemini 품질 평가까지 완료했다는 뜻은 아닙니다. 6가지 예시를 다시 얻으려면 [whatfraud-evidence.mjs](scripts/whatfraud-evidence.mjs)를 위 checkout의 `tools/tests/portfolio-evidence.mjs`로 복사한 뒤 `node tools/tests/portfolio-evidence.mjs`를 실행합니다. 결과는 checkout의 `portfolio-game-examples.json`에 기록됩니다.

### 수어 CPU 검사와 합성 처리 예시

```sh
git clone --no-checkout https://github.com/molba2see/adv-pj-a.git
cd adv-pj-a
git sparse-checkout init --cone
git sparse-checkout set llm
git checkout 6a744e67e9ee061b6ba44b22d4888643d0b78065
python -m venv .venv
# Activate the virtual environment for your operating system.
python -m pip install -r ../hoyhoy1227/verification/2026-11-01/requirements-review.txt
cd llm
python -m pytest -q
```

환경 경로는 두 저장소를 같은 상위 폴더에 두었다는 예시입니다. Windows의 임시 폴더 접근 문제가 있으면 쓰기 가능한 전용 폴더로 `TEMP`, `TMP`, pytest `--basetemp`를 지정합니다. 이 검증도 같은 조치 후 원본 코드 변경 없이 통과했습니다.

[gloss_reproduce.py](scripts/gloss_reproduce.py)는 `python gloss_reproduce.py --llm <checkout/llm>`으로 실행합니다. 원본 말뭉치·영상·학습 가중치를 읽지 않고 형식 검사용 합성 CSV와 집계만 만듭니다.

실제 모델 출력이나 기존 WER를 다시 측정하려면 **정확한 최종 어댑터·토크나이저·기반 모델과 해당 버전의 로컬 평가 입력**이 필요합니다. 현재 공개 코드 checkout에는 이 자원이 없어 이번 작업에서 실행하지 않았습니다. 기반 모델만 새로 받아 최종 모델인 것처럼 제시하지 않습니다. 실제 모델 추론은 [원본 WORKFLOW](https://github.com/molba2see/adv-pj-a/blob/6a744e67e9ee061b6ba44b22d4888643d0b78065/llm/docs/WORKFLOW.md)의 자원 복원 절차와 설정을 따르며, 원본·예측 행 파일은 로컬에 두고 공개물에는 집계만 옮깁니다.

## 남은 확인

- 실제 Gemini의 동일 장면 응답 품질과 실브라우저·실기기 동작.
- 최종 수어 모델의 자체 작성 입력 출력과 실패 사례, 미사용 독립 평가셋·수어 전문가 검수.
- 개인 기여 근거는 추후 추가.

원본 구현·학습 알고리즘·`avatar`는 변경하지 않았습니다.
