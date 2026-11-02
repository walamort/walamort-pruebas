"""Rebuild page-specific CSP hashes after changing inline scripts.

Run: python scripts/security-policy.py [--check]
No network access or third-party dependencies.
"""
import base64,hashlib,re,sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
def policy(source):
 hashes=[]
 for attrs,body in re.findall(r'<script\b([^>]*)>(.*?)</script\s*>',source,re.I|re.S):
  if not re.search(r'\bsrc\s*=',attrs,re.I):
   hashes.append("'sha256-"+base64.b64encode(hashlib.sha256(body.encode('utf-8')).digest()).decode()+"'")
 return "; ".join(["default-src 'self'","base-uri 'none'","object-src 'none'","script-src 'self'"+(' '+' '.join(sorted(set(hashes))) if hashes else ''),"script-src-attr 'none'","style-src 'self' 'unsafe-inline' https://fonts.googleapis.com","font-src 'self' https://fonts.gstatic.com","img-src 'self' data: blob: https://i.ytimg.com","media-src 'self' blob: data:","connect-src 'self' https://assets.mailerlite.com","frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com","form-action 'self' https://assets.mailerlite.com","worker-src 'none'","upgrade-insecure-requests"])

def hardened(source):
 source=re.sub(r'<meta\b(?=[^>]*http-equiv=["\']Content-Security-Policy["\'])[^>]*>','',source,flags=re.I)
 source=re.sub(r'<meta\b(?=[^>]*name=["\']referrer["\'])[^>]*>','',source,flags=re.I)
 tags='<meta http-equiv="Content-Security-Policy" content="'+policy(source)+'"><meta name="referrer" content="strict-origin-when-cross-origin">'
 return re.sub(r'(<head\b[^>]*>)',lambda m:m[1]+tags,source,count=1,flags=re.I)

def main():
 changed=[];count=0
 for p in ROOT.rglob('*.html'):
  if any(part in ['.git','node_modules'] for part in p.relative_to(ROOT).parts):continue
  source=p.read_text(encoding='utf-8')
  if not re.search(r'<head\b',source,re.I):continue
  count+=1;new=hardened(source)
  if new!=source:
   changed.append(p.relative_to(ROOT).as_posix())
   if '--check' not in sys.argv:p.write_text(new,encoding='utf-8')
 if '--check' in sys.argv and changed:
  print('FAIL: regenerate CSP for: '+', '.join(changed));return 1
 print(('PASS: checked ' if '--check' in sys.argv else 'Updated ')+str(count)+' HTML policies; '+str(len(changed))+' changes.')
 return 0
if __name__=='__main__':raise SystemExit(main())
