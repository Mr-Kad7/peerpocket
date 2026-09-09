import {NextResponse} from 'next/server';
import {getSupabaseAdmin} from '@/lib/supabaseAdmin';

export async function POST(req:Request){
  try{
    const body=await req.json();
    const required=['full_name','phone','skill'];
    if(required.some(key=>!body[key]))return NextResponse.json({error:'Please complete all required fields.'},{status:400});
    const {error}=await getSupabaseAdmin().from('learning_submissions').insert({
      full_name:body.full_name,
      phone:body.phone,
      skill:body.skill,
      location:body.location||null,
      application_data:body.application_data||{},
      status:'review',
    });
    if(error)throw error;
    return NextResponse.json({ok:true});
  }catch{
    return NextResponse.json({error:'Learning application could not be saved. Configure Supabase and run the latest schema first.'},{status:503});
  }
}
