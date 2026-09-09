"use client";

import {useState} from 'react';

const money=(n:any)=>`GHS ${Number(n||0).toLocaleString()}`;

export default function EditableSupporters({data,refresh}:any){
  const [form,setForm]=useState<any>(null);
  const [editing,setEditing]=useState<string|null>(null);
  const save=async()=>{
    if(!editing||!form?.display_name.trim())return;
    const response=await fetch('/api/admin/supporters',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'update',data:form})});
    if(response.ok){setForm(null);setEditing(null);refresh()}
  };
  return <div className="admin-panel"><div className="panel-head"><div><h2>Supporters</h2><p>Edit the people and totals shown in the public Community section.</p></div></div>{editing&&form&&<div className="inline-form"><input value={form.display_name} onChange={e=>setForm({...form,display_name:e.target.value})} placeholder="Name"/><input value={form.role||''} onChange={e=>setForm({...form,role:e.target.value})} placeholder="Role (e.g. Sponsor)"/><input type="number" min="0" value={form.campaigns_supported||0} onChange={e=>setForm({...form,campaigns_supported:Number(e.target.value)})} placeholder="Businesses backed"/><input type="number" min="0" value={form.total_supported||0} onChange={e=>setForm({...form,total_supported:Number(e.target.value)})} placeholder="Support total (GHS)"/><button className="support-btn" onClick={save}>Save supporter</button><button onClick={()=>{setForm(null);setEditing(null)}}>Cancel</button></div>}<div className="admin-list">{data.length===0?<div className="empty">No supporters yet.</div>:data.map((s:any)=><div className="admin-card" key={s.id}><div><b>{s.display_name||'Anonymous'}</b><span>{s.role||'Supporter'} · backed {s.campaigns_supported||0} businesses · {money(s.total_supported)}</span></div><div className="row-actions"><button onClick={()=>{setForm({...s});setEditing(s.id)}}>Edit</button></div></div>)}</div></div>;
}
