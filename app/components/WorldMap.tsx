'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export type MapNews={id:number;title:string;country:string;category:string;lng:number;lat:number};

export default function WorldMap({news,onSelect}:{news:MapNews[];onSelect:(id:number)=>void}){
 const ref=useRef<HTMLDivElement|null>(null);
 useEffect(()=>{
  if(!ref.current)return;
  const map=new maplibregl.Map({container:ref.current,style:'https://demotiles.maplibre.org/style.json',center:[0,20],zoom:1.35,minZoom:1.1,maxZoom:8});
  map.addControl(new maplibregl.NavigationControl(),'top-right');
  news.forEach(n=>{
   const el=document.createElement('button'); el.className='real-marker'; el.title=n.title;
   el.onclick=()=>onSelect(n.id);
   new maplibregl.Marker({element:el}).setLngLat([n.lng,n.lat]).addTo(map);
  });
  return()=>map.remove();
 },[news,onSelect]);
 return <div ref={ref} className="real-map"/>;
}
