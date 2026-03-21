// ============================================
// FILE: ai-studio.jsx
// PATH: /src/pages/ai-studio.jsx
// CYBEV AI Content Studio v3.0 — World Creators Center
// Video + Music + Graphics + DUB + Character Generator
// ============================================
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import api from '@/lib/api';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Film, Music, Image, Sparkles, Wand2, Play, Pause,
  Download, Share2, Loader2, ChevronRight, Coins,
  Video, Mic, Palette, Zap, Clock, RefreshCw,
  CheckCircle2, XCircle, ArrowLeft, Volume2, VolumeX,
  Maximize2, Copy, Heart, Send, Edit3, Eye, FileText,
  ChevronLeft, ChevronDown, ChevronUp, Plus, Trash2,
  Camera, Type, MessageSquare, Layers, PenTool,
  Languages, UserCircle2, Upload, Square, Globe
} from 'lucide-react';

// ─── Constants ───
const TOOLS = [
  { id: 'video', label: 'AI Video', icon: Film, color: 'from-purple-600 to-pink-600', accent: 'purple', desc: 'Script → scene-by-scene video' },
  { id: 'movie', label: 'AI Movie', icon: Video, color: 'from-amber-500 to-red-600', accent: 'amber', desc: 'Movies, series & episodes' },
  { id: 'music', label: 'AI Music', icon: Music, color: 'from-blue-600 to-cyan-600', accent: 'blue', desc: 'Compose songs with AI' },
  { id: 'graphics', label: 'AI Graphics', icon: Image, color: 'from-orange-500 to-red-500', accent: 'orange', desc: 'Create stunning visuals' },
  { id: 'dub', label: 'AI Dub', icon: Languages, color: 'from-emerald-500 to-teal-600', accent: 'emerald', desc: 'Re-voice & translate videos' },
  { id: 'character', label: 'AI Character', icon: UserCircle2, color: 'from-rose-500 to-violet-600', accent: 'rose', desc: 'Your face in AI videos' },
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

const VIDEO_DURATIONS = [
  { val: 5, label: '5s', scenes: 1, cost: 100, key: 'short' },
  { val: 15, label: '15s', scenes: 3, cost: 100, key: 'short' },
  { val: 30, label: '30s', scenes: 6, cost: 200, key: 'medium' },
  { val: 60, label: '60s', scenes: 12, cost: 500, key: 'long' },
];


// ═══════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════

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

function StepIndicator({ steps, current, accent = 'purple' }) {
  const colors = {
    purple: { active: 'bg-purple-600', done: 'bg-purple-500', line: 'bg-purple-200', lineDone: 'bg-purple-500' },
    blue: { active: 'bg-blue-600', done: 'bg-blue-500', line: 'bg-blue-200', lineDone: 'bg-blue-500' },
    orange: { active: 'bg-orange-500', done: 'bg-orange-500', line: 'bg-orange-200', lineDone: 'bg-orange-500' },
  };
  const c = colors[accent] || colors.purple;
  return (
    <div className="flex items-center gap-0 mb-6">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-initial">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < current ? `${c.done} text-white` : i === current ? `${c.active} text-white ring-4 ring-${accent}-100` : 'bg-gray-200 text-gray-500'
            }`}>
              {i < current ? <CheckCircle2 size={16} /> : i + 1}
            </div>
            <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${i <= current ? 'text-gray-700' : 'text-gray-400'}`}>{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mt-[-14px] rounded-full ${i < current ? c.lineDone : c.line}`} />
          )}
        </div>
      ))}
    </div>
  );
}

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

// Pill tag selector
function PillSelect({ options, value, onChange, accent = 'purple' }) {
  const activeClass = {
    purple: 'bg-purple-600 text-white',
    blue: 'bg-blue-600 text-white',
    orange: 'bg-orange-500 text-white',
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(value === opt ? '' : opt)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            value === opt ? (activeClass[accent] || activeClass.purple) : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}


// ═══════════════════════════════════════════
// VOICEOVER PANEL — Voice picker with preview
// ═══════════════════════════════════════════
const VOICES = [
  { group: '🌍 Africa', voices: [
    { id: 'nova-ng',    label: 'Amara',   accent: 'Nigerian',      gender: 'Female', flag: '🇳🇬' },
    { id: 'echo-ng',    label: 'Emeka',   accent: 'Nigerian',      gender: 'Male',   flag: '🇳🇬' },
    { id: 'onyx-ng',    label: 'Tunde',   accent: 'Nigerian',      gender: 'Male',   flag: '🇳🇬' },
    { id: 'nova-gh',    label: 'Ama',     accent: 'Ghanaian',      gender: 'Female', flag: '🇬🇭' },
    { id: 'echo-gh',    label: 'Kwame',   accent: 'Ghanaian',      gender: 'Male',   flag: '🇬🇭' },
    { id: 'nova-za',    label: 'Naledi',  accent: 'South African',  gender: 'Female', flag: '🇿🇦' },
    { id: 'onyx-za',    label: 'Sipho',   accent: 'South African',  gender: 'Male',   flag: '🇿🇦' },
    { id: 'shimmer-ke', label: 'Wanjiku', accent: 'Kenyan',        gender: 'Female', flag: '🇰🇪' },
    { id: 'echo-ke',    label: 'Otieno',  accent: 'Kenyan',        gender: 'Male',   flag: '🇰🇪' },
    { id: 'nova-tz',    label: 'Amina',   accent: 'Tanzanian',     gender: 'Female', flag: '🇹🇿' },
    { id: 'echo-et',    label: 'Dawit',   accent: 'Ethiopian',     gender: 'Male',   flag: '🇪🇹' },
    { id: 'shimmer-cm', label: 'Ngozi',   accent: 'Cameroonian',   gender: 'Female', flag: '🇨🇲' },
    { id: 'onyx-eg',    label: 'Ahmed',   accent: 'Egyptian',      gender: 'Male',   flag: '🇪🇬' },
  ]},
  { group: '🇺🇸 American', voices: [
    { id: 'nova',     label: 'Nova',     accent: 'American',  gender: 'Female', flag: '🇺🇸' },
    { id: 'shimmer',  label: 'Shimmer',  accent: 'American',  gender: 'Female', flag: '🇺🇸' },
    { id: 'echo',     label: 'Echo',     accent: 'American',  gender: 'Male',   flag: '🇺🇸' },
    { id: 'alloy',    label: 'Alloy',    accent: 'Neutral',   gender: 'Neutral', flag: '🌐' },
  ]},
  { group: '🇬🇧 British', voices: [
    { id: 'fable-uk',    label: 'James',     accent: 'British', gender: 'Male',   flag: '🇬🇧' },
    { id: 'shimmer-uk',  label: 'Charlotte', accent: 'British', gender: 'Female', flag: '🇬🇧' },
    { id: 'onyx',        label: 'Onyx',      accent: 'Deep',    gender: 'Male',   flag: '🇬🇧' },
    { id: 'fable',       label: 'Fable',     accent: 'British', gender: 'Male',   flag: '🇬🇧' },
  ]},
  { group: '🌏 International', voices: [
    { id: 'nova-in',    label: 'Priya',   accent: 'Indian',     gender: 'Female', flag: '🇮🇳' },
    { id: 'echo-fr',    label: 'Pierre',  accent: 'French',     gender: 'Male',   flag: '🇫🇷' },
    { id: 'shimmer-br', label: 'Ana',     accent: 'Brazilian',  gender: 'Female', flag: '🇧🇷' },
    { id: 'echo-jm',    label: 'Marcus',  accent: 'Jamaican',   gender: 'Male',   flag: '🇯🇲' },
    { id: 'nova-au',    label: 'Sophie',  accent: 'Australian', gender: 'Female', flag: '🇦🇺' },
  ]},
  { group: '🎬 Deep & Narrator', voices: [
    { id: 'onyx-narrator',   label: 'Morgan',   accent: 'Cinematic',     gender: 'Male',   flag: '🎬' },
    { id: 'onyx-doc',        label: 'Atlas',    accent: 'Documentary',   gender: 'Male',   flag: '🌍' },
    { id: 'echo-narrator',   label: 'David',    accent: 'Narrator',      gender: 'Male',   flag: '🎙️' },
    { id: 'fable-narrator',  label: 'Benedict', accent: 'British Deep',  gender: 'Male',   flag: '🇬🇧' },
    { id: 'onyx-epic',       label: 'Titan',    accent: 'Epic Trailer',  gender: 'Male',   flag: '⚡' },
    { id: 'nova-narrator',   label: 'Maya',     accent: 'Female Narrator',gender: 'Female', flag: '🎙️' },
    { id: 'shimmer-narrator',label: 'Elena',    accent: 'Reflective',    gender: 'Female', flag: '🌙' },
    { id: 'onyx-ng-deep',    label: 'Obinna',   accent: 'Nigerian Deep', gender: 'Male',   flag: '🇳🇬' },
    { id: 'onyx-za-deep',    label: 'Mandla',   accent: 'SA Deep',       gender: 'Male',   flag: '🇿🇦' },
  ]},
  { group: '👶 Children', voices: [
    { id: 'shimmer-child',  label: 'Lily',   accent: 'Girl',            gender: 'Girl',    flag: '👧' },
    { id: 'nova-child',     label: 'Zara',   accent: 'Girl',            gender: 'Girl',    flag: '👧🏽' },
    { id: 'alloy-child',    label: 'Sam',    accent: 'Kid',             gender: 'Neutral', flag: '🧒' },
    { id: 'echo-child',     label: 'Max',    accent: 'Boy',             gender: 'Boy',     flag: '👦' },
    { id: 'fable-child',    label: 'Oliver', accent: 'British Boy',     gender: 'Boy',     flag: '👦🏻' },
    { id: 'nova-child-ng',  label: 'Amaka',  accent: 'Nigerian Girl',   gender: 'Girl',    flag: '👧🏿' },
    { id: 'echo-child-gh',  label: 'Kofi',   accent: 'Ghanaian Boy',    gender: 'Boy',     flag: '👦🏿' },
  ]},
  { group: '🎉 Happy & Energetic', voices: [
    { id: 'nova-happy',     label: 'Joy',     accent: 'Happy',          gender: 'Female', flag: '😊' },
    { id: 'shimmer-happy',  label: 'Sunny',   accent: 'Cheerful',       gender: 'Female', flag: '☀️' },
    { id: 'echo-happy',     label: 'Blaze',   accent: 'Energetic',      gender: 'Male',   flag: '🔥' },
    { id: 'alloy-happy',    label: 'Spark',   accent: 'Upbeat',         gender: 'Neutral', flag: '✨' },
    { id: 'fable-happy',    label: 'Winston', accent: 'British Happy',  gender: 'Male',   flag: '🎩' },
    { id: 'nova-hype',      label: 'Hype',    accent: 'Hype',           gender: 'Female', flag: '🚀' },
    { id: 'echo-motivate',  label: 'Coach',   accent: 'Motivational',   gender: 'Male',   flag: '💪' },
    { id: 'nova-ng-happy',  label: 'Chioma',  accent: 'Nigerian Happy', gender: 'Female', flag: '🇳🇬' },
    { id: 'echo-gh-happy',  label: 'Yaw',     accent: 'Ghanaian Happy', gender: 'Male',   flag: '🇬🇭' },
  ]},
];

function VoiceoverPanel({ voice, setVoice, addVoiceover, setAddVoiceover }) {
  const [playingId, setPlayingId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const audioRef = useRef(null);
  const [expandedGroup, setExpandedGroup] = useState('🌍 Africa');

  const handlePreview = async (voiceId) => {
    // Stop current audio
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (playingId === voiceId) { setPlayingId(null); return; }

    setLoadingId(voiceId);
    setVoice(voiceId);
    try {
      const { data } = await api.post('/api/ai-content/voice/preview', { voiceId }, { timeout: 20000 });
      if (data.audioBase64) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
        audioRef.current = audio;
        audio.onended = () => { setPlayingId(null); audioRef.current = null; };
        audio.play();
        setPlayingId(voiceId);
      }
    } catch {
      // Silently fail preview
    } finally {
      setLoadingId(null);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => () => { if (audioRef.current) audioRef.current.pause(); }, []);

  return (
    <div className="border border-purple-200 rounded-xl p-4 bg-purple-50/50">
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Mic size={16} className="text-purple-500" /> Voiceover Narration
        </label>
        <button onClick={() => setAddVoiceover(!addVoiceover)}
          className={`relative w-11 h-6 rounded-full transition-colors ${addVoiceover ? 'bg-purple-600' : 'bg-gray-300'}`}
        >
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${addVoiceover ? 'left-[22px]' : 'left-0.5'}`} />
        </button>
      </div>

      {addVoiceover && (
        <div className="space-y-3">
          {/* Region tabs */}
          <div className="flex flex-wrap gap-1.5">
            {VOICES.map(group => (
              <button key={group.group} onClick={() => setExpandedGroup(expandedGroup === group.group ? '' : group.group)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  expandedGroup === group.group ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {group.group} ({group.voices.length})
              </button>
            ))}
          </div>

          {/* Voice cards for expanded group */}
          {VOICES.filter(g => g.group === expandedGroup).map(group => (
            <div key={group.group} className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {group.voices.map(v => {
                const isSelected = voice === v.id;
                const isPlaying = playingId === v.id;
                const isLoading = loadingId === v.id;
                return (
                  <div key={v.id}
                    className={`relative rounded-xl border-2 transition-all overflow-hidden ${
                      isSelected ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {/* Select on card click */}
                    <button onClick={() => setVoice(v.id)} className="w-full px-3 py-2.5 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{v.flag}</span>
                        <div className="min-w-0">
                          <div className={`text-xs font-bold truncate ${isSelected ? 'text-purple-700' : 'text-gray-800'}`}>{v.label}</div>
                          <div className="text-[10px] text-gray-400">{v.accent} · {v.gender}</div>
                        </div>
                      </div>
                    </button>

                    {/* Play preview button */}
                    <button onClick={(e) => { e.stopPropagation(); handlePreview(v.id); }}
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isPlaying ? 'bg-purple-600 text-white scale-110' :
                        isLoading ? 'bg-purple-100 text-purple-500' :
                        'bg-gray-100 text-gray-500 hover:bg-purple-100 hover:text-purple-600'
                      }`}
                      title="Preview voice"
                    >
                      {isLoading ? <Loader2 size={12} className="animate-spin" /> :
                       isPlaying ? <Pause size={12} /> : <Play size={12} />}
                    </button>

                    {/* Playing indicator */}
                    {isPlaying && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500">
                        <div className="h-full bg-purple-300 animate-pulse" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          <p className="text-[10px] text-gray-400">
            Click the play button to preview each voice. AI reads each scene's "Narration" field — scenes without narration text will be silent.
          </p>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════
// VIDEO MAKER — with Script Writer
// ═══════════════════════════════════════════
function VideoMaker({ balance }) {
  // Step: 0=idea, 1=script-loading, 2=script-editor, 3=generating, 4=result
  const [step, setStep] = useState(0);
  const [idea, setIdea] = useState('');
  const [style, setStyle] = useState('');
  const [duration, setDuration] = useState(30);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [script, setScript] = useState(null);
  const [scriptError, setScriptError] = useState('');
  const [genStatus, setGenStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [sceneTasks, setSceneTasks] = useState([]);
  const [sceneResults, setSceneResults] = useState([]);
  const [merging, setMerging] = useState(false);
  const [mergedUrl, setMergedUrl] = useState(null);
  const [mergeError, setMergeError] = useState('');
  const [showAllScenes, setShowAllScenes] = useState(false);
  const [voice, setVoice] = useState('onyx-narrator');
  const [addVoiceover, setAddVoiceover] = useState(true);
  const [thumbnails, setThumbnails] = useState([]);
  const [selectedThumb, setSelectedThumb] = useState(null);
  const [autoCaptions, setAutoCaptions] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoPosition, setLogoPosition] = useState('top-right');
  const [introImageUrl, setIntroImageUrl] = useState('');
  const [outroImageUrl, setOutroImageUrl] = useState('');
  const pollRef = useRef(null);

  const durConfig = VIDEO_DURATIONS.find(d => d.val === duration) || VIDEO_DURATIONS[2];

  // Write Script
  const handleWriteScript = async () => {
    if (!idea.trim()) return;
    setStep(1);
    setScriptError('');
    try {
      const { data } = await api.post('/api/ai-content/script/video', {
        idea: idea.trim(), style, duration, aspectRatio
      }, { timeout: 120000 });
      setScript(data.script);
      setStep(2);
    } catch (err) {
      setScriptError(err?.response?.data?.details || err?.response?.data?.error || err?.message || 'Failed to write script. Try again.');
      setStep(0);
    }
  };

  // Update scene field
  const updateScene = (idx, field, value) => {
    setScript(prev => ({
      ...prev,
      scenes: prev.scenes.map((s, i) => i === idx ? { ...s, [field]: value } : s)
    }));
  };

  // Add scene
  const addScene = () => {
    setScript(prev => ({
      ...prev,
      scenes: [...prev.scenes, {
        sceneNumber: prev.scenes.length + 1,
        duration: 5,
        visual: '',
        camera: 'Wide shot',
        textOverlay: '',
        narration: '',
        transition: 'Cut'
      }]
    }));
  };

  // Remove scene
  const removeScene = (idx) => {
    if (script.scenes.length <= 1) return;
    setScript(prev => ({
      ...prev,
      scenes: prev.scenes.filter((_, i) => i !== idx).map((s, i) => ({ ...s, sceneNumber: i + 1 }))
    }));
  };

  // Generate video from script
  const handleGenerate = async () => {
    setStep(3);
    setGenStatus('processing');
    setProgress(0);
    setSceneTasks([]);
    setSceneResults([]);
    try {
      const { data } = await api.post('/api/ai-content/video/generate', {
        prompt: idea,
        style,
        duration: durConfig.key,
        aspectRatio,
        script
      }, { timeout: 300000 }); // 5 min — multi-scene submission is sequential with rate-limit delays

      // ─── MULTI-SCENE response ───
      if (data.mode === 'multi' && data.tasks) {
        const tasks = data.tasks;
        setSceneTasks(tasks);
        const taskIds = tasks.map(t => t.taskId).filter(Boolean);

        // If all scenes failed to create, show failure immediately
        if (!taskIds.length) {
          setGenStatus('failed');
          return;
        }

        // If some already failed but others are processing, still poll
        let pollErrors = 0;
        pollRef.current = setInterval(async () => {
          try {
            const { data: batch } = await api.post('/api/ai-content/video/status/batch', {
              taskIds, provider: data.provider || 'replicate'
            });
            pollErrors = 0; // reset on success
            setProgress(batch.progress || 0);

            // Merge batch results with original tasks (preserving failed ones)
            const updated = tasks.map(t => {
              if (!t.taskId) return t; // keep pre-failed tasks as-is
              const r = batch.results.find(b => b.taskId === t.taskId);
              return { ...t, status: r?.status || t.status, videoUrl: r?.videoUrl || t.videoUrl };
            });
            setSceneTasks(updated);

            if (batch.allDone) {
              clearInterval(pollRef.current);
              const completedScenes = updated.filter(t => t.status === 'completed' && t.videoUrl);
              setSceneResults(completedScenes);
              if (completedScenes.length > 0) {
                setResult({ mode: 'multi', scenes: completedScenes, title: data.title });
                setGenStatus('completed');
                setStep(4);
              } else {
                setGenStatus('failed');
              }
            }
          } catch {
            pollErrors++;
            if (pollErrors > 10) {
              clearInterval(pollRef.current);
              setGenStatus('failed');
            }
          }
        }, 5000); // poll every 5s (not 4) to be gentler on the API
        return; // IMPORTANT: prevent falling through to single-scene path
      }

      // ─── SINGLE response (5s / no script) ───
      if (!data.taskId) {
        // No task ID means generation failed silently
        setGenStatus('failed');
        return;
      }

      if (data.status === 'completed') {
        setResult(data);
        setGenStatus('completed');
        setStep(4);
      } else {
        const provider = data.provider || 'replicate';
        let singlePollErrors = 0;
        pollRef.current = setInterval(async () => {
          try {
            const { data: s } = await api.get(`/api/ai-content/video/status/${data.taskId}?provider=${provider}`);
            singlePollErrors = 0;
            setProgress(s.progress || Math.min(progress + 8, 92));
            if (s.status === 'completed') {
              clearInterval(pollRef.current);
              setResult(s);
              setGenStatus('completed');
              setStep(4);
            } else if (s.status === 'failed') {
              clearInterval(pollRef.current);
              setGenStatus('failed');
            }
          } catch {
            singlePollErrors++;
            if (singlePollErrors > 10) {
              clearInterval(pollRef.current);
              setGenStatus('failed');
            }
          }
        }, 3000);
      }
    } catch (err) {
      setGenStatus('failed');
    }
  };

  useEffect(() => () => clearInterval(pollRef.current), []);

  // ─── STEP 0: Idea Input ───
  if (step === 0) {
    return (
      <div className="space-y-5">
        <StepIndicator steps={['Idea', 'Script', 'Edit', 'Generate']} current={0} accent="purple" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What's your video about?</label>
          <textarea rows={3} maxLength={500} placeholder='e.g. "Marketing video for CYBEV.IO — show how creators connect, earn, and build communities"'
            value={idea} onChange={e => setIdea(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">{idea.length}/500 — Be descriptive! AI will turn this into a scene-by-scene storyboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visual Style</label>
            <PillSelect options={VIDEO_STYLES} value={style} onChange={setStyle} accent="purple" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
            <div className="flex gap-2">
              {ASPECT_RATIOS.map(ar => (
                <button key={ar.value} onClick={() => setAspectRatio(ar.value)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    aspectRatio === ar.value ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >{ar.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
          <div className="grid grid-cols-4 gap-2">
            {VIDEO_DURATIONS.map(d => (
              <button key={d.val} onClick={() => setDuration(d.val)}
                className={`px-3 py-3 rounded-xl text-center border-2 transition-all ${
                  duration === d.val ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`text-lg font-bold ${duration === d.val ? 'text-purple-700' : 'text-gray-700'}`}>{d.label}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{d.scenes} scene{d.scenes > 1 ? 's' : ''} × 5s each</div>
                <div className="text-[10px] text-amber-500 mt-0.5">{d.cost} credits</div>
              </button>
            ))}
          </div>
        </div>

        {scriptError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{scriptError}</div>
        )}

        <div className="flex items-center justify-between pt-2">
          <TokenCost cost={durConfig.cost} label={`${durConfig.scenes} scenes`} />
          <button onClick={handleWriteScript} disabled={!idea.trim() || idea.trim().length < 3}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <PenTool size={18} /> Write Script
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // ─── STEP 1: Loading Script ───
  if (step === 1) {
    return (
      <div className="space-y-5">
        <StepIndicator steps={['Idea', 'Script', 'Edit', 'Generate']} current={1} accent="purple" />
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-600 rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-700 font-semibold text-lg">AI is writing your script...</p>
          <p className="text-gray-400 text-sm">Creating a detailed scene-by-scene storyboard</p>
        </div>
      </div>
    );
  }

  // ─── STEP 2: Script Editor ───
  if (step === 2 && script) {
    return (
      <div className="space-y-5">
        <StepIndicator steps={['Idea', 'Script', 'Edit', 'Generate']} current={2} accent="purple" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(0)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              <ChevronLeft size={16} /> Back to idea
            </button>
            {result && (
              <button onClick={() => setStep(4)} className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-medium">
                <Film size={14} /> View Video Results
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{script.scenes.length} scenes · {script.scenes.length * 5}s total</span>
            <button onClick={addScene} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 font-medium">
              <Plus size={12} /> Add Scene
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Video Title</label>
          <input type="text" value={script.title || ''} onChange={e => setScript(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Scenes */}
        <div className="space-y-4">
          {script.scenes.map((scene, idx) => (
            <SceneCard key={idx} scene={scene} index={idx}
              onUpdate={(field, val) => updateScene(idx, field, val)}
              onRemove={() => removeScene(idx)}
              canRemove={script.scenes.length > 1}
            />
          ))}
        </div>

        {/* Music suggestion */}
        {script.musicSuggestion && (
          <div className="p-3 bg-purple-50 rounded-lg">
            <label className="block text-xs font-medium text-purple-600 mb-1">Background Music Suggestion</label>
            <input type="text" value={script.musicSuggestion}
              onChange={e => setScript(prev => ({ ...prev, musicSuggestion: e.target.value }))}
              className="w-full px-3 py-1.5 border border-purple-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>
        )}

        {/* Voiceover Settings */}
        <VoiceoverPanel voice={voice} setVoice={setVoice} addVoiceover={addVoiceover} setAddVoiceover={setAddVoiceover} />

        {/* Auto-Captions toggle */}
        {addVoiceover && (
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-white">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Auto-Captions</p>
                <p className="text-[10px] text-gray-400">Display voiceover text as synced captions on the video</p>
              </div>
            </div>
            <button onClick={() => setAutoCaptions(!autoCaptions)}
              className={`relative w-11 h-6 rounded-full transition-colors ${autoCaptions ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${autoCaptions ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
        )}

        {/* Media Uploads — Logo, Intro, Outro */}
        <div className="border border-gray-200 rounded-xl p-4 space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Image size={16} className="text-purple-500" /> Custom Media (Optional)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Logo Upload */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Logo Watermark</label>
              {logoUrl ? (
                <div className="relative">
                  <img src={logoUrl} alt="Logo" className="w-full h-20 object-contain bg-gray-50 rounded-lg border border-gray-200 p-1" />
                  <button onClick={() => setLogoUrl('')} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">×</button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-1 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-colors">
                  <Upload size={16} className="text-gray-400" />
                  <span className="text-[10px] text-gray-400">PNG or SVG</span>
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0]; if (!file) return;
                    try {
                      const fd = new FormData(); fd.append('file', file);
                      const { data } = await api.post('/api/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000 });
                      setLogoUrl(data.url || data.imageUrl || data.secure_url || '');
                    } catch {}
                  }} />
                </label>
              )}
              {logoUrl && (
                <select value={logoPosition} onChange={e => setLogoPosition(e.target.value)}
                  className="w-full mt-1.5 px-2 py-1 border border-gray-200 rounded text-[10px] text-gray-500 outline-none"
                >
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="center">Center</option>
                </select>
              )}
            </div>

            {/* Intro Image */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Intro Slide (3s)</label>
              {introImageUrl ? (
                <div className="relative">
                  <img src={introImageUrl} alt="Intro" className="w-full h-20 object-cover bg-gray-50 rounded-lg border border-gray-200" />
                  <button onClick={() => setIntroImageUrl('')} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">×</button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-1 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-colors">
                  <Upload size={16} className="text-gray-400" />
                  <span className="text-[10px] text-gray-400">Intro image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0]; if (!file) return;
                    try {
                      const fd = new FormData(); fd.append('file', file);
                      const { data } = await api.post('/api/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000 });
                      setIntroImageUrl(data.url || data.imageUrl || data.secure_url || '');
                    } catch {}
                  }} />
                </label>
              )}
            </div>

            {/* Outro Image */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Outro Slide (3s)</label>
              {outroImageUrl ? (
                <div className="relative">
                  <img src={outroImageUrl} alt="Outro" className="w-full h-20 object-cover bg-gray-50 rounded-lg border border-gray-200" />
                  <button onClick={() => setOutroImageUrl('')} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">×</button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-1 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-colors">
                  <Upload size={16} className="text-gray-400" />
                  <span className="text-[10px] text-gray-400">Outro image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0]; if (!file) return;
                    try {
                      const fd = new FormData(); fd.append('file', file);
                      const { data } = await api.post('/api/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000 });
                      setOutroImageUrl(data.url || data.imageUrl || data.secure_url || '');
                    } catch {}
                  }} />
                </label>
              )}
            </div>
          </div>
          <p className="text-[10px] text-gray-400">Logo appears as watermark on every frame. Intro/outro show as 3-second still slides before/after the video.</p>
        </div>

        {/* Generate */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <TokenCost cost={durConfig.cost} label="to generate" />
          <div className="flex items-center gap-3">
            <button onClick={handleWriteScript} className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50">
              <RefreshCw size={14} /> Rewrite
            </button>
            <button onClick={handleGenerate} disabled={balance < durConfig.cost}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
            >
              <Sparkles size={18} /> Generate Video
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 3: Generating (with per-scene progress) ───
  if (step === 3) {
    const completedCount = sceneTasks.filter(t => t.status === 'completed').length;
    const totalCount = sceneTasks.length;
    const isMulti = totalCount > 1;
    const isSubmitting = totalCount === 0 && genStatus === 'processing';

    return (
      <div className="space-y-5">
        <StepIndicator steps={['Idea', 'Script', 'Edit', 'Generate']} current={3} accent="purple" />

        {genStatus === 'failed' ? (
          <div className="space-y-4">
            <GenerationStatus status="failed" progress={0} onRetry={() => { setStep(2); setGenStatus(null); }} />
            <button onClick={() => { clearInterval(pollRef.current); setStep(2); setGenStatus(null); }}
              className="flex items-center gap-1.5 mx-auto px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={14} /> Back to Script Editor
            </button>
          </div>
        ) : isSubmitting ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 rounded-full" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-purple-600 rounded-full border-t-transparent animate-spin" />
            </div>
            <p className="text-gray-700 font-semibold text-lg">Submitting scenes to AI...</p>
            <p className="text-gray-400 text-sm text-center max-w-md">
              Each scene is queued one at a time to stay within API limits.
              {script?.scenes?.length > 3 && ` ${script.scenes.length} scenes ≈ ${Math.ceil(script.scenes.length * 11 / 60)} min to submit.`}
            </p>
          </div>
        ) : isMulti ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-700 font-semibold text-lg">Generating {totalCount} scenes...</p>
              <p className="text-gray-400 text-sm mt-1">{completedCount}/{totalCount} scenes complete — each scene takes 30-90 seconds</p>
            </div>

            {/* Overall progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700"
                style={{ width: `${totalCount ? (completedCount / totalCount) * 100 : 0}%` }}
              />
            </div>

            {/* Per-scene status */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sceneTasks.map((t, i) => (
                <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                  t.status === 'completed' ? 'border-green-200 bg-green-50 text-green-700' :
                  t.status === 'failed' ? 'border-red-200 bg-red-50 text-red-600' :
                  'border-gray-200 bg-white text-gray-600'
                }`}>
                  {t.status === 'completed' ? <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" /> :
                   t.status === 'failed' ? <XCircle size={14} className="text-red-400 flex-shrink-0" /> :
                   <Loader2 size={14} className="animate-spin text-purple-500 flex-shrink-0" />}
                  <span className="font-medium">Scene {t.sceneNumber}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <GenerationStatus status={genStatus} progress={progress} onRetry={() => { setStep(2); setGenStatus(null); }} />
        )}
      </div>
    );
  }

  // ─── STEP 4: Result ───
  const handleMerge = async (scenes) => {
    setMerging(true);
    setMergeError('');
    setThumbnails([]);
    try {
      const narrations = script?.scenes?.map(s => s.narration || '') || [];
      const textOverlays = script?.scenes?.map(s => s.textOverlay || '') || [];
      const { data } = await api.post('/api/ai-content/video/merge', {
        videoUrls: scenes.map(s => s.videoUrl),
        title: result?.title || 'CYBEV-video',
        narrations,
        textOverlays,
        voice,
        addVoiceover,
        autoCaptions,
        logoUrl: logoUrl || undefined,
        logoPosition,
        introImageUrl: introImageUrl || undefined,
        outroImageUrl: outroImageUrl || undefined
      }, { timeout: 360000 });
      if (data.mergedUrl) {
        setMergedUrl(data.mergedUrl);
        if (data.thumbnails?.length) setThumbnails(data.thumbnails);
      } else {
        setMergeError('Merge completed but no URL returned.');
      }
    } catch (err) {
      setMergeError(err?.response?.data?.error || err?.message || 'Merge failed');
    } finally {
      setMerging(false);
    }
  };

  const resetAll = () => {
    setStep(0); setResult(null); setScript(null); setGenStatus(null);
    setSceneTasks([]); setSceneResults([]); setMergedUrl(null); setMergeError('');
    setShowAllScenes(false); setThumbnails([]); setSelectedThumb(null);
  };

  if (step === 4 && result) {
    const isMulti = result.mode === 'multi' && result.scenes?.length > 0;
    const scenes = isMulti ? result.scenes : [];
    const canMerge = scenes.length >= 2;

    return (
      <div className="space-y-5">
        <StepIndicator steps={['Idea', 'Script', 'Edit', 'Generate']} current={4} accent="purple" />

        {/* Back + title row */}
        <div className="flex items-center justify-between">
          <button onClick={() => { setStep(2); setGenStatus(null); }}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={16} /> Edit Script
          </button>
          <button onClick={resetAll} className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800">
            <Plus size={14} /> New Video
          </button>
        </div>

        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-green-500" />
          {result.title || 'Video'} — {isMulti ? `${scenes.length} Scenes Ready!` : 'Ready!'}
        </h3>

        {/* ─── Merged video (if merged) ─── */}
        {mergedUrl && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
            <h4 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              Full Video with Audio ({scenes.length * 5}s)
            </h4>
            <video src={mergedUrl} controls className="w-full rounded-lg max-h-96 bg-black" />
            <div className="flex flex-wrap gap-3 mt-3">
              <a href={mergedUrl} download={`${(result.title || 'cybev-video').replace(/\s+/g, '-')}.mp4`}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700"
              >
                <Download size={15} /> Download Full Video
              </a>
              <button className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300">
                <Share2 size={14} /> Post to CYBEV
              </button>
            </div>
          </div>
        )}

        {/* ─── Thumbnail selector (after merge) ─── */}
        {mergedUrl && (thumbnails.length > 0 || true) && (
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Video Thumbnail</h4>
            {thumbnails.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-gray-400">Select a thumbnail or upload your own:</p>
                <div className="grid grid-cols-4 gap-2">
                  {thumbnails.map((t, i) => (
                    <button key={i} onClick={() => setSelectedThumb(t.url)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all aspect-video ${
                        selectedThumb === t.url ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={t.url} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                      {selectedThumb === t.url && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                          <CheckCircle2 size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400">Thumbnails are being generated...</p>
            )}
            {/* Upload custom thumbnail */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer hover:text-purple-600">
                <Upload size={14} />
                <span>Upload custom thumbnail</span>
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const { data } = await api.post('/api/upload/image', formData, {
                      headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000
                    });
                    const url = data.url || data.imageUrl || data.secure_url;
                    if (url) { setThumbnails(prev => [{ url, timestamp: 0 }, ...prev]); setSelectedThumb(url); }
                  } catch {}
                }} />
              </label>
            </div>
          </div>
        )}

        {/* ─── STEP 1: MERGE + VOICEOVER (primary action) ─── */}
        {canMerge && !mergedUrl && !merging && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-5 text-white">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Volume2 size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">Next: Add Voiceover & Merge</h4>
                <p className="text-sm text-purple-100 mt-1">
                  AI video clips are generated <strong>without audio</strong>. Click below to merge all {scenes.length} scenes into one {scenes.length * 5}s video
                  {addVoiceover && ` with ${VOICES.flatMap(g => g.voices).find(v => v.id === voice)?.label || voice} narration`}
                  {autoCaptions && ' + auto-captions'}.
                </p>

                {/* Quick toggles */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <button onClick={() => setAutoCaptions(!autoCaptions)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      autoCaptions ? 'bg-white text-purple-700' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <MessageSquare size={12} /> {autoCaptions ? 'Captions ON' : 'Captions OFF'}
                  </button>
                  <button onClick={() => setAddVoiceover(!addVoiceover)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      addVoiceover ? 'bg-white text-purple-700' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Volume2 size={12} /> {addVoiceover ? 'Voice ON' : 'Voice OFF'}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <button onClick={() => handleMerge(scenes)}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-purple-700 rounded-full font-bold hover:bg-purple-50 transition-colors shadow-lg"
                  >
                    <Film size={18} /> {addVoiceover ? 'Merge + Voiceover' : 'Merge All Scenes'}{autoCaptions ? ' + Captions' : ''}
                  </button>
                  <button onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-white/20 text-white rounded-full text-sm font-medium hover:bg-white/30"
                  >
                    <Mic size={14} /> Change Voice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Merging progress ─── */}
        {merging && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 text-center border border-purple-200">
            <Loader2 size={32} className="animate-spin text-purple-500 mx-auto mb-3" />
            <p className="text-base text-purple-700 font-bold">
              {addVoiceover ? 'Generating voiceover & merging video...' : 'Merging scenes into one video...'}
            </p>
            <p className="text-sm text-purple-400 mt-1">
              {addVoiceover ? `Creating ${VOICES.flatMap(g => g.voices).find(v => v.id === voice)?.label || voice} narration for each scene, then combining everything — 1-3 minutes` : '30-60 seconds'}
            </p>
          </div>
        )}

        {mergeError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {mergeError}
            <button onClick={() => handleMerge(scenes)} className="ml-2 underline hover:no-underline font-medium">Retry</button>
          </div>
        )}

        {/* ─── Merged result (full video with audio) ─── */}
        {mergedUrl && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200">
            <h4 className="text-sm font-bold text-purple-700 mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              Full Video with Audio ({scenes.length * 5}s)
            </h4>
            <video src={mergedUrl} controls autoPlay className="w-full rounded-lg max-h-96 bg-black" />
            <div className="flex flex-wrap gap-3 mt-3">
              <a href={mergedUrl} download={`${(result.title || 'cybev-video').replace(/\s+/g, '-')}.mp4`}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700"
              >
                <Download size={15} /> Download Full Video
              </a>
              <button className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300">
                <Share2 size={14} /> Post to CYBEV
              </button>
            </div>
          </div>
        )}

        {/* ─── Individual scene clips (silent previews) ─── */}
        {isMulti && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Scene Clips ({scenes.length} × 5s each)</h4>
              <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                <VolumeX size={10} /> Silent — audio added on merge
              </span>
            </div>
            {scenes.map((scene, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">{scene.sceneNumber}</div>
                    Scene {scene.sceneNumber}
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><VolumeX size={9} /> silent</span>
                  </span>
                  <a href={scene.videoUrl} download={`${(result.title || 'scene').replace(/\s+/g, '-')}-scene-${scene.sceneNumber}.mp4`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200"
                  >
                    <Download size={12} /> Download
                  </a>
                </div>
                <video src={scene.videoUrl} controls muted className="w-full rounded-lg max-h-56 bg-black" />
              </div>
            ))}
          </div>
        )}

        {/* Single scene (non-multi) */}
        {!isMulti && (
          <div className="bg-gray-50 rounded-xl p-5">
            <video src={result.videoUrl} controls className="w-full rounded-lg max-h-96 bg-black" />
            <a href={result.videoUrl} download={`${(result.title || 'cybev-video').replace(/\s+/g, '-')}.mp4`}
              className="inline-flex items-center gap-1.5 px-4 py-2 mt-3 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700"
            >
              <Download size={14} /> Download
            </a>
          </div>
        )}
      </div>
    );
  }

  return null;
}

// ─── Scene Card (editable) ───
function SceneCard({ scene, index, onUpdate, onRemove, canRemove }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">{index + 1}</div>
          <span className="text-sm font-medium text-gray-700">Scene {index + 1}</span>
          <span className="text-xs text-gray-400">· {scene.duration || 5}s</span>
        </div>
        <div className="flex items-center gap-2">
          {canRemove && (
            <button onClick={e => { e.stopPropagation(); onRemove(); }} className="p-1 text-gray-400 hover:text-red-500">
              <Trash2 size={14} />
            </button>
          )}
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-3">
          {/* Visual */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
              <Eye size={12} /> Visual Description
            </label>
            <textarea rows={2} value={scene.visual || ''} onChange={e => onUpdate('visual', e.target.value)}
              placeholder="Detailed description of what appears on screen..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Camera */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
                <Camera size={12} /> Camera
              </label>
              <input type="text" value={scene.camera || ''} onChange={e => onUpdate('camera', e.target.value)}
                placeholder="e.g. Wide shot, slow pan right"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
              />
            </div>

            {/* Transition */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
                <Layers size={12} /> Transition
              </label>
              <select value={scene.transition || 'Cut'} onChange={e => onUpdate('transition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 outline-none bg-white"
              >
                {['Cut', 'Fade', 'Dissolve', 'Wipe', 'Zoom'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Text overlay */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
                <Type size={12} /> Text Overlay
              </label>
              <input type="text" value={scene.textOverlay || ''} onChange={e => onUpdate('textOverlay', e.target.value)}
                placeholder="On-screen text (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
              />
            </div>

            {/* Narration */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
                <MessageSquare size={12} /> Narration
              </label>
              <input type="text" value={scene.narration || ''} onChange={e => onUpdate('narration', e.target.value)}
                placeholder="Voiceover text (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════
// MUSIC COMPOSER — with Script Writer
// ═══════════════════════════════════════════
function MusicComposer({ balance }) {
  const [step, setStep] = useState(0);
  const [idea, setIdea] = useState('');
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('');
  const [duration, setDuration] = useState('short');
  const [instrumental, setInstrumental] = useState(false);
  const [script, setScript] = useState(null);
  const [scriptError, setScriptError] = useState('');
  const [genStatus, setGenStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const pollRef = useRef(null);

  const costs = { short: 50, full: 150 };

  const handleWriteScript = async () => {
    if (!idea.trim()) return;
    setStep(1);
    setScriptError('');
    try {
      const { data } = await api.post('/api/ai-content/script/music', {
        idea: idea.trim(), genre, mood, duration, instrumental
      }, { timeout: 120000 });
      setScript(data.script);
      setStep(2);
    } catch (err) {
      setScriptError(err?.response?.data?.details || err?.response?.data?.error || err?.message || 'Failed to write script.');
      setStep(0);
    }
  };

  const updateSection = (idx, field, value) => {
    setScript(prev => ({
      ...prev,
      sections: prev.sections.map((s, i) => i === idx ? { ...s, [field]: value } : s)
    }));
  };

  const addSection = () => {
    setScript(prev => ({
      ...prev,
      sections: [...prev.sections, {
        type: 'Verse',
        duration: '8 bars',
        lyrics: '',
        vocalDirection: '',
        productionNotes: '',
      }]
    }));
  };

  const removeSection = (idx) => {
    if (script.sections.length <= 1) return;
    setScript(prev => ({ ...prev, sections: prev.sections.filter((_, i) => i !== idx) }));
  };

  const handleGenerate = async () => {
    setStep(3);
    setGenStatus('processing');
    setProgress(0);
    try {
      const { data } = await api.post('/api/ai-content/music/generate', {
        prompt: idea, genre, mood, duration, instrumental, script
      });
      if (data.status === 'completed') {
        setResult(data);
        setGenStatus('completed');
        setStep(4);
      } else {
        const provider = data.provider || 'replicate';
        pollRef.current = setInterval(async () => {
          try {
            const { data: s } = await api.get(`/api/ai-content/music/status/${data.taskId}?provider=${provider}`);
            setProgress(p => Math.min(p + 10, 90));
            if (s.status === 'completed') { clearInterval(pollRef.current); setResult(s); setGenStatus('completed'); setStep(4); }
            else if (s.status === 'failed') { clearInterval(pollRef.current); setGenStatus('failed'); }
          } catch {}
        }, 3000);
      }
    } catch { setGenStatus('failed'); }
  };

  useEffect(() => () => clearInterval(pollRef.current), []);

  // ─── STEP 0: Idea ───
  if (step === 0) {
    return (
      <div className="space-y-5">
        <StepIndicator steps={['Idea', 'Script', 'Edit', 'Generate']} current={0} accent="blue" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What kind of song?</label>
          <textarea rows={2} maxLength={500} placeholder='e.g. "An upbeat gospel worship song about grace, with a powerful choir and live band"'
            value={idea} onChange={e => setIdea(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
          <PillSelect options={MUSIC_GENRES} value={genre} onChange={setGenre} accent="blue" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
          <PillSelect options={MUSIC_MOODS} value={mood} onChange={setMood} accent="blue" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            {[{ val: 'short', label: '30 sec', cost: 50 }, { val: 'full', label: 'Full Song', cost: 150 }].map(d => (
              <button key={d.val} onClick={() => setDuration(d.val)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  duration === d.val ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600'
                }`}
              >{d.label} · <span className="text-amber-500">{d.cost}</span></button>
            ))}
          </div>
          <button onClick={() => setInstrumental(!instrumental)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              instrumental ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600'
            }`}
          >🎵 Instrumental only</button>
        </div>

        {scriptError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{scriptError}</div>}

        <div className="flex items-center justify-between pt-2">
          <TokenCost cost={costs[duration]} label={duration} />
          <button onClick={handleWriteScript} disabled={!idea.trim() || idea.trim().length < 3}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
          >
            <PenTool size={18} /> Write Script <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // ─── STEP 1: Loading ───
  if (step === 1) {
    return (
      <div className="space-y-5">
        <StepIndicator steps={['Idea', 'Script', 'Edit', 'Generate']} current={1} accent="blue" />
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-700 font-semibold text-lg">AI is writing your {instrumental ? 'arrangement' : 'lyrics'}...</p>
          <p className="text-gray-400 text-sm">Composing structure, {instrumental ? 'instruments' : 'verses, chorus'}, and production notes</p>
        </div>
      </div>
    );
  }

  // ─── STEP 2: Script Editor ───
  if (step === 2 && script) {
    return (
      <div className="space-y-5">
        <StepIndicator steps={['Idea', 'Script', 'Edit', 'Generate']} current={2} accent="blue" />

        <div className="flex items-center justify-between">
          <button onClick={() => setStep(0)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ChevronLeft size={16} /> Back
          </button>
          <button onClick={addSection} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 font-medium">
            <Plus size={12} /> Add Section
          </button>
        </div>

        {/* Song Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input type="text" value={script.title || ''} onChange={e => setScript(p => ({ ...p, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tempo</label>
            <input type="text" value={script.tempo || ''} onChange={e => setScript(p => ({ ...p, tempo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Key</label>
            <input type="text" value={script.key || ''} onChange={e => setScript(p => ({ ...p, key: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Overall Vibe</label>
            <input type="text" value={script.overallVibe || ''} onChange={e => setScript(p => ({ ...p, overallVibe: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {script.sections.map((section, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              <div className="flex items-center justify-between px-4 py-2.5 bg-blue-50 border-b border-blue-100">
                <div className="flex items-center gap-2">
                  <Music size={14} className="text-blue-500" />
                  <select value={section.type || 'Verse'} onChange={e => updateSection(idx, 'type', e.target.value)}
                    className="text-sm font-semibold text-blue-700 bg-transparent outline-none cursor-pointer"
                  >
                    {['Intro', 'Verse 1', 'Verse 2', 'Verse 3', 'Pre-Chorus', 'Chorus', 'Bridge', 'Outro', 'Instrumental Break'].map(t =>
                      <option key={t} value={t}>{t}</option>
                    )}
                  </select>
                  <span className="text-xs text-gray-400">·</span>
                  <input type="text" value={section.duration || ''} onChange={e => updateSection(idx, 'duration', e.target.value)}
                    className="text-xs text-gray-500 bg-transparent outline-none w-20" placeholder="8 bars"
                  />
                </div>
                {script.sections.length > 1 && (
                  <button onClick={() => removeSection(idx)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                )}
              </div>
              <div className="p-4 space-y-3">
                {/* Lyrics or instrumental notes */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {instrumental ? 'Instrumental Notes' : 'Lyrics'}
                  </label>
                  <textarea rows={3}
                    value={instrumental ? (section.instrumentalNotes || '') : (section.lyrics || '')}
                    onChange={e => updateSection(idx, instrumental ? 'instrumentalNotes' : 'lyrics', e.target.value)}
                    placeholder={instrumental ? 'Describe the instrumentation, dynamics...' : 'Write the lyrics...'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none resize-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Production Notes</label>
                  <input type="text" value={section.productionNotes || ''} onChange={e => updateSection(idx, 'productionNotes', e.target.value)}
                    placeholder="Arrangement, effects, energy..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <TokenCost cost={costs[duration]} label="to generate" />
          <div className="flex items-center gap-3">
            <button onClick={handleWriteScript} className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50">
              <RefreshCw size={14} /> Rewrite
            </button>
            <button onClick={handleGenerate} disabled={balance < costs[duration]}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
            >
              <Sparkles size={18} /> Compose Song <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 3: Generating ───
  if (step === 3) {
    return (
      <div className="space-y-5">
        <StepIndicator steps={['Idea', 'Script', 'Edit', 'Generate']} current={3} accent="blue" />
        <GenerationStatus status={genStatus} progress={progress} onRetry={() => { setStep(2); setGenStatus(null); }} />
      </div>
    );
  }

  // ─── STEP 4: Result ───
  if (step === 4 && result) {
    return (
      <div className="space-y-5">
        <StepIndicator steps={['Idea', 'Script', 'Edit', 'Generate']} current={4} accent="blue" />
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-xl bg-blue-200 overflow-hidden flex-shrink-0">
              {result.coverArt ? <img src={result.coverArt} className="w-full h-full object-cover" alt="" /> :
                <div className="w-full h-full flex items-center justify-center"><Music size={32} className="text-blue-400" /></div>}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">{result.title || script?.title || 'AI Generated Song'}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{script?.genre || genre || 'Various'} · {script?.mood || mood || 'Mixed'}</p>
              <audio src={result.audioUrl} controls className="w-full mt-3" />
              <div className="flex flex-wrap gap-3 mt-3">
                <a href={result.audioUrl} download className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700">
                  <Download size={14} /> Download
                </a>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300">
                  <Share2 size={14} /> Share
                </button>
                <button onClick={() => { setStep(0); setResult(null); setScript(null); setGenStatus(null); }}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50"
                >
                  <Plus size={14} /> New Song
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}


// ═══════════════════════════════════════════
// GRAPHICS GENERATOR — with Script Writer
// ═══════════════════════════════════════════
function GraphicsGenerator({ balance }) {
  const [step, setStep] = useState(0);
  const [idea, setIdea] = useState('');
  const [style, setStyle] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [count, setCount] = useState(1);
  const [quality, setQuality] = useState('basic');
  const [script, setScript] = useState(null);
  const [scriptError, setScriptError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const cost = count > 1 ? 80 : quality === 'hd' ? 50 : 20;

  const handleWriteScript = async () => {
    if (!idea.trim()) return;
    setStep(1);
    setScriptError('');
    try {
      const { data } = await api.post('/api/ai-content/script/graphics', {
        idea: idea.trim(), style, size
      }, { timeout: 120000 });
      setScript(data.script);
      setStep(2);
    } catch (err) {
      setScriptError(err?.response?.data?.details || err?.response?.data?.error || err?.message || 'Failed to write brief.');
      setStep(0);
    }
  };

  const handleGenerate = async () => {
    setStep(3);
    setGenerating(true);
    setResult(null);
    try {
      const { data } = await api.post('/api/ai-content/graphics/generate', {
        prompt: script?.prompt || idea, style: script?.style || style, size, count, quality, script
      });
      setResult(data);
      setStep(4);
    } catch (err) {
      alert(err?.response?.data?.error || 'Generation failed');
      setStep(2);
    } finally {
      setGenerating(false);
    }
  };

  // ─── STEP 0: Idea ───
  if (step === 0) {
    return (
      <div className="space-y-5">
        <StepIndicator steps={['Idea', 'Brief', 'Edit', 'Generate']} current={0} accent="orange" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What image do you want to create?</label>
          <textarea rows={3} maxLength={500}
            placeholder='e.g. "A futuristic city skyline at dusk with flying cars, neon lights reflecting on glass towers"'
            value={idea} onChange={e => setIdea(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Art Style</label>
          <PillSelect options={GRAPHIC_STYLES} value={style} onChange={setStyle} accent="orange" />
        </div>

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
                >{q === 'hd' ? 'HD' : 'Standard'}</button>
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
                >{c === 1 ? '1 Image' : '4 Images'}</button>
              ))}
            </div>
          </div>
        </div>

        {scriptError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{scriptError}</div>}

        <div className="flex items-center justify-between pt-2">
          <TokenCost cost={cost} label={quality} />
          <button onClick={handleWriteScript} disabled={!idea.trim() || idea.trim().length < 3}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
          >
            <PenTool size={18} /> Write Brief <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // ─── STEP 1: Loading ───
  if (step === 1) {
    return (
      <div className="space-y-5">
        <StepIndicator steps={['Idea', 'Brief', 'Edit', 'Generate']} current={1} accent="orange" />
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-200 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-orange-500 rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-700 font-semibold text-lg">AI is writing your visual brief...</p>
          <p className="text-gray-400 text-sm">Designing composition, colors, and detailed prompt</p>
        </div>
      </div>
    );
  }

  // ─── STEP 2: Script Editor ───
  if (step === 2 && script) {
    return (
      <div className="space-y-5">
        <StepIndicator steps={['Idea', 'Brief', 'Edit', 'Generate']} current={2} accent="orange" />

        <div className="flex items-center justify-between">
          <button onClick={() => setStep(0)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ChevronLeft size={16} /> Back
          </button>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
          <input type="text" value={script.title || ''} onChange={e => setScript(p => ({ ...p, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Main Prompt */}
        <div>
          <label className="block text-xs font-medium text-orange-600 mb-1">AI Generation Prompt (this is what the AI sees)</label>
          <textarea rows={4} value={script.prompt || ''} onChange={e => setScript(p => ({ ...p, prompt: e.target.value }))}
            className="w-full px-3 py-2 border-2 border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none resize-none bg-orange-50/30"
          />
        </div>

        {/* Negative prompt */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Negative Prompt (things to avoid)</label>
          <input type="text" value={script.negativePrompt || ''} onChange={e => setScript(p => ({ ...p, negativePrompt: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Composition */}
        {script.composition && (
          <div className="border border-gray-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Composition</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['layout', 'foreground', 'midground', 'background', 'focusPoint'].map(field => (
                <div key={field}>
                  <label className="block text-xs text-gray-500 mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                  <input type="text" value={script.composition[field] || ''}
                    onChange={e => setScript(p => ({ ...p, composition: { ...p.composition, [field]: e.target.value } }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Color Palette */}
        {script.colorPalette && (
          <div className="border border-gray-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Color Palette</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['primary', 'secondary', 'accent', 'mood'].map(field => (
                <div key={field}>
                  <label className="block text-xs text-gray-500 mb-1 capitalize">{field}</label>
                  <input type="text" value={script.colorPalette[field] || ''}
                    onChange={e => setScript(p => ({ ...p, colorPalette: { ...p.colorPalette, [field]: e.target.value } }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Variations */}
        {script.variations && script.variations.length > 0 && (
          <div className="bg-orange-50 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-orange-600 mb-2">Alternative Angles (click to use)</h4>
            <div className="flex flex-wrap gap-2">
              {script.variations.map((v, i) => (
                <button key={i} onClick={() => setScript(p => ({ ...p, prompt: v }))}
                  className="px-3 py-1.5 bg-white border border-orange-200 rounded-full text-xs text-gray-700 hover:border-orange-400 hover:bg-orange-50 transition-colors"
                >{v.length > 60 ? v.substring(0, 60) + '...' : v}</button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <TokenCost cost={cost} label="to generate" />
          <div className="flex items-center gap-3">
            <button onClick={handleWriteScript} className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50">
              <RefreshCw size={14} /> Rewrite
            </button>
            <button onClick={handleGenerate} disabled={balance < cost}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
            >
              <Sparkles size={18} /> Generate <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 3: Generating ───
  if (step === 3) {
    return (
      <div className="space-y-5">
        <StepIndicator steps={['Idea', 'Brief', 'Edit', 'Generate']} current={3} accent="orange" />
        <div className="flex flex-col items-center gap-3 py-12">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-orange-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Creating your {count > 1 ? 'images' : 'image'}...</p>
          <p className="text-gray-400 text-sm">This may take 15–60 seconds</p>
        </div>
      </div>
    );
  }

  // ─── STEP 4: Result ───
  if (step === 4 && result?.images?.length > 0) {
    return (
      <div className="space-y-5">
        <StepIndicator steps={['Idea', 'Brief', 'Edit', 'Generate']} current={4} accent="orange" />
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-green-500" /> Generated {result.images.length > 1 ? 'Images' : 'Image'}
        </h3>
        <div className={`grid gap-4 ${result.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1 max-w-lg mx-auto'}`}>
          {result.images.map((img, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden bg-gray-100 shadow-sm">
              <img src={img.url} alt={`Generated ${i + 1}`} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                <a href={img.url} download className="p-2.5 bg-white rounded-full shadow-lg hover:scale-110 transition-transform">
                  <Download size={18} className="text-gray-700" />
                </a>
                <button className="p-2.5 bg-white rounded-full shadow-lg hover:scale-110 transition-transform">
                  <Share2 size={18} className="text-gray-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button onClick={() => { setStep(0); setResult(null); setScript(null); }}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50"
          >
            <Plus size={14} /> Create Another
          </button>
        </div>
      </div>
    );
  }

  return null;
}


// ═══════════════════════════════════════════
// MAIN AI STUDIO PAGE
// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
// MOVIE MAKER — Full production pipeline
// ═══════════════════════════════════════════
const GENRES = ['Drama', 'Comedy', 'Action', 'Documentary', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation', 'Faith', 'Mystery', 'Fantasy'];

function MovieMaker({ balance }) {
  const [view, setView] = useState('list'); // list, create, project, episode
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState(null);
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Create form
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('series');
  const [formGenre, setFormGenre] = useState(['Drama']);
  const [formLogline, setFormLogline] = useState('');
  const [formStyle, setFormStyle] = useState('Cinematic');

  // Edit project
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState({});

  // Episode view
  const [genProgress, setGenProgress] = useState(null);
  const [merging, setMerging] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);
  const epPollRef = useRef(null);

  // Load projects
  const loadProjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/movie-projects');
      setProjects(data.projects || []);
    } catch {} finally { setLoading(false); }
  };

  const loadProject = async (id) => {
    try {
      const { data } = await api.get(`/api/movie-projects/${id}`);
      setActiveProject(data.project);
      setView('project');
    } catch (e) { setError(e?.response?.data?.error || 'Failed to load project'); }
  };

  useEffect(() => { loadProjects(); }, []);

  // Auto-poll when episode is generating
  useEffect(() => {
    if (view === 'episode' && activeEpisode?.status === 'generating' && activeProject) {
      const poll = setInterval(async () => {
        try {
          const { data: st } = await api.get(`/api/movie-projects/${activeProject._id}/episodes/${activeEpisode._id}/status`);
          setGenProgress(st.summary);
          if (st.allDone) {
            clearInterval(poll);
            const { data: pd } = await api.get(`/api/movie-projects/${activeProject._id}`);
            const updatedEp = pd.project.episodes.find(e => e._id === activeEpisode._id);
            if (updatedEp) setActiveEpisode(updatedEp);
            setActiveProject(pd.project);
            setGenProgress(null);
          } else {
            const completedScenes = st.scenes.filter(s => s.videoUrl);
            if (completedScenes.length > 0) {
              setActiveEpisode(prev => {
                if (!prev?.scenes) return prev;
                const updated = { ...prev, scenes: prev.scenes.map(s => {
                  const match = st.scenes.find(r => r.sceneNumber === s.sceneNumber);
                  return match ? { ...s, status: match.status, videoUrl: match.videoUrl || s.videoUrl } : s;
                })};
                return updated;
              });
            }
          }
        } catch {}
      }, 5000);
      epPollRef.current = poll;
      return () => clearInterval(poll);
    }
  }, [view, activeEpisode?._id, activeEpisode?.status]);

  // Create project
  const handleCreate = async () => {
    if (!formTitle.trim()) return;
    setCreating(true);
    try {
      const { data } = await api.post('/api/movie-projects', {
        title: formTitle, type: formType, genre: formGenre, logline: formLogline, style: formStyle
      });
      setActiveProject(data.project);
      setView('project');
      setFormTitle(''); setFormLogline('');
      loadProjects();
    } catch (e) { setError(e?.response?.data?.error || 'Failed to create'); }
    finally { setCreating(false); }
  };

  // ─── LIST VIEW ───
  if (view === 'list') {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Video size={22} className="text-amber-500" /> AI Movie Studio
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">Create movies, series, and episodes with AI</p>
          </div>
          <button onClick={() => setView('create')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-red-600 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all"
          >
            <Plus size={16} /> New Project
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12"><Loader2 size={24} className="animate-spin text-amber-500 mx-auto" /></div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <Video size={56} className="mx-auto text-gray-300" />
            <p className="text-gray-500 font-medium">No projects yet</p>
            <p className="text-sm text-gray-400 max-w-md mx-auto">Create your first AI movie, series, or short film. Cast characters using your own photos and AI will generate every scene.</p>
            <button onClick={() => setView('create')}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-red-600 text-white rounded-full font-semibold"
            >Create Your First Project</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(p => (
              <button key={p._id} onClick={() => loadProject(p._id)}
                className="text-left p-4 border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  {p.coverImageUrl ? (
                    <img src={p.coverImageUrl} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" alt="" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-red-100 flex items-center justify-center flex-shrink-0">
                      <Film size={24} className="text-amber-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{p.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{p.type} · {Array.isArray(p.genre) ? p.genre.join(', ') : p.genre} · {p.totalEpisodes || 0} episode{p.totalEpisodes !== 1 ? 's' : ''}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        p.status === 'published' ? 'bg-green-100 text-green-700' :
                        p.status === 'in-production' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>{p.status}</span>
                      <span className="text-[10px] text-gray-400">{p.characters?.length || 0} characters</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0 mt-4" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── CREATE VIEW ───
  if (view === 'create') {
    return (
      <div className="space-y-5">
        <button onClick={() => setView('list')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} /> Back to Projects
        </button>
        <h3 className="text-lg font-bold text-gray-900">New Movie Project</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder='e.g. "The Last Prophet" or "Lagos Dreams"'
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <div className="flex gap-2">
              {[{ v: 'series', l: '📺 Series', d: 'Multiple episodes' }, { v: 'movie', l: '🎬 Movie', d: 'Single feature' }, { v: 'short', l: '🎞️ Short Film', d: 'Under 5 min' }].map(t => (
                <button key={t.v} onClick={() => setFormType(t.v)}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-center border-2 transition-all ${formType === t.v ? 'border-amber-500 bg-amber-50' : 'border-gray-200'}`}
                >
                  <div className="text-sm font-semibold">{t.l}</div>
                  <div className="text-[10px] text-gray-400">{t.d}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genre (select multiple)</label>
            <div className="flex flex-wrap gap-1.5">
              {GENRES.map(g => (
                <button key={g} onClick={() => setFormGenre(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${formGenre.includes(g) ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >{g}</button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logline (one-sentence pitch)</label>
          <input type="text" value={formLogline} onChange={e => setFormLogline(e.target.value)}
            placeholder='e.g. "A young Nigerian programmer discovers she can hack into an alternate digital dimension"'
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Visual Style</label>
          <PillSelect options={VIDEO_STYLES} value={formStyle} onChange={setFormStyle} accent="orange" />
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

        <button onClick={handleCreate} disabled={!formTitle.trim() || creating}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-red-600 text-white rounded-full font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
        >
          {creating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          Create Project
        </button>
      </div>
    );
  }

  // ─── PROJECT VIEW (Characters + Episodes) ───

  const startEdit = () => {
    setEditFields({
      title: activeProject.title,
      logline: activeProject.logline || '',
      synopsis: activeProject.synopsis || '',
      type: activeProject.type,
      genre: activeProject.genre || ['Drama'],
      style: activeProject.style || 'Cinematic',
      targetAudience: activeProject.targetAudience || '',
      language: activeProject.language || 'en',
      defaultVoiceId: activeProject.defaultVoiceId || 'onyx-narrator',
      autoCaptions: activeProject.autoCaptions ?? true,
      logoUrl: activeProject.logoUrl || '',
      introImageUrl: activeProject.introImageUrl || '',
      outroImageUrl: activeProject.outroImageUrl || '',
      coverImageUrl: activeProject.coverImageUrl || '',
    });
    setEditMode(true);
  };

  const saveEdit = async () => {
    try {
      const { data } = await api.put(`/api/movie-projects/${activeProject._id}`, editFields);
      setActiveProject(data.project);
      setEditMode(false);
    } catch (e) { setError(e?.response?.data?.error || 'Save failed'); }
  };

  const uploadForField = async (file, field) => {
    try {
      const fd = new FormData(); fd.append('file', file);
      const { data } = await api.post('/api/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000 });
      const url = data.url || data.imageUrl || data.secure_url || '';
      setEditFields(prev => ({ ...prev, [field]: url }));
    } catch {}
  };

  if (view === 'project' && activeProject) {
    const p = activeProject;
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <button onClick={() => { setView('list'); setActiveProject(null); setEditMode(false); }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft size={16} /> All Projects
          </button>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.status === 'in-production' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{p.status}</span>
            {!editMode ? (
              <button onClick={startEdit} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 font-medium">
                <Edit3 size={12} /> Edit Project
              </button>
            ) : (
              <div className="flex gap-1.5">
                <button onClick={saveEdit} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-amber-500 text-white rounded-full hover:bg-amber-600 font-medium">
                  <CheckCircle2 size={12} /> Save
                </button>
                <button onClick={() => setEditMode(false)} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 font-medium">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Project Header — Edit mode or Display mode */}
        {editMode ? (
          <div className="border-2 border-amber-300 rounded-xl p-5 bg-amber-50/30 space-y-4">
            <h4 className="text-sm font-bold text-amber-700 flex items-center gap-2"><Edit3 size={14} /> Edit Project Details</h4>

            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
              <input type="text" value={editFields.title || ''} onChange={e => setEditFields(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>

            {/* Type + Style */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                <div className="flex gap-2">
                  {['series', 'movie', 'short'].map(t => (
                    <button key={t} onClick={() => setEditFields(prev => ({ ...prev, type: t }))}
                      className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium border ${editFields.type === t ? 'border-amber-500 bg-amber-100 text-amber-700' : 'border-gray-200 text-gray-600'}`}
                    >{t === 'series' ? '📺 Series' : t === 'movie' ? '🎬 Movie' : '🎞️ Short'}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Style</label>
                <div className="flex flex-wrap gap-1">
                  {VIDEO_STYLES.map(s => (
                    <button key={s} onClick={() => setEditFields(prev => ({ ...prev, style: s }))}
                      className={`px-2 py-1 rounded-full text-[10px] font-medium ${editFields.style === s ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                    >{s}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Genre — multi-select */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Genre (select multiple)</label>
              <div className="flex flex-wrap gap-1.5">
                {GENRES.map(g => (
                  <button key={g} onClick={() => setEditFields(prev => {
                    const genres = prev.genre || [];
                    return { ...prev, genre: genres.includes(g) ? genres.filter(x => x !== g) : [...genres, g] };
                  })}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${(editFields.genre || []).includes(g) ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >{g}</button>
                ))}
              </div>
            </div>

            {/* Logline */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Logline (one-sentence pitch)</label>
              <input type="text" value={editFields.logline || ''} onChange={e => setEditFields(prev => ({ ...prev, logline: e.target.value }))}
                placeholder="A young programmer discovers she can hack into an alternate dimension..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>

            {/* Synopsis */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Full Synopsis</label>
              <textarea rows={3} value={editFields.synopsis || ''} onChange={e => setEditFields(prev => ({ ...prev, synopsis: e.target.value }))}
                placeholder="Describe the overall story arc, main conflicts, and themes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 outline-none resize-none"
              />
            </div>

            {/* Target Audience + Language */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Target Audience</label>
                <input type="text" value={editFields.targetAudience || ''} onChange={e => setEditFields(prev => ({ ...prev, targetAudience: e.target.value }))}
                  placeholder="e.g. Young adults, Church community, Tech enthusiasts"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Language</label>
                <select value={editFields.language || 'en'} onChange={e => setEditFields(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {[['en','English'],['yo','Yoruba'],['ig','Igbo'],['ha','Hausa'],['tw','Twi'],['sw','Swahili'],['fr','French'],['es','Spanish'],['pt','Portuguese'],['ar','Arabic'],['zh','Chinese']].map(([c,l]) => (
                    <option key={c} value={c}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Branding: Cover, Logo, Intro, Outro */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Project Branding</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { field: 'coverImageUrl', label: 'Cover Image' },
                  { field: 'logoUrl', label: 'Logo' },
                  { field: 'introImageUrl', label: 'Intro Slide' },
                  { field: 'outroImageUrl', label: 'Outro Slide' },
                ].map(({ field, label }) => (
                  <div key={field}>
                    <span className="text-[10px] text-gray-400">{label}</span>
                    {editFields[field] ? (
                      <div className="relative mt-1">
                        <img src={editFields[field]} alt={label} className="w-full h-16 object-cover rounded-lg border border-gray-200" />
                        <button onClick={() => setEditFields(prev => ({ ...prev, [field]: '' }))}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">×</button>
                      </div>
                    ) : (
                      <label className="mt-1 flex flex-col items-center gap-0.5 p-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-400 text-center">
                        <Upload size={14} className="text-gray-400" />
                        <span className="text-[9px] text-gray-400">Upload</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadForField(e.target.files[0], field)} />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Settings: Voice, Captions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Default Narrator Voice</label>
                <select value={editFields.defaultVoiceId || 'onyx-narrator'} onChange={e => setEditFields(prev => ({ ...prev, defaultVoiceId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {VOICES.flatMap(g => g.voices).map(v => (
                    <option key={v.id} value={v.id}>{v.flag} {v.label} ({v.accent})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Auto-Captions</label>
                <button onClick={() => setEditFields(prev => ({ ...prev, autoCaptions: !prev.autoCaptions }))}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium border ${editFields.autoCaptions ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-300 text-gray-600'}`}
                >{editFields.autoCaptions ? '✅ Captions ON' : 'Captions OFF'}</button>
              </div>
            </div>

            {/* Delete project */}
            <div className="pt-3 border-t border-gray-200">
              <button onClick={async () => {
                if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
                try {
                  await api.delete(`/api/movie-projects/${p._id}`);
                  setView('list'); setActiveProject(null); setEditMode(false); loadProjects();
                } catch {}
              }} className="text-xs text-red-500 hover:text-red-700 font-medium">
                Delete this project
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-100 to-red-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {p.coverImageUrl ? <img src={p.coverImageUrl} className="w-full h-full rounded-xl object-cover" alt="" /> : <Film size={32} className="text-amber-500" />}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{p.title}</h3>
              <p className="text-sm text-gray-500">{p.type} · {Array.isArray(p.genre) ? p.genre.join(', ') : p.genre} · {p.style}</p>
              {p.logline && <p className="text-sm text-gray-600 mt-1 italic">"{p.logline}"</p>}
              {p.synopsis && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.synopsis}</p>}
              {p.targetAudience && <p className="text-[10px] text-gray-400 mt-1">Audience: {p.targetAudience}</p>}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {p.logoUrl && <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full">🏷️ Logo</span>}
                {p.introImageUrl && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">🎬 Intro</span>}
                {p.outroImageUrl && <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">🎬 Outro</span>}
                {p.autoCaptions && <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">💬 Captions</span>}
              </div>
            </div>
          </div>
        )}

        {/* CHARACTERS */}
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2"><UserCircle2 size={16} className="text-amber-500" /> Cast ({p.characters?.length || 0})</h4>
            <button onClick={async () => {
              const name = prompt('Character name:');
              if (!name) return;
              const role = prompt('Role (main/supporting/narrator):') || 'main';
              const desc = prompt('Brief description:') || '';
              try {
                const { data } = await api.post(`/api/movie-projects/${p._id}/characters`, { name, role, description: desc });
                setActiveProject(prev => ({ ...prev, characters: data.characters }));
              } catch {}
            }} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-amber-50 text-amber-600 rounded-full hover:bg-amber-100 font-medium">
              <Plus size={12} /> Add Character
            </button>
          </div>

          {(!p.characters || p.characters.length === 0) ? (
            <p className="text-sm text-gray-400 text-center py-4">No characters yet. Add your cast — upload face photos so AI can generate them in scenes!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {p.characters.map(c => {
                const projId = activeProject._id; // Always use fresh ref
                return (
                <div key={c._id} className="border border-gray-200 rounded-xl p-3 relative group">
                  {/* Action buttons — top right */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button onClick={async () => {
                      const name = prompt('Character name:', c.name);
                      if (!name) return;
                      const role = prompt('Role (main/supporting/narrator/extra):', c.role) || c.role;
                      const desc = prompt('Description:', c.description) || c.description;
                      try {
                        await api.put(`/api/movie-projects/${projId}/characters/${c._id}`, { name, role, description: desc });
                        loadProject(projId);
                      } catch (err) { alert(err?.response?.data?.error || 'Update failed'); }
                    }} className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-amber-50" title="Edit">
                      <Edit3 size={10} className="text-gray-500" />
                    </button>
                    <button onClick={async () => {
                      if (!confirm(`Remove ${c.name} from cast?`)) return;
                      try {
                        await api.delete(`/api/movie-projects/${projId}/characters/${c._id}`);
                        loadProject(projId);
                      } catch (err) { alert(err?.response?.data?.error || 'Delete failed'); }
                    }} className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-red-50" title="Delete">
                      <Trash2 size={10} className="text-red-400" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Face */}
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {c.faceImageUrl ? <img src={c.faceImageUrl} className="w-full h-full object-cover" alt={c.name} /> : <UserCircle2 size={36} className="text-gray-300 mx-auto mt-2" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
                      <p className="text-[10px] text-gray-400 capitalize">{c.role}</p>
                      {c.description && <p className="text-[10px] text-gray-400 truncate mt-0.5">{c.description}</p>}
                      <div className="flex items-center gap-1 mt-1">
                        {c.voiceRecordingUrl ? (
                          <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><Mic size={8} /> Custom voice</span>
                        ) : (
                          <span className="text-[10px] bg-purple-50 text-purple-500 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <Volume2 size={8} /> {VOICES.flatMap(g => g.voices).find(v => v.id === c.voiceId)?.label || c.voiceId || 'Nova'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reference images gallery (wife, family, etc.) */}
                  {c.referenceImages?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] text-gray-400 mb-1">Reference photos ({c.referenceImages.length})</p>
                      <div className="flex gap-1.5 overflow-x-auto pb-1">
                        {c.referenceImages.map((img, ri) => (
                          <div key={ri} className="relative flex-shrink-0">
                            <img src={img} alt={`Ref ${ri + 1}`} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                            <button onClick={async () => {
                              const updated = c.referenceImages.filter((_, idx) => idx !== ri);
                              try {
                                await api.put(`/api/movie-projects/${projId}/characters/${c._id}`, { referenceImages: updated });
                                loadProject(projId);
                              } catch {}
                            }} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px]">×</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Uploads section */}
                  <div className="mt-2.5 space-y-2">
                    {/* Face + Reference images row */}
                    <div className="flex gap-1.5">
                      <label className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-medium cursor-pointer hover:bg-amber-100">
                        <Camera size={10} /> {c.faceImageUrl ? 'Change Face' : 'Upload Face'}
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                          const file = e.target.files?.[0]; if (!file) return;
                          try {
                            const fd = new FormData(); fd.append('file', file);
                            const { data: up } = await api.post('/api/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000 });
                            const url = up.url || up.imageUrl || up.secure_url;
                            if (!url) throw new Error('No URL returned');
                            await api.put(`/api/movie-projects/${projId}/characters/${c._id}`, { faceImageUrl: url });
                            loadProject(projId);
                          } catch (err) { alert(`Face upload failed: ${err?.response?.data?.error || err.message}`); }
                        }} />
                      </label>
                      {/* Add reference image (wife, family, etc.) */}
                      <label className="flex items-center justify-center gap-1 px-2 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-medium cursor-pointer hover:bg-indigo-100" title="Add reference photo (family, wife, etc.)">
                        <Plus size={10} /> Ref Photo
                        <input type="file" accept="image/*" multiple className="hidden" onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          if (!files.length) return;
                          const newUrls = [];
                          for (const file of files) {
                            try {
                              const fd = new FormData(); fd.append('file', file);
                              const { data: up } = await api.post('/api/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000 });
                              const url = up.url || up.imageUrl || up.secure_url;
                              if (url) newUrls.push(url);
                            } catch (err) { console.error('Ref upload failed:', err.message); }
                          }
                          if (newUrls.length > 0) {
                            try {
                              await api.put(`/api/movie-projects/${projId}/characters/${c._id}`, {
                                referenceImages: [...(c.referenceImages || []), ...newUrls]
                              });
                              loadProject(projId);
                            } catch (err) { alert(`Save failed: ${err?.response?.data?.error || err.message}`); }
                          }
                        }} />
                      </label>
                      {c.faceImageUrl && (
                        <button onClick={async () => {
                          try { await api.put(`/api/movie-projects/${projId}/characters/${c._id}`, { faceImageUrl: '' }); loadProject(projId); } catch {}
                        }} className="px-2 py-1.5 bg-red-50 text-red-500 rounded-lg text-[10px] font-medium hover:bg-red-100" title="Remove face">
                          <Trash2 size={10} />
                        </button>
                      )}
                    </div>

                    {/* Voice recording upload row */}
                    <div className="flex gap-1.5">
                      <label className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-medium cursor-pointer hover:bg-blue-100">
                        <Mic size={10} /> {c.voiceRecordingUrl ? 'Change Voice' : 'Upload Voice'}
                        <input type="file" accept="audio/*,video/*" className="hidden" onChange={async (e) => {
                          const file = e.target.files?.[0]; if (!file) return;
                          try {
                            const fd = new FormData(); fd.append('file', file);
                            const { data: up } = await api.post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 });
                            const url = up.url || up.videoUrl || up.secure_url;
                            if (!url) throw new Error('No URL returned');
                            await api.put(`/api/movie-projects/${projId}/characters/${c._id}`, { voiceRecordingUrl: url });
                            loadProject(projId);
                          } catch (err) { alert(`Voice upload failed: ${err?.response?.data?.error || err.message}`); }
                        }} />
                      </label>
                      {c.voiceRecordingUrl && (
                        <button onClick={async () => {
                          try { await api.put(`/api/movie-projects/${projId}/characters/${c._id}`, { voiceRecordingUrl: '' }); loadProject(projId); } catch {}
                        }} className="px-2 py-1.5 bg-red-50 text-red-500 rounded-lg text-[10px] font-medium hover:bg-red-100" title="Remove voice">
                          <Trash2 size={10} />
                        </button>
                      )}
                    </div>

                    {/* Voice preview */}
                    {c.voiceRecordingUrl && (
                      <audio src={c.voiceRecordingUrl} controls className="w-full h-8 mt-1" />
                    )}

                    {/* TTS voice selector (fallback) */}
                    {!c.voiceRecordingUrl && (
                      <select value={c.voiceId || 'nova'} onChange={async (e) => {
                        try {
                          await api.put(`/api/movie-projects/${projId}/characters/${c._id}`, { voiceId: e.target.value });
                          loadProject(projId);
                        } catch {}
                      }} className="w-full px-2 py-1 border border-gray-200 rounded-lg text-[10px] text-gray-500 outline-none focus:ring-1 focus:ring-amber-400">
                        {VOICES.flatMap(g => g.voices).map(v => (
                          <option key={v.id} value={v.id}>{v.flag} {v.label} — {v.accent}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>

        {/* EPISODES */}
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2"><Film size={16} className="text-amber-500" /> Episodes ({p.episodes?.length || 0})</h4>
            <div className="flex flex-wrap gap-1.5">
              {p.type === 'series' && (
                <button onClick={async (e) => {
                  const btn = e.currentTarget; btn.disabled = true; btn.textContent = 'Planning...';
                  try {
                    const count = parseInt(prompt('How many episodes?', '6')) || 6;
                    if (!count) { btn.disabled = false; btn.textContent = 'AI Plan Season'; return; }
                    const { data } = await api.post(`/api/movie-projects/${p._id}/plan-season`, { episodeCount: count }, { timeout: 600000 });
                    loadProject(p._id);
                    if (data.episodesCreated < data.requested) {
                      alert(`Planned ${data.episodesCreated} of ${data.requested} episodes. Some batches failed — you can plan more to fill the gaps.`);
                    } else {
                      alert(`All ${data.episodesCreated} episodes planned!`);
                    }
                  } catch (err) {
                    // Reload project — batches saved before the failure are still in DB
                    loadProject(p._id);
                    alert(err?.response?.data?.error || 'Planning may have partially completed — check your episodes list.');
                  }
                  finally { btn.disabled = false; btn.textContent = 'AI Plan Season'; }
                }} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 font-medium disabled:opacity-50">
                  <Sparkles size={12} /> AI Plan Season
                </button>
              )}
              <button onClick={async () => {
                const title = prompt('Episode title:') || `Episode ${(p.episodes?.length || 0) + 1}`;
                try {
                  await api.post(`/api/movie-projects/${p._id}/episodes`, { title, duration: 60 });
                  loadProject(p._id);
                } catch {}
              }} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-amber-50 text-amber-600 rounded-full hover:bg-amber-100 font-medium">
                <Plus size={12} /> Add Episode
              </button>
              {p.episodes?.length > 0 && (
                <button onClick={async () => {
                  if (!confirm(`Delete ALL ${p.episodes.length} episodes? This cannot be undone.`)) return;
                  try {
                    await api.delete(`/api/movie-projects/${p._id}/episodes`);
                    loadProject(p._id);
                  } catch (e) { alert(e?.response?.data?.error || 'Failed'); }
                }} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 text-red-500 rounded-full hover:bg-red-100 font-medium">
                  <Trash2 size={12} /> Delete All
                </button>
              )}
            </div>
          </div>

          {(!p.episodes || p.episodes.length === 0) ? (
            <p className="text-sm text-gray-400 text-center py-4">No episodes. Add one manually or let AI plan your entire season!</p>
          ) : (
            <div className="space-y-2">
              {p.episodes.map((ep, i) => (
                <div key={ep._id} className="flex items-center gap-2 p-3 border border-gray-100 rounded-xl hover:border-amber-200 hover:bg-amber-50/30 transition-all group">
                  {/* Click to open episode */}
                  <button onClick={() => { setActiveEpisode(ep); setView('episode'); }} className="flex-1 flex items-center gap-3 text-left min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-amber-600">{ep.episodeNumber}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{ep.title}</p>
                      <p className="text-[10px] text-gray-400 truncate">{ep.synopsis || 'No synopsis'}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        ep.status === 'merged' || ep.status === 'published' ? 'bg-green-100 text-green-700' :
                        ep.status === 'rendered' ? 'bg-blue-100 text-blue-700' :
                        ep.status === 'generating' ? 'bg-amber-100 text-amber-700' :
                        ep.status === 'scripted' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>{ep.status}</span>
                      <span className="text-[10px] text-gray-400">{ep.scenes?.length || 0} scenes</span>
                    </div>
                  </button>

                  {/* Episode action buttons */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {/* Edit title/synopsis */}
                    <button onClick={async (e) => {
                      e.stopPropagation();
                      const title = prompt('Episode title:', ep.title);
                      if (!title) return;
                      const synopsis = prompt('Synopsis:', ep.synopsis || '');
                      try {
                        await api.put(`/api/movie-projects/${p._id}/episodes/${ep._id}`, { title, synopsis });
                        loadProject(p._id);
                      } catch {}
                    }} className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-amber-50" title="Edit episode">
                      <Edit3 size={11} className="text-gray-500" />
                    </button>
                    {/* Re-script (reset to draft) */}
                    {(ep.status === 'scripted' || ep.status === 'rendered' || ep.status === 'failed') && (
                      <button onClick={async (e) => {
                        e.stopPropagation();
                        if (!confirm(`Re-script "${ep.title}"? This will erase current scenes.`)) return;
                        try {
                          await api.post(`/api/movie-projects/${p._id}/episodes/${ep._id}/re-script`);
                          loadProject(p._id);
                        } catch {}
                      }} className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-purple-50" title="Re-script episode">
                        <RefreshCw size={11} className="text-purple-500" />
                      </button>
                    )}
                    {/* Delete episode */}
                    <button onClick={async (e) => {
                      e.stopPropagation();
                      if (!confirm(`Delete Ep ${ep.episodeNumber}: "${ep.title}"?`)) return;
                      try {
                        await api.delete(`/api/movie-projects/${p._id}/episodes/${ep._id}`);
                        loadProject(p._id);
                      } catch {}
                    }} className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-red-50" title="Delete episode">
                      <Trash2 size={11} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── EPISODE VIEW (Script + Generate + Preview) ───

  if (view === 'episode' && activeProject && activeEpisode) {
    const p = activeProject;
    const ep = activeEpisode;
    const completedScenes = ep.scenes?.filter(s => s.status === 'completed' || s.videoUrl).length || 0;
    const totalScenes = ep.scenes?.length || 0;

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <button onClick={() => { setView('project'); setActiveEpisode(null); setGenProgress(null); clearInterval(epPollRef.current); }}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={16} /> Back to {p.title}
          </button>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              ep.status === 'merged' ? 'bg-green-100 text-green-700' :
              ep.status === 'rendered' ? 'bg-blue-100 text-blue-700' :
              ep.status === 'generating' ? 'bg-amber-100 text-amber-700' :
              ep.status === 'scripted' ? 'bg-purple-100 text-purple-700' :
              'bg-gray-100 text-gray-500'
            }`}>{ep.status}</span>
            {/* Edit episode title/synopsis */}
            <button onClick={async () => {
              const title = prompt('Episode title:', ep.title);
              if (!title) return;
              const synopsis = prompt('Synopsis:', ep.synopsis || '') || '';
              try {
                await api.put(`/api/movie-projects/${p._id}/episodes/${ep._id}`, { title, synopsis });
                setActiveEpisode(prev => ({ ...prev, title, synopsis }));
                loadProject(p._id);
              } catch {}
            }} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-amber-50" title="Edit episode">
              <Edit3 size={12} className="text-gray-500" />
            </button>
          </div>
        </div>

        <h3 className="font-bold text-gray-900">Ep {ep.episodeNumber}: {ep.title}</h3>
        {ep.synopsis && <p className="text-sm text-gray-500 italic">{ep.synopsis}</p>}

        {/* ─── PROGRESS BAR (during generation) ─── */}
        {(ep.status === 'generating' || genProgress) && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-amber-700 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Generating Scenes...
              </span>
              <span className="text-sm font-bold text-amber-600">
                {genProgress ? `${genProgress.completed}/${genProgress.total}` : `${completedScenes}/${totalScenes}`}
              </span>
            </div>
            <div className="w-full h-3 bg-amber-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${genProgress ? genProgress.progress : (totalScenes > 0 ? Math.round(completedScenes / totalScenes * 100) : 0)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-amber-500">
              <span>{genProgress?.completed || completedScenes} completed</span>
              {(genProgress?.failed || 0) > 0 && <span className="text-red-500">{genProgress.failed} failed</span>}
              <span>{genProgress?.generating || (totalScenes - completedScenes)} in progress</span>
            </div>
          </div>
        )}

        {/* ─── ACTION BUTTONS ─── */}
        <div className="flex flex-wrap gap-2">
          {(!ep.scenes || ep.scenes.length === 0 || ep.status === 'draft') && (
            <button onClick={async (e) => {
              const btn = e.currentTarget; btn.disabled = true;
              setScriptLoading(true);
              try {
                setError('');
                const { data } = await api.post(`/api/movie-projects/${p._id}/episodes/${ep._id}/write-script`, {}, { timeout: 120000 });
                setActiveEpisode(data.episode);
                loadProject(p._id);
              } catch (err) { setError(err?.response?.data?.error || 'Script failed'); }
              finally { btn.disabled = false; setScriptLoading(false); }
            }} disabled={scriptLoading} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold hover:shadow-lg disabled:opacity-50">
              {scriptLoading ? <Loader2 size={16} className="animate-spin" /> : <PenTool size={16} />}
              {scriptLoading ? 'Writing Script...' : 'AI Write Script'}
            </button>
          )}

        {/* ─── Script writing progress ─── */}
        {scriptLoading && (
          <div className="w-full bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Writing script...
              </span>
            </div>
            <div className="w-full h-2.5 bg-purple-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ width: '70%' }} />
            </div>
          </div>
        )}

          {ep.scenes?.length > 0 && (ep.status === 'scripted' || ep.status === 'draft') && (
            <button onClick={async (e) => {
              const btn = e.currentTarget; btn.disabled = true;
              try {
                setError('');
                await api.post(`/api/movie-projects/${p._id}/episodes/${ep._id}/generate`, {}, { timeout: 300000 });
                setActiveEpisode(prev => ({ ...prev, status: 'generating' }));
              } catch (err) { setError(err?.response?.data?.error || 'Generation failed'); btn.disabled = false; }
            }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-red-600 text-white rounded-full text-sm font-semibold hover:shadow-lg disabled:opacity-50">
              <Sparkles size={16} /> Generate All Scenes
            </button>
          )}

          {(ep.status === 'rendered' || (completedScenes >= 2 && ep.status !== 'generating')) && (
            <button onClick={async (e) => {
              const btn = e.currentTarget; btn.disabled = true; setMerging(true);
              try {
                setError('');
                const urls = ep.scenes.filter(s => s.videoUrl).map(s => s.videoUrl);
                // For movies: compile dialogue as audio
                const narrations = ep.scenes.map(s => {
                  if (s.dialogue?.length > 0) {
                    return s.dialogue.map(d => d.line || '').join('. ');
                  }
                  return s.narration || '';
                });
                const textOverlays = ep.scenes.map(s => s.textOverlay || '');

                // Build per-scene voice IDs — each character speaks in their own TTS voice
                const voiceRecordingUrls = ep.scenes.map(s => {
                  const speakerNames = [
                    ...(s.dialogue?.map(d => d.character) || []),
                    ...(s.characters || [])
                  ];
                  for (const name of speakerNames) {
                    if (!name) continue;
                    const char = p.characters?.find(c =>
                      c.name.toLowerCase() === name.toLowerCase()
                    );
                    if (char?.voiceId) return char.voiceId;
                  }
                  return null; // falls back to project default voice
                });
                const { data } = await api.post('/api/ai-content/video/merge', {
                  videoUrls: urls, title: `${p.title} - ${ep.title}`,
                  narrations, textOverlays, voiceRecordingUrls,
                  voice: p.defaultVoiceId || 'onyx-narrator', addVoiceover: true, autoCaptions: p.autoCaptions !== false,
                  logoUrl: p.logoUrl || undefined, introImageUrl: p.introImageUrl || undefined, outroImageUrl: p.outroImageUrl || undefined
                }, { timeout: 360000 });
                if (data.mergedUrl) {
                  await api.put(`/api/movie-projects/${p._id}/episodes/${ep._id}`, { status: 'merged' });
                  setActiveEpisode(prev => ({ ...prev, mergedVideoUrl: data.mergedUrl, status: 'merged', thumbnails: data.thumbnails || [] }));
                }
              } catch (err) { setError(err?.response?.data?.error || 'Merge failed'); }
              finally { btn.disabled = false; setMerging(false); }
            }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-semibold hover:shadow-lg disabled:opacity-50">
              {merging ? <Loader2 size={16} className="animate-spin" /> : <Film size={16} />}
              {merging ? 'Merging...' : 'Merge + Voiceover'}
            </button>
          )}

          {/* Re-script */}
          {ep.scenes?.length > 0 && ep.status !== 'generating' && (
            <button onClick={async () => {
              if (!confirm('Re-script this episode? All scenes will be erased.')) return;
              try {
                await api.post(`/api/movie-projects/${p._id}/episodes/${ep._id}/re-script`);
                setActiveEpisode(prev => ({ ...prev, scenes: [], status: 'draft', mergedVideoUrl: '' }));
                loadProject(p._id);
              } catch {}
            }} className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200">
              <RefreshCw size={14} /> Re-script
            </button>
          )}

          {/* Delete all scenes */}
          {ep.scenes?.length > 0 && ep.status !== 'generating' && (
            <button onClick={async () => {
              if (!confirm(`Delete all ${ep.scenes.length} scenes?`)) return;
              try {
                await api.delete(`/api/movie-projects/${p._id}/episodes/${ep._id}/scenes`);
                setActiveEpisode(prev => ({ ...prev, scenes: [], status: 'draft', mergedVideoUrl: '' }));
                loadProject(p._id);
              } catch {}
            }} className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-500 rounded-full text-sm font-medium hover:bg-red-100">
              <Trash2 size={14} /> Delete All Scenes
            </button>
          )}
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

        {/* ─── Merging progress ─── */}
        {merging && (
          <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
            <Loader2 size={24} className="animate-spin text-green-500 mx-auto mb-2" />
            <p className="text-sm text-green-700 font-medium">Merging {completedScenes} scenes + adding voiceover...</p>
            <p className="text-xs text-green-400 mt-1">This may take 1-3 minutes</p>
          </div>
        )}

        {/* ─── Merged video ─── */}
        {ep.mergedVideoUrl && (
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2"><CheckCircle2 size={16} /> Full Episode with Audio</h4>
            <video src={ep.mergedVideoUrl} controls className="w-full rounded-lg max-h-80 bg-black" />
            <div className="flex gap-2 mt-2">
              <a href={ep.mergedVideoUrl} download className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700">
                <Download size={14} /> Download
              </a>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300">
                <Share2 size={14} /> Post to CYBEV
              </button>
            </div>
          </div>
        )}

        {/* ─── SCENE LIST with edit/delete ─── */}
        {ep.scenes?.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Scenes ({totalScenes}) — {completedScenes} rendered</h4>
              {ep.status !== 'generating' && (
                <span className="text-[10px] text-gray-400">Hover scenes to edit or delete</span>
              )}
            </div>
            {ep.scenes.map((scene, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-3 group relative">
                {/* Scene action buttons — top right */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Edit scene */}
                  <button onClick={async () => {
                    const visual = prompt('Visual description:', scene.visual);
                    if (visual === null) return;
                    const narration = prompt('Narration:', scene.narration || '');
                    const textOverlay = prompt('Text overlay (max 8 words):', scene.textOverlay || '');
                    const camera = prompt('Camera:', scene.camera || '');
                    try {
                      await api.put(`/api/movie-projects/${p._id}/episodes/${ep._id}/scenes/${i}`, {
                        visual: visual || scene.visual, narration, textOverlay, camera
                      });
                      setActiveEpisode(prev => {
                        const scenes = [...prev.scenes];
                        scenes[i] = { ...scenes[i], visual: visual || scenes[i].visual, narration, textOverlay, camera };
                        return { ...prev, scenes };
                      });
                    } catch {}
                  }} className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-amber-50" title="Edit scene">
                    <Edit3 size={10} className="text-gray-500" />
                  </button>
                  {/* Delete scene */}
                  <button onClick={async () => {
                    if (!confirm(`Delete Scene ${scene.sceneNumber}?`)) return;
                    try {
                      await api.delete(`/api/movie-projects/${p._id}/episodes/${ep._id}/scenes/${i}`);
                      setActiveEpisode(prev => {
                        const scenes = prev.scenes.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, sceneNumber: idx + 1 }));
                        return { ...prev, scenes };
                      });
                    } catch {}
                  }} className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-red-50" title="Delete scene">
                    <Trash2 size={10} className="text-red-400" />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-2 pr-16">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">{scene.sceneNumber}</div>
                    Scene {scene.sceneNumber}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      scene.status === 'completed' || scene.videoUrl ? 'bg-green-100 text-green-600' :
                      scene.status === 'generating' ? 'bg-amber-100 text-amber-600 animate-pulse' :
                      scene.status === 'failed' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>{scene.videoUrl ? 'completed' : scene.status}</span>
                  </span>
                  {scene.status === 'generating' && <Loader2 size={14} className="animate-spin text-amber-500" />}
                </div>

                <p className="text-xs text-gray-600 mb-1"><span className="font-medium text-gray-500">Visual:</span> {scene.visual?.substring(0, 150)}{scene.visual?.length > 150 ? '...' : ''}</p>
                {scene.camera && <p className="text-[10px] text-gray-400 mb-1">📷 {scene.camera}</p>}
                {scene.narration && <p className="text-xs text-purple-600 italic mb-1">🎤 "{scene.narration}"</p>}
                {scene.textOverlay && <p className="text-[10px] text-amber-600 mb-1">📝 "{scene.textOverlay}"</p>}
                {scene.dialogue?.length > 0 && (
                  <div className="text-[10px] text-blue-600 mb-1">
                    {scene.dialogue.map((d, di) => <span key={di} className="block">💬 <strong>{d.character}:</strong> "{d.line}"</span>)}
                  </div>
                )}

                {scene.videoUrl && (
                  <div className="mt-2">
                    <video src={scene.videoUrl} controls muted className="w-full rounded-lg max-h-40 bg-black" />
                    <a href={scene.videoUrl} download className="inline-flex items-center gap-1 mt-1 text-[10px] text-amber-600 hover:text-amber-800">
                      <Download size={10} /> Download clip
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}


// ═══════════════════════════════════════════
// DUB STUDIO — Upload video → AI re-voices it
// ═══════════════════════════════════════════
function DubStudio({ balance }) {
  const [step, setStep] = useState(0); // 0=upload, 1=configure, 2=processing, 3=result
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [voice, setVoice] = useState('onyx-narrator');
  const [addVoiceover, setAddVoiceover] = useState(true);
  const [targetLang, setTargetLang] = useState('en');
  const [customScript, setCustomScript] = useState('');
  const [useRecorded, setUseRecorded] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState('');
  const [recordedFile, setRecordedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const LANGUAGES = [
    { code: 'en', label: 'English (keep original)' }, { code: 'es', label: 'Spanish' }, { code: 'fr', label: 'French' },
    { code: 'pt', label: 'Portuguese' }, { code: 'de', label: 'German' }, { code: 'ar', label: 'Arabic' },
    { code: 'hi', label: 'Hindi' }, { code: 'sw', label: 'Swahili' }, { code: 'yo', label: 'Yoruba' },
    { code: 'ig', label: 'Igbo' }, { code: 'ha', label: 'Hausa' }, { code: 'zu', label: 'Zulu' },
    { code: 'am', label: 'Amharic' }, { code: 'tw', label: 'Twi' }, { code: 'zh', label: 'Chinese' },
    { code: 'ja', label: 'Japanese' }, { code: 'ko', label: 'Korean' }, { code: 'it', label: 'Italian' },
    { code: 'ru', label: 'Russian' }, { code: 'tr', label: 'Turkish' },
  ];

  const handleUploadVideo = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120000
      });
      setUploadedUrl(data.url || data.videoUrl || data.secure_url);
      setVideoFile(file);
      setStep(1);
    } catch (err) {
      setError(err?.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadRecording = async (file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file); // reuse video upload endpoint for audio
      const { data } = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000
      });
      setRecordedUrl(data.url || data.videoUrl || data.secure_url);
      setRecordedFile(file);
    } catch {
      setError('Failed to upload voice recording');
    }
  };

  const handleProcess = async () => {
    setStep(2);
    setProcessing(true);
    setError('');
    try {
      const { data } = await api.post('/api/ai-content/dub/process', {
        videoUrl: uploadedUrl || videoUrl,
        voiceId: voice,
        targetLang,
        customScript: customScript.trim() || undefined,
        useRecordedVoice: useRecorded,
        recordedAudioUrl: recordedUrl || undefined
      }, { timeout: 300000 });
      setResult(data);
      setStep(3);
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.details || 'Dubbing failed');
      setStep(1);
    } finally {
      setProcessing(false);
    }
  };

  // ─── STEP 0: Upload ───
  if (step === 0) {
    return (
      <div className="space-y-5">
        <div className="text-center py-8">
          <Languages size={48} className="mx-auto text-emerald-500 mb-3" />
          <h3 className="text-lg font-bold text-gray-900">AI Dub Studio</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">Upload a video and AI will re-voice it in any accent, voice, or language. Perfect for translations, voiceovers, and content localization.</p>
        </div>

        {/* Upload area */}
        <div className="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center bg-emerald-50/30 hover:bg-emerald-50 transition-colors">
          <input type="file" accept="video/*" id="dub-video-upload" className="hidden"
            onChange={e => e.target.files?.[0] && handleUploadVideo(e.target.files[0])}
          />
          <label htmlFor="dub-video-upload" className="cursor-pointer">
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 size={32} className="animate-spin text-emerald-500" />
                <p className="text-sm text-emerald-600 font-medium">Uploading video...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload size={32} className="text-emerald-400" />
                <p className="text-sm font-semibold text-gray-700">Click to upload a video</p>
                <p className="text-xs text-gray-400">MP4, MOV, WebM — up to 100MB</p>
              </div>
            )}
          </label>
        </div>

        {/* Or paste URL */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400">or paste URL</span><div className="flex-1 h-px bg-gray-200" />
        </div>
        <div className="flex gap-2">
          <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
            placeholder="https://example.com/video.mp4"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <button onClick={() => { if (videoUrl.trim()) { setUploadedUrl(videoUrl.trim()); setStep(1); } }}
            disabled={!videoUrl.trim()} className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-emerald-700"
          >Use URL</button>
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
      </div>
    );
  }

  // ─── STEP 1: Configure ───
  if (step === 1) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <button onClick={() => { setStep(0); setUploadedUrl(''); setVideoFile(null); }}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          ><ArrowLeft size={16} /> Change video</button>
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1"><CheckCircle2 size={14} /> Video uploaded</span>
        </div>

        {/* Video preview */}
        <video src={uploadedUrl} controls className="w-full rounded-lg max-h-48 bg-black" />

        {/* Mode selector */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">How should AI get the narration?</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { mode: 'transcribe', icon: Volume2, label: 'From video audio', desc: 'AI transcribes existing audio and re-voices it' },
              { mode: 'script', icon: Edit3, label: 'Custom script', desc: 'Write your own narration text' },
              { mode: 'record', icon: Mic, label: 'Upload voice', desc: 'Upload a voice recording to use' },
            ].map(m => (
              <button key={m.mode} onClick={() => { setUseRecorded(m.mode === 'record'); setCustomScript(m.mode === 'script' ? customScript : ''); }}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  (m.mode === 'record' && useRecorded) || (m.mode === 'script' && customScript !== '' && !useRecorded) || (m.mode === 'transcribe' && !useRecorded && !customScript)
                    ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <m.icon size={20} className="text-emerald-500 mb-1" />
                <div className="text-sm font-semibold text-gray-800">{m.label}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom script input */}
        {!useRecorded && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Custom Script (leave blank to auto-transcribe video audio)</label>
            <textarea rows={3} value={customScript} onChange={e => setCustomScript(e.target.value)}
              placeholder="Type your narration script here... AI will speak this text over the video."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            />
          </div>
        )}

        {/* Voice recording upload */}
        {useRecorded && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Upload voice recording</label>
            <input type="file" accept="audio/*,video/*" onChange={e => e.target.files?.[0] && handleUploadRecording(e.target.files[0])}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
            />
            {recordedUrl && <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle2 size={12} /> Recording uploaded</p>}
          </div>
        )}

        {/* Language */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Target Language</label>
          <select value={targetLang} onChange={e => setTargetLang(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>

        {/* Voice selection */}
        <VoiceoverPanel voice={voice} setVoice={setVoice} addVoiceover={addVoiceover} setAddVoiceover={setAddVoiceover} />

        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

        <button onClick={handleProcess} disabled={processing || (useRecorded && !recordedUrl)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
        >
          <Languages size={18} /> Dub Video
        </button>
      </div>
    );
  }

  // ─── STEP 2: Processing ───
  if (step === 2) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-200 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="text-gray-700 font-semibold text-lg">Dubbing your video...</p>
        <p className="text-gray-400 text-sm text-center max-w-sm">Transcribing → {targetLang !== 'en' ? 'Translating → ' : ''}Generating voiceover → Replacing audio</p>
        <p className="text-xs text-gray-300">This may take 1-3 minutes</p>
      </div>
    );
  }

  // ─── STEP 3: Result ───
  if (step === 3 && result) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft size={16} /> Back
          </button>
          <button onClick={() => { setStep(0); setResult(null); setUploadedUrl(''); setVideoUrl(''); setCustomScript(''); }}
            className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800"
          ><Plus size={14} /> Dub Another</button>
        </div>

        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-green-500" /> Dubbed Video Ready!
        </h3>

        <video src={result.dubbedUrl} controls className="w-full rounded-lg max-h-96 bg-black" />

        {result.transcript && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="block text-xs font-medium text-gray-500 mb-1">Narration Text</label>
            <p className="text-sm text-gray-700">{result.transcript}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <a href={result.dubbedUrl} download className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:bg-emerald-700">
            <Download size={14} /> Download
          </a>
          <button className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300">
            <Share2 size={14} /> Post to CYBEV
          </button>
        </div>
      </div>
    );
  }

  return null;
}


// ═══════════════════════════════════════════
// CHARACTER GENERATOR — Your face in AI videos
// ═══════════════════════════════════════════
function CharacterGenerator({ balance }) {
  const [step, setStep] = useState(0); // 0=upload, 1=prompt, 2=generating, 3=result
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [duration, setDuration] = useState('short');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const pollRef = useRef(null);

  const CHAR_STYLES = ['Realistic', 'Cinematic', 'Anime', '3D Animation', 'Comic Book', 'Watercolor', 'Professional', 'Fantasy'];
  const CHAR_PROMPTS = [
    'Person speaking confidently to camera in a professional office',
    'Person walking through a vibrant city street, smiling',
    'Person presenting on a stage with an audience',
    'Person in a cozy living room, having a warm conversation',
    'Person standing in nature, wind blowing, inspirational mood',
    'Person dancing energetically at a party',
    'Person working at a desk, focused and productive',
    'Person waving hello to the camera with a friendly smile',
  ];

  const handleUploadImage = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    // Show local preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/api/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000
      });
      setImageUrl(data.url || data.imageUrl || data.secure_url);
      setImageFile(file);
      setStep(1);
    } catch (err) {
      setError(err?.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !imageUrl) return;
    setStep(2);
    setGenerating(true);
    setError('');
    try {
      const { data } = await api.post('/api/ai-content/character/generate', {
        imageUrl, prompt: prompt.trim(), style, duration
      });
      if (data.status === 'completed') {
        setResult(data);
        setStep(3);
      } else if (data.taskId) {
        const provider = data.provider || 'replicate';
        pollRef.current = setInterval(async () => {
          try {
            const { data: s } = await api.get(`/api/ai-content/video/status/${data.taskId}?provider=${provider}`);
            if (s.status === 'completed') {
              clearInterval(pollRef.current);
              setResult(s);
              setStep(3);
            } else if (s.status === 'failed') {
              clearInterval(pollRef.current);
              setError('Generation failed. Try a different prompt or image.');
              setStep(1);
            }
          } catch {}
        }, 4000);
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Generation failed');
      setStep(1);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => () => clearInterval(pollRef.current), []);

  const cost = duration === 'short' ? 100 : 200;

  // ─── STEP 0: Upload face ───
  if (step === 0) {
    return (
      <div className="space-y-5">
        <div className="text-center py-8">
          <UserCircle2 size={48} className="mx-auto text-rose-500 mb-3" />
          <h3 className="text-lg font-bold text-gray-900">AI Character Generator</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">Upload a photo of yourself (or anyone) and AI will create a video featuring that person. Great for personalized content, avatars, and creative storytelling.</p>
        </div>

        <div className="border-2 border-dashed border-rose-300 rounded-xl p-8 text-center bg-rose-50/30 hover:bg-rose-50 transition-colors">
          <input type="file" accept="image/*" id="char-image-upload" className="hidden"
            onChange={e => e.target.files?.[0] && handleUploadImage(e.target.files[0])}
          />
          <label htmlFor="char-image-upload" className="cursor-pointer">
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 size={32} className="animate-spin text-rose-500" />
                <p className="text-sm text-rose-600 font-medium">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Camera size={32} className="text-rose-400" />
                <p className="text-sm font-semibold text-gray-700">Upload a clear face photo</p>
                <p className="text-xs text-gray-400">Front-facing, well-lit — JPG, PNG, WebP</p>
              </div>
            )}
          </label>
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

        <div className="bg-rose-50 rounded-lg p-3">
          <p className="text-xs text-rose-600 font-medium mb-1">Tips for best results:</p>
          <p className="text-[10px] text-gray-500">Clear, front-facing photo with good lighting. One person only. Neutral or simple background. No sunglasses or heavy shadows on face.</p>
        </div>
      </div>
    );
  }

  // ─── STEP 1: Prompt + Style ───
  if (step === 1) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <button onClick={() => { setStep(0); setImageUrl(''); setImagePreview(''); }}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          ><ArrowLeft size={16} /> Change photo</button>
        </div>

        {/* Face preview */}
        {imagePreview && (
          <div className="flex justify-center">
            <img src={imagePreview} alt="Face" className="w-32 h-32 rounded-full object-cover border-4 border-rose-200 shadow-lg" />
          </div>
        )}

        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What should this person do in the video?</label>
          <textarea rows={3} maxLength={500} value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. Person speaking confidently to camera in a professional office..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none resize-none"
          />
        </div>

        {/* Quick prompts */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Quick ideas</label>
          <div className="flex flex-wrap gap-2">
            {CHAR_PROMPTS.map((p, i) => (
              <button key={i} onClick={() => setPrompt(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  prompt === p ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >{p.length > 40 ? p.substring(0, 40) + '...' : p}</button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Visual Style</label>
          <PillSelect options={CHAR_STYLES} value={style} onChange={setStyle} accent="orange" />
        </div>

        {/* Duration */}
        <div className="flex gap-3">
          {[{ val: 'short', label: '5 sec', cost: 100 }, { val: 'medium', label: '10 sec', cost: 200 }].map(d => (
            <button key={d.val} onClick={() => setDuration(d.val)}
              className={`flex-1 px-4 py-3 rounded-xl text-center border-2 transition-all ${
                duration === d.val ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`text-sm font-bold ${duration === d.val ? 'text-rose-700' : 'text-gray-700'}`}>{d.label}</div>
              <div className="text-[10px] text-amber-500">{d.cost} credits</div>
            </button>
          ))}
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

        <div className="flex items-center justify-between pt-2">
          <TokenCost cost={cost} />
          <button onClick={handleGenerate} disabled={!prompt.trim() || balance < cost}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-violet-600 text-white rounded-full font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
          >
            <Sparkles size={18} /> Generate Character Video
          </button>
        </div>
      </div>
    );
  }

  // ─── STEP 2: Generating ───
  if (step === 2) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-rose-200 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-rose-500 rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="text-gray-700 font-semibold text-lg">Creating your character video...</p>
        <p className="text-gray-400 text-sm">AI is animating the face with your prompt — 30-90 seconds</p>
      </div>
    );
  }

  // ─── STEP 3: Result ───
  if (step === 3 && result) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <button onClick={() => { setStep(1); setResult(null); }}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          ><ArrowLeft size={16} /> Edit prompt</button>
          <button onClick={() => { setStep(0); setResult(null); setImageUrl(''); setImagePreview(''); setPrompt(''); }}
            className="flex items-center gap-1 text-sm text-rose-600"
          ><Plus size={14} /> New Character</button>
        </div>

        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-green-500" /> Character Video Ready!
        </h3>

        <video src={result.videoUrl} controls className="w-full rounded-lg max-h-96 bg-black" />

        <div className="flex flex-wrap gap-3">
          <a href={result.videoUrl} download className="flex items-center gap-1.5 px-5 py-2.5 bg-rose-600 text-white rounded-full text-sm font-semibold hover:bg-rose-700">
            <Download size={14} /> Download
          </a>
          <button className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300">
            <Share2 size={14} /> Post to CYBEV
          </button>
        </div>
      </div>
    );
  }

  return null;
}


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
            <p className="text-gray-500 mt-1 text-sm">Describe your idea → AI writes the script → You edit → Generate</p>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2">
            <Coins size={18} className="text-amber-500" />
            <span className="font-bold text-amber-700">{loadingBalance ? '...' : balance.toLocaleString()}</span>
            <span className="text-amber-500 text-sm">credits</span>
          </div>
        </div>

        {/* Tool Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all whitespace-nowrap flex-shrink-0 ${
                activeTool === tool.id
                  ? 'border-purple-500 bg-purple-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0`}>
                <tool.icon size={18} className="text-white" />
              </div>
              <div className="text-left min-w-0">
                <p className={`text-xs font-semibold ${activeTool === tool.id ? 'text-purple-700' : 'text-gray-700'}`}>
                  {tool.label}
                </p>
                <p className="text-[10px] text-gray-400 hidden lg:block truncate">{tool.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* How it works — collapsed hint */}
        <div className="mb-6 p-3 bg-gradient-to-r from-purple-50 via-blue-50 to-orange-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold">1</span> Enter idea</div>
            <ChevronRight size={12} className="text-gray-300" />
            <div className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">2</span> AI writes script</div>
            <ChevronRight size={12} className="text-gray-300" />
            <div className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-[10px] font-bold">3</span> Edit & refine</div>
            <ChevronRight size={12} className="text-gray-300" />
            <div className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold">4</span> Generate!</div>
          </div>
        </div>

        {/* Active Tool Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {activeTool === 'video' && <VideoMaker balance={balance} />}
          {activeTool === 'movie' && <MovieMaker balance={balance} />}
          {activeTool === 'music' && <MusicComposer balance={balance} />}
          {activeTool === 'graphics' && <GraphicsGenerator balance={balance} />}
          {activeTool === 'dub' && <DubStudio balance={balance} />}
          {activeTool === 'character' && <CharacterGenerator balance={balance} />}
        </div>
      </div>
    </AppLayout>
  );
}
