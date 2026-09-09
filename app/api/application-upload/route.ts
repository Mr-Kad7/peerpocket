import {NextRequest,NextResponse} from 'next/server';
import {getSupabaseAdmin} from '@/lib/supabaseAdmin';

export async function POST(req:NextRequest){
  try{
    const form=await req.formData(),file=form.get('file');
    if(!(file instanceof File))return NextResponse.json({error:'No image selected.'},{status:400});
    if(file.size>5*1024*1024)return NextResponse.json({error:'Image must be 5MB or smaller.'},{status:400});
    if(!file.type.startsWith('image/'))return NextResponse.json({error:'Only image files are allowed.'},{status:400});
    const storage=getSupabaseAdmin(),bucket='application-images';
    await storage.storage.createBucket(bucket,{public:true,fileSizeLimit:'5MB'}).catch(()=>{});
    const extension=file.name.split('.').pop()?.toLowerCase()||'jpg';
    const path=`${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
    const {error}=await storage.storage.from(bucket).upload(path,Buffer.from(await file.arrayBuffer()),{contentType:file.type});
    if(error)throw error;
    return NextResponse.json({url:storage.storage.from(bucket).getPublicUrl(path).data.publicUrl});
  }catch(error:any){return NextResponse.json({error:error?.message||'Image upload failed.'},{status:500});}
}
