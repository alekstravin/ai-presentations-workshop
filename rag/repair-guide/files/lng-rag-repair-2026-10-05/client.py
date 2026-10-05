import json, pathlib, urllib.request, urllib.error
BASE='http://127.0.0.1:8888'
def request(path,data=None,method=None,token=None,timeout=120):
    headers={'Content-Type':'application/json'}
    if token:headers['Authorization']='Bearer '+token
    req=urllib.request.Request(BASE+path,data=None if data is None else json.dumps(data).encode(),headers=headers,method=method)
    try:
        with urllib.request.urlopen(req,timeout=timeout) as r:return json.load(r)
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code}: {e.read().decode()}") from None
def login():
    secret=(pathlib.Path.home()/'.unsloth/studio/auth/.desktop_secret').read_text().strip()
    return request('/api/auth/desktop-login',{'secret':secret})['access_token']
