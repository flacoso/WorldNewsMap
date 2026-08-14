'use client';
import {useEffect,useRef} from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
export type MapNews={id:string;title:string;country:string;category:string;lng:number;lat:number};
const EMPTY={type:'FeatureCollection',features:[]} as GeoJSON.FeatureCollection;
const STYLE={version:8 as const,sources:{osm:{type:'raster' as const,tiles:['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],tileSize:256,attribution:'© OpenStreetMap contributors'}},layers:[{id:'osm',type:'raster' as const,source:'osm'}]};
function geo(news:MapNews[]):GeoJSON.FeatureCollection{return news.length?{type:'FeatureCollection',features:news.map(n=>({type:'Feature',geometry:{type:'Point',coordinates:[Number(n.lng)||0,Number(n.lat)||0]},properties:{id:n.id,title:n.title,country:n.country,category:n.category}}))}:EMPTY;}
export default function WorldMap({news,onSelect}:{news:MapNews[];onSelect:(id:string)=>void}){
 const ref=useRef<HTMLDivElement|null>(null),mapRef=useRef<maplibregl.Map|null>(null),selectRef=useRef(onSelect),newsRef=useRef(news);
 useEffect(()=>{selectRef.current=onSelect;newsRef.current=news},[onSelect,news]);
 useEffect(()=>{
  if(!ref.current)return;
  const container=ref.current;
  const map=new maplibregl.Map({container,style:STYLE,center:[0,20],zoom:1.25,minZoom:1,maxZoom:8,attributionControl:{compact:true}});
  mapRef.current=map;map.addControl(new maplibregl.NavigationControl(),'top-right');
  const render=()=>{const data=geo(newsRef.current);map.addSource('news',{type:'geojson',data,cluster:true,clusterMaxZoom:5,clusterRadius:48});map.addLayer({id:'clusters',type:'circle',source:'news',filter:['has','point_count'],paint:{'circle-color':['step',['get','point_count'],'#3b82f6',10,'#8b5cf6',30,'#ef4444'],'circle-radius':['step',['get','point_count'],20,10,25,30,31],'circle-stroke-width':2,'circle-stroke-color':'#fff'}});map.addLayer({id:'cluster-count',type:'symbol',source:'news',filter:['has','point_count'],layout:{'text-field':['get','point_count_abbreviated'],'text-size':12},paint:{'text-color':'#fff'}});map.addLayer({id:'news-points',type:'circle',source:'news',filter:['!',['has','point_count']],paint:{'circle-color':['match',['get','category'],'Seguridad','#ff4d5e','Política','#4da3ff','Tecnología','#4da3ff','Ciencia','#35d07f','Economía','#ffc44d','#8fa8c2'],'circle-radius':7,'circle-stroke-color':'#fff','circle-stroke-width':2}});map.on('click','clusters',async e=>{const f=map.queryRenderedFeatures(e.point,{layers:['clusters']})[0];if(!f)return;const id=Number(f.properties?.cluster_id);const src=map.getSource('news') as maplibregl.GeoJSONSource;map.easeTo({center:(f.geometry as GeoJSON.Point).coordinates as [number,number],zoom:await src.getClusterExpansionZoom(id)});});map.on('click','news-points',e=>{const f=map.queryRenderedFeatures(e.point,{layers:['news-points']})[0];if(f?.properties?.id)selectRef.current(String(f.properties.id));});};
  map.once('load',render);map.on('error',e=>console.error('WorldNewsMap map error',e.error));
  const resize=()=>map.resize();const ro=new ResizeObserver(resize);ro.observe(container);window.addEventListener('resize',resize);requestAnimationFrame(resize);setTimeout(resize,250);setTimeout(resize,1000);
  return()=>{ro.disconnect();window.removeEventListener('resize',resize);map.remove();mapRef.current=null};
 },[]);
 useEffect(()=>{newsRef.current=news;const map=mapRef.current;if(!map||!map.isStyleLoaded())return;const src=map.getSource('news') as maplibregl.GeoJSONSource|undefined;if(src)src.setData(geo(news));},[news]);
 return <div ref={ref} aria-label="Mapa mundial de noticias" style={{position:'relative',width:'100%',height:'100%',minHeight:'520px',overflow:'hidden'}}/>;
}
