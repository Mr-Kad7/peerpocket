"use client";

import {useState} from 'react';

const defaults=[
  {name:'Nana B.',role:'Sponsor',backed:6,total:2400},
  {name:'Kojo Mensah',role:'Investor',backed:4,total:1600},
  {name:'Priscilla O.',role:'Supporter',backed:3,total:950},
  {name:'Yaw A.',role:'Supporter',backed:5,total:700},
];

export default function CommunitySupporterList({settings,act}:any){
  const [supporters,setSupporters]=useState<any[]>(Array.isArray(settings.community_supporters)&&settings.community_supporters.length?settings.community_supporters:defaults);
  const update=(index:number,patch:any)=>setSupporters(supporters.map((item,i)=>i===index?{...item,...patch}:item));
  return <div className="admin-panel"><div className="panel-head"><div><h2>Community supporters</h2><p>Edit the exact supporter rows shown on the public homepage. Their order here sets the ranking.</p></div></div><div className="admin-list">{supporters.map((supporter,index)=><div className="inline-form" key={index}><input value={supporter.name||''} onChange={e=>update(index,{name:e.target.value})} placeholder="Name"/><input value={supporter.role||''} onChange={e=>update(index,{role:e.target.value})} placeholder="Role"/><input type="number" min="0" value={supporter.backed||0} onChange={e=>update(index,{backed:Number(e.target.value)})} placeholder="Businesses backed"/><input type="number" min="0" value={supporter.total||0} onChange={e=>update(index,{total:Number(e.target.value)})} placeholder="Support total (GHS)"/><button className="danger" type="button" aria-label={`Remove ${supporter.name||'supporter'}`} onClick={()=>setSupporters(supporters.filter((_,i)=>i!==index))}>Remove</button></div>)}</div><div className="admin-actions"><button type="button" onClick={()=>setSupporters([...supporters,{name:'',role:'Supporter',backed:0,total:0}])}>+ Add supporter</button><button className="support-btn" onClick={()=>act('set_setting',{key:'community_supporters',value:supporters.filter(s=>s.name?.trim())})}>Save supporter list</button></div></div>;
}
