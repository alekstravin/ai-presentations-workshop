"""Start the installed Desktop with the verified LNG environment; credentials stay in memory."""
from client import *
import os,subprocess,threading,time
p=pathlib.Path(__file__).resolve().parent
try:
 request('/api/health',timeout=2)
 print('Unsloth уже открыт. Полностью завершите его через Unsloth → Quit Unsloth и запустите эту команду снова.')
 raise SystemExit(1)
except (OSError,RuntimeError):pass
import runpy
runpy.run_path(str(p/'install_patch.py'))
env={**os.environ,'UNSLOTH_LNG_PAGE_RAG':'1','RAG_EMBED_BACKEND':'llama-server','RAG_CHUNK_TOKENS':'120','RAG_CHUNK_OVERLAP':'24','RAG_AUTOINJECT_TOP_K':'12','RAG_AUTOINJECT_MIN_SCORE':'0.10','RAG_TOP_K_LEXICAL':'30','RAG_TOP_K_DENSE':'30','RAG_TOP_K_HYBRID':'12'}
log=open(p/'desktop-launch.log','a')
app=subprocess.Popen(['/Applications/Unsloth.app/Contents/MacOS/unsloth-studio'],env=env,stdout=log,stderr=subprocess.STDOUT)
def setup():
 for _ in range(120):
  try:
   t=login();break
  except (OSError,RuntimeError):time.sleep(1)
 else:print('Desktop не запустил API за 120 секунд.');return
 try:
  model=str(pathlib.Path.home()/'.unsloth/studio/models/lng-embedder/paraphrase-multilingual-MiniLM-L12-v2-F16.gguf')
  request('/api/settings/embedding-model',{'embedding_model':model,'backend':'llama'},method='PUT',token=t)
  request('/api/chat/settings',json.loads((p/'verified-settings.json').read_text()),method='PUT',token=t)
  r=request('/api/inference/load',json.loads((p/'load-request.json').read_text()),token=t,timeout=7200)
  print('Готово: Qwen3.5-4B Q4_K_M. Откройте чат «СПГ — Qwen 4B · проверенный профиль».',flush=True)
 except Exception as e:print('Не удалось применить профиль:',e,flush=True)
threading.Thread(target=setup,daemon=True).start()
app.wait()
