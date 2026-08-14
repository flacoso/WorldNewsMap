'use client';

import { useMemo, useState } from 'react';

type News = { id:number; title:string; country:string; category:string; time:string; color:string };
const news:News[] = [
 {id:1,title:'Nuevas conversaciones diplomáticas marcan la agenda internacional',country:'Ginebra, Suiza',category:'Política',time:'Hace 12 min',color:'blue'},
 {id:2,title:'Actualización sobre la situación en Europa oriental',country:'Kyiv, Ucrania',category:'Seguridad',time:'Hace 18 min',color:''},
 {id:3,title:'Mercados asiáticos reaccionan a nuevos datos económicos',country:'Tokio, Japón',category:'Economía',time:'Hace 26 min',color:'yellow'},
 {id:4,title:'Avances científicos abren nuevas posibilidades para la energía limpia',country:'São Paulo, Brasil',category:'Ciencia',time:'Hace 34 min',color:'green'},
 {id:5,title:'Nueva misión tecnológica despierta interés internacional',country:'California, EE. UU.',category:'Tecnología',time:'Hace 41 min',color:'blue'},
 {id:6,title:'Autoridades informan sobre condiciones meteorológicas',country:'Ciudad del Cabo, Sudáfrica',category:'Desastres',time:'Hace 49 min',color:''}
];
const categories=['Todos','Política','Seguridad','Economía','Ciencia','Tecnología','Desastres'];

export default function Home(){
 const [selected,setSelected]=useState(1); const [filter,setFilter]=useState('Todos'); const [query,setQuery]=useState('');
 const filtered=useMemo(()=>news.filter(n=>(filter==='Todos'||n.category===filter)&&(`${n.title} ${n.country}`.toLowerCase().includes(query.toLowerCase()))),[filter,query]);
 const selectedNews=news.find(n=>n.id===selected);
 return <main className="app">
  <header className="topbar"><div className="brand">🌎 <span>WorldNews</span>Map</div><input className="search" placeholder="Buscar país, ciudad o acontecimiento..." value={query} onChange={e=>setQuery(e.target.value)}/></header>
  <section className="content">
   <aside className="sidebar"><div className="section-title"><h2>Últimos acontecimientos</h2><span className="badge">EN VIVO</span></div>
    <div className="filters">{categories.map(c=><button key={c} className={`filter ${filter===c?'active':''}`} onClick={()=>setFilter(c)}>{c}</button>)}</div>
    {filtered.length ? filtered.map(n=><article key={n.id} className="news-card" onClick={()=>setSelected(n.id)}><div className="meta">{n.country} · {n.time}</div><div className="news-title">{n.title}</div><span className="category">{n.category}</span></article>) : <div className="empty">No encontramos acontecimientos con esos filtros.</div>}
   </aside>
   <div className="map-wrap"><div className="map-placeholder"><div className="grid"/><div className="continent na"/><div className="continent sa"/><div className="continent eu"/><div className="continent af"/><div className="continent asia"/><div className="continent au"/>
    {[1,2,3,4,5,6].map(id=><button key={id} aria-label={`Acontecimiento ${id}`} className={`marker ${news[id-1].color} m${id}`} onClick={()=>setSelected(id)}/>) }
    <div className="map-label">🛰️ Mapa mundial · acontecimientos recientes</div>
    {selectedNews && <div className="selected-news"><div className="meta">{selectedNews.country} · {selectedNews.time}</div><div className="selected-title">{selectedNews.title}</div><span className="category">{selectedNews.category}</span></div>}
    <div className="legend"><div><i className="dot red"/>Seguridad</div><div><i className="dot blue"/>Política / tecnología</div><div><i className="dot green"/>Ciencia</div><div><i className="dot yellow"/>Economía</div></div>
   </div></div>
  </section>
 </main>;
}
