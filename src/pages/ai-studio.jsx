// ============================================
// FILE: ai-studio.jsx
// PATH: /src/pages/ai-studio.jsx
// CYBEV AI Content Studio v2.0 — Script Writer Flow
// Step 1: Brief idea → Step 2: AI writes script →
// Step 3: Edit script → Step 4: Generate with Replicate
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
  Camera, Type, MessageSquare, Layers, PenTool
} from 'lucide-react';

// ─── Constants ───
const TOOLS = [
  { id: 'video', label: 'AI Video', icon: Film, color: 'from-purple-600 to-pink-600', accent: 'purple', desc: 'Generate videos from text prompts' },
  { id: 'music', label: 'AI Music', icon: Music, color: 'from-blue-600 to-cyan-600', accent: 'blue', desc: 'Compose songs with AI' },
  { id: 'graphics', label: 'AI Graphics', icon: Image, color: 'from-orange-500 to-red-500', accent: 'orange', desc: 'Create stunning visuals' },
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
  const [voice, setVoice] = useState('nova');
  const [addVoiceover, setAddVoiceover] = useState(true);
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
          <button onClick={() => setStep(0)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ChevronLeft size={16} /> Back to idea
          </button>
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
    try {
      // Extract narrations from script for each scene
      const narrations = script?.scenes?.map(s => s.narration || '') || [];
      const { data } = await api.post('/api/ai-content/video/merge', {
        videoUrls: scenes.map(s => s.videoUrl),
        title: result?.title || 'CYBEV-video',
        narrations,
        voice,
        addVoiceover
      }, { timeout: 300000 });
      if (data.mergedUrl) {
        setMergedUrl(data.mergedUrl);
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
    setSceneTasks([]); setSceneResults([]); setMergedUrl(null); setMergeError(''); setShowAllScenes(false);
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
          <button onClick={() => { setStep(2); setGenStatus(null); setResult(null); setMergedUrl(null); setMergeError(''); }}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={16} /> Back to Script Editor
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
              <Film size={16} /> Full Merged Video ({scenes.length * 5}s)
            </h4>
            <video src={mergedUrl} controls className="w-full rounded-lg max-h-96 bg-black" />
            <a href={mergedUrl} download={`${(result.title || 'cybev-video').replace(/\s+/g, '-')}.mp4`}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 mt-3 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 transition-colors"
            >
              <Download size={15} /> Download Full Video
            </a>
          </div>
        )}

        {/* ─── Merge / Action buttons ─── */}
        <div className="flex flex-wrap items-center gap-3">
          {canMerge && !mergedUrl && (
            <button onClick={() => handleMerge(scenes)} disabled={merging}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold hover:shadow-lg disabled:opacity-60 transition-all"
            >
              {merging ? <Loader2 size={16} className="animate-spin" /> : <Film size={16} />}
              {merging ? 'Merging...' : `Merge${addVoiceover ? ' + Voiceover' : ''} (${scenes.length * 5}s)`}
            </button>
          )}
          <button className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300">
            <Share2 size={14} /> Post to CYBEV
          </button>
        </div>

        {mergeError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {mergeError}
            <button onClick={() => handleMerge(scenes)} className="ml-2 underline hover:no-underline font-medium">Retry</button>
          </div>
        )}

        {merging && (
          <div className="p-4 bg-purple-50 rounded-xl text-center">
            <Loader2 size={24} className="animate-spin text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-purple-700 font-medium">
              {addVoiceover ? `Generating ${voice} voiceover + merging ${scenes.length} clips...` : `Merging ${scenes.length} clips into one video...`}
            </p>
            <p className="text-xs text-purple-400 mt-1">
              {addVoiceover ? 'Generating narration audio, then combining with video — may take 1-2 minutes' : 'This may take 30-60 seconds'}
            </p>
          </div>
        )}

        {/* ─── Scene previews — ALWAYS VISIBLE ─── */}
        {isMulti ? (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Scene Clips ({scenes.length} × 5s each)</h4>
            {scenes.map((scene, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">{scene.sceneNumber}</div>
                    Scene {scene.sceneNumber}
                  </span>
                  <a href={scene.videoUrl} download={`${(result.title || 'scene').replace(/\s+/g, '-')}-scene-${scene.sceneNumber}.mp4`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200"
                  >
                    <Download size={12} /> Download
                  </a>
                </div>
                <video src={scene.videoUrl} controls className="w-full rounded-lg max-h-56 bg-black" />
              </div>
            ))}
          </div>
        ) : (
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
        <div className="flex gap-3 mb-6">
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
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0`}>
                <tool.icon size={20} className="text-white" />
              </div>
              <div className="text-left min-w-0">
                <p className={`text-sm font-semibold ${activeTool === tool.id ? 'text-purple-700' : 'text-gray-700'}`}>
                  {tool.label}
                </p>
                <p className="text-xs text-gray-400 hidden md:block truncate">{tool.desc}</p>
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
          {activeTool === 'music' && <MusicComposer balance={balance} />}
          {activeTool === 'graphics' && <GraphicsGenerator balance={balance} />}
        </div>
      </div>
    </AppLayout>
  );
}
