'use client';
import {useEffect,useRef} from 'react';
import type * as Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
export type MapNews={id:string;title:string;country:string;category:string;lng:number;lat:number};
const colors:Record<string,string>={Seguridad:'#ef4444',Política:'#3b82f6',Tecnología:'#3b82f6',Ciencia:'#22c55e',Economía:'#eab308',General:'#94a3b8',Desastres:'#f97316'};
export default function WorldMap({news,onSelect}:{news:MapNews[];onSelect:(id:string)=>void}){
 const ref=useRef<HTMLDivElement|null>(null),mapRef=useRef<Leaflet.Map|null>(null),markersRef=useRef<Leaflet.LayerGroup|null>(null),selectRef=useRef(onSelect),newsRef=useRef(news);
 useEffect(()=>{selectRef.current=onSelect;newsRef.current=news},[onSelect,news]);
 const renderMarkers=()=>{const group=markersRef.current;if(!group)return;import('leaflet').then(L=>{if(!markersRef.current)return;group.clearLayers();for(const n of newsRef.current){const lat=Number(n.lat),lng=Number(n.lng);if(!Number.isFinite(lat)||!Number.isFinite(lng))continue;const color=colors[n.category]||colors.General;const marker=L.circleMarker([lat,lng],{radius:8,color:'#fff',weight:2,fillColor:color,fillOpacity:1});marker.bindTooltip(`${n.country} · ${n.category}`,{direction:'top',offset:[0,-8]});marker.bindPopup(`<strong>${n.country}</strong><br/>${n.title}`);marker.on('click',()=>selectRef.current(n.id));group.addLayer(marker);}});};
 useEffect(()=>{let cancelled=false;let cleanup:(()=>void)|undefined;const load=async()=>{const L=await import('leaflet');if(cancelled||!ref.current)return;const map=L.map(ref.current,{worldCopyJump:true,minZoom:1,maxZoom:8,zoomControl:true}).setView([20,0],1.25);mapRef.current=map;L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);markersRef.current=L.layerGroup().addTo(map);renderMarkers();const resize=()=>map.invalidateSize(false);const ro=new ResizeObserver(resize);ro.observe(ref.current);window.addEventListener('resize',resize);requestAnimationFrame(resize);setTimeout(resize,250);setTimeout(resize,1000);cleanup=()=>{ro.disconnect();window.removeEventListener('resize',resize);map.remove();mapRef.current=null;markersRef.current=null};};load();return()=>{cancelled=true;cleanup?.()};},[]);
 useEffect(()=>{newsRef.current=news;renderMarkers()},[news]);
 return <div ref={ref} aria-label="Mapa mundial de noticias" style={{position:'relative',width:'100%',height:'100%',minHeight:'520px',overflow:'hidden'}}/>;
}
