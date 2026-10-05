import pathlib,shutil,hashlib
p=pathlib.Path(__file__).resolve().parent
root=pathlib.Path.home()/'.unsloth/studio/unsloth_studio/lib/python3.13/site-packages/studio/backend/core/rag'
shutil.copyfile(p/'lng_page_search.py',root/'lng_page_search.py')
tool=root/'tool.py';s=tool.read_text();marker='# Local opt-in LNG page retrieval.'
if marker not in s:
 h=hashlib.sha256(s.encode()).hexdigest()[:12]
 (p/('unsloth-tool-backup-'+h+'.py')).write_text(s)
 tool.write_text(s+'\n\n'+(p/'tool-patch.txt').read_text())
