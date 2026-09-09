"use client";

import {useState} from 'react';

export default function CommunityContent({settings,act}:any){
  const [copy,setCopy]=useState<any>({...settings.site_copy});
  return <div className="admin-panel"><div className="panel-head"><div><h2>Community section</h2><p>Edit the heading and description above the public supporter list.</p></div></div><div className="form-grid"><label className="full">Heading<input value={copy.community_title||''} placeholder="People backing real businesses" onChange={e=>setCopy({...copy,community_title:e.target.value})}/></label><label className="full">Description<textarea value={copy.community_description||''} placeholder="Supporters help entrepreneurs move from a good idea to a practical next step." onChange={e=>setCopy({...copy,community_description:e.target.value})}/></label></div><button className="support-btn" onClick={()=>act('set_setting',{key:'site_copy',value:copy})}>Save Community content</button></div>;
}
