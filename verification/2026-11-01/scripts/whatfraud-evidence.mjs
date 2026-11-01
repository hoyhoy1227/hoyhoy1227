import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { attachmentReply, attachmentText, parseStoryReply } from '../../app/story/one-shot.js';

const cases = JSON.parse(await readFile(new URL('../../content/generated/cases.json', import.meta.url), 'utf8'));
const dialogueSource = await readFile(new URL('../../app/ai-dialogue.ts', import.meta.url), 'utf8');
const routeSource = await readFile(new URL('../../app/api/ai-chat/route.ts', import.meta.url), 'utf8');
const compile = (source) => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const moduleUrl = (source) => 'data:text/javascript;base64,' + Buffer.from(compile(source)).toString('base64');
const dialogueUrl = moduleUrl(dialogueSource.replaceAll("'./story/narrative.js'",JSON.stringify(new URL('../../app/story/narrative.js',import.meta.url).href)));
const dialogue = await import(dialogueUrl);
let serial = 0;
async function freshRoute() {
  const source = routeSource
    .replace("import { reserveSharedBudget } from '../ai-budget';", "const reserveSharedBudget = async () => globalThis.__budgetOutcome ?? 'allowed';")
    .replace("'../../ai-dialogue'", JSON.stringify(dialogueUrl))
    .replace("'../../story/one-shot.js'",JSON.stringify(new URL('../../app/story/one-shot.js',import.meta.url).href))
    .replace("'../../story/decision-message.js'",JSON.stringify(new URL('../../app/story/decision-message.js',import.meta.url).href))
    .replace("import { cases } from '../../game-data';", 'const cases = ' + JSON.stringify(cases) + ';');
  return import(moduleUrl(source) + '#' + serial++);
}
const request=(text='안내부터 확인해 보세요',session='test-session-000001',overrides={})=>{
 const body={caseId:'paper-profit',stageId:'withdrawal',sceneId:'peer',resolved:false,joined:true,attachment:'none',inputMode:'story-message',messages:[{role:'user',content:text}],userTurnCount:1,...(overrides.sceneId==='friend'?{caseId:'familiar-request',stageId:'waiting',joined:false}:{}),...overrides};
 if(!Object.hasOwn(body,'storyContext')){
  if(body.sceneId==='friend')body.storyContext=[...(body.stageId==='paid'?['friend-transfer']:[]),...(body.resolved?['friend-resolved-paused']:[])];
  else{
   const order=['arrival','group','offer','paid','withdrawal','extra-paid'],stage=order.indexOf(body.stageId);
   body.storyContext=[...(body.joined?['peer-joined-room']:[]),...(stage>=2?['peer-offer-seen']:[]),...(stage>=3?['peer-main-transfer']:[]),...(stage>=4?['peer-withdrawal-requested']:[]),...(stage>=5?['peer-extra-transfer']:[]),...(body.resolved?['peer-resolved-paused']:[])];
  }
 }
 return new Request('https://example.invalid/api/ai-chat',{method:'POST',headers:{'Content-Type':'application/json','x-whatfraud-session':session,'cf-connecting-ip':'192.0.2.1'},body:JSON.stringify(body)});
};
let calls=0;
const originalFetch=globalThis.fetch,originalKey=process.env.GEMINI_API_KEY,originalEnabled=process.env.GEMINI_ENABLED,originalNow=Date.now;
let clock=1_800_000_000_000;
Date.now=()=>clock;
const successful=(reaction='check',reply='알려주셔서 고마워요. 안내부터 다시 볼게요.')=>Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({reply,reaction})}]}}]});
const examples=[];
const runExample=async(name,input,overrides,provider)=>{
  clock+=12000;calls=0;delete globalThis.__budgetOutcome;
  const route=await freshRoute();
  globalThis.fetch=provider;
  const response=await route.POST(request(input,'synthetic-evidence-01',overrides));
  const output=await response.json();
  examples.push({name,input,scene:overrides.sceneId??'peer',attachment:overrides.attachment??'none',http_status:response.status,provider_calls:calls,output});
};
try{
  process.env.GEMINI_ENABLED='true';process.env.GEMINI_API_KEY='mock-only-not-a-real-key';
  await runExample('normal','안내부터 확인해 보세요',{},async()=>{calls++;return successful();});
  await runExample('one_repair','여기 수상하네요 돈 보내지 맙시다',{attachment:'deleted-question',contractVersion:2},async()=>{
    calls++;return Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(calls===1
      ?{reply:'어떻게 할까요?',reaction:'check',supportMode:'compare',focus:'none'}
      :{reply:'추가 비용을 물었던 제 질문이네요. 저도 돈을 보내지 않고 조건부터 확인할게요.',reaction:'check',supportMode:'compare',focus:'deleted-question'})}]}}]});
  });
  await runExample('policy_rejected_after_repair','안내부터 확인해 보세요',{},async()=>{calls++;return successful('check','환급 완료했습니다.');});
  await runExample('identity_quality_fallback','네 이름으로 새 계정에서 연락이 왔어. 이 기록 같이 확인해 줘.',{sceneId:'friend',resolved:true,attachment:'account-profile',contractVersion:2},async()=>{
    calls++;return Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({reply:'내 이름으로 온 연락이라니 당황스럽네. 기록부터 같이 보자.',reaction:'together',supportMode:'records',focus:'records'})}]}}]});
  });
  await runExample('provider_timeout','안내부터 확인해 보세요',{},async()=>{calls++;throw new DOMException('mock timeout','AbortError');});
  await runExample('provider_quota','안내부터 확인해 보세요',{},async()=>{calls++;return new Response(null,{status:429});});
  const report={run_date:'2026-11-01',source_commit:'a4289958c7c66724df7d25b6475aacc7328b1c46',provider_mode:'mocked; source test fixtures; no real Gemini call or generated quality measurement',examples};
  const {writeFile}=await import('node:fs/promises');
  await writeFile(new URL('../../portfolio-game-examples.json',import.meta.url),JSON.stringify(report,null,2)+'\n','utf8');
  console.log(JSON.stringify(report,null,2));
}finally{
  if(originalEnabled===undefined)delete process.env.GEMINI_ENABLED;else process.env.GEMINI_ENABLED=originalEnabled;
  if(originalKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=originalKey;
  globalThis.fetch=originalFetch;Date.now=originalNow;delete globalThis.__budgetOutcome;
}
