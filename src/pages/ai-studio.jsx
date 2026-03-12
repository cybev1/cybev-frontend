// ============================================
// FILE: ai-studio.jsx
// PATH: /src/pages/ai-studio.jsx
// CYBEV AI Content Studio — Create with AI
// ============================================
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import api from '@/lib/api';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Film, Music, Image, Sparkles, Wand2, Play, Pause,
  Download, Share2, Loader2, ChevronRight, Coins,
  Video, Mic, Palette, Zap, Clock, RefreshCw,
  CheckCircle2, XCircle, ArrowLeft, Volume2, VolumeX,
  Maximize2, Copy, Heart, Send
} from 'lucide-react';

// ─── Tabs ───
const TOOLS = [
  { id: 'video', label: 'AI Video', icon: Film, color: 'from-purple-600 to-pink-600', desc: 'Generate videos from text prompts' },
  { id: 'music', label: 'AI Music', icon: Music, color: 'from-blue-600 to-cyan-600', desc: 'Compose songs with AI' },
  { id: 'graphics', label: 'AI Graphics', icon: Image, color: 'from-orange-500 to-red-500', desc: 'Create stunning visuals' },
];

const VIDEO_STYLES = ['Cinematic', 'Anime', 'Realistic', '3D Animation', 'Watercolor', 'Vintage Film', 'Neon', 'Documentary'];
const MUSIC_GENRES = ['Pop', 'Gospel', 'Afrobeats', 'Hip Hop', 'R&B', 'EDM', 'Jazz', 'Classical', 'Rock', 'Lo-Fi', 'Worship'];
const MUSIC_MOODS = ['Happy', 'Energetic', 'Chill', 'Emotional', 'Epic', 'Peaceful', 'Dark', 'Motivational', 'Romantic'];
const GRAPHIC_STYLES = ['Photorealistic', 'Digital Art', 'Oil Painting', 'Watercolor', 'Anime', '3D Render', 'Minimalist', 'Abstract', 'Comic Book', 'Pixel Art'];
const ASPECT_RATIOS = [
  { value: '16:9', label: '16:9 Landscape' },
  { value: '9:16', label: '9:16 Portrait' },
  { value: '1:1', label: '1:1 Square' },
];

// ─── Token Cost Display ───
function TokenCost({ cost, label }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
      <Coins size={14} />
      <span className="font-medium">{cost}</span>
      <span className="text-amber-500">credits</span>
      {label && <span className="text-amber-400 text-xs">({label})</span>}
    </div>
  );
}

// ─── Generation Status ───
function GenerationStatus({ status, progress, onRetry }) {
  if (status === 'processing') {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-purple-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-purple-600">{progress || 0}%</span>
          </div>
        </div>
        <p className="text-gray-600 font-medium">AI is creating your content...</p>
        <p className="text-gray-400 text-sm">This may take 30 seconds to a few minutes</p>
      </div>
    );
  }
  if (status === 'failed') {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <XCircle size={48} className="text-red-400" />
        <p className="text-gray-600 font-medium">Generation failed</p>
        <button onClick={onRetry} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700">
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    );
  }
  return null;
}

// ═══════════════════════════════════════════
// VIDEO MAKER TAB
// ═══════════════════════════════════════════
function VideoMaker({ balance }) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [duration, setDuration] = useState('short');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState(null); // null | 'processing' | 'completed' | 'failed'
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const pollRef = useRef(null);

  const costs = { short: 100, medium: 200, long: 500 };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    try {
      setGenerating(true);
      setStatus('processing');
      setProgress(0);

      const { data } = await api.post('/api/ai-content/video/generate', {
        prompt, style, duration, aspectRatio
      });

      if (data.status === 'completed') {
        setResult(data);
        setStatus('completed');
      } else {
        // Poll for status
        const provider = data.provider || 'replicate';
        pollRef.current = setInterval(async () => {
          try {
            const { data: statusData } = await api.get(`/api/ai-content/video/status/${data.taskId}?provider=${provider}`);
            setProgress(statusData.progress || Math.min(progress + 10, 90));
            if (statusData.status === 'completed') {
              clearInterval(pollRef.current);
              setResult(statusData);
              setStatus('completed');
              setGenerating(false);
            } else if (statusData.status === 'failed') {
              clearInterval(pollRef.current);
              setStatus('failed');
              setGenerating(false);
            }
          } catch { /* keep polling */ }
        }, 3000);
      }
    } catch (err) {
      setStatus('failed');
      alert(err?.response?.data?.error || 'Video generation failed');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => () => clearInterval(pollRef.current), []);

  return (
    <div className="space-y-6">
      {/* Prompt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Describe your video</label>
        <textarea
          rows={3} maxLength={1000}
          placeholder="A majestic eagle soaring over a misty mountain range at sunrise, cinematic slow motion..."
          value={prompt} onChange={e => setPrompt(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none text-sm"
        />
      </div>

      {/* Options row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
          <div className="flex flex-wrap gap-2">
            {VIDEO_STYLES.map(s => (
              <button key={s} onClick={() => setStyle(style === s ? '' : s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  style === s ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
          <div className="flex gap-2">
            {[
              { val: 'short', label: '5 sec', cost: 100 },
              { val: 'medium', label: '15 sec', cost: 200 },
              { val: 'long', label: '30+ sec', cost: 500 }
            ].map(d => (
              <button key={d.val} onClick={() => setDuration(d.val)}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  duration === d.val ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div>{d.label}</div>
                <div className="text-amber-500 text-[10px] mt-0.5">{d.cost} credits</div>
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
          <div className="flex gap-2">
            {ASPECT_RATIOS.map(ar => (
              <button key={ar.value} onClick={() => setAspectRatio(ar.value)}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  aspectRatio === ar.value ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {ar.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate button */}
      <div className="flex items-center justify-between">
        <TokenCost cost={costs[duration]} label={duration} />
        <button onClick={handleGenerate}
          disabled={generating || !prompt.trim() || balance < costs[duration]}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {generating ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
          {generating ? 'Generating...' : 'Generate Video'}
        </button>
      </div>

      {/* Status */}
      {status && status !== 'completed' && (
        <GenerationStatus status={status} progress={progress} onRetry={handleGenerate} />
      )}

      {/* Result */}
      {status === 'completed' && result && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-500" /> Video Ready!
          </h3>
          <video src={result.videoUrl} controls className="w-full rounded-lg max-h-96" />
          <div className="flex gap-3 mt-3">
            <a href={result.videoUrl} download className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700">
              <Download size={14} /> Download
            </a>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300">
              <Share2 size={14} /> Post to CYBEV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// MUSIC COMPOSER TAB
// ═══════════════════════════════════════════
function MusicComposer({ balance }) {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('');
  const [duration, setDuration] = useState('short');
  const [instrumental, setInstrumental] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [showLyrics, setShowLyrics] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const pollRef = useRef(null);

  const costs = { short: 50, full: 150 };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    try {
      setGenerating(true);
      setStatus('processing');
      setProgress(0);

      const { data } = await api.post('/api/ai-content/music/generate', {
        prompt, genre, mood, duration, instrumental,
        lyrics: showLyrics && lyrics.trim() ? lyrics : undefined
      });

      if (data.status === 'completed') {
        setResult(data);
        setStatus('completed');
      } else {
        const musicProvider = data.provider || 'replicate';
        pollRef.current = setInterval(async () => {
          try {
            const { data: statusData } = await api.get(`/api/ai-content/music/status/${data.taskId}?provider=${musicProvider}`);
            setProgress(p => Math.min(p + 10, 90));
            if (statusData.status === 'completed') {
              clearInterval(pollRef.current);
              setResult(statusData);
              setStatus('completed');
              setGenerating(false);
            } else if (statusData.status === 'failed') {
              clearInterval(pollRef.current);
              setStatus('failed');
              setGenerating(false);
            }
          } catch {}
        }, 3000);
      }
    } catch (err) {
      setStatus('failed');
      alert(err?.response?.data?.error || 'Music generation failed');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => () => clearInterval(pollRef.current), []);

  return (
    <div className="space-y-6">
      {/* Prompt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Describe your song</label>
        <textarea
          rows={2} maxLength={500}
          placeholder="An upbeat gospel worship song with a powerful choir, drums, and electric guitar..."
          value={prompt} onChange={e => setPrompt(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm"
        />
      </div>

      {/* Genre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
        <div className="flex flex-wrap gap-2">
          {MUSIC_GENRES.map(g => (
            <button key={g} onClick={() => setGenre(genre === g ? '' : g)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                genre === g ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
        <div className="flex flex-wrap gap-2">
          {MUSIC_MOODS.map(m => (
            <button key={m} onClick={() => setMood(mood === m ? '' : m)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                mood === m ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {[{ val: 'short', label: '30 sec', cost: 50 }, { val: 'full', label: 'Full Song', cost: 150 }].map(d => (
            <button key={d.val} onClick={() => setDuration(d.val)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                duration === d.val ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600'
              }`}
            >
              {d.label} · <span className="text-amber-500">{d.cost}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setInstrumental(!instrumental)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            instrumental ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600'
          }`}
        >
          🎵 Instrumental only
        </button>
        <button onClick={() => setShowLyrics(!showLyrics)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            showLyrics ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600'
          }`}
        >
          ✍️ Custom lyrics
        </button>
      </div>

      {/* Custom lyrics */}
      {showLyrics && (
        <textarea
          rows={4} maxLength={2000} placeholder="Write your lyrics here..."
          value={lyrics} onChange={e => setLyrics(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm"
        />
      )}

      {/* Generate */}
      <div className="flex items-center justify-between">
        <TokenCost cost={costs[duration]} label={duration} />
        <button onClick={handleGenerate}
          disabled={generating || !prompt.trim() || balance < costs[duration]}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
        >
          {generating ? <Loader2 size={18} className="animate-spin" /> : <Music size={18} />}
          {generating ? 'Composing...' : 'Compose Song'}
        </button>
      </div>

      {status && status !== 'completed' && <GenerationStatus status={status} progress={progress} onRetry={handleGenerate} />}

      {status === 'completed' && result && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-xl bg-blue-200 overflow-hidden flex-shrink-0">
              {result.coverArt ? <img src={result.coverArt} className="w-full h-full object-cover" alt="" /> :
                <div className="w-full h-full flex items-center justify-center"><Music size={32} className="text-blue-400" /></div>}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">{result.title || 'AI Generated Song'}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{genre || 'Various'} · {mood || 'Mixed'}</p>
              <audio src={result.audioUrl} controls className="w-full mt-3" />
              <div className="flex gap-3 mt-3">
                <a href={result.audioUrl} download className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700">
                  <Download size={14} /> Download
                </a>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300">
                  <Share2 size={14} /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// GRAPHICS GENERATOR TAB
// ═══════════════════════════════════════════
function GraphicsGenerator({ balance }) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [count, setCount] = useState(1);
  const [quality, setQuality] = useState('basic');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const cost = count > 1 ? 80 : quality === 'hd' ? 50 : 20;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    try {
      setGenerating(true);
      setResult(null);
      const { data } = await api.post('/api/ai-content/graphics/generate', {
        prompt, style, size, count, quality
      });
      setResult(data);
    } catch (err) {
      alert(err?.response?.data?.error || 'Image generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Prompt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Describe your image</label>
        <textarea
          rows={3} maxLength={1000}
          placeholder="A futuristic city skyline at dusk with flying cars, neon lights reflecting on glass towers..."
          value={prompt} onChange={e => setPrompt(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-sm"
        />
      </div>

      {/* Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Art Style</label>
        <div className="flex flex-wrap gap-2">
          {GRAPHIC_STYLES.map(s => (
            <button key={s} onClick={() => setStyle(style === s ? '' : s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                style === s ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
          <select value={size} onChange={e => setSize(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="1024x1024">1024×1024 (Square)</option>
            <option value="1792x1024">1792×1024 (Landscape)</option>
            <option value="1024x1792">1024×1792 (Portrait)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
          <div className="flex gap-2">
            {['basic', 'hd'].map(q => (
              <button key={q} onClick={() => setQuality(q)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border ${
                  quality === q ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-300 text-gray-600'
                }`}
              >
                {q === 'hd' ? 'HD' : 'Standard'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Count</label>
          <div className="flex gap-2">
            {[1, 4].map(c => (
              <button key={c} onClick={() => setCount(c)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border ${
                  count === c ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-300 text-gray-600'
                }`}
              >
                {c === 1 ? '1 Image' : '4 Images'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate */}
      <div className="flex items-center justify-between">
        <TokenCost cost={cost} label={quality} />
        <button onClick={handleGenerate}
          disabled={generating || !prompt.trim() || balance < cost}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
        >
          {generating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {generating ? 'Creating...' : 'Generate'}
        </button>
      </div>

      {/* Results */}
      {result && result.images && result.images.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-500" /> Generated Images
          </h3>
          <div className={`grid gap-4 ${result.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1 max-w-lg'}`}>
            {result.images.map((img, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden bg-gray-100">
                <img src={img.url} alt={`Generated ${i + 1}`} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                  <a href={img.url} download className="p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform">
                    <Download size={18} className="text-gray-700" />
                  </a>
                  <button className="p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform">
                    <Share2 size={18} className="text-gray-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN AI STUDIO PAGE
// ═══════════════════════════════════════════
export default function AIStudio() {
  const router = useRouter();
  const [activeTool, setActiveTool] = useState('video');
  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const { data } = await api.get('/api/ai-content/balance');
        setBalance(data.balance || 0);
      } catch {
        setBalance(0);
      } finally {
        setLoadingBalance(false);
      }
    };
    fetchBalance();
  }, []);

  const activeConfig = TOOLS.find(t => t.id === activeTool);

  return (
    <AppLayout>
      <Head>
        <title>AI Studio — CYBEV</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Wand2 className="text-purple-600" size={28} />
              AI Studio
            </h1>
            <p className="text-gray-500 mt-1">Create videos, music, and graphics with AI</p>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2">
            <Coins size={18} className="text-amber-500" />
            <span className="font-bold text-amber-700">{loadingBalance ? '...' : balance.toLocaleString()}</span>
            <span className="text-amber-500 text-sm">credits</span>
          </div>
        </div>

        {/* Tool Tabs */}
        <div className="flex gap-3 mb-8">
          {TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                activeTool === tool.id
                  ? 'border-purple-500 bg-purple-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                <tool.icon size={20} className="text-white" />
              </div>
              <div className="text-left">
                <p className={`text-sm font-semibold ${activeTool === tool.id ? 'text-purple-700' : 'text-gray-700'}`}>
                  {tool.label}
                </p>
                <p className="text-xs text-gray-400 hidden md:block">{tool.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Active Tool Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {activeTool === 'video' && <VideoMaker balance={balance} />}
          {activeTool === 'music' && <MusicComposer balance={balance} />}
          {activeTool === 'graphics' && <GraphicsGenerator balance={balance} />}
        </div>
      </div>
    </AppLayout>
  );
}
