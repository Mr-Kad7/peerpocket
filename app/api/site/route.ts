import {NextResponse} from 'next/server';
import {getSupabaseAdmin} from '@/lib/supabaseAdmin';

export async function GET(){
  try{
    const s=getSupabaseAdmin();
    const [settings,faqs,supporters]=await Promise.all([
      s.from('site_settings').select('key,value'),
      s.from('faqs').select('question,answer').eq('active',true).order('sort_order',{ascending:true}),
      s.from('supporters').select('display_name,role,total_supported,campaigns_supported').order('total_supported',{ascending:false}).limit(8),
    ]);
    if(settings.error)throw settings.error;
    if(faqs.error)throw faqs.error;
    if(supporters.error)throw supporters.error;
    const uniqueFaqs=Array.from(new Map((faqs.data||[]).map((faq:any)=>[faq.question,faq])).values());
    return NextResponse.json({
      settings:Object.fromEntries((settings.data||[]).map((item:any)=>[item.key,item.value])),
      faqs:uniqueFaqs,
      supporters:supporters.data||[],
    },{headers:{'Cache-Control':'no-store'}});
  }catch{
    return NextResponse.json({settings:{},faqs:[]},{status:503});
  }
}
