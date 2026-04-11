import { NextResponse } from 'next/server'
import { analyzeResume } from '../../../services/geminiService'

export const runtime = 'nodejs'

export async function POST(request) {
  try{
    const body=await request.json();
    let {resumecontent,jobrole,exp,description,filename,mimeType}=body;
    if(!resumecontent){
      return NextResponse.json({msg:"Please Upload a Proper Resume Content"});
    }
    const analysis= await analyzeResume(resumecontent,jobrole || "",exp || "",description || "",filename,mimeType);
    return NextResponse.json(analysis);
  }
  catch(error){
    return NextResponse.json({
      msg:error,
    },
  {
    status:500
  })
  }
}
