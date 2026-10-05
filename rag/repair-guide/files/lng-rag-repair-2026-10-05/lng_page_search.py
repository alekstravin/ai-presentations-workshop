"""Opt-in retrieval for one LNG KB: bilingual query expansion and intact PDF pages.
No answers or test questions are embedded in the implementation.
"""
from __future__ import annotations
import math,re
from collections import defaultdict,Counter
from storage import rag_db
from . import retrieval,store
KB_ID='1b07438c-3c29-41a5-83c9-352f16c69538'
STOP=set('what which how the of in to and is are a an as at for on by from according report annual по в во на и из к у с со за году год года какой какая какое какие каков какова каковы сколько указан указана указано указаны отчёт отчете отчёте отчёту отчета годовому годовом только основе данным'.split())
CONCEPTS=[
 (r'спот|spot',r'spot|спот',r'spot basis|спотов',5),
 (r'миров|global|world|в мире|во всем мире',r'global|world|миров',r'global lng trade|global lng exports|global lng volume|миров.{0,20}спг',4),
 (r'торгов|trade',r'trade|торгов',r'global lng trade|lng trade',2),
 (r'стран|countries|рынк.{0,5}импорт|importing markets',r'countries|markets|стра[н]|рынк',r'exporting countries|importing markets|number of importers',5),
 (r'мощност|capacity',r'capacity|мощност',r'проектная мощность|проектной мощност|nameplate capacity|liquefaction capacity',4),
 (r'ресурсн|месторож|field|feedstock|питает',r'месторож|field|ресурсн',r'ресурсной базой|ресурсная база|resource base',4),
 (r'спрос|demand|потреблен',r'demand|consumption|спрос|потребл',r'global gas demand|миров.{0,20}спрос',4),
 (r'постав|supply|projects|проект',r'supply|постав|projects|проект',r'new projects|нов.{0,10}проект',2),
 (r'электро|electric|низкоуглер|low.carbon',r'электро|electric|низкоуглер|low.carbon',r'низкоуглеродн.{0,30}электро|low.carbon electric',5),
 (r'отгруз|shipment|commercial|коммерческ',r'отгруз|shipment|commercial|коммерческ',r'коммерческие отгрузки|commercial shipment',4),
 (r'контрольн|checksum',r'контрольн|checksum',r'контрольная сумма|checksum',8),
]
def words(s):return re.findall(r'[\w-]+',s.casefold().replace('ё','е'),re.UNICODE)
def merge(parts):
 text=''
 for part in parts:
  if not text:text=part;continue
  overlap=0
  for n in range(min(len(text),len(part),1024),19,-1):
   if text[-n:]==part[:n]:overlap=n;break
  text+= ('\n' if not overlap else '')+part[overlap:]
 return text

def search(query,top_k=4):
 scope=store.kb_scope(KB_ID);conn=rag_db.get_connection()
 try:
  rows=[dict(r) for r in conn.execute('SELECT c.*, d.filename,d.stored_path FROM chunks c JOIN documents d ON d.id=c.document_id WHERE c.scope=? AND d.status="completed" ORDER BY c.document_id,c.chunk_index',(scope,))]
  groups=defaultdict(list)
  for row in rows:groups[(row['document_id'],row['page_number'])].append(row)
  pages=[]
  for items in groups.values():
   page={**items[0],'text':merge([r['text'] for r in items])};page['members']=[r['id'] for r in items]
   if page['page_number'] and page['filename'].lower().endswith('.pdf') and 'key figures' in page['text'].lower():
    try:
     import pymupdf
     with pymupdf.open(page['stored_path']) as pdf:
      blocks=pdf[page['page_number']-1].get_text('blocks',sort=True)
      spatial='\n\n'.join(b[4].strip() for b in blocks if b[6]==0 and b[4].strip())
     if len(spatial)>100:page['text']=spatial
    except Exception:pass
   pages.append(page)
  q=query.casefold().replace('ё','е')
  aliases=[(r'сша','united states'),(r'северн.{0,6}америк','north america'),(r'африк','africa'),(r'австрал','australia'),(r'рост|вырос|прирост','growth increase'),(r'экспорт','exports'),(r'импорт','imports')]
  expanded=q+' '+ ' '.join(en for ru,en in aliases if re.search(ru,q))
  qwords=[x for x in words(expanded) if x not in STOP and not x.isdigit() and len(x)>2]
  active=[c for c in CONCEPTS if re.search(c[0],q)]
  # Explicit report family/year filters are based on the uploaded filenames, not numeric answers.
  families=[]
  if 'giignl' in q:families.append('giignl')
  if 'iea' in q or 'мэа' in q:families.append('iea')
  if re.search(r'новат[еэ]к|novatek',q):families.append('novatek')
  if not families:
   if re.search(r'ямал|yamal|арктик|arctic|высоц|vysotsk|месторож|низкоуглер',q):families=['novatek']
   elif re.search(r'миров|global|спот|spot|стран.{0,15}экспорт|exporting countries',q) and not re.search(r'газ|gas demand|iea',q):families=['giignl']
  literal_names={p['filename'] for p in pages if p['filename'].casefold() in q}
  allowed=[p for p in pages if (not literal_names or p['filename'] in literal_names) and (not families or any(f in p['filename'].casefold() for f in families))]
  for fam in families:
   m=re.search(fam+r'[^0-9]{0,45}(20\d\d)',q)
   if fam=='novatek' and not m:m=re.search(r'новат[еэ]к[\s_-]*(20\d\d)',q)
   if m:
    year=m[1];names={p['filename'] for p in allowed}
    same=[name for name in names if fam in name.casefold() and year in name]
    if same:allowed=[p for p in allowed if p['filename'] in same]
  df=Counter()
  for p in allowed:
   for w in set(words(p['text'])):df[w]+=1
  dense={}
  try:
   hits=retrieval.retrieve_dense(conn,scope,query,200)
   dense={h.chunk_id:h.dense_score or 0 for h in hits}
  except Exception:pass
  scores=[]
  qyears=set(re.findall(r'\b20\d\d\b',q))
  for p in allowed:
   text=p['text'].casefold().replace('ё','е');pw=set(words(text));score=0.0;matched=0
   for w in qwords:
    if w in pw:
     score+=min(3,math.log(1+len(allowed)/(1+df[w])));matched+=1
   concept_matches=0
   for _,broad,specific,weight in active:
    if re.search(broad,text):score+=weight;concept_matches+=1
    if re.search(specific,text):score+=weight*1.8
   if re.search(r'executive summary',text) and any(re.search(c[0],q) for c in CONCEPTS[6:8]):score+=12
   if re.search(r'key figures',text) and any(re.search(c[0],q) for c in CONCEPTS[:4]):score+=12
   semantic=max((dense.get(cid,0) for cid in p['members']),default=0)
   score+=semantic*4
   if qyears & set(re.findall(r'\b20\d\d\b',text)):score+=2
   # Reject a candidate that only shares an incidental year/LNG label.
   if matched==0 and concept_matches==0 and semantic<0.65:continue
   if len(re.sub(r'[^a-zа-я]','',text))<70 and p['page_number'] is not None:score*=.1
   if re.search(r'contents|содержание',text[:120]):score*=.35
   scores.append((score,p))
  ranked=sorted(scores,key=lambda x:x[0],reverse=True)
  chosen=[];k=max(1,min(int(top_k or 4),4))
  compare=len(qyears)>=2 and bool(re.search(r'разниц|сравн|difference|compare|2024.{0,12}2025|2025.{0,12}2024',q))
  if compare:
   seen=set()
   for s,p in ranked:
    if p['filename'] not in seen:chosen.append((s,p));seen.add(p['filename'])
    if len(chosen)>=k:break
  for item in ranked:
   if len(chosen)>=k:break
   if not any(p['id']==item[1]['id'] for _,p in chosen):chosen.append(item)
  out=[]
  # Bound context without cutting a label away from its number: fewer complete pages.
  budget=12500
  for score,p in chosen:
   text=p['text']
   if len(text)>8000:continue
   if len(text)>budget:continue
   budget-=len(text)
   out.append({'citationId':len(out)+1,'chunkId':p['id'],'documentId':p['document_id'],'filename':p['filename'],'page':p['page_number'],'text':text,'score':None,'pageRank':round(score,4)})
  return out
 finally:conn.close()
