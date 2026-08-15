'use client';
import {useEffect,useRef} from 'react';
import type * as Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
export type MapNews={id:string;title:string;country:string;category:string;lng:number;lat:number};
const colors:Record<string,string>={Seguridad:'#ff4d5e',Política:'#4da3ff',Tecnología:'#4da3ff',Ciencia:'#35d07f',Economía:'#ffc44d',General:'#8fa8c2',Desastres:'#ff8a3d'};
export default function WorldMap({news,onSelect}:{news:MapNews[];onSelect:(id:string)=>void}){
 const ref=useRef<HTMLDivElement|null>(null),mapRef=useRef<Leaflet.Map|null>(null),markersRef=useRef<Leaflet.LayerGroup|null>(null),selectRef=useRef(onSelect),newsRef=useRef(news);
 useEffect(()=>{selectRef.current=onSelect;newsRef.current=news},[onSelect,news]);
 const renderMarkers=()=>{const LGroup=markersRef.current;const map=mapRef.current;if(!LGroup||!map)return;LGroup.clearLayers();import('leaflet').then(L=>{if(!markersRef.current||!mapRef.current)return;for(const n of newsRef.current){const lat=Number(n.lat),lng=Number(n.lng);if(!Number.isFinite(lat)||!Number.isFinite(lng))continue;const c=colors[n.category]||colors.General;const marker=L.marker([lat,lng],{icon:L.divIcon({className:'news-marker',html:`<span style="background:${c}"></span>`,iconSize:[16,16],iconAnchor:[8,8]})}).bindPopup(`<strong>${n.country}</strong><br>${n.title}`);marker.on('click',()=>selectRef.current(n.id));markersRef.current.addLayer(marker);}});};
 useEffect(()=>{
  let cancelled=false;let cleanup:(()=>void)|undefined;
  const load=async()=>{const L=await import('leaflet');if(cancelled||!ref.current)return;
   const map=L.map(ref.current,{worldCopyJump:true,minZoom:1,maxZoom:8,zoomControl:true}).setView([20,0],1.25);mapRef.current=map;
   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
   markersRef.current=L.layerGroup().addTo(map);renderMarkers();
   const resize=()=>map.invalidateSize(false);const ro=new ResizeObserver(resize);ro.observe(ref.current);window.addEventListener('resize',resize);requestAnimationFrame(resize);setTimeout(resize,250);setTimeout(resize,1000);
   cleanup=()=>{ro.disconnect();window.removeEventListener('resize',resize);map.remove();mapRef.current=null;markersRef.current=null};
  };load();return()=>{cancelled=true;cleanup?.()};
 },[]);
 useEffect(()=>{newsRef.current=news;renderMarkers()},[news]);
 return <div ref={ref} aria-label="Mapa mundial de noticias" style={{position:'relative',width:'100%',height:'100%',minHeight:'520px',overflow:'hidden'}}/>;
}
