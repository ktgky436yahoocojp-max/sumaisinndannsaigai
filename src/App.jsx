import { useState } from "react";

const LINE_URL = "https://line.me/R/ti/p/@148cciyn";
const LINE_URL_DAIKO = LINE_URL;

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&family=Yomogi&display=swap');* { box-sizing:border-box; margin:0; padding:0; }`;

function ScoreBar({ pct }) {
  const color = pct>=75?"#4ade80":pct>=50?"#facc15":pct>=25?"#fb923c":"#f87171";
  return <div style={{ height:10, background:"#e5e7eb", borderRadius:99, overflow:"hidden", marginTop:6 }}><div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:99, transition:"width 0.8s" }} /></div>;
}

function ProgressBar({ cur, total, grad }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, width:"100%", maxWidth:540 }}>
      <div style={{ flex:1, height:8, background:"#e5e7eb", borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${(cur/total)*100}%`, background:grad, borderRadius:99, transition:"width 0.4s" }} />
      </div>
      <span style={{ fontSize:13, color:"#6b7280", whiteSpace:"nowrap", fontFamily:"'M PLUS Rounded 1c',sans-serif" }}>{cur} / {total}</span>
    </div>
  );
}

function getLineType(score, totalMax) {
  const pct = totalMax > 0 ? (score / totalMax) * 100 : 0;
  if (pct >= 75) return "Aタイプ";
  if (pct >= 50) return "Bタイプ";
  if (pct >= 25) return "Cタイプ";
  return "Dタイプ";
}

function getSubType(worstCat) {
  const MAP = {
    "浸水・洪水リスク": { emoji:"🌊", name:"洪水浸食型" },
    "土砂災害リスク":   { emoji:"🌪️", name:"斜面崩落警戒型" },
    "排水・防水対策":   { emoji:"🚿", name:"排水機能限界型" },
    "保険・備え":       { emoji:"🚨", name:"避難判断遅延型" },
    "地域・インフラ":   { emoji:"🏝️", name:"孤立島化型" },
  };
  return MAP[worstCat] || { emoji:"⚠️", name:"複合リスク型" };
}

function getPercentile(score, totalMax) {
  const pct = totalMax > 0 ? (score / totalMax) * 100 : 0;
  if (pct >= 75) return "上位20%";
  if (pct >= 50) return "上位50%";
  if (pct >= 25) return "上位75%";
  return "下位25%";
}

function calcSumaiAge(score, totalMax) {
  const pct = totalMax > 0 ? score / totalMax : 0;
  return Math.round(85 - pct * 65);
}

function defaultRisk(score, TOTAL_MAX, labels) {
  const pct = TOTAL_MAX > 0 ? (score / TOTAL_MAX) * 100 : 0;
  const levels = [
    { min:75, label:labels[0]||"安心レベル", color:"#16a34a", bg:"#f0fdf4", border:"#86efac", emoji:"🟢", desc:"現時点では大きなリスクは見当たりません。引き続き定期メンテナンスを続けましょう。" },
    { min:50, label:labels[1]||"注意レベル", color:"#d97706", bg:"#fefce8", border:"#fcd34d", emoji:"🟡", desc:"いくつか気になる点があります。専門家による確認をおすすめします。" },
    { min:25, label:labels[2]||"要対策レベル", color:"#ea580c", bg:"#fff7ed", border:"#fdba74", emoji:"🟠", desc:"複数のリスク要因があります。早めに点検・対策を検討してください。" },
    { min:0,  label:labels[3]||"要緊急対応",  color:"#dc2626", bg:"#fef2f2", border:"#fca5a5", emoji:"🔴", desc:"深刻なリスクの可能性があります。専門家による診断を早急に受けることをおすすめします。" },
  ];
  return levels.find(l => pct >= l.min);
}

function LineBanner({ score, totalMax, subType }) {
  const lineType = getLineType(score, totalMax);
  const sendText = subType ? subType.name : lineType;
  const url = LINE_URL + "?oatext=" + encodeURIComponent(sendText);
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      style={{ display:"block", width:"100%", maxWidth:540, background:"linear-gradient(135deg,#06c755,#00a040)", border:"2px solid #04a844", boxShadow:"4px 6px 0px #027a30", borderRadius:20, padding:"20px 22px", marginBottom:20, textDecoration:"none" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <span style={{ fontSize:24 }}>📮</span>
        <div>
          <div style={{ fontSize:11, color:"#d1fae5", fontWeight:700, fontFamily:"'M PLUS Rounded 1c',sans-serif" }}>あなた専用</div>
          <div style={{ fontSize:17, fontWeight:800, color:"#fff", fontFamily:"'M PLUS Rounded 1c',sans-serif", lineHeight:1.3 }}>この結果の解説を見る（無料）</div>
        </div>
      </div>
      <div style={{ background:"#fff", borderRadius:14, padding:"16px", textAlign:"center" }}>
        {["なぜこの結果になったのか","20年後の危険箇所","今やるべき改善策"].map((t,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#374151", fontFamily:"'M PLUS Rounded 1c',sans-serif", fontWeight:700, marginBottom:6, justifyContent:"center" }}>
            <span style={{ color:"#06c755" }}>✓</span> {t}
          </div>
        ))}
        <div style={{ height:1, background:"#e5e7eb", margin:"12px 0" }} />
        <div style={{ fontSize:15, fontWeight:800, color:"#06c755", fontFamily:"'M PLUS Rounded 1c',sans-serif" }}>🆓 LINEで無料配布中</div>
        <div style={{ fontSize:11, color:"#9ca3af", marginTop:2, fontFamily:"'M PLUS Rounded 1c',sans-serif" }}>お友だち追加だけ・料金一切なし</div>
        {subType && (
          <>
            <div style={{ height:1, background:"#e5e7eb", margin:"12px 0" }} />
            <div style={{ background:"#f0fdf4", borderRadius:10, padding:"10px 14px" }}>
              <div style={{ fontSize:12, color:"#15803d", fontFamily:"'M PLUS Rounded 1c',sans-serif", marginBottom:4 }}>
                追加後にLINEへこのキーワードを送ってください
              </div>
              <div style={{ fontSize:20, fontWeight:900, color:"#15803d", fontFamily:"'Yomogi',cursive", lineHeight:1.3 }}>
                {subType.emoji} {subType.name}
              </div>
            </div>
          </>
        )}
      </div>
    </a>
  );
}

function DaikoCTA() {
  return (
    <div style={{ width:"100%", maxWidth:540, background:"linear-gradient(135deg,#1f2937,#374151)", border:"2.5px solid #4b5563", boxShadow:"4px 6px 0px #111827", borderRadius:24, padding:"28px 24px", marginBottom:20 }}>
      <div style={{ textAlign:"center", marginBottom:16 }}>
        <div style={{ fontSize:36, marginBottom:8 }}>🔎</div>
        <h3 style={{ fontFamily:"'Yomogi',cursive", fontSize:19, color:"#fff", marginBottom:8 }}>自分で調べるのが面倒なら…</h3>
        <p style={{ fontSize:13, color:"#d1d5db", lineHeight:1.7 }}>書類確認・現地確認・詳細レポートまで<br/><b style={{ color:"#fbbf24" }}>マンション管理士が代わりに診断</b>します。</p>
      </div>
      <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"12px 16px", marginBottom:16 }}>
        <div style={{ fontSize:12, color:"#9ca3af", fontFamily:"'M PLUS Rounded 1c',sans-serif", marginBottom:8 }}>この診断ではわからない</div>
        {["20年後のリスク","今やるべき優先対策","住み続けるか、住み替えるかの判断"].map((t,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#fff", fontFamily:"'M PLUS Rounded 1c',sans-serif", fontWeight:700, marginBottom: i<2 ? 6 : 0 }}>
            <span style={{ color:"#fbbf24" }}>✅</span> {t}
          </div>
        ))}
        <div style={{ marginTop:10, fontSize:12, color:"#d1d5db", fontFamily:"'M PLUS Rounded 1c',sans-serif", lineHeight:1.7 }}>を詳しく分析します。</div>
      </div>
      <a href={LINE_URL_DAIKO} target="_blank" rel="noopener noreferrer" style={{ display:"block", width:"100%", padding:"15px 15px 12px", background:"linear-gradient(135deg,#f59e0b,#ef4444)", borderRadius:14, border:"none", boxShadow:"0 3px 0 #92400e", cursor:"pointer", textDecoration:"none", textAlign:"center" }}>
        <div style={{ color:"#fff", fontSize:16, fontWeight:800, fontFamily:"'M PLUS Rounded 1c',sans-serif", marginBottom:8 }}>🔎 プロ代行診断の内容を見てみる</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, background:"rgba(255,255,255,0.9)", borderRadius:10, padding:"8px 12px" }}>
          <span style={{ fontSize:16 }}>💬</span>
          <span style={{ fontSize:13, color:"#374151", fontWeight:700, fontFamily:"'M PLUS Rounded 1c',sans-serif" }}>LINEお友だちから <span style={{ background:"#fef9c3", padding:"1px 6px", borderRadius:4 }}>「代行」</span> と送ってください</span>
        </div>
      </a>
    </div>
  );
}

// ============================================================
// この診断のデータ
// ============================================================
const CONFIG = {
      titleEmoji:"🌊", title:"戸建て\n水害・浸水リスク診断", subtitle:"15の質問で水害・土砂災害への\n備えとリスクがわかります",
    accent:"#0ea5e9", accentDark:"#0369a1", accentBg:"#f0f9ff", accentBorder:"#bae6fd",
    grad:"linear-gradient(135deg,#0ea5e9,#06b6d4)", wrapBg:"linear-gradient(160deg,#f0f9ff 0%,#ecfeff 100%)",
    categoryList:[["🌊","浸水・洪水リスク","4問"],["⛰️","土砂災害リスク","2問"],["🚿","排水・防水対策","3問"],["📋","保険・備え","2問"],["🏘️","地域・インフラ","4問"]],
    categoryComments:{
      "浸水・洪水リスク":{high:"浸水・洪水リスクは低い状態です。引き続きハザードマップの確認を。",middle:"浸水リスクに一部懸念があります。ハザードマップの再確認をおすすめします。",low:"浸水リスクが高い可能性があります。止水対策と避難計画の整備を急いでください。"},
      "土砂災害リスク":{high:"土砂災害リスクは低い状態です。",middle:"土砂災害の可能性がある地域です。警戒区域の確認をおすすめします。",low:"土砂災害リスクが高い可能性があります。早急に避難計画と対策を検討してください。"},
      "排水・防水対策":{high:"排水・防水対策は良好です。",middle:"排水・防水に一部改善の余地があります。雨樋の清掃や外壁点検をおすすめします。",low:"排水・防水に問題があります。雨水侵入リスクを早急に解消してください。"},
      "保険・備え":{high:"保険・備えは十分です。万一の際も安心です。",middle:"保険内容の確認が必要です。水災補償の有無を確認しましょう。",low:"水害への備えが不足しています。水災補償の加入を早急に検討してください。"},
      "地域・インフラ":{high:"地域のインフラ・防災体制は整っています。",middle:"地域の防災情報の確認をおすすめします。避難場所を家族で共有しましょう。",low:"地域の防災体制に不安があります。自治体の防災情報を確認し備えを強化してください。"},
    },
    nextApps:[
      {emoji:"🪨",label:"基礎・地盤リスク診断",url:"https://sumaishindan-kiso.vercel.app"},
      {emoji:"🤝",label:"近隣コミュニティ・人間関係力診断",url:"https://sumaishindan-community.vercel.app"},
      {emoji:"💴",label:"家計・住居費の持続力診断",url:"https://sumaishindan-kakei.vercel.app"},
    ],
    getRisk:(s,m)=>defaultRisk(s,m,["備え良好","要確認","要対策","要緊急対応"]),
    questions:[
      {id:1,category:"浸水・洪水リスク",emoji:"🌊",text:"市区町村の洪水ハザードマップを確認しましたか？",hint:"国土交通省「ハザードマップポータルサイト」で無料確認できます。",options:[{label:"確認済み・浸水リスクなし",score:2},{label:"確認済み・浸水リスクあり",score:0},{label:"まだ確認していない",score:0}]},
      {id:2,category:"浸水・洪水リスク",emoji:"🌧️",text:"大雨のとき、近くの道路や川が氾濫したことがありますか？",hint:"過去の浸水実績は将来のリスクの最も信頼できる指標です。",options:[{label:"一度もない",score:2},{label:"道路が冠水したことがある",score:1},{label:"床下・床上浸水の経験がある",score:0}]},
      {id:3,category:"浸水・洪水リスク",emoji:"📏",text:"建物の床の高さ（GL＋基礎高）はどのくらいですか？",hint:"基礎高が高いほど床下浸水リスクが低くなります。",options:[{label:"高め（GL+40cm以上）",score:2},{label:"標準的（GL+20〜40cm）",score:1},{label:"低め（GL+20cm未満）・わからない",score:0}]},
      {id:4,category:"浸水・洪水リスク",emoji:"🏞️",text:"建物の周囲より土地が低い（周りに囲まれた低地）ですか？",hint:"周囲より低い土地は雨水が集まりやすく浸水リスクが高まります。",options:[{label:"周囲より高い・同じくらい",score:2},{label:"やや低い",score:1},{label:"明らかに低い・すり鉢状",score:0}]},
      {id:5,category:"土砂災害リスク",emoji:"⛰️",text:"土砂災害ハザードマップで警戒区域を確認しましたか？",hint:"急傾斜地・土石流・地すべりの警戒区域に該当する場合は要対策。",options:[{label:"確認済み・区域外",score:2},{label:"確認済み・区域内",score:0},{label:"まだ確認していない",score:0}]},
      {id:6,category:"土砂災害リスク",emoji:"🌿",text:"敷地の近くに急な斜面・崖・山はありますか？",hint:"崖から建物まで水平距離が崖高さの2倍以内は土砂災害のリスクゾーンです。",options:[{label:"近くにない",score:2},{label:"やや遠い（50m以上）",score:1},{label:"すぐそば（50m以内）",score:0}]},
      {id:7,category:"排水・防水対策",emoji:"🚿",text:"雨水排水（雨樋・排水溝）は詰まらずに機能していますか？",hint:"雨樋の詰まりは外壁・基礎への雨水侵入の原因になります。",options:[{label:"定期的に清掃・問題なし",score:2},{label:"たまに確認する程度",score:1},{label:"ほぼ確認したことがない",score:0}]},
      {id:8,category:"排水・防水対策",emoji:"🧱",text:"外壁・基礎のひび割れから雨水が浸入している形跡はありますか？",hint:"ひび割れからの浸水は建物内部の腐食・シロアリ被害につながります。",options:[{label:"浸入の形跡なし",score:2},{label:"少し気になる箇所がある",score:1},{label:"明らかな浸水跡がある",score:0}]},
      {id:9,category:"排水・防水対策",emoji:"🔒",text:"浸水対策（止水板・防水扉・土のう等）を準備していますか？",hint:"ハザードマップでリスクがある場合、簡易止水板だけでも大きな効果があります。",options:[{label:"対策済み・準備している",score:2},{label:"検討中",score:1},{label:"何も準備していない",score:0}]},
      {id:10,category:"保険・備え",emoji:"📋",text:"火災保険に水災補償を付けていますか？",hint:"水災補償は別途オプションの場合が多く、未加入だと浸水被害が自己負担になります。",options:[{label:"水災補償あり",score:2},{label:"保険はあるが補償内容不明",score:1},{label:"水災補償なし・保険未加入",score:0}]},
      {id:11,category:"保険・備え",emoji:"🗂️",text:"過去の浸水・水害被害の記録を保管していますか？",hint:"被害記録は保険請求・売却時の告知義務にも関わります。",options:[{label:"記録・写真を保管している",score:2},{label:"おおよそ把握している",score:1},{label:"記録していない",score:0}]},
      {id:12,category:"地域・インフラ",emoji:"🏘️",text:"地域の排水インフラ（下水道・雨水幹線）は整備されていますか？",hint:"排水インフラが未整備な地域は大雨時の冠水リスクが高まります。",options:[{label:"整備済み・問題なし",score:2},{label:"一部未整備",score:1},{label:"未整備・わからない",score:0}]},
      {id:13,category:"地域・インフラ",emoji:"🌊",text:"近くに海・湾・干拓地はありますか？",hint:"海抜が低い地域は高潮・津波のリスクも考慮が必要です。",options:[{label:"近くにない・内陸部",score:2},{label:"数キロ以内にある",score:1},{label:"すぐそば・海抜が低い",score:0}]},
      {id:14,category:"地域・インフラ",emoji:"📡",text:"地域の防災情報（避難場所・避難経路）を把握していますか？",hint:"水害は事前の避難が命を守ります。避難場所・タイミングの把握が重要。",options:[{label:"把握・家族で共有済み",score:2},{label:"おおよそ知っている",score:1},{label:"把握していない",score:0}]},
      {id:15,category:"地域・インフラ",emoji:"🛡️",text:"自治会・町内会の防災活動に参加していますか？",hint:"地域のつながりは水害時の早期避難・助け合いに大きく役立ちます。",options:[{label:"積極的に参加している",score:2},{label:"時々参加する",score:1},{label:"ほぼ参加していない",score:0}]},
    ],
};

// ============================================================
// メインアプリ
// ============================================================
export default function App() {
  const config = CONFIG;
  const { questions, accent, accentDark, accentBg, accentBorder, grad, wrapBg, titleEmoji, title, subtitle, categoryList } = config;
  const TOTAL_MAX = questions.reduce((acc,q) => acc + Math.max(...q.options.map(o=>o.score)), 0);
  const CATEGORIES = [...new Set(questions.map(q=>q.category))];

  const [screen, setScreen] = useState("top");
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flash, setFlash] = useState(null);
  const [hint, setHint] = useState(false);

  const q = questions[cur];
  const totalScore = Object.values(answers).reduce((a,b)=>a+b, 0);
  const risk = config.getRisk(totalScore, TOTAL_MAX);

  function handleSelect(idx, score) {
    if (flash !== null) return;
    setFlash(idx);
    setTimeout(() => {
      const newAns = { ...answers, [q.id]: score };
      setAnswers(newAns);
      setFlash(null);
      setHint(false);
      if (cur + 1 < questions.length) setCur(cur + 1);
      else setScreen("result");
    }, 380);
  }

  function restart() { setScreen("top"); setCur(0); setAnswers({}); setFlash(null); setHint(false); window.scrollTo({top:0}); }

  const wrap = { minHeight:"100vh", background:wrapBg, fontFamily:"'M PLUS Rounded 1c',sans-serif", display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 16px 60px" };
  const card = { width:"100%", maxWidth:540, background:"#fff", borderRadius:24, border:`2.5px solid ${accentBorder}`, boxShadow:`4px 6px 0px ${accentBorder}`, padding:"28px 24px" };

  if (screen === "top") return (
    <div style={wrap}>
      <style>{FONTS}</style>
      <div style={{ width:"100%", maxWidth:540 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:52, marginBottom:8 }}>{titleEmoji}</div>
          <h1 style={{ fontFamily:"'Yomogi',cursive", fontSize:26, color:accent, lineHeight:1.4, marginBottom:4, whiteSpace:"pre-wrap" }}>{title}</h1>
          <div style={{ textAlign:"right", marginBottom:8 }}>
            <span style={{ fontSize:10, color:"#9ca3af", fontFamily:"'M PLUS Rounded 1c',sans-serif" }}>マンション管理士監修</span>
          </div>
          <p style={{ fontSize:14, color:"#9ca3af", lineHeight:1.7, whiteSpace:"pre-wrap" }}>{subtitle}</p>
        </div>
        <div style={card}>
          <button onClick={()=>setScreen("quiz")} style={{ width:"100%", padding:"16px", background:grad, color:"#fff", borderRadius:16, border:"none", fontSize:17, fontWeight:800, fontFamily:"'M PLUS Rounded 1c',sans-serif", boxShadow:`0 4px 0 ${accentDark}`, cursor:"pointer", marginBottom:20, display:"block" }}>🚀 診断スタート</button>
          <div style={{ background:accentBg, borderRadius:12, padding:"12px 14px", marginBottom:16, fontSize:13, color:accentDark, lineHeight:1.7 }}>💡 所要時間は約<b>5〜8分</b>。タップするだけで自動で次へ進みます！</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {categoryList.map(([em,lb,ct])=>(
              <div key={lb} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:accentBg, borderRadius:12, border:`1.5px dashed ${accentBorder}`, padding:"9px 14px" }}>
                <span style={{ fontSize:13, color:"#374151" }}>{em} {lb}</span>
                <span style={{ fontSize:12, color:accent, fontWeight:700 }}>{ct}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ textAlign:"center", fontSize:12, color:"#d1d5db", marginTop:20 }}>※ この診断は簡易的な目安です。正確な診断は専門家にご相談ください。</p>
      </div>
    </div>
  );

  if (screen === "quiz") return (
    <div style={wrap}>
      <style>{FONTS}</style>
      <ProgressBar cur={cur+1} total={questions.length} grad={grad} />
      <div style={card}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:accentBg, border:`2px dashed ${accentBorder}`, borderRadius:20, padding:"4px 14px", fontSize:13, color:accent, fontWeight:700, marginBottom:16 }}>{q.emoji} {q.category}</div>
        <p style={{ fontSize:17, fontWeight:700, color:"#1f2937", lineHeight:1.6, marginBottom:20 }}>Q{q.id}. {q.text}</p>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
          {q.options.map((opt,i)=>{ const isFlash=flash===i; return (
            <button key={i} onClick={()=>handleSelect(i,opt.score)} disabled={flash!==null}
              style={{ width:"100%", padding:"13px 16px", background:isFlash?accentBg:"#f9fafb", border:isFlash?`2.5px solid ${accent}`:"2px solid #e5e7eb", borderRadius:12, textAlign:"left", fontSize:14, color:isFlash?accent:"#374151", fontWeight:isFlash?700:400, fontFamily:"'M PLUS Rounded 1c',sans-serif", cursor:flash!==null?"default":"pointer", transition:"all 0.15s", display:"flex", alignItems:"center", gap:10, transform:isFlash?"scale(0.98)":"scale(1)" }}>
              <span style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, border:isFlash?`2.5px solid ${accent}`:"2px solid #d1d5db", background:isFlash?accent:"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {isFlash&&<span style={{ width:8, height:8, background:"#fff", borderRadius:"50%", display:"block" }}/>}
              </span>
              {opt.label}
            </button>
          );})}
        </div>
        <div>
          <button onClick={()=>setHint(!hint)} style={{ background:"none", border:"none", color:accent, fontSize:13, fontWeight:700, fontFamily:"'M PLUS Rounded 1c',sans-serif", cursor:"pointer" }}>{hint?"▲ ヒントを閉じる":"💡 ヒントを見る"}</button>
          {hint&&<div style={{ marginTop:8, background:accentBg, border:`1.5px dashed ${accentBorder}`, borderRadius:10, padding:"10px 12px", fontSize:13, color:accentDark, lineHeight:1.7 }}>{q.hint}</div>}
        </div>
      </div>
    </div>
  );

  // RESULT
  const getCatScore = (cat) => {
    const qs = questions.filter(q=>q.category===cat);
    const earned = qs.reduce((a,q)=>a+(answers[q.id]??0), 0);
    const max = qs.reduce((a,q)=>a+Math.max(...q.options.map(o=>o.score)), 0);
    return { earned, max, pct: max>0 ? Math.round((earned/max)*100) : 0 };
  };

  const weakPoints = questions
    .map(q => ({ q, score: answers[q.id]??0, max: Math.max(...q.options.map(o=>o.score)) }))
    .filter(item => item.score < item.max)
    .sort((a,b) => (a.score/a.max) - (b.score/b.max))
    .slice(0,3);

  const catRatios = {};
  questions.forEach(q => {
    const ans = answers[q.id] ?? 0;
    const max = Math.max(...q.options.map(o=>o.score));
    if (!catRatios[q.category]) catRatios[q.category] = { total:0, max:0 };
    catRatios[q.category].total += ans;
    catRatios[q.category].max += max;
  });
  const worstCat = Object.entries(catRatios)
    .map(([cat,v]) => ({ cat, ratio: v.max>0 ? v.total/v.max : 1 }))
    .sort((a,b) => a.ratio - b.ratio)[0]?.cat || "";
  const subType = getSubType(worstCat);

  const getCatComment = (cat, pct) => {
    if (!config.categoryComments) return null;
    const c = config.categoryComments[cat];
    if (!c) return null;
    if (pct >= 70) return c.high;
    if (pct >= 40) return c.middle;
    return c.low;
  };

  return (
    <div style={wrap}>
      <style>{FONTS}</style>
      <div style={{ width:"100%", maxWidth:540 }}>
        <div style={{ width:"100%", maxWidth:540, background:risk.bg, border:`2.5px solid ${risk.border}`, boxShadow:`4px 6px 0px ${risk.border}`, borderRadius:24, padding:"28px 24px", textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>{risk.emoji}</div>

          {/* サブ型（弱点の正体） */}
          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:13, color:"#6b7280", fontFamily:"'M PLUS Rounded 1c',sans-serif", marginBottom:4 }}>あなたの危機の正体</div>
            <div style={{ fontSize:32, fontWeight:900, fontFamily:"'Yomogi',cursive", lineHeight:1.1, color:risk.color }}>
              {subType.emoji} {subType.name}
            </div>
          </div>

          <div style={{ marginBottom:8 }}>
            <div style={{ fontSize:13, color:"#6b7280", fontFamily:"'M PLUS Rounded 1c',sans-serif", marginBottom:4 }}>診断ランク</div>
            <div style={{ display:"flex", alignItems:"baseline", justifyContent:"center", gap:8 }}>
              <div style={{ fontSize:44, fontWeight:900, color:risk.color, fontFamily:"'Yomogi',cursive", lineHeight:1 }}>{getLineType(totalScore, TOTAL_MAX)}</div>
              <div style={{ background:risk.color, color:"#fff", fontSize:13, fontWeight:800, fontFamily:"'M PLUS Rounded 1c',sans-serif", borderRadius:20, padding:"3px 12px" }}>{getPercentile(totalScore, TOTAL_MAX)}</div>
            </div>
          </div>

          <div style={{ background:"rgba(255,255,255,0.7)", borderRadius:16, padding:"10px 20px", marginBottom:10, display:"inline-block" }}>
            <div style={{ fontSize:11, color:"#6b7280", fontFamily:"'M PLUS Rounded 1c',sans-serif", marginBottom:2 }}>🏠 住まう年齢</div>
            <div style={{ fontSize:36, fontWeight:800, color:risk.color, fontFamily:"'Yomogi',cursive", lineHeight:1 }}>{calcSumaiAge(totalScore, TOTAL_MAX)}<span style={{ fontSize:18 }}>歳</span></div>
          </div>

          <div style={{ fontSize:18, fontWeight:800, color:risk.color, fontFamily:"'Yomogi',cursive", marginBottom:6 }}>{risk.label}</div>
          <div style={{ fontSize:13, color:"#6b7280", marginBottom:8, fontFamily:"'M PLUS Rounded 1c',sans-serif" }}>{totalScore} / {TOTAL_MAX}点</div>
          <p style={{ fontSize:14, color:"#374151", lineHeight:1.7 }}>{risk.desc}</p>
        </div>

        <LineBanner score={totalScore} totalMax={TOTAL_MAX} subType={subType} />

        {weakPoints.length > 0 && (
          <div style={{ ...card, marginBottom:20, border:"2.5px solid #fcd34d", boxShadow:"4px 6px 0px #fcd34d", background:"#fefce8" }}>
            <h3 style={{ fontFamily:"'Yomogi',cursive", fontSize:17, color:"#92400e", marginBottom:14 }}>⚠️ 優先確認事項</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {weakPoints.map((item,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, background:"#fff", borderRadius:12, padding:"10px 14px", border:"1.5px solid #fde68a" }}>
                  <span style={{ fontSize:15, fontWeight:800, color:"#d97706", minWidth:22, fontFamily:"'M PLUS Rounded 1c',sans-serif" }}>{"①②③"[i]}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#1f2937", fontFamily:"'M PLUS Rounded 1c',sans-serif" }}>{item.q.text}</div>
                    <div style={{ fontSize:11, color:"#9ca3af", marginTop:2, fontFamily:"'M PLUS Rounded 1c',sans-serif" }}>{item.q.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ ...card, marginBottom:20 }}>
          <h3 style={{ fontFamily:"'Yomogi',cursive", fontSize:18, color:accent, marginBottom:16 }}>📊 カテゴリ別の結果</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            {CATEGORIES.map(cat=>{
              const {earned,max,pct}=getCatScore(cat);
              const q0=questions.find(q=>q.category===cat);
              const comment=getCatComment(cat,pct);
              return (
                <div key={cat}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:13, color:"#374151", fontWeight:700 }}>{q0?.emoji} {cat}</span>
                    <span style={{ fontSize:13, color:"#6b7280" }}>{earned}/{max}点</span>
                  </div>
                  <ScoreBar pct={pct}/>
                  {comment && (
                    <div style={{ marginTop:8, fontSize:12, color: pct>=70?"#15803d":pct>=40?"#92400e":"#dc2626", background: pct>=70?"#f0fdf4":pct>=40?"#fefce8":"#fef2f2", borderRadius:8, padding:"7px 10px", lineHeight:1.6, fontFamily:"'M PLUS Rounded 1c',sans-serif" }}>
                      {pct>=70?"✅ ":pct>=40?"💡 ":"⚠️ "}{comment}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <DaikoCTA />
        <button onClick={restart} style={{ width:"100%", maxWidth:540, padding:"12px", background:"#fff", color:accent, borderRadius:14, border:`2px solid ${accentBorder}`, fontSize:14, fontWeight:700, fontFamily:"'M PLUS Rounded 1c',sans-serif", cursor:"pointer" }}>🔄 もう一度診断する</button>
      </div>
    </div>
  );
}
