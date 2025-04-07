// 更新後的打工人測驗頁面（含 loading/nameInput/分析 loading 背景與動畫 + Q1 頁面）
'use client';
import { useState, useEffect, useRef } from 'react';
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
  
  const emotionMap: { [key: string]: number[] } = {
    q1: [2, 0, 1],
    q2: [1, 0, 2],
    q3: [2, 1, 0],
    q4: [2, 1, 0],
    q5: [2, 0, 1],
  };
  

// 修改後的人格類型定義 - 更加分散的情感特徵值
const personalities = [
  { id: 'silentMage', name: '沉默魔導師', emotion: { wornOut: 15, emotional: 15, positive: 20, active: 30, anxious: 5 } },
  { id: 'burstFighter', name: '爆裂戰士', emotion: { wornOut: 5, emotional: 40, positive: 20, active: 30, anxious: 20 } },
  { id: 'sootheBeast', name: '療癒小獸', emotion: { wornOut: 5, emotional: 35, positive: 40, active: 20, anxious: 15 } },
  { id: 'sunshineWalker', name: '日行者', emotion: { wornOut: 5, emotional: 20, positive: 50, active: 45, anxious: 10 } },
  { id: 'shadowTactician', name: '影子策士', emotion: { wornOut: 25, emotional: 30, positive: 5, active: 10, anxious: 15 } },
  { id: 'grumpyGremlin', name: '厭世小怪獸', emotion: { wornOut: 70, emotional: 20, positive: 5, active: 5, anxious: 40 } },
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

const personalityEmotionQuotes = {
  silentMage: {
    content: '理性就是魔法\n冷靜才能活下來',
    background: '#F3ECE0',
    headerBg: '#19121D',
    headerTextColor: '#FFF',
    textColor: '#19121D'
  },
  burstFighter: {
    content: '遇到犯賤行為就是要\n硬碰硬無所畏懼',
    background: '#D46614',
    headerBg: '#491A00',
    headerTextColor: 'rgba(247, 240, 234, 0.80)',
    textColor: '#471900'
  },
  sootheBeast: {
    content: '我只是不想撕破臉',
    background: '#FEF7CE',
    headerBg: '#143802',
    headerTextColor: '#F5E882',
    textColor: '#143902'
  },
  grumpyGremlin: {
    content: '生活已經如此艱難\n就不要為難我了',
    background: '#ECE2F4',
    headerBg: '#19121D',
    headerTextColor: '#FFF',
    textColor: '#19121D'
  },
  sunshineWalker: {
    content: '我不只會喊口號\n我還會衝第一',
    background: '#FFF',
    headerBg: '#F15502',
    headerTextColor: '#FFF',
    textColor: '#F15502'
  },
  shadowTactician: {
    content: '觀察才是我的本領\n策劃才是專長',
    background: '#77A453',
    headerBg: '#143802',
    headerTextColor: '#EAE59A',
    textColor: '#143802'
  },
  resolverCat: {
    content: '混亂，是我最熟悉的戰場',
    background: '#013F2E',
    headerBg: '#00231B',
    headerTextColor: '#FFF',
    textColor: '#E0E3CE'
  },
  shieldBearer: {
    content: '我沒事\n你們先走',
    background: '#F2D37D',
    headerBg: '#2B300C',
    headerTextColor: '#FFF',
    textColor: '#2B2F0B'
  }
}

const personalityRelations = {
  silentMage: { heal: ['sootheBeast', 'resolverCat'], hurt: ['burstFighter', 'sunshineWalker'] },
  burstFighter: { heal: ['sunshineWalker', 'resolverCat'], hurt: ['silentMage', 'grumpyGremlin'] },
  sootheBeast: { heal: ['silentMage', 'shieldBearer'], hurt: ['burstFighter', 'shadowTactician'] },
  grumpyGremlin: { heal: ['sootheBeast', 'shieldBearer'], hurt: ['sunshineWalker', 'burstFighter'] },
  sunshineWalker: { heal: ['burstFighter', 'resolverCat'], hurt: ['grumpyGremlin', 'shadowTactician'] },
  shadowTactician: { heal: ['resolverCat', 'silentMage'], hurt: ['sootheBeast', 'sunshineWalker'] },
  resolverCat: { heal: ['shadowTactician', 'sunshineWalker'], hurt: ['shieldBearer', 'burstFighter'] },
  shieldBearer: { heal: ['sootheBeast', 'grumpyGremlin'], hurt: ['resolverCat', 'shadowTactician'] },
};

const relationBlockBackground = {
  silentMage: '#F3ECE0',
  burstFighter: '#D46614',
  sootheBeast: '#FEF7CE',
  grumpyGremlin: '#ECE2F4',
  sunshineWalker: '#FFF',
  shadowTactician: '#77A453',
  resolverCat: '#013F2E',
  shieldBearer: '#F2D37D',
};

const relationHeaderBackground = {
  silentMage: '#19121D',
  burstFighter: '#491A00',
  sootheBeast: '#143802',
  grumpyGremlin: '#19121D',
  sunshineWalker: '#F15502',
  shadowTactician: '#143802',
  resolverCat: '#00231B',
  shieldBearer: '#2B300C',
};


function calculateScore(answers: number[]): number {
  let score = 0;

  answers.forEach((ans, index) => {
    const qKey = `q${index + 1}`;
    const optionScore = emotionMap[qKey]?.[ans];
    if (typeof optionScore === 'number') {
      score += optionScore;
    }    
  });

  return score;
}

  

  function getPersonalityByScore(score: number) {
    if (score <= 2) return personalities.find(p => p.id === 'grumpyGremlin')!;
    if (score === 3) return personalities.find(p => p.id === 'shadowTactician')!;
    if (score === 4) return personalities.find(p => p.id === 'shieldBearer')!;
    if (score === 5) return personalities.find(p => p.id === 'silentMage')!;
    if (score === 6) return personalities.find(p => p.id === 'resolverCat')!;
    if (score === 7) return personalities.find(p => p.id === 'sootheBeast')!;
    if (score === 8) return personalities.find(p => p.id === 'burstFighter')!;
    return personalities.find(p => p.id === 'sunshineWalker')!;
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
  const clickSound = typeof window !== 'undefined' ? new Audio('/click.mp3') : null;
const [isPlaying, setIsPlaying] = useState(false);
const audioRef = useRef<HTMLAudioElement | null>(null);

useEffect(() => {
  audioRef.current = new Audio('/bg-music.mp3');
  audioRef.current.loop = true;

  return () => {
    audioRef.current?.pause();
    audioRef.current = null;
  };
}, []);

const toggleMusic = () => {
  if (!audioRef.current) return;

  if (isPlaying) {
    audioRef.current.pause();
    setIsPlaying(false);
  } else {
    audioRef.current.play();
    setIsPlaying(true);
  }
};


  const page = pages[pageIndex];
  function calculateScore(answers: number[]): number {
    let score = 0;
  
    answers.forEach((ans, index) => {
      const qKey = `q${index + 1}`;
      const optionScore = emotionMap[qKey]?.[ans];
if (typeof optionScore === 'number') {
  score += optionScore;
}
    });
  
    return score;
  }  

  
  useEffect(() => {
    if (page === 'analysisLoading') {
      const timeout = setTimeout(() => {
        const score = calculateScore(answers);
  
        const personalityByScore: { [key: number]: string } = {
          0: 'silentMage',
          1: 'silentMage',
          2: 'silentMage',
          3: 'burstFighter',
          4: 'sootheBeast',
          5: 'sunshineWalker',
          6: 'shadowTactician',
          7: 'grumpyGremlin',
          8: 'resolverCat',
          9: 'shieldBearer',
          10: 'shieldBearer',
        };
  
        const resultId = personalityByScore[score];
        const matched = personalities.find((p) => p.id === resultId)!;
  
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
    
    <div className="w-full h-full overflow-hidden relative">
      {/* 音樂控制按鈕 */}
<img
  src={isPlaying ? "volume.png" : "volume-off.png"}
  alt="音樂開關"
  onClick={toggleMusic}
  style={{
    position: "absolute",
    top: "60px",
    right: "60px",
    width: "100px",
    height: "100px",
    cursor: "pointer",
    zIndex: 50,
  }}
/>
  <AnimatePresence mode="wait">
    {page === 'loading' && (
      <motion.div
        key="loading"
        className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center text-white"
        style={{ backgroundImage: 'url(bg-start-page.png)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <img
          src="bird-icon.png"
          alt="bird icon"
          style={{
            width: "146.128px",
            height: "131.593px",
            marginBottom: "40px",
          }}
        />
        <div
          style={{
            fontSize: "117.414px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          打工人小劇場
        </div>
        <div
          style={{
            fontSize: "68.279px",
            marginBottom: "40px",
          }}
        >
          找找你的職場主角
        </div>
        <button
            onClick={() => {
              clickSound?.play(); // ✅ 播放音效
              next();             // ✅ 原本邏輯
            }}
          style={{
            width: "790px",
            height: "141px",
            backgroundColor: 'rgba(22, 22, 23, 0.5)',
            color: "#ffffff",
            fontSize: "78px",
            fontWeight: "bold",
            borderRadius: "9999px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            border: "1px solid #FFF",
          }}
        >
          進入測驗
        </button>
      </motion.div>
    )}
       {page === 'nameInput' && (
  <motion.div
    key="nameInput"
    className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center text-white"
    style={{ backgroundImage: "url('bg-name-page.png')" }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* 主標題 */}
    <div
      style={{
        fontSize: '68.279px',
        fontWeight: 700,
        textAlign: 'center',
        lineHeight: '1.5',
        marginBottom: '60px',
      }}
    >
      主人您好！<br />
      請問該怎麼稱呼你
    </div>

    {/* 輸入姓名 */}
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="bg-transparent text-white text-center focus:outline-none"
      style={{
        fontSize: '48px',
        width: '669px',
        marginBottom: '10px',
      }}
      placeholder="輸入姓名"
    />

    {/* 底線 */}
    <div
      style={{
        width: '669px',
        height: '5px',
        backgroundColor: '#FFF',
        opacity: 0.5,
        marginBottom: '100px',
      }}
    />

    {/* 下一步按鈕 */}
    <button
        onClick={() => {
          clickSound?.play(); // ✅ 播放音效
          next();             // ✅ 原本邏輯
        }}
      style={{
        width: '817px',
        height: '151px',
        backgroundColor: 'rgba(22, 22, 23, 0.5)',
        borderRadius: '75.5px',
        fontSize: '64px',
        fontWeight: 'bold',
        color: 'white',
        border: "1px solid #FFF",
      }}
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
            style={{ backgroundImage: "url('bg-q1.png')" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            >
      {/* H1 標題 */}
        <motion.div
            style={{
            fontSize: '69.688px',
            fontWeight: 'bold',
            marginBottom: '24px',
            lineHeight: '1.4',
      }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
    >
              走進會議室<br />發現你變成一隻打工貓…
            </motion.div>
            <motion.div
            style={{
            fontSize: '44.855px',
            fontWeight: 'normal',
            marginBottom: '48px',
            lineHeight: '1.5',
            width: '583.111px',
      }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
    >
              桌上躺著一份緊急專案，老闆開口：「誰來負責？」<br />你會——
            </motion.div>

            {[ // 選項清單
          '看沒人舉起手，主動說我來吧！',
          '假裝沒聽見，低頭做自己的事情',
          '環視大家，默默記下誰在裝死',
    ].map((text, index) => (
      <motion.button
        key={index}
        onClick={() => {
          clickSound?.play();      // ✅ 播放音效
          handleAnswer(index);     // ✅ 執行原有邏輯
        }}
        style={{
              width: '713px',
              height: '100px',
              borderRadius: '50px',
              background: '#FFF',
              color: '#000',
              fontSize: '44.855px',
              fontWeight: 'bold',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.2 }}
      >
        {text}
      </motion.button>
    ))}
  </motion.div>
)}

{page === 'q2' && (
  <motion.div
    key="q2"
    className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center text-white px-6 text-center"
    style={{ backgroundImage: "url('bg-q2.png')" }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* H1 標題 */}
    <motion.div
      style={{
        fontSize: '69.688px',
        fontWeight: 'bold',
        marginBottom: '24px',
        lineHeight: '1.4',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      剛坐下，你發現桌上擺著一顆<br />能說真心話的「貓貓水晶球」
    </motion.div>

    {/* H2 標題（副標題） */}
    <motion.div
      style={{
        fontSize: '44.855px',
        fontWeight: 'normal',
        marginBottom: '48px',
        lineHeight: '1.5',
        width: '583.111px',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      據說它會播放你最近的「真實心聲」給全場聽。<br />你會怎麼做？
    </motion.div>

    {/* 選項按鈕區塊 */}
    {[
      '把水晶球丟給隔壁同事，說「這適合你」',
      '小聲嘆氣，我只是想賺點小錢，不想扛業績',
      '你看著水晶球說「這應該交給領導者」',
    ].map((text, index) => (
      <motion.button
        key={index}
        onClick={() => {
          clickSound?.play();      // ✅ 播放音效
          handleAnswer(index);     // ✅ 執行原有邏輯
        }}
        style={{
          width: '890px',
          height: '100px',
          borderRadius: '50px',
          background: '#FFF',
          color: '#000',
          fontSize: '44.855px',
          fontWeight: 'bold',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 + index * 0.2 }}
      >
        {text}
      </motion.button>
    ))}
  </motion.div>
)}

{page === 'q3' && (
  <motion.div
    key="q3"
    className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center text-white px-6 text-center"
    style={{ backgroundImage: "url('bg-q3.png')" }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* H1 標題 */}
    <motion.div
      style={{
        fontSize: '69.688px',
        fontWeight: 'bold',
        marginBottom: '24px',
        lineHeight: '1.4',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      桌下還藏了一個「時光罐頭」
    </motion.div>

    {/* H2 副標題 */}
    <motion.div
      style={{
        fontSize: '44.855px',
        fontWeight: 'normal',
        marginBottom: '48px',
        lineHeight: '1.5',
        width: '583.111px',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      據說吃了能讓你回到<br />上周五下班以前<br />你會怎麼做？
    </motion.div>

    {/* 選項按鈕 */}
    {[
      '立刻開罐：「我要重新過一次！」',
      '默默放進包包，回家慢慢想',
      '看看有沒有人看到，考慮放回去當沒看到',
    ].map((text, index) => (
      <motion.button
        key={index}
        onClick={() => {
          clickSound?.play();      // ✅ 播放音效
          handleAnswer(index);     // ✅ 執行原有邏輯
        }}
        style={{
          width: '880px',
          height: '100px',
          borderRadius: '50px',
          background: '#FFF',
          color: '#000',
          fontSize: '44.855px',
          fontWeight: 'bold',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 + index * 0.2 }}
      >
        {text}
      </motion.button>
    ))}
  </motion.div>
)}


{page === 'q4' && (
  <motion.div
    key="q4"
    className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center text-white px-6 text-center"
    style={{ backgroundImage: "url('bg-q4.png')" }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* H1 主標題 */}
    <motion.div
      style={{
        fontSize: '69.688px',
        fontWeight: 'bold',
        marginBottom: '24px',
        lineHeight: '1.4',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      中午你打開冰箱，發現便當盒被打開過…
    </motion.div>

    {/* H2 副標題 */}
    <motion.div
      style={{
        fontSize: '44.855px',
        fontWeight: 'normal',
        marginBottom: '48px',
        lineHeight: '1.5',
        width: '583.111px',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      肉被吃掉只剩白飯<br />上面還貼了便利貼：<br />「今天也要努力喔！加油～」<br />你會怎麼做？
    </motion.div>

    {/* 選項按鈕 */}
    {[
      '全樓廣播尋找兇手',
      '開抽屜，拿出昨天還沒吃完的東西',
      '決定午休去頂樓曬太陽',
    ].map((text, index) => (
      <motion.button
        key={index}
        onClick={() => {
          clickSound?.play();      // ✅ 播放音效
          handleAnswer(index);     // ✅ 執行原有邏輯
        }}
        style={{
          width: '713px',
          height: '100px',
          borderRadius: '50px',
          background: '#FFF',
          color: '#000',
          fontSize: '44.855px',
          fontWeight: 'bold',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 + index * 0.2 }}
      >
        {text}
      </motion.button>
    ))}
  </motion.div>
)}


{page === 'q5' && (
  <motion.div
    key="q5"
    className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center text-white px-6 text-center"
    style={{ backgroundImage: "url('bg-q5.png')" }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* H1 主標題 */}
    <motion.div
      style={{
        fontSize: '69.688px',
        fontWeight: 'bold',
        marginBottom: '24px',
        lineHeight: '1.4',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      會議快結束時<br />魔王老闆突然拍桌
    </motion.div>

    {/* H2 副標題 */}
    <motion.div
      style={{
        fontSize: '44.855px',
        fontWeight: 'normal',
        marginBottom: '48px',
        lineHeight: '1.5',
        width: '583.111px',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      「這份報告誰 present？<br />馬上！」<br />你會怎麼做？
    </motion.div>

    {/* 選項按鈕 */}
    {[
      '雖然手在抖但還是走上前，眼神堅定說：「我來。」',
      '嗚...我今天有點感冒...」聲音比空氣還小',
      '假裝打開資料夾裝忙',
    ].map((text, index) => (
      <motion.button
        key={index}
        onClick={() => {
          clickSound?.play();      // ✅ 播放音效
          handleAnswer(index);     // ✅ 執行原有邏輯
        }}
        style={{
          width: '880px',
          height: '100px',
          lineHeight: '1',
          borderRadius: '50px',
          background: '#FFF',
          color: '#000',
          fontSize: '44.855px',
          fontWeight: 'bold',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 + index * 0.2 }}
      >
        {text}
      </motion.button>
    ))}
  </motion.div>
)}

        {/* 分析 loading 頁面 */}
        {page === 'analysisLoading' && (
  <motion.div
    key="analysisLoading"
    className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center text-white px-6 text-center"
    style={{ backgroundImage: "url('bg-analysis.png')" }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* 標題文字 */}
    <motion.div
      style={{
        fontSize: '68.279px',
        fontWeight: 'bold',
        marginBottom: '48px',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      你的職場主角是……
    </motion.div>

    {/* loading 動畫圓圈（放大 4.4 倍） */}
    <motion.div
      className="animate-spin border-4 border-white border-t-transparent rounded-full"
      style={{
        width: '52.8px',  // 12 * 4.4
        height: '52.8px',
        borderWidth: '17.6px', // 4 * 4.4
      }}
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
        src={`emotion-bg-${result.id}.png`}
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
        src={`emotion-radar-${result.id}.png`}
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
        src={`emotion-fill-${result.id}.png`}
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
      const widthList = ['360px', '360px', '360px', '360px'];
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

{/* 情緒宣言區塊 */}
<div
  className="absolute"
  style={{
    left: 582,
    top: 1055,
    width: 450,
    height: 286,
    borderRadius: '17.5px',
    background: (personalityEmotionQuotes as any)[result.id].background,
    zIndex: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden'
  }}
>
  {/* 標題底框 */}
  <div
    style={{
      width: 450,
      height: 85.75,
      borderRadius: '17.5px 17.5px 0px 0px',
      background: (personalityEmotionQuotes as any)[result.id].headerBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <div
      style={{
        fontSize: 42,
        fontWeight: 800,
        lineHeight: '61.25px',
        letterSpacing: '2.1px',
        color: (personalityEmotionQuotes as any)[result.id].headerTextColor,
      }}
    >
      情緒宣言
    </div>
  </div>

  {/* 內文 */}
  <div
    style={{
      padding: '24px',
      textAlign: 'center',
      fontSize: 42,
      fontWeight: 800,
      lineHeight: '61.25px',
      letterSpacing: '2.1px',
      color: (personalityEmotionQuotes as any)[result.id].textColor,
    }}
  >
    {(personalityEmotionQuotes as any)[result.id].content}
  </div>
</div>


{result && (personalityEmotionQuotes as any)[result.id] && (
  <>
    {/* 互相治癒區塊 */}
    <div
      className="absolute"
      style={{
        left: 65,
        top: 1410,
        width: '467.15px',
        height: '203.875px',
        borderRadius: '17.5px',
        border: '0.875px solid #FFF',
        background: (relationBlockBackground as any)[result.id], // 這邊我接下來給你
        zIndex: 10
      }}
    >
      {/* 標題底框 */}
      <div
        style={{
          width: '467.15px',
          height: '85.75px',
          background: (relationHeaderBackground as any)[result.id],
          borderRadius: '17.5px 17.5px 0px 0px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          fontWeight: 800,
          color: '#FFF',
        }}
      >
        互相治癒
      </div>
      {/* icon 清單 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        paddingTop: '28px'
      }}>
        {(personalityRelations as any)[result.id].heal.map((charId: string) => (
          <img
            key={charId}
            src={`icon-${charId}.png`}
            alt={charId}
            style={{ width: '72px', height: '72px', borderRadius: '50%' }}
          />
        ))}
      </div>
    </div>

    {/* 互相傷害區塊 */}
    <div
      className="absolute"
      style={{
        right: 52,
        top: 1410,
        width: '450px',
        height: '203.875px',
        borderRadius: '17.5px',
        border: '0.875px solid #FFF',
        background: (relationBlockBackground as any)[result.id],
        zIndex: 10
      }}
    >
      {/* 標題底框 */}
      <div
        style={{
          width: '455px',
          height: '85.75px',
          background: (relationHeaderBackground as any)[result.id],
          borderRadius: '17.5px 17.5px 0px 0px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          fontWeight: 800,
          color: '#FFF',
        }}
      >
        互相傷害
      </div>
      {/* icon 清單 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        paddingTop: '28px'
      }}>
        {(personalityRelations as any) [result.id].hurt.map((charId: string) => (
          <img
            key={charId}
            src={`icon-${charId}.png`}
            alt={charId}
            style={{ width: '72px', height: '72px', borderRadius: '50%' }}
          />
        ))}
      </div>
    </div>
  </>
)}


    {/* 角色圖片 - 放到最底層並放大 */}
    <img
      src={`result-${result.id}.png`}
      alt={result.name}
      className="absolute"
      style={{
        right: 120,
        top: 80,
        width: '500px',
        zIndex: 0,
        transform: 'scale(1.24)',
        transformOrigin: 'top left'
      }}
    />
  </motion.div>
)}

      </AnimatePresence>

    {/* Debug 區塊顯示 result.id */}
    <div className="text-xs mt-4 text-white">
      圖片預期路徑：{`result-${result?.id}.png`}
      <br />
      JSON：<pre>{JSON.stringify(result, null, 2)}</pre>
    </div>

  {/* 分享按鈕區塊 */}
  {result && (
  <div
    className="absolute bottom-0 left-0"
    style={{
      width: '1080px',
      height: '156px',
      background: '#000',
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
)}
  </div> // ✅ 外層 div 結尾
)};        // ✅ return 結尾