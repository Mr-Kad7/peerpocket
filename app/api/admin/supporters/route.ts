import {NextRequest,NextResponse} from 'next/server';
import {getSupabaseAdmin} from '@/lib/supabaseAdmin';
import {isAdmin} from '@/lib/adminAuth';

export async function POST(req:NextRequest){
  if(!isAdmin(req))return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const body=await req.json(),db=getSupabaseAdmin();
    if(body.action==='update'){const {id,display_name,role,phone_last4,total_supported,campaigns_supported}=body.data||{};const {data,error}=await db.from('supporters').update({display_name,role,phone_last4,total_supported,campaigns_supported}).eq('id',id).select().single();if(error)throw error;return NextResponse.json({supporter:data})}
    return NextResponse.json({error:'Unknown action'},{status:400});
  }catch(e:any){return NextResponse.json({error:e?.message||'Supporter update failed.'},{status:500})}
}
