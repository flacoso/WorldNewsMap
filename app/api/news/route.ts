import { NextResponse } from 'next/server';

export const dynamic='force-dynamic';

export async function GET(){
 const url='https://api.gdeltproject.org/api/v2/doc/doc?query=(news%20OR%20world)&mode=artlist&maxrecords=50&timespan=6h&sort=datedesc&format=json';
 try{
  const res=await fetch(url,{next:{revalidate:900}});
  if(!res.ok) return NextResponse.json({articles:[]},{status:502});
  const data=await res.json();
  return NextResponse.json({articles:data.articles??[],updatedAt:new Date().toISOString()});
 }catch{return NextResponse.json({articles:[],error:'No se pudo consultar la fuente de noticias'},{status:503});}
}
