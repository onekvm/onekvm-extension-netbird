#!/usr/bin/env python3
"""Exercise the actual controller against event-driven Unix-socket daemon fixtures."""
import json
import concurrent.futures
import os
from pathlib import Path
import signal
import socket
import subprocess
import sys
import tempfile
import time

FIXTURE = r'''#!/usr/bin/env python3
import http.server, json, os, socket, socketserver, sys, threading
from pathlib import Path
p=os.environ['TEST_PROVIDER']; data=Path(os.environ['ONEKVM_EXTENSION_DATA']); sockets=Path(os.environ['ONEKVM_EXTENSION_SOCKET'])
statefile=data/'fixture-state'
def transition(value):
    statefile.write_text(json.dumps(value))
    s=socket.socket(socket.AF_UNIX); s.connect(str(sockets/'control')); s.sendall(b'change'); s.close()
def daemon():
    cond=threading.Condition(); revision=[0]
    class Control(socketserver.BaseRequestHandler):
        def handle(self):
            self.request.recv(100)
            with cond: revision[0]+=1; cond.notify_all()
    class HTTP(socketserver.ThreadingMixIn, socketserver.UnixStreamServer): daemon_threads=True
    class Handler(http.server.BaseHTTPRequestHandler):
        def log_message(self,*args): pass
        def do_POST(self): self.handle_request()
        def do_GET(self): self.handle_request()
        def handle_request(self):
            if self.headers.get('Content-Length'): self.rfile.read(int(self.headers['Content-Length']))
            stream='SubscribeStatus' in self.path or 'watch-ipn-bus' in self.path
            with (data/'requests').open('a') as f:f.write(('stream' if stream else 'status')+'\n')
            self.send_response(200); self.end_headers()
            while True:
                with cond: rev=revision[0]
                value=json.loads(statefile.read_text())
                if stream and p=='netbird':value={'result':value}
                self.wfile.write(json.dumps(value).encode()+b'\n');self.wfile.flush()
                if not stream:return
                with cond:cond.wait_for(lambda:revision[0]!=rev)
    control=socketserver.ThreadingUnixStreamServer(str(sockets/'control'),Control)
    threading.Thread(target=control.serve_forever,daemon=True).start()
    path=sockets/('netbird-http.sock' if p=='netbird' else 'tailscaled.sock')
    server=HTTP(str(path),Handler)
    if p=='netbird':(sockets/'netbird.sock').touch()
    server.serve_forever()
if 'service' in sys.argv or Path(sys.argv[0]).name=='tailscaled':daemon()
elif 'status' in sys.argv:print(statefile.read_text())
elif 'login' in sys.argv or 'up' in sys.argv:
    if 'up' in sys.argv and p=='netbird':transition({'status':'Connected'});sys.exit(0)
    if p=='tailscale':transition({'BackendState':'NeedsLogin'})
    with (data/'login-pids').open('a') as f:f.write(str(os.getpid())+'\n')
    url='https://login.example/activate?user_code=ABCD-EFGH&next=%2Fdevice'
    def show(url,code):print('Use this URL to log in:\n\n'+url+' and enter the code '+code+' to authenticate.' if p=='netbird' else json.dumps({'AuthURL':url}),flush=True)
    show(url,'ABCD-EFGH')
    while True:
        with (data/'approval').open() as f:decision=f.read().strip()
        if decision=='rotate':show(url+'&generation=2','NEW-CODE');continue
        break
    if decision!='ok':
        messages={
            'expired': 'waiting sso login failed with: rpc error: code = Unknown desc = context deadline exceeded' if p=='netbird' else 'backend error: authorization expired',
            'timeout': 'failed to dial management: context deadline exceeded' if p=='netbird' else 'timeout waiting for Tailscale service to enter a Running state; check health with "tailscale status"',
            'denied': 'authorization denied',
        }
        print(messages[decision],flush=True);sys.exit(1)
    if p=='tailscale':transition({'BackendState':'Running','Self':{'TailscaleIPs':['100.64.0.1']}})
elif 'down' in sys.argv:transition({'status':'Disconnected'} if p=='netbird' else {'BackendState':'Stopped'})
'''

def until(check, label, timeout=8):
    deadline=time.monotonic()+timeout
    while time.monotonic()<deadline:
        result=check()
        if result:return result
        time.sleep(.02)
    raise AssertionError('timed out: '+label)

def test(binary, provider):
    with tempfile.TemporaryDirectory(prefix='onekvm-auth-service-') as tmp:
        root=Path(tmp); data=root/'data';config=root/'config';sockets=root/'sockets'
        for p in [data,config,sockets]:p.mkdir()
        settings={'setup_key':'','hostname':'onekvm','management_url':'','wireguard_port':0} if provider=='netbird' else {'auth_key':'','control_url':'','accept_routes':False,'shields_up':False,'port':0}
        (config/'config.json').write_text(json.dumps(settings))
        (data/'fixture-state').write_text(json.dumps({'status':'Disconnected'} if provider=='netbird' else {'BackendState':'NeedsLogin'}))
        os.mkfifo(data/'approval')
        env={**os.environ,'TEST_PROVIDER':provider,'ONEKVM_EXTENSION_DATA':str(data),'ONEKVM_EXTENSION_CONFIG':str(config),'ONEKVM_EXTENSION_SOCKET':str(sockets)}
        for name,key in [('netbird','ONEKVM_NETBIRD'),('tailscale','ONEKVM_TAILSCALE_CLI'),('tailscaled','ONEKVM_TAILSCALED')]:
            file=root/name;file.write_text(FIXTURE);file.chmod(0o755);env[key]=str(file)
        notify=root/'notify';notify.write_text('#!/bin/sh\nprintf "event\\n" >>"$ONEKVM_EXTENSION_DATA/notifications"\n');notify.chmod(0o755)
        env['ONEKVM_SCREEN_NOTIFY']=str(notify)
        def run(command):return json.loads(subprocess.check_output([str(binary),command],env=env,text=True))
        def phase(value):
            result=run('status');return result if result['authState']==value else None
        def notifications():return (data/'notifications').read_text().count('\n') if (data/'notifications').exists() else 0
        with (root/'service.log').open('w') as log:
            service=subprocess.Popen([str(binary),'--service'],env=env,stdout=log,stderr=log)
            try:
                until(lambda:(data/'requests').exists() and 'stream' in (data/'requests').read_text(),'initial status subscription')
                with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
                    starts=list(pool.map(lambda _:run('connect'),range(5)))
                assert sum(result['started'] for result in starts)==1,'concurrent Connect calls spawned multiple sessions'
                pending=until(lambda:(r if (r:=phase('pending')) and r['authExpiresAt'] else None),'active QR link and deadline')
                expected_window=int(os.environ.get('ONEKVM_TEST_AUTH_WINDOW','300'))
                assert pending['authWindowSeconds']==expected_window
                assert 0<pending['authExpiresAt']-int(time.time()*1000)<=expected_window*1000
                assert run('status')['authExpiresAt']==pending['authExpiresAt'],'reading status must not extend the window'
                assert pending['authURL'].endswith('user_code=ABCD-EFGH&next=%2Fdevice')
                oldpid=int((data/'login-pids').read_text().splitlines()[-1])
                time.sleep(.1);count=notifications();time.sleep(.3)
                assert notifications()==count,'idle service emitted periodic screen refreshes'
                assert 'poll' in Path(f'/proc/{service.pid}/wchan').read_text(),'supervisor must block on event descriptors'
                old_request=(data/'oauth-wanted').read_text()
                for _ in range(3):
                    result=run('connect');assert not result['started'] and result['alreadyPending']
                assert (data/'oauth-wanted').read_text()==old_request,'duplicate connect replaced the active request'
                assert run('status')['authExpiresAt']==pending['authExpiresAt'],'duplicate connect renewed the QR window'
                assert len((data/'login-pids').read_text().splitlines())==1
                run('disconnect')
                assert run('connect')['started']
                until(lambda:len((data/'login-pids').read_text().splitlines())==2,'replacement login')
                until(lambda:phase('pending'),'replacement link')
                def stopped():
                    stat=Path(f'/proc/{oldpid}/stat')
                    return not stat.exists() or stat.read_text().split()[2]=='Z'
                until(stopped,'previous login child cancellation')
                with (data/'approval').open('w') as f:f.write('rotate')
                rotated=until(lambda:(r if (r:=phase('pending')) and 'generation=2' in r['authURL'] else None),'server link rotation')
                if provider=='netbird':assert rotated['authCode']=='NEW-CODE'
                for decision,expected in [('expired','expired'),('timeout','timed-out'),('denied','failed')]:
                    with (data/'approval').open('w') as f:f.write(decision)
                    retired=until(lambda:phase(expected),decision+' event')
                    assert retired['authURL']==''
                    if provider=='netbird':assert retired['authCode']==''
                    assert not (data/'oauth-output').exists(),'retired credentials remain on disk'
                    assert run('connect')['started']
                    until(lambda:phase('pending'),'retry link')
                with (data/'approval').open('w') as f:f.write('ok')
                until(lambda:phase('idle'),'authorization completion')
                assert run('status')['authURL']==''
                assert notifications()>count,'completion did not notify the screen'
                run('disconnect')
                assert run('status')['authURL']==''
                if os.environ.get('ONEKVM_TEST_AUTH_WINDOW'):
                    run('connect')
                    pending=until(lambda:(r if (r:=phase('pending')) and r['authExpiresAt'] else None),'timed QR')
                    time.sleep(.6)
                    run('disconnect')
                    run('connect')
                    replacement=until(lambda:(r if (r:=phase('pending')) and r['authExpiresAt']>pending['authExpiresAt'] else None),'replacement deadline')
                    time.sleep(max(0,(pending['authExpiresAt']-time.time()*1000)/1000+.1))
                    assert run('status')['authState']=='pending','old timer expired the replacement request'
                    expired=until(lambda:phase('expired'),'one-shot local QR expiry',expected_window+2)
                    assert expired['authURL']=='' and expired['authExpiresAt']==0
                    if provider=='netbird':assert expired['authCode']==''
                    assert not (data/'oauth-output').exists(),'expired QR credentials remain on disk'
                    lastpid=int((data/'login-pids').read_text().splitlines()[-1])
                    stat=Path(f'/proc/{lastpid}/stat')
                    until(lambda:not stat.exists() or stat.read_text().split()[2]=='Z','expired login process termination',2)
                    time.sleep(.1);count_after_expiry=notifications();time.sleep(.3)
                    assert notifications()==count_after_expiry,'expired QR restarted or emitted periodic events'
                    run('connect')
                    until(lambda:(r if (r:=phase('pending')) and r['authExpiresAt']>replacement['authExpiresAt'] else None),'manual retry after local expiry')
                    run('disconnect')
                def restart_service():
                    nonlocal service
                    request_count=(data/'requests').read_text().count('stream')
                    service.send_signal(signal.SIGTERM)
                    service.wait(timeout=4)
                    assert service.returncode==0
                    for socket_path in sockets.iterdir():socket_path.unlink()
                    service=subprocess.Popen([str(binary),'--service'],env=env,stdout=log,stderr=log)
                    until(lambda:(data/'requests').read_text().count('stream')>request_count,'subscription after restart')
                run('connect')
                until(lambda:phase('pending'),'request before restart tests')
                with (data/'approval').open('w') as f:f.write('expired')
                until(lambda:phase('expired'),'expired before restart')
                login_count=len((data/'login-pids').read_text().splitlines())
                restart_service()
                assert phase('expired'),'service restart replayed an expired authorization'
                time.sleep(.1)
                assert len((data/'login-pids').read_text().splitlines())==login_count
                assert run('connect')['started']
                until(lambda:phase('pending'),'manual retry after restart')
                login_count=len((data/'login-pids').read_text().splitlines())
                restart_service()
                interrupted=phase('failed')
                assert interrupted and interrupted['authURL']=='' and interrupted['authExpiresAt']==0
                assert not (data/'oauth-output').exists(),'interrupted QR survived service restart'
                time.sleep(.1)
                assert len((data/'login-pids').read_text().splitlines())==login_count,'service restart renewed an interrupted login'
                assert run('connect')['started']
                until(lambda:phase('pending'),'manual retry after interruption')
                run('disconnect')
                assert service.poll() is None,'supervisor exited during authorization'
            finally:
                service.send_signal(signal.SIGTERM)
                try:service.wait(timeout=4)
                except subprocess.TimeoutExpired:service.kill();service.wait();raise
                if service.returncode:print((root/'service.log').read_text(),file=sys.stderr)
            assert service.returncode==0
    print(provider+': pending/replacement/rotation/expiry/timeout/failure/completion/cancellation/idle event tests passed')

if __name__=='__main__':
    test(Path(sys.argv[1]).resolve(),sys.argv[2])
