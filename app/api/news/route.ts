import { NextResponse } from 'next/server';
export const dynamic='force-dynamic';

const FALLBACK=[{id:'demo-1',title:'WorldNewsMap está listo para recibir noticias en tiempo real',country:'Mundo',category:'General',time:new Date().toISOString(),lat:20,lng:0,url:'https://www.gdeltproject.org/',source:'GDELT'}];

const PLACES:Array<[RegExp,string,number,number]>=[
[/colombia|bogota|bogotá|barranquilla/i,'Colombia',4.57,-74.08],[/venezuela|caracas/i,'Venezuela',10.48,-66.90],[/ecuador|quito/i,'Ecuador',-0.18,-78.47],[/peru|lima/i,'Perú',-12.05,-77.04],[/brazil|brasil|sao paulo|são paulo|rio de janeiro/i,'Brasil',-14.24,-51.93],[/argentina|buenos aires/i,'Argentina',-34.60,-58.38],[/chile|santiago/i,'Chile',-33.45,-70.67],[/mexico|mexico city/i,'México',19.43,-99.13],[/united states|usa|u\.s\.|washington|new york|california/i,'Estados Unidos',38.90,-77.04],[/canada|ottawa|toronto/i,'Canadá',45.42,-75.70],[/ukraine|kyiv|kiev/i,'Ucrania',50.45,30.52],[/russia|moscow|moscú/i,'Rusia',55.76,37.62],[/israel|tel aviv|jerusalem|jerusalén/i,'Israel',31.77,35.21],[/gaza|palestine|palestina/i,'Palestina',31.50,34.47],[/iran|tehran|teheran/i,'Irán',35.69,51.39],[/china|beijing|peking|shanghai/i,'China',39.90,116.40],[/japan|tokyo/i,'Japón',35.68,139.69],[/india|delhi|mumbai/i,'India',28.61,77.21],[/australia|sydney|melbourne/i,'Australia',-33.87,151.21],[/south africa|cape town|johannesburg/i,'Sudáfrica',-33.92,18.42],[/egypt|cairo/i,'Egipto',30.04,31.24],[/nigeria|lagos|abuja/i,'Nigeria',9.08,7.40],[/kenya|nairobi/i,'Kenia',-1.29,36.82],[/germany|berlin/i,'Alemania',52.52,13.40],[/france|paris/i,'Francia',48.86,2.35],[/united kingdom|uk|london|londres/i,'Reino Unido',51.51,-0.13],[/italy|rome|roma/i,'Italia',41.90,12.50],[/spain|madrid/i,'España',40.42,-3.70]
];
function locate(title:string,description:string,domain:string){const text=`${title} ${description} ${domain}`;const hit=PLACES.find(p=>p[0].test(text));return hit?{country:hit[1],lat:hit[2],lng:hit[3]}:{country:'Mundo',lat:20,lng:0};}
function categoryOf(title:string){const t=title.toLowerCase();if(/war|conflict|attack|military|security|ukraine|israel|gaza/.test(t))return'Seguridad';if(/election|president|government|minister|politic|parliament/.test(t))return'Política';if(/market|economy|economic|bank|trade|inflation|stock/.test(t))return'Economía';if(/science|research|climate|space|health|medical/.test(t))return'Ciencia';if(/technology|software|artificial intelligence|\bai\b|chip/.test(t))return'Tecnología';if(/earthquake|flood|storm|hurricane|fire|volcano/.test(t))return'Desastres';return'General';}

async function fetchGdelt(){
 const url='https://api.gdeltproject.org/api/v2/doc/doc?query=(news%20OR%20world)&mode=artlist&maxrecords=50&timespan=6h&sort=datedesc&format=json';
 const res=await fetch(url,{cache:'no-store',headers:{accept:'application/json'}});
 if(!res.ok)throw new Error(`GDELT ${res.status}`);
 const data=await res.json();
 return (data.articles??[]).map((a:any,i:number)=>{const title=String(a.title??'Sin título');const domain=String(a.domain??'');const place=locate(title,'',domain);return{id:`gdelt-${i}`,title,country:place.country,category:categoryOf(title),time:parseGdeltDate(a.seendate),lat:place.lat,lng:place.lng,url:String(a.url??''),source:domain||'GDELT'};}).filter((a:any)=>a.url);
}
function parseGdeltDate(value:any){const s=String(value??'');if(/^\d{14}$/.test(s)){const d=new Date(`${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}T${s.slice(8,10)}:${s.slice(10,12)}:${s.slice(12,14)}Z`);return d.toISOString();}const d=new Date(s);return Number.isNaN(d.getTime())?new Date().toISOString():d.toISOString();}

export async function GET(){
 try{
  const articles=await fetchGdelt();
  return NextResponse.json({source:'GDELT',articles:articles.length?articles:FALLBACK,updatedAt:new Date().toISOString()},{headers:{'Cache-Control':'s-maxage=600, stale-while-revalidate=300'}});
 }catch(error){
  console.error('WorldNewsMap news feed error:',error);
  return NextResponse.json({source:'fallback',articles:FALLBACK,updatedAt:new Date().toISOString(),error:'news_source_unavailable'},{status:200,headers:{'Cache-Control':'s-maxage=60, stale-while-revalidate=300'}});
 }
}
