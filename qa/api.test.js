import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID, randomBytes, createHash } from 'node:crypto';
process.env.LENK_TEST='1';
const { app, pool, initialize } = await import('../server/index.js');
await initialize();
const server=app.listen(0,'127.0.0.1');
await new Promise(resolve=>server.once('listening',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
let cookieA='',cookieB=''; const ids=[];
async function api(endpoint,body,cookie='') {const r=await fetch(base+endpoint,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',Cookie:cookie},...(body===undefined?{}:{body:JSON.stringify(body)})});return {status:r.status,body:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
test('MariaDB auth, ownership, slug conflicts, public resolve, counters and persistence',async()=>{
 try {
  assert.equal((await api('/api/health')).body.database,'mariadb');
  assert.equal((await api('/api/query',{table:'links'})).status,401);
  const emailA=`qa-${randomUUID()}@example.com`,emailB=`qa-${randomUUID()}@example.com`;
  const a=await api('/api/auth/register',{email:emailA,password:'TestingStrong123!',options:{data:{full_name:'QA User'}}});assert.equal(a.status,200);cookieA=a.cookie;ids.push(a.body.data.user.id);
  const b=await api('/api/auth/register',{email:emailB,password:'TestingStrong123!'});assert.equal(b.status,200);cookieB=b.cookie;ids.push(b.body.data.user.id);
  assert.equal((await api('/api/auth/login',{email:emailA,password:'wrong'})).status,401);
  assert.equal((await api('/api/auth/session',undefined,cookieA)).body.data.session.user.id,ids[0]);
  const slug='qa-'+randomUUID();
  const made=await api('/api/query',{table:'links',operation:'insert',single:true,values:{user_id:ids[1],short_slug:slug,original_url:'https://example.com',title:'QA'}},cookieA);assert.equal(made.status,200);assert.equal(made.body.data.user_id,ids[0]);const link=made.body.data;
  assert.equal((await api('/api/query',{table:'links',filters:[{column:'id',value:link.id}]},cookieB)).body.data.length,0);
  assert.equal((await api('/api/query',{table:'links',operation:'update',filters:[{column:'id',value:link.id}],values:{original_url:'https://hijack.example'}},cookieB)).status,404);
  assert.equal((await api('/api/query',{table:'bio_pages',operation:'insert',values:{slug,theme_settings:{}}},cookieB)).status,409);
  assert.equal((await api('/api/query',{table:'links',operation:'insert',values:{short_slug:'dashboard',original_url:'https://example.com'}},cookieA)).status,400);
  assert.equal((await api('/api/query',{table:'links',operation:'update',filters:[{column:'id',value:link.id}],values:{original_url:'javascript:alert(1)'}},cookieA)).status,400);
  await Promise.all(Array.from({length:8},()=>api('/api/resolve/'+slug,{referrer:'https://example.org'})));
  const counted=await api('/api/query',{table:'links',single:true,filters:[{column:'id',value:link.id}]},cookieA);assert.equal(counted.body.data.clicks,8);
  const traffic=await api('/api/query',{table:'traffic_logs'},cookieA);assert.equal(traffic.body.data.length,8);
  const bioSlug='qa-'+randomUUID(); const bio=await api('/api/query',{table:'bio_pages',operation:'insert',single:true,values:{slug:bioSlug,theme_settings:{displayName:'QA'},is_published:false}},cookieA);assert.equal(bio.status,200);assert.equal((await api('/api/resolve/'+bioSlug,{})).status,404);
  assert.equal((await api('/api/query',{table:'bio_pages',operation:'update',filters:[{column:'id',value:bio.body.data.id}],values:{is_published:true}},cookieA)).status,200);
  const published=await api('/api/resolve/'+bioSlug,{});assert.equal(published.body.data.page.theme_settings.displayName,'QA');assert.equal(published.body.data.page.user_id,undefined);
  assert.equal((await api('/api/query',{table:'links',operation:'update',filters:[{column:'id',value:link.id}],values:{is_archived:true}},cookieA)).status,200);assert.equal((await api('/api/resolve/'+slug,{})).status,404);
  const form=new FormData();form.append('file',new Blob([Buffer.from('89504e470d0a1a0a00000000','hex')],{type:'image/png'}),'test.png');const upload=await fetch(base+'/api/uploads',{method:'POST',headers:{Cookie:cookieA},body:form});assert.equal(upload.status,200);const image=await upload.json();assert.equal((await fetch(base+image.data.url)).status,200);
  const bad=new FormData();bad.append('file',new Blob(['<svg/>'],{type:'image/svg+xml'}),'bad.svg');assert.equal((await fetch(base+'/api/uploads',{method:'POST',headers:{Cookie:cookieA},body:bad})).status,400);
  assert.equal((await api('/api/auth/user',{password:'NewTestingStrong123!',current_password:'wrong'},cookieA)).status,400);
  assert.equal((await api('/api/auth/user',{password:'NewTestingStrong123!',current_password:'TestingStrong123!',data:{full_name:'Changed'}},cookieA)).status,200);
  assert.equal((await api('/api/auth/login',{email:emailA,password:'NewTestingStrong123!'})).status,200);
  const setupToken=randomBytes(32).toString('hex');
  await pool.execute('INSERT INTO password_setup_tokens(token_hash,user_id,expires_at) VALUES(?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 1 DAY))',[createHash('sha256').update(setupToken).digest('hex'),ids[1]]);
  assert.equal((await api('/api/auth/setup-password',{token:setupToken,password:'FreshTesting123!'})).status,200);
  assert.equal((await api('/api/auth/setup-password',{token:setupToken,password:'FreshTesting456!'})).status,400);
  assert.equal((await api('/api/auth/login',{email:emailB,password:'FreshTesting123!'})).status,200);
  await api('/api/auth/logout',{},cookieB);assert.equal((await api('/api/auth/session',undefined,cookieB)).body.data.session,null);
 } finally { for(const id of ids) {await pool.execute('DELETE FROM slugs WHERE resource_id IN (SELECT id FROM links WHERE user_id=? UNION SELECT id FROM bio_pages WHERE user_id=?)',[id,id]);await pool.execute('DELETE FROM users WHERE id=?',[id]);} await new Promise(resolve=>server.close(resolve));await pool.end(); }
});
