// ============================================
// FILE: tv.jsx — CYBEV TV 2.0
// Netflix-style dark streaming hub
// ============================================
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import api from '@/lib/api';
import AppLayout from '@/components/Layout/AppLayout';
import { Play, Tv, Radio, Clock, Eye, Heart, Users, Search, ChevronRight, ChevronLeft, Film, Headphones, Video, Flame, TrendingUp, Star, Zap, Globe, Loader2, PlayCircle, PlusCircle, Sparkles, Music, BookOpen, Gamepad2, Code, Palette, Dumbbell, Info } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All' }, { id: 'live', label: '🔴 Live' }, { id: 'trending', label: 'Trending' },
  { id: 'ministry', label: 'Ministry' }, { id: 'music', label: 'Music' }, { id: 'teaching', label: 'Teaching' },
  { id: 'entertainment', label: 'Entertainment' }, { id: 'tech', label: 'Tech' }, { id: 'gaming', label: 'Gaming' },
  { id: 'lifestyle', label: 'Lifestyle' }, { id: 'fitness', label: 'Fitness' },
];

function formatDuration(s) { if (!s) return ''; const m = Math.floor(s/60), sc = s%60; return m>60?`${Math.floor(m/60)}:${(m%60+'').padStart(2,'0')}:${(sc+'').padStart(2,'0')}`:`${m}:${(sc+'').padStart(2,'0')}`; }
function formatViews(n) { if (!n) return '0'; if (n>=1e6) return (n/1e6).toFixed(1)+'M'; if (n>=1e3) return (n/1e3).toFixed(1)+'K'; return n+''; }
function getViews(i) { return i.viewerCount || i.viewsCount || (Array.isArray(i.views)?i.views.length:i.views||0); }
function getThumb(i) { return i.thumbnail||i.thumbnailUrl||i.coverImage||i.featuredImage||(i.videoUrl?i.videoUrl.replace(/\.mp4.*/,'.jpg').replace('/upload/','/upload/w_640,h_360,c_fill/'):''); }
function timeAgo(d) { if(!d) return ''; const s=Math.floor((Date.now()-new Date(d))/1000); if(s<60) return 'Just now'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; if(s<604800) return Math.floor(s/86400)+'d'; return new Date(d).toLocaleDateString(); }
function getName(i) { return i.host?.displayName||i.host?.username||i.user?.username||i.author?.username||i.authorName||''; }

// ═══ HERO BANNER ═══
function HeroBanner({ items, onClick }) {
  const [idx, setIdx] = useState(0);
  const list = (items||[]).slice(0,5);
  const c = list[idx];
  useEffect(() => { if(list.length<=1) return; const t=setInterval(()=>setIdx(i=>(i+1)%list.length),8000); return()=>clearInterval(t); }, [list.length]);
  if (!c) return null;
  const live = c.status==='live'||c.isLive;
  return (
    <div className="relative w-full aspect-[21/9] md:aspect-[2.6/1] rounded-2xl overflow-hidden cursor-pointer group" onClick={()=>onClick(c)}>
      {getThumb(c)?<img src={getThumb(c)} alt="" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-[2s]"/>:<div className="w-full h-full bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900"/>}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"/>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent"/>
      <div className="absolute bottom-0 left-0 p-5 md:p-8 max-w-lg z-10">
        {live&&<div className="inline-flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-3 animate-pulse"><Radio size={12}/> LIVE</div>}
        <h2 className="text-white text-xl md:text-3xl font-black mb-2 leading-tight drop-shadow-lg line-clamp-2">{c.title||c.caption||'Featured'}</h2>
        {c.description&&<p className="text-gray-300 text-sm line-clamp-2 mb-3">{c.description}</p>}
        <div className="flex items-center gap-3 text-gray-400 text-xs mb-4">
          <span className="text-gray-300 font-medium">{getName(c)}</span>
          <span className="flex items-center gap-1"><Eye size={12}/>{formatViews(getViews(c))}</span>
          {c.createdAt&&<span>{timeAgo(c.createdAt)}</span>}
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-bold text-sm hover:bg-gray-200 shadow-xl"><Play size={18} fill="black"/>{live?'Watch Live':'Play'}</button>
          <button className="flex items-center gap-2 px-4 py-3 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30 backdrop-blur-sm" onClick={e=>e.stopPropagation()}><Info size={16}/> Info</button>
        </div>
      </div>
      {list.length>1&&<div className="absolute bottom-4 right-6 flex gap-1.5 z-10">{list.map((_,i)=><button key={i} onClick={e=>{e.stopPropagation();setIdx(i)}} className={`w-2 h-2 rounded-full transition-all ${i===idx?'bg-white w-6':'bg-white/40'}`}/>)}</div>}
    </div>
  );
}

// ═══ CONTENT CARD ═══
function Card({ item, onClick, small }) {
  const live = item.status==='live'||item.isLive;
  const th = getThumb(item);
  const v = getViews(item);
  return (
    <div onClick={()=>onClick(item)} className={`group cursor-pointer flex-shrink-0 ${small?'w-44 md:w-52':'w-full'}`}>
      <div className="relative rounded-xl overflow-hidden bg-gray-800 aspect-video">
        {th?<img src={th} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"/>:<div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center"><Tv size={28} className="text-gray-600"/></div>}
        {live&&<div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold"><span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"/>LIVE</div>}
        {item.duration&&!live&&<div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white px-1.5 py-0.5 rounded text-[10px] font-mono">{formatDuration(item.duration)}</div>}
        {(live||v>0)&&<div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-[10px]"><Eye size={10}/>{formatViews(v)}</div>}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-xl"><Play size={20} fill="#000" className="ml-0.5 text-black"/></div>
        </div>
      </div>
      <div className="mt-2.5 flex gap-2.5">
        {!small&&(item.host?.avatar||item.user?.avatar||item.author?.avatar||item.authorProfilePicture)&&<div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden flex-shrink-0 mt-0.5"><img src={item.host?.avatar||item.user?.avatar||item.author?.avatar||item.authorProfilePicture} alt="" className="w-full h-full object-cover" onError={e=>e.target.style.display='none'}/></div>}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-gray-100 line-clamp-2 leading-snug ${small?'text-xs':'text-sm'}`}>{item.title||item.caption||'Untitled'}</h3>
          <p className={`text-gray-500 mt-0.5 ${small?'text-[10px]':'text-xs'}`}>{getName(item)}</p>
          <p className={`text-gray-600 ${small?'text-[10px]':'text-xs'}`}>{v>0?formatViews(v)+' views':''}{v>0&&item.createdAt?' · ':''}{item.createdAt?timeAgo(item.createdAt):''}</p>
        </div>
      </div>
    </div>
  );
}

// ═══ SCROLL ROW ═══
function Row({ title, icon: Icon, items, onClick, seeAllHref, small }) {
  const ref = useRef(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);
  const check = () => { const e=ref.current; if(!e) return; setCanL(e.scrollLeft>10); setCanR(e.scrollLeft<e.scrollWidth-e.clientWidth-10); };
  const scroll = d => ref.current?.scrollBy({left:d*350,behavior:'smooth'});
  if (!items?.length) return null;
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">{Icon&&<Icon size={20} className="text-purple-400"/>}{title}</h2>
        {seeAllHref&&<Link href={seeAllHref} className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">See all<ChevronRight size={16}/></Link>}
      </div>
      <div className="relative group/r">
        {canL&&<button onClick={()=>scroll(-1)} className="absolute left-0 top-1/3 -translate-y-1/2 z-10 w-10 h-10 bg-black/80 rounded-full flex items-center justify-center text-white hover:bg-purple-600 opacity-0 group-hover/r:opacity-100 transition-all shadow-xl -ml-2"><ChevronLeft size={20}/></button>}
        {canR&&items.length>3&&<button onClick={()=>scroll(1)} className="absolute right-0 top-1/3 -translate-y-1/2 z-10 w-10 h-10 bg-black/80 rounded-full flex items-center justify-center text-white hover:bg-purple-600 opacity-0 group-hover/r:opacity-100 transition-all shadow-xl -mr-2"><ChevronRight size={20}/></button>}
        <div ref={ref} onScroll={check} className="flex gap-4 overflow-x-auto scroll-smooth pb-2" style={{scrollbarWidth:'none'}}>
          {items.map((item,i)=><div key={item._id||i} className={small?'':'flex-shrink-0 w-[280px] md:w-[300px]'}><Card item={item} onClick={onClick} small={small}/></div>)}
        </div>
      </div>
    </div>
  );
}

// ═══ LIVE STRIP ═══
function LiveStrip({ streams, onClick }) {
  if (!streams?.length) return null;
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2 mb-3"><span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"/>Live Now<span className="text-xs font-normal text-gray-500 ml-1">{streams.length} streaming</span></h2>
      <div className="flex gap-3 overflow-x-auto pb-2" style={{scrollbarWidth:'none'}}>
        {streams.map(s=>(
          <div key={s._id} onClick={()=>onClick(s)} className="flex-shrink-0 w-56 cursor-pointer group">
            <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-800">
              {getThumb(s)?<img src={getThumb(s)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>:<div className="w-full h-full bg-gradient-to-br from-red-900/50 to-gray-900 flex items-center justify-center"><Radio size={24} className="text-red-400 animate-pulse"/></div>}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold"><span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"/>LIVE</div>
              <div className="absolute bottom-2 left-2 right-2"><p className="text-white text-xs font-semibold line-clamp-1">{s.title}</p><p className="text-gray-300 text-[10px] flex items-center gap-1 mt-0.5"><Eye size={10}/>{formatViews(s.viewerCount||getViews(s))} watching</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ MAIN ═══
export default function CybevTV() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('all');
  const [searchQ, setSearchQ] = useState('');
  const [featured, setFeatured] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [watchParties, setWatchParties] = useState([]);
  const [catContent, setCatContent] = useState([]);

  const fetch_ = useCallback(async () => {
    try {
      const [f,l,t,r,w] = await Promise.all([
        api.get('/api/vlogs?sort=-views&limit=5').catch(()=>({data:{vlogs:[]}})),
        api.get('/api/vlogs?status=live&limit=20').catch(()=>({data:{vlogs:[]}})),
        api.get('/api/vlogs?sort=-views&limit=20').catch(()=>({data:{vlogs:[]}})),
        api.get('/api/vlogs?sort=-createdAt&limit=20').catch(()=>({data:{vlogs:[]}})),
        api.get('/api/watch-party?status=live&limit=10').catch(()=>({data:{parties:[]}})),
      ]);
      const li=l.data?.vlogs||l.data||[], fi=f.data?.vlogs||f.data||[], ti=t.data?.vlogs||t.data||[];
      setFeatured([...li.slice(0,2),...fi.slice(0,3)].filter(Boolean).length?[...li.slice(0,2),...fi.slice(0,3)]:ti.slice(0,3));
      setLiveStreams(li); setTrending(ti); setRecent(r.data?.vlogs||r.data||[]); setWatchParties(w.data?.parties||[]);
    } catch(e){ console.error('TV:',e); } finally { setLoading(false); }
  },[]);

  useEffect(()=>{fetch_()},[fetch_]);

  useEffect(()=>{
    if(['all','live','trending'].includes(activeCat)){setCatContent([]);return;}
    api.get(`/api/vlogs?category=${activeCat}&limit=30`).then(({data})=>setCatContent(data?.vlogs||data||[])).catch(()=>setCatContent([]));
  },[activeCat]);

  const go = i => { if(i.status==='live'&&i.streamKey) router.push(`/live/${i._id}`); else router.push(`/vlog/${i._id}`); };
  const goWP = p => router.push(`/watch-party/${p._id}`);

  const catD = activeCat==='live'?{items:liveStreams,title:'Live Now'}:activeCat==='trending'?{items:trending,title:'Trending'}:activeCat!=='all'?{items:catContent,title:CATEGORIES.find(c=>c.id===activeCat)?.label||''}:null;

  return (
    <AppLayout>
      <Head><title>CYBEV TV</title></Head>
      <div className="min-h-screen" style={{background:'linear-gradient(180deg,#0a0a12 0%,#0d0d18 50%,#0a0a12 100%)'}}>
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2"><Tv className="text-purple-400" size={26}/><span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">CYBEV TV</span></h1>
            <div className="flex items-center gap-2">
              <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/><input type="text" placeholder="Search..." value={searchQ} onChange={e=>setSearchQ(e.target.value)} className="pl-9 pr-4 py-2 bg-gray-800/80 border border-gray-700/50 rounded-full text-sm w-40 md:w-56 focus:ring-1 focus:ring-purple-500 outline-none text-gray-200 placeholder-gray-600"/></div>
              <Link href="/live/go-live" className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold"><Radio size={12}/>Go Live</Link>
              <Link href="/vlog/create" className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-full text-xs font-medium border border-gray-700"><PlusCircle size={12}/>Upload</Link>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-5" style={{scrollbarWidth:'none'}}>
            {CATEGORIES.map(c=><button key={c.id} onClick={()=>setActiveCat(c.id)} className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${activeCat===c.id?'bg-purple-600 text-white shadow-lg shadow-purple-600/30':'bg-gray-800/80 text-gray-400 hover:bg-gray-700 border border-gray-700/50'}`}>{c.label}</button>)}
          </div>

          {loading?(
            <div className="flex items-center justify-center py-32"><Loader2 size={36} className="animate-spin text-purple-500"/></div>
          ):(
            <>
              {catD?(
                <div>
                  <h2 className="text-xl font-bold text-gray-100 mb-4">{catD.title}</h2>
                  {catD.items.length===0?<div className="text-center py-20"><Tv size={48} className="mx-auto mb-3 text-gray-700"/><p className="text-gray-500">No content yet</p></div>:(
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">{catD.items.map(i=><Card key={i._id} item={i} onClick={go}/>)}</div>
                  )}
                </div>
              ):(
                <>
                  {featured.length>0&&<HeroBanner items={featured} onClick={go}/>}
                  <div className="h-6"/>
                  <LiveStrip streams={liveStreams} onClick={go}/>
                  {watchParties.length>0&&<Row title="Watch Parties" icon={Users} items={watchParties.map(wp=>({...wp,thumbnail:wp.coverImage||wp.videoSource?.thumbnail,host:wp.host,viewerCount:(wp.participants||[]).filter(p=>p.isActive).length,status:wp.status==='live'?'live':'ended'}))} onClick={goWP} seeAllHref="/watch-party" small/>}
                  <Row title="Trending" icon={Flame} items={trending} onClick={go}/>
                  <Row title="New Uploads" icon={Sparkles} items={recent} onClick={go}/>
                  {trending.length===0&&recent.length===0&&liveStreams.length===0&&(
                    <div className="text-center py-20"><Tv size={56} className="mx-auto mb-4 text-gray-700"/><h3 className="text-gray-400 font-semibold text-lg mb-2">No content yet</h3><p className="text-gray-600 text-sm mb-6">Be the first to upload or go live</p><div className="flex justify-center gap-3"><Link href="/live/go-live" className="px-5 py-2.5 bg-red-600 text-white rounded-full text-sm font-medium">Go Live</Link><Link href="/vlog/create" className="px-5 py-2.5 bg-gray-800 text-gray-200 rounded-full text-sm border border-gray-700">Upload</Link></div></div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
