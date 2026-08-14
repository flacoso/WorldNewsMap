'use client';

type News={country:string;category:string};
export default function WorldStats({news}:{news:News[]}){
 const counts=new Map<string,number>();news.forEach(n=>counts.set(n.country,(counts.get(n.country)||0)+1));
 const top=[...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8);
 const categories=['Seguridad','Política','Economía','Ciencia','Tecnología','Desastres','General'];
 return <section className="world-stats"><div className="stats-head"><div><small>ACTIVIDAD MUNDIAL</small><h3>{news.length} acontecimientos</h3></div><div className="live-dot">● EN VIVO</div></div><div className="stat-grid">{categories.map(c=>{const n=news.filter(x=>x.category===c).length;return <div className="stat-card" key={c}><span>{c}</span><strong>{n}</strong></div>})}</div>{top.length>0&&<div className="top-countries"><h4>Países con mayor actividad</h4>{top.map(([c,n],i)=><div className="country-row" key={c}><span>{i+1}. {c}</span><b>{n}</b></div>)}</div>}</section>;
}
