'use client';
import {useEffect,useRef} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
export type MapNews={id:string;title:string;country:string;category:string;lng:number;lat:number};
const icon=L.divIcon({className:'news-marker',html:'<span></span>',iconSize:[14,14],iconAnchor:[7,7]});
const colors:Record<string,string>={Seguridad:'#ff4d5e',Política:'#4da3ff',Tecnología:'#4da3ff',Ciencia:'#35d07f',Economía:'#ffc44d',General:'#8fa8c2',Desastres:'#ff8a3d'};
export default function WorldMap({news,onSelect}:{news:MapNews[];onSelect:(id:string)=>void}){
 const ref=useRef<HTMLDivElement|null>(null),mapRef=useRef<L.Map|null>(null),markersRef=useRef<L.LayerGroup|null>(null),selectRef=useRef(onSelect),newsRef=useRef(news);
 useEffect(()=>{selectRef.current=onSelect;newsRef.current=news},[onSelect,news]);
 useEffect(()=>{
  if(!ref.current)return;
  const map=L.map(ref.current,{worldCopyJump:true,minZoom:1,maxZoom:8,zoomControl:true}).setView([20,0],1.25);
  mapRef.current=map;
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
  const markers=L.layerGroup().addTo(map);markersRef.current=markers;
  const render=()=>{markers.clearLayers();for(const n of newsRef.current){const lat=Number(n.lat),lng=Number(n.lng);if(!Number.isFinite(lat)||!Number.isFinite(lng))continue;const c=colors[n.category]||colors.General;const marker=L.marker([lat,lng],{icon:L.divIcon({className:'news-marker',html:`<span style="background:${c}"></span>`,iconSize:[16,16],iconAnchor:[8,8]})}).bindTooltip(`${n.country} · ${n.category}`,{direction:'top',offset:[0,-8]});marker.on('click',()=>selectRef.current(n.id));markers.addLayer(marker);}};
  render();
  const resize=()=>map.invalidateSize(false);const ro=new ResizeObserver(resize);ro.observe(ref.current);window.addEventListener('resize',resize);requestAnimationFrame(resize);setTimeout(resize,250);setTimeout(resize,1000);
  return()=>{ro.disconnect();window.removeEventListener('resize',resize);map.remove();mapRef.current=null;markersRef.current=null};
 },[]);
 useEffect(()=>{newsRef.current=news;markersRef.current?.clearLayers();const map=mapRef.current;if(!map)return;for(const n of news){const lat=Number(n.lat),lng=Number(n.lng);if(!Number.isFinite(lat)||!Number.isFinite(lng))continue;const c=colors[n.category]||colors.General;const marker=L.marker([lat,lng],{icon:L.divIcon({className:'news-marker',html:`<span style="background:${c}"></span>`,iconSize:[16,16],iconAnchor:[8,8]})}).bindTooltip(`${n.country} · ${n.category}`,{direction:'top',offset:[0,-8]});marker.on('click',()=>selectRef.current(n.id));markersRef.current?.addLayer(marker);}},[news]);
 return <div ref={ref} aria-label="Mapa mundial de noticias" style={{position:'relative',width:'100%',height:'100%',minHeight:'520px',overflow:'hidden'}}/>;
}
