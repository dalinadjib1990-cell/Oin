import React, { useState, useRef, useEffect } from "react";
import {
  Bug,
  Volume2,
  Play,
  Square,
  ShieldAlert,
  Info,
  Sparkles,
  BookOpen,
  Camera,
  CheckCircle2,
  Activity,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Clock,
  ExternalLink,
  Smartphone
} from "lucide-react";

// Structure for the returned Gemini AI insect identification
interface AnalysisReport {
  name: string;
  englishName: string;
  scientificName: string;
  ultrasonicSusceptibility: string;
  isRepelledBySound: boolean;
  dangerLevel: string;
  remedies: string[];
  funFact: string;
}

// Preset animal hearing frequency ranges for the interactive chart comparison
const ANIMAL_HEARING_RANGES = [
  { name: "الإنسان (البالغ)", range: "20 Hz - 16,000 Hz", icon: "👤", max: 16000, desc: "تضعف القدرة على سماع الترددات التي تفوق 15,000 هرتز تدريجياً مع تقدم العمر." },
  { name: "الإنسان (الأطفال)", range: "20 Hz - 20,000 Hz", icon: "👶", max: 20000, desc: "الأطفال واليافعون يمتلكون حساسية فائقة للترددات العالية جداً." },
  { name: "الذباب المنزلي", range: "100 Hz - 1,000 Hz", icon: "🪰", max: 1000, desc: "الذباب لا يمتلك آذاناً وإنما يستشعر اهتزازات الأجنحة المنخفضة. الترددات الفوق صوتية غير مرئية له تماماً!" },
  { name: "البعوض (الناموس)", range: "150 Hz - 500 Hz", icon: "🦟", max: 500, desc: "يستشعر ضربات أجنحة البعوض الأخرى في نطاق منخفض جداً لجذب التزاوج. لا يتأثر بأمواج السونار العالية." },
  { name: "الكلاب والقطط", range: "60 Hz - 45,000 Hz", icon: "🐕", max: 45000, desc: "تمتلك الحيوانات الأليفة نطاقاً واسعاً جداً من السمع الفوق صوتي، وقد يزعجها تشغيل الترددات الصوتية المستمرة." },
  { name: "الخفافيش", range: "1,000 Hz - 120,000 Hz", icon: "🦇", max: 120000, desc: "تعتمد كلياً على ارتداد كرات الصوت عالية النطاق (الصدى) للملاحة والصيد في الغسق." }
];

// Preset real scientifically-proven traps
const SCIENTIFIC_DIY_GUIDES = [
  {
    id: "diy-cider-trap",
    title: "مصيدة خل التفاح والليمون (للذباب والناموس الصغير)",
    description: "مصيدة كيميائية طبيعية تعتمد على خداع الشم لجذب ذباب الفاكهة والحشرات الطائرة وحبسها كيميائياً.",
    supplies: [
      "كوب زجاجي أو مرطبان صغير",
      "خل تفاح طبيعي (3 ملاعق كجدار جذب عطري)",
      "قطرات من سائل غسيل الأطباق (يكسر التوتر السطحي للماء)",
      "ورقة ملفوفة على شكل قمع أو غطاء بلاستيكي مثقوب"
    ],
    steps: [
      "اسكب خل التفاح في القاع لتنتشر الرائحة الحامضية الكثيفة.",
      "أضف 3-4 قطرات من صابون الأطباق السائل دون تحريك الرغوة (هذا يمنع الحشرة من الوقوف على السطح ويغرقها فوراً).",
      "ضع القمع الورقي فوق فوهة الوعاء بحيث تكون النهاية الضيقة متجهة للأسفل دون ملامسة السائل.",
      "تنجذب الذبابة للرائحة فتدخل عبر القمع ولا تستطيع الخروج مجدداً بسبب ارتباك المسار البصري وظلمة الجوانب."
    ],
    timeEstimate: "تحتاج إلى 24 ساعة لتبدأ النتائج الملموسة"
  },
  {
    id: "diy-yeast-co2-trap",
    title: "مصيدة ثاني أكسيد الكربون (CO2) للبعوض والذباب الأسود",
    description: "مصيدة حيوية تحاكي تنفس الكائنات الحية. ينجذب البعوض والذباب من مسافات بعيدة مستشعراً غاز ثاني أكسيد الكربون المنبعث من التنفس.",
    supplies: [
      "زجاجة بلاستيكية فارغة (سعة 2 لتر)",
      "كوب ماء دافئ (غير مغلي لتجنب إتلاف الخميرة)",
      "ربع كوب من السكر البني أو العادي",
      "1 جرام من خميرة الخبز النشطة",
      "شريط لاصق أسود أو غطاء قماش معتم"
    ],
    steps: [
      "اقطع الجزء العلوي من الزجاجة البلاستيكية (حوالي ثلث الزجاجة من الأعلى).",
      "اسكب الماء الدافئ في النصف السفلي من الزجاجة ثم أذب السكر جيداً ليصبح غذاءاً للخميرة.",
      "عندما يبرد السائل قليلاً، رش مسحوق الخميرة فوق السطح (سيبدأ التفاعل بإنتاج فقاعات الغاز CO2 تدريجياً).",
      "اقلب الجزء العلوي المقطوع من الزجاجة وضعه كقمع داخل الجزء السفلي ثم ألصقه بشريط لاصق لمنع تنفيس الهواء من الأطراف.",
      "قُم بلف الزجاجة بشريط داكن أو قطعة قماش معتمة؛ لأن البعوض ينجذب للألوان المعتمة والزوايا المظلمة."
    ],
    timeEstimate: "ينشر غاز الجذب الفعال لمدة تتراوح بين 5 إلى 7 أيام"
  },
  {
    id: "diy-essential-scents",
    title: "محلول الزيوت العطرية المركبة المقاوم للحشرات",
    description: "بديل طبيعي للرش الحشري الكيميائي. تستخدم النباتات خطوط دفاع عطرية تسبب تشويشاً كبيراً في مستقبلات الاستشعار لدى الحشرات الطائرة وتجعلها تهرب من المكان.",
    supplies: [
      "زجاجة بخاخ فارغة نظيفة",
      "زيت النعناع البري أو زيت الأوريغانو (الأكثر فاعلية للذباب)",
      "زيت الكافور (اليوجينول) أو اللافندر المحبب للاسترخاء",
      "نصف كوب ماء مقطر ومقدار ملعقة من كحول طبي طبيعي للمساعدة على التجانس والتطاير العطري"
    ],
    steps: [
      "أضف 15-20 قطرة من زيت النعناع مع 10 قطرات من زيت اللافندر أو الكافور في البخاخ.",
      "امزج الزيوت مع الكحول النقي لضمان سهولة اختلاط الزيت الدهني بالسوائل.",
      "أضف نصف كوب من الماء الدافئ المقطر ورج العبوة جيداً قبل كل استخدام.",
      "قم برش الستائر، النوافذ، وعتبات الأبواب الخارجية. ستشعر برائحة مذهلة ويفر الذباب والبعوض هرباً من المكان فوراً!"
    ],
    timeEstimate: "تأثير فوري يمتد من 3 إلى 5 ساعات للترطيب العطري الفردي"
  }
];

const PRESET_BUGS_SAMPLES = [
  { name: "الذباب المنزلي", english: "Housefly", img: "https://images.unsplash.com/photo-1558230672-0e9e42becc48?w=300&fit=crop&q=80" },
  { name: "البعوض (الناموس)", english: "Mosquito", img: "https://images.unsplash.com/photo-1596701062351-8c29144a83ec?w=300&fit=crop&q=80" },
  { name: "ذباب الفاكهة", english: "Fruit Fly", img: "https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=300&fit=crop&q=80" }
];

export default function App() {
  // Navigation / Tabs state
  const [activeTab, setActiveTab] = useState<"ai" | "synth" | "guide">("ai");

  // Audio Tone Generator state
  const [frequency, setFrequency] = useState<number>(15000); // Default to 15 kHz
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.1); // Safe defaults
  const [actualHeard, setActualHeard] = useState<boolean | null>(null);

  // Audio node Web Audio refs (stored to survive re-renders)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // AI Insect Identifier upload states
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisReport | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Interactive Timer state for DIY Guides
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [activeTimerName, setActiveTimerName] = useState<string>("");
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // UI installation details helper
  const [showInstallTip, setShowInstallTip] = useState<boolean>(false);

  // Clean elements audio refs on destroyed
  useEffect(() => {
    return () => {
      stopTone();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Web Audio Synth controllers
  const startTone = () => {
    try {
      // 1. Initial Web Audio context if not active
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Resume context if browser suspended it (frequent security rule)
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      // 2. Clear existing oscillation if any
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Set oscillator configuration
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Safe limited volume gain
      gain.gain.setValueAtTime(volume, ctx.currentTime);

      // Link up nodes
      osc.connect(gain);
      gain.connect(ctx.destination);

      // Play tone
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setIsPlaying(true);
    } catch (err: any) {
      console.error("Failed to start audio synthesizer:", err);
      alert("تعذر تشغيل المولد الصوتي في متصفحك. يرجى التفاعل مع الصفحة أولاً لتفعيل تشغيل الصوتيات.");
    }
  };

  const stopTone = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      setIsPlaying(false);
    } catch (e) {
      console.error("Error stopping tone:", e);
    }
  };

  // Dynamically update synthesizer frequency while playing
  useEffect(() => {
    if (isPlaying && oscillatorRef.current && audioCtxRef.current) {
      oscillatorRef.current.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
    }
  }, [frequency, isPlaying]);

  // Dynamically update synthesizer volume gain
  useEffect(() => {
    if (isPlaying && gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume, isPlaying]);

  // Handle local image file upload & base64 encoding
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setAnalysisResult(null);
        setAiError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit base64 Image to full stack backend (/api/identify)
  const handlePestAnalysis = async () => {
    if (!capturedImage) {
      setAiError("الرجاء تحديد صورة أولاً للبدء بالفحص.");
      return;
    }

    setIsAnalyzing(true);
    setAiError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/identify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64: capturedImage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || "فشل الاتصال بالخادم.");
      }

      const data: AnalysisReport = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error("Error analyzing image:", err);
      setAiError(err.message || "حدث عطل غير متوقع أثناء مقارنة وتحليل الصورة مع قاعدة البيانات العلمية.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Select reference preset sample for quick testing without taking photos
  const handleLoadSample = (sampleUrl: string, sampleName: string) => {
    setIsAnalyzing(true);
    setAiError(null);
    setAnalysisResult(null);
    setCapturedImage(sampleUrl);

    // Simulate drawing from base64 encoding or fetch the image to convert
    fetch(sampleUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCapturedImage(reader.result as string);
          setIsAnalyzing(false);
        };
        reader.readAsDataURL(blob);
      })
      .catch((err) => {
        setIsAnalyzing(false);
        setCapturedImage(sampleUrl); // Fallback string representation
      });
  };

  // Interactive Countdown Timer helper for brewing DIY solutions
  const startDiyTimer = (title: string, durationMinutes: number) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setActiveTimerName(title);
    setTimerSeconds(durationMinutes * 60);
    setTimerActive(true);

    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          setTimerActive(false);
          alert(`⏱️ انتهى وقت التجهيز لـ (${title})! يمكنك الآن استخدام المصيدة البيولوجية.`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopDiyTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimerActive(false);
  };

  const formatTimerString = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="max-w-md mx-auto bg-slate-950 text-slate-100 min-h-screen shadow-2xl flex flex-col relative border-x border-slate-900">
      
      {/* App Header Bar */}
      <header id="app-header" className="border-b border-slate-905 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Bug className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight text-white flex items-center gap-1">
              VeriPest <span className="text-[10px] bg-slate-800 text-teal-400 px-1.5 py-0.5 rounded-full font-mono">علمي مجرب</span>
            </h1>
            <p className="text-[10px] text-slate-400">مكافحة الحشرات القائمة على الحقائق والدراسات</p>
          </div>
        </div>

        {/* PWA Instal Icon */}
        <button
          id="btn-pwa-install"
          title="تثبيت التطبيق على جهازك"
          onClick={() => setShowInstallTip(!showInstallTip)}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-teal-400 font-mono px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all shrink-0 cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>تثبيت</span>
        </button>
      </header>

      {/* PWA Install Help Modal Banner */}
      {showInstallTip && (
        <div className="bg-slate-900 border-b border-slate-800 p-4 shrink-0 transition-opacity animate-in fade-in duration-300">
          <div className="bg-teal-950/40 border border-teal-800/60 rounded-xl p-3 text-right">
            <h3 className="text-xs font-bold text-teal-300 flex items-center gap-1.5 mb-1.5">
              <Smartphone className="w-3.5 h-3.5 text-teal-400" />
              كيفية تثبيت التطبيق على هاتفك؟
            </h3>
            <ul className="text-[11px] space-y-1 text-slate-300 list-disc pr-4 font-sans leading-relaxed">
              <li><strong>على هواتف أندرويد (Chrome):</strong> انقر على زر الخيارات ثلاثي النقاط <span className="font-mono">⋮</span> ثم اختر <strong>&quot;إضافة إلى الشاشة الرئيسية&quot;</strong>.</li>
              <li><strong>على هواتف آيفون (Safari):</strong> اضغط على أيقونة المشاركة <span className="text-md font-bold">⎋</span> ثم اختر <strong>&quot;إضافة إلى الشاشة الرئيسية&quot;</strong>.</li>
              <li><strong>على الكمبيوتر الشخصي:</strong> ستجد علامة التثبيت مباشرة في شريط العناوين بالأعلى للبدء فورا.</li>
            </ul>
            <button
              onClick={() => setShowInstallTip(false)}
              className="mt-3.5 w-full text-center text-[10px] bg-teal-900 hover:bg-teal-800 text-teal-200 py-1 rounded"
            >
              فهمت ذلك
            </button>
          </div>
        </div>
      )}

      {/* Core Body Container */}
      <main className="flex-1 p-4 space-y-5 overflow-y-auto">

        {/* Dynamic Timer HUD if running */}
        {timerActive && (
          <div className="bg-gradient-to-l from-emerald-950 to-slate-900 border border-emerald-800 rounded-2xl p-3.5 animate-bounce flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Clock className="w-4 h-4 animate-spin" />
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate-400 font-sans">مؤقت تحضير المصيدة الذاتي:</p>
                <p className="text-xs font-bold text-white max-w-[180px] truncate">{activeTimerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-emerald-400">{formatTimerString(timerSeconds)}</span>
              <button
                onClick={stopDiyTimer}
                title="إلغاء المؤقت"
                className="p-1 rounded-full bg-slate-800 text-rose-400 hover:bg-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Global Scientific Honest Verdict Banner */}
        <section id="scientific-disclaimer-card" className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-right">
              <h2 className="text-xs font-bold text-orange-300 flex items-center gap-1.5 font-sans">
                الحقيقة العلمية الحاسمة للجمهور العربي
              </h2>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                أحييك لقلقك بشان الحقيقة! علمياً وبيولوجياً، <strong className="text-white">طرد الحشرات باستخدام الترددات الصوتية الفوق-صوتية (غير المسموعة) هو مجرد وسيلة دعائية وهمية (Pseudoscience) غير ناجحة.</strong>
              </p>
            </div>
          </div>
          <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-3 mt-3.5 space-y-1.5 text-right">
            <p className="text-[10px] text-slate-400 flex items-center gap-1.5 leading-normal">
              <Info className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>
                <strong>لماذا لا تعمل؟</strong> إن الذباب والبعوض لا يمتلك طبلات أذن أو خلايا حسية تتأثر سلبياً بالترددات العالية لتجعلها تفر. لهذا حظرت هيئة التجارة الفيدرالية الأمريكية (FTC) المبيعات الدعائية لهذه الأجهزة الزائفة قانونياً.
              </span>
            </p>
            <p className="text-[10px] text-emerald-400 font-sans font-medium">
              ✓ بدلاً من الغش والمصائد الإعلانية المزيفة، قمنا بتوفير أداة ذكاء اصطناعي حقيقية لتحديد الحشرات بالدليل العلمي والمصائد الحيوية الفعلية بالأسفل!
            </p>
          </div>
        </section>

        {/* Tab Selection Buttons */}
        <nav className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl">
          <button
            id="tab-ai-identifier"
            onClick={() => setActiveTab("ai")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === "ai"
                ? "bg-slate-800 text-teal-300 shadow shadow-slate-950/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>محلل الذكاء الاصطناعي</span>
          </button>

          <button
            id="tab-remedy-guide"
            onClick={() => setActiveTab("guide")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === "guide"
                ? "bg-slate-800 text-teal-300 shadow shadow-slate-950/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>وصفات مكافحة حقيقية</span>
          </button>

          <button
            id="tab-frequency-generator"
            onClick={() => setActiveTab("synth")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === "synth"
                ? "bg-slate-800 text-teal-300 shadow shadow-slate-950/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>مختبر الترددات والسمع</span>
          </button>
        </nav>

        {/* View Segment 1: AI Insect Identifier */}
        {activeTab === "ai" && (
          <section className="space-y-4">
            <div className="bg-slate-900 rounded-2xl p-4 space-y-4 border border-slate-800">
              <div className="text-right space-y-1">
                <h3 className="text-xs font-bold text-white flex items-center gap-1">
                  <Camera className="w-4 h-4 text-teal-400" />
                  التعرف الذكي على الحشرات بالذكاء الاصطناعي
                </h3>
                <p className="text-[11px] text-slate-400">
                  التقط بهاتفك أو ارفع صورة لأي ذبابة أو حشرة هنا لنقوم بمسح شكلها بالذكاء الاصطناعي، واستخراج طريقة التخلص الحقيقية منها.
                </p>
              </div>

              {/* Photo Upload/Camera Interface Wrapper */}
              <div className="bg-slate-950 rounded-xl border border-dashed border-slate-800 p-4 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[160px]">
                {capturedImage ? (
                  <div className="w-full space-y-3 relative z-10">
                    <img
                      src={capturedImage}
                      alt="Captured Insect"
                      className="max-h-40 mx-auto rounded-lg object-contain border border-slate-800 bg-slate-900"
                    />
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          setCapturedImage(null);
                          setAnalysisResult(null);
                        }}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg active:scale-95 transition-all text-right cursor-pointer"
                      >
                        إلغاء الصورة
                      </button>
                      <button
                        id="btn-analyze-pest"
                        onClick={handlePestAnalysis}
                        disabled={isAnalyzing}
                        className="text-[10px] bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                      >
                        {isAnalyzing ? "جاري الفحص بالذكاء الاصطناعي..." : "ابدأ تحليل الحشرة وتحديد العلاج"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer w-full flex flex-col items-center justify-center py-6 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-teal-400 border border-slate-800 shadow">
                      <Camera className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-200 text-center">اضغط هنا لالتقاط صورة أو رفع ملف</p>
                      <p className="text-[10px] text-slate-500 mt-1 text-center font-mono">يدعم صيغ JPG, PNG لصور الذباب والبعوض والقراد</p>
                    </div>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              {/* Sample Quick Try Buttons */}
              {!capturedImage && (
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 text-right">أمثلة سريعة للتجربة الفورية:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_BUGS_SAMPLES.map((sample, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleLoadSample(sample.img, sample.name)}
                        className="bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl p-2 text-right transition-all group flex flex-col items-center gap-1 text-center cursor-pointer"
                      >
                        <img src={sample.img} alt={sample.name} className="w-8 h-8 rounded-full border border-slate-800 object-cover" />
                        <span className="text-[10px] font-bold text-slate-200 group-hover:text-teal-400 block truncate w-full">{sample.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading State Spinner */}
              {isAnalyzing && (
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-3 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-teal-300">جاري مسح الحشرة علمياً بموديل Gemini الذكي...</p>
                    <p className="text-[10px] text-slate-500 font-sans leading-normal">
                      نتحقق من التشابك البصري، هل تستجيب الحشرة للترددات؟ وما هو الفخ البيولوجي الأنسب لها.
                    </p>
                  </div>
                </div>
              )}

              {/* AI Analysis Error Log */}
              {aiError && (
                <div className="bg-rose-950/40 border border-rose-900 rounded-xl p-3 text-right text-xs space-y-1">
                  <p className="text-rose-400 font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    عذراً، فشل التحليل العلمي:
                  </p>
                  <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{aiError}</p>
                </div>
              )}

              {/* Analysis Result Card Output */}
              {analysisResult && (
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-4 animate-in fade-in duration-300">
                  
                  {/* Insect Identity Badge */}
                  <div className="flex items-start justify-between border-b border-slate-900 pb-3">
                    <div className="text-right">
                      <span className="text-[9px] font-mono tracking-widest text-[#94a3b8] block uppercase">تصنيف الحشرات</span>
                      <h4 className="text-sm font-black text-white">{analysisResult.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono italic">
                        {analysisResult.englishName} ({analysisResult.scientificName})
                      </p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-right">
                      <span className="text-[9px] text-slate-500 block">درجة الإزعاج/العدوى</span>
                      <strong className="text-[10px] text-[#e11d48]">{analysisResult.dangerLevel}</strong>
                    </div>
                  </div>

                  {/* Ultrasonic Verdict Segment (Honest Fact-Checking) */}
                  <div className="bg-rose-950/10 border border-rose-900/40 rounded-xl p-3 text-right space-y-1">
                    <div className="flex items-center gap-1.5 text-rose-400">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span className="text-[10px] font-bold font-sans">
                        علاقة {analysisResult.name} بالترددات الصوتية:
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      {analysisResult.ultrasonicSusceptibility}
                    </p>
                    <div className="mt-2 flex items-center gap-1 bg-slate-900 rounded-lg py-1 px-2.5 w-fit">
                      <span className="text-[9px] text-slate-400">طرد بالترددات غير مسموعة:</span>
                      <strong className="text-[9px] text-[#fb7185] bg-rose-500/10 px-1 py-0.5 rounded">غير ممكن فعلياً ✗</strong>
                    </div>
                  </div>

                  {/* Best Real Biological Remedies Suggested */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-teal-400 flex items-center gap-1 text-right">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      طرق الإبادة والمكافحة الحيوية والفيزيائية المجربة علمياً:
                    </h5>
                    <ul className="text-[11px] text-slate-300 space-y-1.5 list-none pr-0">
                      {analysisResult.remedies.map((remedy, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-right p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="w-4 h-4 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center font-mono text-[9px] shrink-0 font-bold mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{remedy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Fun Behavior Scientific Fact */}
                  <div className="bg-teal-950/20 border border-teal-900/30 rounded-xl p-3 text-right">
                    <p className="text-[10px] text-teal-300 leading-relaxed font-sans">
                      💡 <strong>هل تعلم؟ (معلومة علمية):</strong> {analysisResult.funFact}
                    </p>
                  </div>

                </div>
              )}

            </div>
          </section>
        )}

        {/* View Segment 2: Frequency Tone Generator (Educational Study Tool) */}
        {activeTab === "synth" && (
          <section className="space-y-4">
            <div className="bg-slate-900 rounded-2xl p-4 space-y-4 border border-slate-800">
              
              <div className="text-right space-y-1">
                <h3 className="text-xs font-bold text-white flex items-center gap-1">
                  <Activity className="w-4 h-4 text-teal-400 animate-pulse" />
                  مولد ذبذبات السمع البشري والحيواني
                </h3>
                <p className="text-[11px] text-slate-400">
                  قم بإنشاء أمواج جيبية نقية (Sine Waves) لاستكشاف نطاقات السمع المختلفة ونختبر نظريات طرد الحشرات.
                </p>
              </div>

              {/* Synthesizer Control HUD */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-4">
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">الحالة الصوتية</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${isPlaying ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-900 text-slate-500"}`}>
                    {isPlaying ? "جاري تشغيل الإشارة ●" : "متوقف ▀"}
                  </span>
                </div>

                {/* Frequency Indicator */}
                <div className="py-2 text-center bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-500 block uppercase font-mono">التردد الصوتي الحالي</span>
                  <span className="text-2xl font-black text-white font-mono">{frequency.toLocaleString()}</span>
                  <span className="text-xs font-bold text-teal-400 font-sans mr-1">هرتز (Hz)</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {frequency > 20000 ? "نطاق ما فوق صوتي (Ultrasonic)" : frequency > 15000 ? "تردد عالٍ جداً (يكاد لا يسمعه غير الأطفال)" : "تردد مسموع بوضوح للإنسان"}
                  </span>
                </div>

                {/* Slider UI */}
                <div className="space-y-1 text-right">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-mono">22,000 Hz</span>
                    <label className="text-xs font-bold text-slate-300">التحكم في التردد</label>
                    <span className="text-[10px] text-slate-500 font-mono">100 Hz</span>
                  </div>
                  <input
                    id="frequency-slider"
                    type="range"
                    min="100"
                    max="22000"
                    step="50"
                    value={frequency}
                    onChange={(e) => setFrequency(Number(e.target.value))}
                    className="w-full accent-teal-400 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => setFrequency(1000)}
                      className="text-[9px] bg-slate-900 hover:bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono cursor-pointer"
                    >
                      1 kHz (طبيعي)
                    </button>
                    <button
                      onClick={() => setFrequency(14000)}
                      className="text-[9px] bg-slate-900 hover:bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono cursor-pointer"
                    >
                      14 kHz (متوسط)
                    </button>
                    <button
                      onClick={() => setFrequency(18000)}
                      className="text-[9px] bg-slate-900 hover:bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono cursor-pointer"
                    >
                      18 kHz (فما فوق)
                    </button>
                    <button
                      onClick={() => setFrequency(21000)}
                      className="text-[9px] bg-slate-900 hover:bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono cursor-pointer"
                    >
                      21 kHz (سونار)
                    </button>
                  </div>
                </div>

                {/* Volume UI */}
                <div className="space-y-1 text-right">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-slate-500">20% (مستوى آمن)</span>
                    <label className="text-xs font-bold text-slate-300">مستوى شدة الصوت (Volume)</label>
                    <span className="text-[10px] font-mono text-slate-500">0%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.2"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full accent-teal-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[9px] text-rose-400 text-right mt-0.5 leading-normal">
                    ⚠️ تائه: لا تقم برفع التوتر بشدة بالقرب من ميكروفون الأذن أو الحيوانات الأليفة لتفادي التوتر غير الطبيعي.
                  </p>
                </div>

                {/* Push Buttons */}
                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    id="btn-tone-stop"
                    onClick={stopTone}
                    disabled={!isPlaying}
                    className="w-full py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-rose-400 font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>إيقاف التردد</span>
                  </button>

                  <button
                    id="btn-tone-play"
                    onClick={startTone}
                    disabled={isPlaying}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>تشغيل التردد</span>
                  </button>
                </div>

              </div>

              {/* Subjective Audiogram Prompt */}
              {isPlaying && (
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 text-right space-y-2.5">
                  <p className="text-xs font-bold text-white leading-normal">هل تستطيع سماع التردد الصوتي الحالي في أذنك بوضوح؟</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActualHeard(true)}
                      className={`text-[10px] flex-1 py-1 px-3 rounded-md text-center border cursor-pointer transition-all ${actualHeard === true ? "bg-emerald-950 text-emerald-400 border-emerald-800" : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850"}`}
                    >
                      نعم، أسمع طنين بوضوح
                    </button>
                    <button
                      onClick={() => setActualHeard(false)}
                      className={`text-[10px] flex-1 py-1 px-3 rounded-md text-center border cursor-pointer transition-all ${actualHeard === false ? "bg-rose-950 text-rose-400 border-rose-800" : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850"}`}
                    >
                      لا، صمت تام تماماً
                    </button>
                  </div>
                  {actualHeard !== null && (
                    <p className="text-[10px] text-slate-400 leading-normal font-sans">
                      {actualHeard
                        ? "✓ هذا طبيعي للأذن الشابة. أغلب البالغين يبدأون بفقدان سماع الترددات التي تفوق 15,000 هرتز. لكن لاحظ أن الحشرات المحيطة بك لا تهرب ولا تبالي لأنها لا تعتبرها تهديداً عدوانياً!"
                        : "✓ التفسير العلمي: إما أن هذا التردد يفوق القدرة البيولوجية لأذنك وهذا طبيعي جداً للبالغين، أو أن سماعة الهاتف لا تستطيع إخراج هذا التردد من الأساس لقصور فيزيائي."}
                    </p>
                  )}
                </div>
              )}

              {/* Informative Audiogram Chart Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 text-right flex items-center gap-1 justify-end">
                  مقارنة نطاقات السمع والاستجابة للحشرات
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                </h4>
                <div className="space-y-2">
                  {ANIMAL_HEARING_RANGES.map((animal, index) => (
                    <div key={index} className="bg-slate-950 rounded-xl border border-slate-850 p-2.5 text-right font-sans">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-teal-400 font-semibold">{animal.range}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{animal.name}</span>
                          <span>{animal.icon}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal">{animal.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>
        )}

        {/* View Segment 3: Real DIY Scientific Controls Recipes */}
        {activeTab === "guide" && (
          <section className="space-y-4">
            <div className="bg-slate-900 rounded-2xl p-4 space-y-4 border border-slate-800">
              
              <div className="text-right space-y-1">
                <h3 className="text-xs font-bold text-white flex items-center gap-1 text-right">
                  <BookOpen className="w-4 h-4 text-teal-400" />
                  دليل التركيبات والمصائد العلمية المنزلية
                </h3>
                <p className="text-[11px] text-slate-400">
                  حلول حقيقية وتجريبية بسيطة تصنعها بنفسك في المنزل للتخلص الكيميائي والعضوي من الحشرات المزعجة بدلاً من الأوهام.
                </p>
              </div>

              {/* Map list of Scientific Guide cards */}
              <div className="space-y-4">
                {SCIENTIFIC_DIY_GUIDES.map((guide, idx) => (
                  <div key={idx} className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3.5 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-2 h-full bg-teal-500 pointer-events-none" />
                    
                    <div className="text-right">
                      <h4 className="text-xs font-bold text-teal-400 font-sans leading-normal">{guide.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal">{guide.description}</p>
                    </div>

                    {/* Supplies checklist */}
                    <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-900 text-right">
                      <p className="text-[10px] font-bold text-slate-200 mb-1">المكونات والمستلزمات المطلوبة:</p>
                      <ul className="text-[9px] text-slate-400 space-y-1 pr-1.5 list-disc">
                        {guide.supplies.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Step by step */}
                    <div className="text-right space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-200">خطوات التحضير الفعلي:</p>
                      <ol className="text-[9px] text-slate-300 space-y-1.5 list-decimal pr-4">
                        {guide.steps.map((step, sIdx) => (
                          <li key={sIdx} className="leading-relaxed">{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Controls Footer */}
                    <div className="border-t border-slate-900 pt-3 flex items-center justify-between">
                      <span className="text-[9.5px] text-slate-500 font-sans">{guide.timeEstimate}</span>
                      <button
                        onClick={() => startDiyTimer(guide.title, 5)} // Setup draft 5-minute assistant timer
                        className="text-[9px] bg-teal-900/40 hover:bg-teal-950 border border-teal-850 text-teal-300 font-bold px-3 py-1 rounded-md cursor-pointer transition-all active:scale-95"
                      >
                        ⏱️ ابدأ مؤقت التجهيز (5 د)
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          </section>
        )}

      </main>

      {/* Persistent Fact Footer Bar */}
      <footer className="border-t border-slate-900 bg-slate-900/40 p-3 text-center text-[10px] text-slate-500 font-sans leading-relaxed shrink-0">
        <p>&copy; {new Date().getFullYear()} VeriPest Science Hub — مشروع علمي لحماية البيئة</p>
        <p className="text-[9px] text-slate-600 mt-0.5">
          جميع البيانات والمقالات مستوحاة من الأبحاث المنشورة بواسطة منظمة الصحة العالمية وهيئة التجارة الفيدرالية.
        </p>
      </footer>

    </div>
  );
}
