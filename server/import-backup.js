// One-time offline importer. Backup files and credentials must stay outside Git.
import mysql from 'mysql2/promise';
import { readFile, writeFile } from 'node:fs/promises';
import { randomBytes, createHash } from 'node:crypto';
import bcrypt from 'bcryptjs';
import path from 'node:path';
const folder=process.argv[2];
if(!folder) throw new Error('Usage: node server/import-backup.js /private/backup-folder');
const db=mysql.createPool({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME,timezone:'Z'});
const read=async table=>JSON.parse(await readFile(path.join(folder,table+'.json'),'utf8'));
const users=await read('users');
const c=await db.getConnection();const setup=[];
const tables=['profiles','links','bio_pages','notifications','traffic_logs'];
const allowed={profiles:['id','full_name','role','avatar_url','updated_at'],links:['id','user_id','original_url','short_slug','title','clicks','is_archived','created_at'],bio_pages:['id','user_id','slug','profile_title','profile_bio','theme_settings','is_published','views','created_at'],notifications:['id','user_id','type','content','is_read','created_at'],traffic_logs:['id','user_id','link_id','bio_page_id','type','referrer','country','device','browser','created_at']};
const value=(key,v)=>v===null?null:['created_at','updated_at'].includes(key)?new Date(v).toISOString().slice(0,23).replace('T',' '):typeof v==='object'?JSON.stringify(v):v;
async function insert(table,record) {const keys=Object.keys(record);await c.execute(`INSERT INTO \`${table}\` (${keys.map(k=>'`'+k+'`').join(',')}) VALUES(${keys.map(()=>'?').join(',')})`,Object.values(record));}
try {
 await c.beginTransaction();
 const [count]=await c.query('SELECT COUNT(*) AS n FROM users');if(count[0].n)throw new Error('Refusing import into a nonempty user database.');
 for(const u of users) {
  if(!u.email)throw new Error('User without email needs manual migration.');
  const hash=u.encrypted_password||await bcrypt.hash(randomBytes(48).toString('hex'),12);
  await insert('users',{id:u.id,email:u.email.toLowerCase(),password_hash:hash,metadata:JSON.stringify(u.user_metadata||{}),created_at:value('created_at',u.created_at)});
  if(!u.encrypted_password){const token=randomBytes(32).toString('hex');await c.execute('INSERT INTO password_setup_tokens(token_hash,user_id,expires_at) VALUES(?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 7 DAY))',[createHash('sha256').update(token).digest('hex'),u.id]);setup.push({email:u.email,url:`https://lenk.tr/account/password#token=${token}`});}
 }
 for(const table of tables) {
  const rows=await read(table);
  for(const row of rows) {
   const record=Object.fromEntries(Object.entries(row).filter(([key])=>allowed[table].includes(key)).map(([key,v])=>[key,value(key,v)]));
   if(table==='links'||table==='bio_pages'){const slug=table==='links'?row.short_slug:row.slug;if(!/^[a-z0-9][a-z0-9-]{0,99}$/.test(slug))throw new Error('An existing slug needs manual migration.');await insert('slugs',{slug,resource_id:row.id,kind:table==='links'?'link':'bio'});}
   await insert(table,record);
  }
  console.log(table,rows.length);
 }
 await c.commit();await writeFile(path.join(folder,'account-setup-links.json'),JSON.stringify(setup,null,2),{mode:0o600});console.log('users',users.length,'account_setup_required',setup.length);
} catch(e){await c.rollback();throw e;}finally{c.release();await db.end();}
