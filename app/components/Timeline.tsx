'use client';
import {useMemo,useState} from 'react';
import type {MapNews} from './WorldMap';

type News=MapNews&{time:string;title:string;country:string};
function parseTime(t:string){const d=new Date(t);return Number.isNaN(d.getTime())?0:d.getTime()}
export default function Timeline({news,onChange}:{news:News[];onChange:(items:News[])=>void}){
 const [hours,setHours]=useState(6);
 const now=Date.now();
 const items=useMemo(()=>news.filter(n=>{const t=parseTime(n.time);return !t||now-t<=hours*3600000}),[news,hours,now]);
 const change=(h:number)=>{setHours(h);const n=Date.now();onChange(news.filter(x=>{const t=parseTime(x.time);return !t||n-t<=h*3600000}))};
 return <div className="timeline"><div className="timeline-head"><span>🕐 LÍNEA TEMPORAL</span><b>Últimas {hours} horas</b></div><input type="range" min="1" max="24" value={hours} onChange={e=>change(Number(e.target.value))}/><div className="timeline-scale"><span>1h</span><span>6h</span><span>12h</span><span>18h</span><span>24h</span></div><div className="timeline-count">{items.length} acontecimientos en este periodo</div></div>;
}
