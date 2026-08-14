'use client';
import { useMemo,useState } from 'react';
import WorldMap,{MapNews} from './components/WorldMap';

type News=MapNews&{time:string;color:string};
const news:News[]=[
{id:1,title:'Nuevas conversaciones diplomáticas marcan la agenda internacional',country:'Ginebra, Suiza',category:'Política',time:'Hace 12 min',color:'blue',lng:6.14,lat:46.2},
{id:2,title:'Actualización sobre la situación en Europa oriental',country:'Kyiv, Ucrania',category:'Seguridad',time:'Hace 18 min',color:'',lng:30.52,lat:50.45},
{id:3,title:'Mercados asiáticos reaccionan a nuevos datos económicos',country:'Tokio, Japón',category:'Economía',time:'Hace 26 min',color:'yellow',lng:139.69,lat:35.68},
{id:4,title:'Avances científicos abren nuevas posibilidades para la energía limpia',country:'São Paulo, Brasil',category:'Ciencia',time:'Hace 34 min',color:'green',lng:-46.63,lat:-23.55},
{id:5,title:'Nueva misión tecnológica despierta interés internacional',country:'California, EE. UU.',category:'Tecnología',time:'Hace 41 min',color:'blue',lng:-122.42,lat:37.77},
{id:6,title:'Autoridades informan sobre condiciones meteorológicas',country:'Ciudad del Cabo, Sudáfrica',category:'Desastres',time:'Hace 49 min',color:'',lng:18.42,lat:-33.92}
];
const categories=['Todos','Política','Seguridad','Economía','Ciencia','Tecnología','Desastres'];
export default function Home(){
 const [selected,setSelected]=useState(1),[filter,setFilter]=useState('Todos'),[query,setQuery]=useState('');
 const filtered=useMemo(()=>news.filter(n=>(filter==='Todos'||n.category===filter)&&(`${n.title} ${n.country}`.toLowerCase().includes(query.toLowerCase()))),[filter,query]);
 const selectedNews=news.find(n=>n.id===selected);
 return <main className="app"><header className="topbar"><div className="brand">🌎 <span>WorldNews</span>Map</div><input className="search" placeholder="Buscar país, ciudad o acontecimiento..." value={query} onChange={e=>setQuery(e.target.value)}/></header><section className="content"><aside className="sidebar"><div className="section-title"><h2>Últimos acontecimientos</h2><span className="badge">EN VIVO</span></div><div className="filters">{categories.map(c=><button key={c} className={`filter ${filter===c?'active':''}`} onClick={()=>setFilter(c)}>{c}</button>)}</div>{filtered.map(n=><article key={n.id} className="news-card" onClick={()=>setSelected(n.id)}><div className="meta">{n.country} · {n.time}</div><div className="news-title">{n.title}</div><span className="category">{n.category}</span></article>)}</aside><div className="map-wrap"><WorldMap news={news} onSelect={setSelected}/><div className="map-label">🛰️ Mapa mundial · acontecimientos recientes</div>{selectedNews&&<div className="selected-news"><div className="meta">{selectedNews.country} · {selectedNews.time}</div><div className="selected-title">{selectedNews.title}</div><span className="category">{selectedNews.category}</span></div>}<div className="legend"><div><i className="dot red"/>Seguridad</div><div><i className="dot blue"/>Política / tecnología</div><div><i className="dot green"/>Ciencia</div><div><i className="dot yellow"/>Economía</div></div></div></section></main>;
}
