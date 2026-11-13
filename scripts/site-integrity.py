"""Static site integrity and accessibility checks; no browser or network required."""
from pathlib import Path
from html.parser import HTMLParser
from collections import Counter,defaultdict
from urllib.parse import urlsplit,unquote
import sys
root=Path(__file__).resolve().parents[1]
VOID={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
class N:
 def __init__(self,tag,a,parent=None):self.tag=tag;self.a=dict(a);self.parent=parent;self.children=[]
 def text(self):return ''.join(c if isinstance(c,str) else c.text() if c.tag not in ['script','style'] else '' for c in self.children).strip()
class P(HTMLParser):
 def __init__(self,s):super().__init__();self.root=N('root',{});self.stack=[self.root];self.nodes=[];self.feed(s)
 def handle_starttag(self,t,a):
  n=N(t,a,self.stack[-1]);self.stack[-1].children.append(n);self.nodes.append(n)
  if t not in VOID:self.stack.append(n)
 def handle_startendtag(self,t,a):self.handle_starttag(t,a);self.handle_endtag(t)
 def handle_endtag(self,t):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==t:self.stack=self.stack[:i];break
 def handle_data(self,s):self.stack[-1].children.append(s)
issues=defaultdict(list);counts=Counter()
pages={path:P(path.read_text(encoding='utf8')) for path in root.rglob('*.html') if '.git' not in path.parts and '_fuente' not in path.parts}
canonical=next((n.a.get('href','') for n in pages[root/'index.html'].nodes if n.tag=='link' and n.a.get('rel')=='canonical'),'')
public_path=urlsplit(canonical).path or '/'
for path,p in pages.items():
 rel=path.relative_to(root).as_posix();nodes=p.nodes;ids={n.a.get('id'):n for n in nodes if n.a.get('id')};labels={n.a.get('for') for n in nodes if n.tag=='label'}
 def add(kind,detail):issues[rel].append([kind,detail]);counts[kind]+=1

 for id,count in Counter(n.a['id'] for n in nodes if n.a.get('id')).items():
  if count>1:add('duplicate_id',id)
 for n in nodes:
  ref=n.a.get('href') if n.tag in ['a','link'] else n.a.get('src') if n.tag in ['img','script'] else None
  if not ref:continue
  u=urlsplit(ref)
  if u.scheme or u.netloc:continue
  location=unquote(u.path)
  if public_path!='/' and location.startswith(public_path):location='/'+location[len(public_path):]
  target=((root/location.lstrip('/')) if location.startswith('/') else path.parent/location).resolve() if location else path
  if target.is_dir():target=target/'index.html'
  if not target.exists():add('missing_file',ref)
  elif u.fragment and target in pages and unquote(u.fragment) not in {x.a.get('id') for x in pages[target].nodes}:add('missing_fragment',ref)
 for tag in ['title','h1']:
  found=[n for n in nodes if n.tag==tag]
  if len(found)!=1:add(tag,str(len(found)))
 if not any(n.tag=='meta' and n.a.get('name')=='description' and n.a.get('content','').strip() for n in nodes):add('description','missing')
 for n in nodes:
  a=n.a
  if n.tag=='img' and 'alt' not in a:add('image_alt',a.get('src',''))
  if n.tag in ['input','select','textarea'] and a.get('type') not in ['hidden','submit','button','reset']:
   ancestor=n.parent;wrapped=False
   while ancestor:
    if ancestor.tag=='label':wrapped=True;break
    ancestor=ancestor.parent
   if not wrapped and a.get('id') not in labels and not a.get('aria-label') and not a.get('aria-labelledby'):add('label',n.tag+'#'+a.get('id',''))
  if n.tag=='button' and not n.text() and not a.get('aria-label') and not a.get('aria-labelledby') and not a.get('title'):add('button_name',a.get('id',''))
  for attr in ['aria-labelledby','aria-describedby','aria-controls']:
   if attr in a:
    for id in a[attr].split():
     if id not in ids:add('aria_target',attr+'='+id)
if issues:
 for rel,found in issues.items():
  for kind,detail in found:print(f'{rel}: {kind}: {detail}')
 sys.exit(1)
print(f'PASS: {len(pages)} public HTML pages; local files/fragments, unique IDs, titles/descriptions/H1, image alternatives, static control labels and ARIA references.')
