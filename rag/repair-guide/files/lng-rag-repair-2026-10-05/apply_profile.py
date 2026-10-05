from client import *
import time
p=pathlib.Path(__file__).parent
for _ in range(60):
 try:t=login();break
 except OSError:time.sleep(1)
params={'temperature':0.2,'topP':0.9,'topK':20,'minP':0,'minPMode':'custom','repetitionPenalty':1.05,'presencePenalty':0,'maxTokens':768,'systemPrompt':(p/'system-prompt.txt').read_text(),'seed':42,'fastMode':False}
kbid=json.loads((p/'new-kb.json').read_text())['id']
s={'reasoningEnabled':False,'reasoningEffort':'none','toolsEnabled':True,'codeToolsEnabled':False,'imageToolsEnabled':False,'webFetchToolsEnabled':False,'deepResearchEnabled':False,'mcpEnabledForChat':False,'artifactsEnabled':False,'ragSource':{'type':'kb','kbId':kbid},'ragMode':'hybrid','ragTopK':2,'ragAutoInject':'on','ragAutoInjectMinScore':0,'inferenceParams':params,'inferenceParamsByModel':{'unsloth/Qwen3.5-4B-GGUF':params},'speculativeType':'off','preserveThinking':False,'maxToolCallsPerMessage':4}
(p/'verified-settings.json').write_text(json.dumps(s,ensure_ascii=False,indent=2))
request('/api/chat/settings',s,method='PUT',token=t)
th=json.loads((p/'ready-thread.json').read_text());ts={k:v for k,v in s.items() if k in ['reasoningEnabled','reasoningEffort','toolsEnabled','codeToolsEnabled','imageToolsEnabled','webFetchToolsEnabled','deepResearchEnabled','mcpEnabledForChat','artifactsEnabled','ragSource','ragMode','ragTopK','ragAutoInject','ragAutoInjectMinScore']};ts.update({k:v for k,v in params.items() if k not in ['maxTokens','fastMode']});ts['ragEnabled']=True
request('/api/chat/threads/'+th['id'],{'settingsPatch':ts},method='PATCH',token=t)
print('PROFILE APPLIED',flush=True)
r=request('/api/inference/load',json.loads((p/'load-request.json').read_text()),token=t,timeout=7200);(p/'load-result.json').write_text(json.dumps(r,ensure_ascii=False,indent=2));print('LOADED',flush=True)
