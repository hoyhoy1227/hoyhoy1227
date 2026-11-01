from pathlib import Path
import sys,csv,json,subprocess,hashlib,importlib.metadata as md
root=Path(__file__).resolve().parent
import argparse
parser=argparse.ArgumentParser()
parser.add_argument('--llm',type=Path,required=True,help='Pinned source checkout llm directory')
args=parser.parse_args()
llm=args.llm.resolve();sys.path.insert(0,str(llm))
from core.metrics import compute_all
from evaluation.evaluate_multiref import best_reference,aggregate

out=root/'results';out.mkdir(exist_ok=True);fixtures=root/'synthetic_gloss';fixtures.mkdir(exist_ok=True)
src=fixtures/'source';src.mkdir(exist_ok=True)
rows=[{'sample_id':f'fixture-{i:03d}','korean_text':f'직접 작성한 형식검사 입력 {i}', 'gloss_sequence':f'SYN_A SYN_{i}', 'source_corpus':'portfolio_synthetic_fixture','label_type':'hand_authored_fixture'} for i in range(100)]
rows += [dict(rows[0],sample_id='fixture-duplicate'),dict(rows[0],sample_id='fixture-multiref',gloss_sequence='SYN_A SYN_ALT')]
input_path=src/'samples.csv'
with input_path.open('w',encoding='utf-8-sig',newline='') as f:
    writer=csv.DictWriter(f,fieldnames=rows[0].keys());writer.writeheader();writer.writerows(rows)
before=hashlib.sha256(input_path.read_bytes()).hexdigest()
command=[sys.executable,'-X','utf8','-m','data_processing.prepare_ksl_text_data','--input',str(input_path),'--output',str(fixtures/'prepared'),'--seed','42']
success=subprocess.run(command,cwd=llm,capture_output=True,text=True,encoding='utf-8')
if success.returncode:raise RuntimeError(success.stderr)
prep=json.loads((fixtures/'prepared'/'prepare_report.json').read_text(encoding='utf-8'))
failure=subprocess.run([sys.executable,'-X','utf8','-m','data_processing.prepare_ksl_text_data','--input',str(src),'--output',str(src/'must-not-write')],cwd=llm,capture_output=True,text=True,encoding='utf-8')
cases=[]
for name,pred,ref in [('exact','SYN_A SYN_B SYN_C','SYN_A SYN_B SYN_C'),('order_error','SYN_B SYN_A SYN_C','SYN_A SYN_B SYN_C'),('deletion','SYN_A SYN_C','SYN_A SYN_B SYN_C'),('empty','','SYN_A SYN_B SYN_C')]:
    cases.append({'name':name,'synthetic_prediction':pred,'synthetic_reference':ref,'metrics':compute_all([pred],[ref])})
selected,distance,f1=best_reference('SYN_A SYN_C',['SYN_A SYN_B SYN_C','SYN_A SYN_C'])
record={'prediction':'SYN_A SYN_C','selected_reference':selected,'distance':distance,'token_f1':f1}
report={'run_date':'2026-11-01','source_commit':'6a744e67e9ee061b6ba44b22d4888643d0b78065','scope':'CPU-only original processing/evaluation code; hand-authored format fixtures; no learned model inference','python':sys.version,'versions':{p:md.version(p) for p in ['pytest','numpy','pandas','scikit-learn','sacrebleu']},'source_input_unchanged':before==hashlib.sha256(input_path.read_bytes()).hexdigest(),'prepare_report':prep,'rejected_output_inside_source':{'exit_code':failure.returncode,'error_tail':failure.stderr.splitlines()[-3:],'output_created':(src/'must-not-write').exists()},'metric_examples':cases,'multi_reference':{'references':['SYN_A SYN_B SYN_C','SYN_A SYN_C'],'selected_reference':selected,'aggregate':aggregate([record])},'actual_model_generated':False,'original_corpus_rows_read':0}
(out/'gloss_reproduction.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
