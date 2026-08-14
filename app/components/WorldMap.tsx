'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export type MapNews={id:string;title:string;country:string;category:string;lng:number;lat:number};

export default function WorldMap({news,onSelect}:{news:MapNews[];onSelect:(id:string)=>void}){
 const ref=useRef<HTMLDivElement|null>(null);
 const selectRef=useRef(onSelect);
 useEffect(()=>{selectRef.current=onSelect},[onSelect]);
 useEffect(()=>{
  if(!ref.current)return;
  const map=new maplibregl.Map({container:ref.current,style:'https://demotiles.maplibre.org/style.json',center:[0,20],zoom:1.35,minZoom:1,maxZoom:8});
  map.addControl(new maplibregl.NavigationControl(),'top-right');
  map.on('load',()=>{
   map.addSource('news',{type:'geojson',data:{type:'FeatureCollection',features:news.map(n=>({type:'Feature',geometry:{type:'Point',coordinates:[n.lng,n.lat]},properties:{id:n.id,title:n.title,country:n.country,category:n.category}}))},cluster:true,clusterMaxZoom:5,clusterRadius:48});
   map.addLayer({id:'clusters',type:'circle',source:'news',filter:['has','point_count'],paint:{'circle-color':['step',['get','point_count'],'#3b82f6',10,'#8b5cf6',30,'#ef4444'],'circle-radius':['step',['get','point_count'],20,10,25,30,31],'circle-stroke-width':2,'circle-stroke-color':'#fff'}});
   map.addLayer({id:'cluster-count',type:'symbol',source:'news',filter:['has','point_count'],layout:{'text-field':['get','point_count_abbreviated'],'text-size':12},paint:{'text-color':'#fff'}});
   map.addLayer({id:'news-points',type:'circle',source:'news',filter:['!',['has','point_count']],paint:{'circle-color':['match',['get','category'],'Seguridad','#ff4d5e','Política','#4da3ff','Tecnología','#4da3ff','Ciencia','#35d07f','Economía','#ffc44d','#8fa8c2'],'circle-radius':7,'circle-stroke-color':'#fff','circle-stroke-width':2}});
   map.on('click','clusters',async e=>{const f=map.queryRenderedFeatures(e.point,{layers:['clusters']})[0];const clusterId=f.properties?.cluster_id;const source=map.getSource('news') as maplibregl.GeoJSONSource;const zoom=await source.getClusterExpansionZoom(clusterId);map.easeTo({center:(f.geometry as GeoJSON.Point).coordinates as [number,number],zoom});});
   map.on('click','news-points',e=>{const f=map.queryRenderedFeatures(e.point,{layers:['news-points']})[0];if(f.properties?.id)selectRef.current(String(f.properties.id));});
   map.on('mouseenter','clusters',()=>map.getCanvas().style.cursor='pointer');
   map.on('mouseleave','clusters',()=>map.getCanvas().style.cursor='');
   map.on('mouseenter','news-points',()=>map.getCanvas().style.cursor='pointer');
   map.on('mouseleave','news-points',()=>map.getCanvas().style.cursor='');
  });
  return()=>map.remove();
 },[news]);
 return <div ref={ref} className="real-map"/>;
}
