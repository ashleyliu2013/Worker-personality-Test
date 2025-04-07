// 更新後的打工人測驗頁面（含 loading/nameInput/分析 loading 背景與動畫 + Q1 頁面）
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const pages = [
  'loading', 'nameInput', 'q1', 'q2', 'q3', 'q4', 'q5', 'analysisLoading', 'result'
];
const personalityTitleColors: {
    [key: string]: { subtitle: string; title: string };
  } = {
    silentMage: { subtitle: 'rgba(255,255,255,0.7)', title: '#FFFFFF' },
    burstFighter: { subtitle: 'rgba(255,255,255,0.7)', title: '#FFFFFF' },
    sootheBeast: { subtitle: 'rgba(93,134,42,0.7)', title: '#143802' },
    grumpyGremlin: { subtitle: 'rgba(255,255,255,0.7)', title: '#000000' },
    sunshineWalker: { subtitle: 'rgba(241,85,2,0.7)', title: '#F15502' },
    shadowTactician: { subtitle: 'rgba(140,186,96,0.7)', title: '#8CBA60' },
    resolverCat: { subtitle: 'rgba(255,255,255,0.7)', title: '#FFFFFF' },
    shieldBearer: { subtitle: 'rgba(254,227,148,0.7)', title: '#FEE394' },
  };

const personalityBackgrounds: { [key: string]: string } = {
    silentMage: 'linear-gradient(180deg, #583F67 0%, #523C60 25%, #463555 50%, #412F4C 75%, #423250 100%)',
    burstFighter: 'linear-gradient(180deg, #AE460F 0%, #AD4710 25%, #A6440E 50%, #A0420D 75%, #9D420E 100%)',
    sootheBeast: '#F8EBAC',
    sunshineWalker: '#FCE295',
    shadowTactician: '#292A27',
    grumpyGremlin: 'linear-gradient(180deg, #896CAF 0%, #8568AD 25%, #8064AB 50%, #7C61A7 75%, #7E61A8 100%)',
    resolverCat: 'linear-gradient(180deg, #044A37 0%, #034231 50%, #054D39 100%)',
    shieldBearer: 'linear-gradient(180deg, #404118 0%, #323610 100%)',
  };

  const personalityColors: { [key: string]: string } = {
    sunshineWalker: '#F15502',
    silentMage: '#FFFFFF',
    burstFighter: '#FFFFFF',
    sootheBeast: '#143802',
    grumpyGremlin: '#19121D',
    shadowTactician: '#143802',
    resolverCat: '#FFFFFF',
    shieldBearer: '#2B300C',
  };
  
const emotionMap: {
    [key: string]: { wornOut: number; emotional: number; positive: number; active: number; anxious: number }[];
  } = {

  q1: [
    { wornOut: 0, emotional: 15, positive: 20, active: 40, anxious: 5 },
    { wornOut: 25, emotional: 15, positive: 0, active: 5, anxious: 15 },
    { wornOut: 10, emotional: 10, positive: 5, active: 10, anxious: 20 },
  ],
  q2: [
    { wornOut: 10, emotional: 20, positive: 10, active: 5, anxious: 15 },
    { wornOut: 25, emotional: 30, positive: 5, active: 5, anxious: 15 },
    { wornOut: 5, emotional: 10, positive: 10, active: 25, anxious: 10 },
  ],
  q3: [
    { wornOut: 10, emotional: 25, positive: 10, active: 30, anxious: 15 },
    { wornOut: 15, emotional: 15, positive: 10, active: 5, anxious: 20 },
    { wornOut: 20, emotional: 10, positive: 5, active: 0, anxious: 30 },
  ],
  q4: [
    { wornOut: 10, emotional: 25, positive: 5, active: 30, anxious: 10 },
    { wornOut: 10, emotional: 10, positive: 15, active: 15, anxious: 10 },
    { wornOut: 5, emotional: 5, positive: 30, active: 10, anxious: 5 },
  ],
  q5: [
    { wornOut: 0, emotional: 20, positive: 15, active: 40, anxious: 10 },
    { wornOut: 20, emotional: 30, positive: 5, active: 5, anxious: 25 },
    { wornOut: 30, emotional: 10, positive: 5, active: 0, anxious: 20 },
  ]
};

const personalities = [
  { id: 'silentMage', name: '沉默魔導師', emotion: { wornOut: 10, emotional: 15, positive: 20, active: 30, anxious: 5 } },
  { id: 'burstFighter', name: '爆裂戰士', emotion: { wornOut: 5, emotional: 40, positive: 20, active: 30, anxious: 20 } },
  { id: 'sootheBeast', name: '療癒小獸', emotion: { wornOut: 5, emotional: 35, positive: 40, active: 20, anxious: 15 } },
  { id: 'sunshineWalker', name: '日行者', emotion: { wornOut: 5, emotional: 40, positive: 50, active: 45, anxious: 20 } },
  { id: 'shadowTactician', name: '影子策士', emotion: { wornOut: 20, emotional: 30, positive: 5, active: 10, anxious: 15 } },
  { id: 'grumpyGremlin', name: '厭世小怪獸', emotion: { wornOut: 90, emotional: 40, positive: 5, active: 2, anxious: 35 } },
  { id: 'resolverCat', name: '逆轉師', emotion: { wornOut: 10, emotional: 25, positive: 30, active: 35, anxious: 20 } },
  { id: 'shieldBearer', name: '護法者', emotion: { wornOut: 30, emotional: 25, positive: 10, active: 15, anxious: 35 } },
];

const personalityQuotes: {
  [key: string]: {
    quotes: string[];
    color: string;
    background: string;
  };
} = {
  silentMage: {
    quotes: [
      '我是個沒情緒的人',
      'OK,我覺得可以',
      '.........(安靜是生產力)',
      '你有五分鐘嗎？我講重點'
    ],
    color: '#574065',
    background: 'rgba(247, 240, 234, 0.80)'
  },
  burstFighter: {
    quotes: [
      '衝！衝！衝！',
      '誰說工讀生沒有使命感？',
      '使命必達，了解？',
      '就差這一點就對了'
    ],
    color: '#FFFFFF',
    background: 'rgba(218, 107, 24, 0.70)'
  },
  sootheBeast: {
    quotes: [
      '要不要我幫忙轉達比較好？',
      '需要找人吐吐苦水嗎？',
      '好啦我去跟老闆說...',
      '要不要先吃個甜點？'
    ],
    color: '#143802',
    background: '#FEF7CE'
  },
  grumpyGremlin: {
    quotes: [
      '又是沒意義的討論',
      '我不想努力了',
      '要不擺爛了',
      '我心已死....'
    ],
    color: '#574065',
    background: '#FFFFFF'
  },
  sunshineWalker: {
    quotes: [
      '衝ＲＲＲＲ！',
      '決不認輸！',
      '要做就做到最好！',
      '撐過今天就是週末了！'
    ],
    color: '#F15502',
    background: 'rgba(255, 255, 255, 0.80)'
  },
  shadowTactician: {
    quotes: [
      '我有劇本，你們慢慢演',
      '會出事，我先不參與',
      '(我有點子，但我不說)',
      '我只出手一次'
    ],
    color: '#143802',
    background: '#FEF7CE'
  },
  resolverCat: {
    quotes: [
      '我還有一招，等等我',
      '大家先不要慌，一定有辦法',
      '這個坑我可以跳，但先等等一下',
      '我習慣逆境操作，放心'
    ],
    color: '#00231B',
    background: 'rgba(255, 255, 255, 0.80)'
  },
  shieldBearer: {
    quotes: [
      '沒關係，這鍋我背',
      '我會補上那個同事的事',
      '先收拾爛攤子吧！',
      '這件事給我扛吧！'
    ],
    color: '#00231B',
    background: '#F3D37C'
  }
};


function calculateEmotion(answers: number[]) {
    const total = {
      wornOut: 0,
      emotional: 0,
      positive: 0,
      active: 0,
      anxious: 0,
    };
  
    answers.forEach((ans, index) => {
      const qKey = `q${index + 1}`;
      const emotion = emotionMap[qKey]?.[ans];
      if (emotion) {
        total.wornOut += emotion.wornOut;
        total.emotional += emotion.emotional;
        total.positive += emotion.positive;
        total.active += emotion.active;
        total.anxious += emotion.anxious;
      }
    });
  
    return total;
  }
  

  function getClosestPersonality(emotionSum: {
    wornOut: number;
    emotional: number;
    positive: number;
    active: number;
    anxious: number;
  }) {
    let minDistance = Infinity;
    let closest = personalities[0];
  
    personalities.forEach(p => {
      const e = p.emotion;
      const dist = Math.sqrt(
        Math.pow(e.wornOut - emotionSum.wornOut, 2) +
        Math.pow(e.emotional - emotionSum.emotional, 2) +
        Math.pow(e.positive - emotionSum.positive, 2) +
        Math.pow(e.active - emotionSum.active, 2) +
        Math.pow(e.anxious - emotionSum.anxious, 2)
      );
  
      if (dist < minDistance) {
        minDistance = dist;
        closest = p;
      }
    });
  
    return closest;
  }
  

export default function WorkerPlayground() {
  const [pageIndex, setPageIndex] = useState(0);
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{
    id: string;
    name: string;
    emotion: {
      wornOut: number;
      emotional: number;
      positive: number;
      active: number;
      anxious: number;
    };
  } | null>(null);

  const page = pages[pageIndex];

  useEffect(() => {
    if (page === 'analysisLoading') {
        console.log('分析邏輯觸發');
      const timeout = setTimeout(() => {
        const total = calculateEmotion(answers);
        const matched = getClosestPersonality(total);
        const timeout = setTimeout(() => {
            const total = calculateEmotion(answers);
            console.log('Emotion 計算結果:', total);
            const matched = getClosestPersonality(total);
            console.log('找到最接近人格:', matched);
            setResult(matched);
            setPageIndex(pages.indexOf('result'));
          }, 5000);          
        setResult(matched);
        setPageIndex(pages.indexOf('result'));
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [page]);

  const next = () => setPageIndex((prev) => Math.min(prev + 1, pages.length - 1));
  const handleAnswer = (index: number) => {

    setAnswers([...answers, index]);
    next();
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <AnimatePresence mode="wait">
        {page === 'loading' && (
          <motion.div
            key="loading"
            className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center text-white"
            style={{ backgroundImage: 'url(/bg-start-page.png)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <img src="/bird-icon.png" alt="bird icon" className="w-16 h-16 mb-4" />
            <div className="text-3xl font-bold mb-2">打工人小劇場</div>
            <div className="text-base mb-6">找找你的職場主角</div>
            <button
              onClick={next}
              className="bg-white text-black px-8 py-2 rounded-full text-lg font-bold shadow-lg border border-white"
            >
              進入測驗
            </button>
          </motion.div>
        )}
        {page === 'nameInput' && (
          <motion.div
            key="nameInput"
            className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center text-white px-6"
            style={{ backgroundImage: "url('/bg-name-page.png')" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-2xl font-bold text-center mb-4 leading-relaxed">
              主人您好！<br />
              請問該怎麼稱呼你
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-transparent border-b-2 border-white text-white text-center text-lg px-4 py-2 w-64 mb-6 placeholder-white focus:outline-none"
              placeholder="輸入姓名"
            />
            <button
              onClick={next}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full px-10 py-3 text-lg font-bold text-white shadow-lg hover:opacity-90 transition"
            >
              下一步
            </button>
          </motion.div>
        )}

        {/* 問題 Q1 頁 */}
        {page === 'q1' && (
          <motion.div
            key="q1"
            className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center text-white px-6 text-center"
            style={{ backgroundImage: "url('/bg-q1.png')" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-2xl font-bold mb-4 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              走進會議室<br />發現你變成一隻打工貓…
            </motion.div>
            <motion.div
              className="text-base mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              桌上躺著一份緊急專案，老闆開口：「誰來負責？」<br />你會——
            </motion.div>
            <motion.button
              onClick={() => handleAnswer(0)}
              className="bg-white text-black px-6 py-2 rounded-full mb-3 w-full max-w-xs shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              看沒人舉起手，主動說我來吧！
            </motion.button>
            <motion.button
              onClick={() => handleAnswer(1)}
              className="bg-white text-black px-6 py-2 rounded-full mb-3 w-full max-w-xs shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              假裝沒聽見，低頭做自己的事情
            </motion.button>
            <motion.button
              onClick={() => handleAnswer(2)}
              className="bg-white text-black px-6 py-2 rounded-full w-full max-w-xs shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              環視大家，默默記下誰在裝死
            </motion.button>
          </motion.div>
        )}

        {/* 問題 Q2 頁 */}
        {page === 'q2' && (
          <motion.div
            key="q2"
            className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center text-white px-6 text-center"
            style={{ backgroundImage: "url('/bg-q2.png')" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-2xl font-bold mb-4 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              剛坐下，你發現桌上擺著一顆<br />能說真心話的「貓貓水晶球」
            </motion.div>
            <motion.div
              className="text-base mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              據說它會播放你最近的「真實心聲」給全場聽。<br />你會怎麼做？
            </motion.div>
            <motion.button
              onClick={() => handleAnswer(0)}
              className="bg-white text-black px-6 py-2 rounded-full mb-3 w-full max-w-xs shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              把水晶球丟給隔壁同事，說「這適合你」
            </motion.button>
            <motion.button
              onClick={() => handleAnswer(1)}
              className="bg-white text-black px-6 py-2 rounded-full mb-3 w-full max-w-xs shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              小聲嘆氣，我只是想賺點小錢，不想扛業績
            </motion.button>
            <motion.button
              onClick={() => handleAnswer(2)}
              className="bg-white text-black px-6 py-2 rounded-full w-full max-w-xs shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              你看著水晶球說「這應該交給領導者」
            </motion.button>
          </motion.div>
        )}

                {/* 問題 Q3 頁 */}
                {page === 'q3' && (
          <motion.div
            key="q3"
            className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center text-white px-6 text-center"
            style={{ backgroundImage: "url('/bg-q3.png')" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-2xl font-bold mb-4 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              桌下還藏了一個「時光罐頭」
            </motion.div>
            <motion.div
              className="text-base mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              據說吃了能讓你回到<br />上周五下班以前<br />你會怎麼做？
            </motion.div>
            <motion.button
              onClick={() => handleAnswer(0)}
              className="bg-white text-black px-6 py-2 rounded-full mb-3 w-full max-w-xs shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              立刻開罐：「我要重新過一次！」
            </motion.button>
            <motion.button
              onClick={() => handleAnswer(1)}
              className="bg-white text-black px-6 py-2 rounded-full mb-3 w-full max-w-xs shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              默默放進包包，回家慢慢想
            </motion.button>
            <motion.button
              onClick={() => handleAnswer(2)}
              className="bg-white text-black px-6 py-2 rounded-full w-full max-w-xs shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              看看有沒有人看到，考慮放回去當沒看到
            </motion.button>
          </motion.div>
        )}

        {/* 問題 Q4 頁 */}
        {page === 'q4' && (
          <motion.div
            key="q4"
            className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center text-white px-6 text-center"
            style={{ backgroundImage: "url('/bg-q4.png')" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-2xl font-bold mb-4 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              中午你打開冰箱，發現便當盒被打開過…
            </motion.div>
            <motion.div
              className="text-base mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              肉被吃掉只剩白飯<br />上面還貼了便利貼：<br />「今天也要努力喔！加油～」<br />你會怎麼做？
            </motion.div>
            <motion.button
              onClick={() => handleAnswer(0)}
              className="bg-white text-black px-6 py-2 rounded-full mb-3 w-full max-w-xs shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              全樓廣播尋找兇手
            </motion.button>
            <motion.button
              onClick={() => handleAnswer(1)}
              className="bg-white text-black px-6 py-2 rounded-full mb-3 w-full max-w-xs shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              打開抽屜，拿出昨天還沒吃完的東西
            </motion.button>
            <motion.button
              onClick={() => handleAnswer(2)}
              className="bg-white text-black px-6 py-2 rounded-full w-full max-w-xs shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              決定午休去頂樓曬太陽
            </motion.button>
          </motion.div>
        )}

        {/* 問題 Q5 頁 */}
        {page === 'q5' && (
          <motion.div
            key="q5"
            className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center text-white px-6 text-center"
            style={{ backgroundImage: "url('/bg-q5.png')" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-2xl font-bold mb-4 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              會議快結束時<br />魔王老闆突然拍桌
            </motion.div>
            <motion.div
              className="text-base mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              「這份報告誰 present？<br />馬上！」<br />你會怎麼做？
            </motion.div>
            <motion.button
              onClick={() => handleAnswer(0)}
              className="bg-white text-black px-6 py-2 rounded-full mb-3 w-full max-w-xs shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              雖然手在抖但還是走上前，眼神堅定說：「我來。」
            </motion.button>
            <motion.button
              onClick={() => handleAnswer(1)}
              className="bg-white text-black px-6 py-2 rounded-full mb-3 w-full max-w-xs shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              嗚...我今天有點感冒...」聲音比空氣還小
            </motion.button>
            <motion.button
              onClick={() => handleAnswer(2)}
              className="bg-white text-black px-6 py-2 rounded-full w-full max-w-xs shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              假裝打開資料夾裝忙
            </motion.button>
          </motion.div>
        )}


        {/* 分析 loading 頁面 */}
        {page === 'analysisLoading' && (
          <motion.div
            key="analysisLoading"
            className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center text-white px-6 text-center"
            style={{ backgroundImage: "url('/bg-analysis.png')" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-xl mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              你的職場主角是……
            </motion.div>
            <motion.div
              className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            />
          </motion.div>
        )}

// === 角色結果畫面排版區塊 ===
{page === 'result' && result && (
  <motion.div
    key="result"
    className="absolute inset-0 bg-cover bg-center text-white"
    style={{
      background: personalityBackgrounds[result.id],
      width: '1080px',
      height: '1920px'
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
{/* 角色標題區塊 */}
<div className="absolute" style={{ left: 81, top: 185, zIndex: 20 }}>
  {/* 使用者輸入的名字 */}
  <div
    style={{
      color: personalityTitleColors[result.id]?.subtitle,
      fontSize: '70px',
      fontWeight: 700,
      lineHeight: 'normal',
      marginBottom: '4px',
    }}
  >
    {name}
  </div>

  {/* 的職場主角是 */}
  <div
    style={{
      color: personalityTitleColors[result.id]?.subtitle,
      fontSize: '61px',
      fontWeight: 700,
      lineHeight: 'normal',
      marginBottom: '4px',
    }}
  >
    的職場主角是
  </div>

  {/* 人格名稱 */}
  <div
    style={{
      color: personalityTitleColors[result.id]?.title,
      fontSize: '103px',
      fontWeight: 700,
      lineHeight: 'normal',
    }}
  >
    {result.name}
  </div>
</div>

    {/* 情緒比例圖層區塊 */}
    <div
      className="absolute"
      style={{ left: 69, top: 984, width: 467.15, height: 391, zIndex: 10 }}
    >
      {/* 情緒比例標題 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          textAlign: 'center',
          color: personalityColors[result.id],
          fontSize: '41.068px',
          fontWeight: 800,
          lineHeight: '59.891px',
          letterSpacing: '2.053px',
          zIndex: 5
        }}
      >
        情緒比例
      </div>

      <img
        src={`/emotion-bg-${result.id}.png`}
        alt="emotion bg"
        className="absolute top-0 left-0"
        style={{
          top: -32,
          width: '467.147px',
          height: '391px',
          borderRadius: '17.112px',
          border: `0.856px solid ${personalityColors[result.id]}`,
          background: '#FFF',
          zIndex: 1
        }}
      />
      <img
        src={`/emotion-radar-${result.id}.png`}
        alt="radar"
        className="absolute"
        style={{
          left: 141.17,
          top: 100,
          width: '182.666px',
          height: '180.955px',
          zIndex: 2
        }}
      />
      <img
        src={`/emotion-fill-${result.id}.png`}
        alt="fill"
        className="absolute"
        style={{
          left: 145,
          top: 159,
          width: '162.5px',
          height: '110.5px',
          zIndex: 3
        }}
      />

      {/* 五個情緒文字（五邊形排列） */}
      <div
        className="absolute"
        style={{
          fontSize: '27.379px',
          fontWeight: 800,
          lineHeight: '59.891px',
          letterSpacing: '1.369px',
          color: personalityColors[result.id],
          textAlign: 'center',
          width: '100%',
          zIndex: 4,
        }}
      >
        <div style={{ position: 'absolute', left: 195, top: 45 }}>厭世</div>
        <div style={{ position: 'absolute', left: 90, top: 145 }}>樂天</div>
        <div style={{ position: 'absolute', left: 145, top: 270 }}>積極</div>
        <div style={{ position: 'absolute', left: 290, top: 270 }}>焦慮</div>
        <div style={{ position: 'absolute', left: 345, top: 145 }}>情緒</div>
      </div>
    </div>

{/* 語錄區塊 */}
{result && personalityQuotes[result.id] && (
  <div style={{ 
    textAlign: 'left',
    fontSize: '38.732px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: 'normal',
    fontFamily: 'Inter',
    paddingLeft: '32px',
    position: 'absolute', left: 49, top: 530, zIndex: 10 }}>
    {personalityQuotes[result.id].quotes.map((text, index) => {
      const widthList = ['360.689px', '281px', '247px', '261px'];
      return (
        <div
          key={index}
          style={{
            width: widthList[index],
            height: '80px',
            borderRadius: '40.346px',
            background: personalityQuotes[result.id].background,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: personalityQuotes[result.id].color,
            fontWeight: 700
          }}
        >
          {text}
        </div>
      );
    })}
  </div>
)}



    {/* 角色圖片 - 放到最底層並放大 */}
    <img
      src={`/result-${result.id}.png`}
      alt={result.name}
      className="absolute"
      style={{
        right: 100,
        top: 100,
        width: '560px',
        zIndex: 0,
        transform: 'scale(1.24)',
        transformOrigin: 'top left'
      }}
    />
  </motion.div>
)}

      </AnimatePresence>
    </div> // ← 這是外層 div 的結尾
  );  

    {/* Debug 區塊顯示 result.id */}
    <div className="text-xs mt-4 text-white">
      圖片預期路徑：{`/result-${result?.id}.png`}
      <br />
      JSON：<pre>{JSON.stringify(result, null, 2)}</pre>
    </div>

  {/* 分享按鈕區塊 */}
  
  <div
    className="absolute bottom-0 left-0"
    style={{
      width: '1080px',
      height: '156px',
      background: personalityColors[result!.id],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '48px',
      fontWeight: 'bold',
      zIndex: 15
    }}
  >
    🔗 分享網站給朋友
  </div>
</motion.div>
