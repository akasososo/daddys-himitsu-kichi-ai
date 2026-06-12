import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  Heart, 
  Flame, 
  Copy, 
  Check, 
  BookOpen, 
  Sparkles, 
  MapPin, 
  RotateCcw, 
  Compass, 
  Smile, 
  User, 
  Info,
  ChevronRight,
  ClipboardList,
  Coffee,
  Calendar,
  Layers,
  X,
  Mail,
  ArrowRight
} from 'lucide-react';
import OceanWaves from './components/OceanWaves';
import { Message, Story, DialogueCard } from './types';

// Real life stories based on the background of 島のパパ
const SHIMA_NO_PAPA_STORIES: Story[] = [
  {
    id: "story_1",
    title: "スマホを見ながら返事していた日々",
    short: "妻が一生懸命話しているのに、スマホ画面を見つめたまま「うん」「わかった」と返事をして、大切な人を孤独にしてしまった失敗。",
    content: "昔の私は、仕事から帰るといつもスマートフォンを手放せませんでした。妻が今日の子どもの様子や寂しかった出来事を話しかけてくれているのに、視線は液晶画面のまま。生返事ばかり。妻が『私の話、聞いてる？』と悲しそうな顔をした時も、『聞いてるよ』と逆ギレをしてしまいました。家族のために一生懸命に働いているつもりでしたが、妻が本当に欲しかったのはお金ではなく、ただ『今ここにいる私』だったのだと、後になって痛感しました。",
    date: "結婚4年目の大失敗",
    category: "コミュニケーション",
    prompt: "妻が話しているのにスマホを見ながら生返事をしてしまって、妻を孤独にさせていた時期の話を聴かせてください。"
  },
  {
    id: "story_2",
    title: "求めてもいないお説教と正論",
    short: "妻がただ愚痴を聴いてほしいだけなのに、「こうすればいいじゃないか」と冷たいアドバイスを言い続けて顔を凍りつかせた話。",
    content: "妻がつらそうに『ママ友の関係でちょっとしんどくて…』と漏らしたとき、私はすぐさま『それなら気にしないようにして距離を置けばいいじゃないか。そういう時はこう言うべきだよ』と解決策を偉そうに話し始めてしまいました。良かれと思ってのアドバイスのつもりでしたが、妻は『そういう解決策が聞きたいんじゃないの…』と口を閉ざして、部屋を出ていってしまいました。妻が求めていたのは、解決策ではなく『それはしんどかったね』という、ただ寄り添う共感だったのです。",
    date: "結婚6年目のすれ違い",
    category: "夫婦の会話",
    prompt: "良かれと思って「こうすればいい」とアドバイスをして妻を怒らせてしまった失敗談について教えてほしいです。"
  },
  {
    id: "story_3",
    title: "完璧主義の夫婦会議と、寝落ちの日々",
    short: "「夫婦会議を毎晩やろう！」と意気込んで失敗。毎晩ただ寝落ちする中で見つけた、ちょうどいい距離感。",
    content: "お互いの本音を話そうと『夫婦会議』をルールにして、毎晩話し合う時間を作りました。しかし、お互いに仕事と育児で限界まで疲れていました。毎晩話し合いの途中でどちらかが寝落ちしてしまい、『またルールを守れなかった』と自分を責めて落ち込む始末。ルールで縛る完璧主義は私たちには合わなかったのです。寝落ちしてもいい、たわいもない時間を少しだけ温かくつくる。それだけで、不完全な関係のままで十分に愛おしいと気づくことができました。",
    date: "結婚8年目の試行錯誤",
    category: "対話の工夫",
    prompt: "夫婦の話し合いを毎晩やろうとして、毎晩一緒に寝落ちして諦めた時の話が聴きたいです。"
  },
  {
    id: "story_4",
    title: "1年以上続く、夫婦の交換日記",
    short: "話すとケンカになるけれど、文字にすると届く本音。1つの言葉、1行だけでも重ね続けた温もり。",
    content: "言葉で話すと、どうしてもお互いに言い返してしまったり、余計な反論をしてしまったりしました。そこで、思い切ってノートを一冊用意して『交換日記』を始めてみたのです。毎日書かなくてもいい、忙しい日は『今日もありがとう。おやすみなさい』の1行だけでもいい。そんな風に緩やかに始めて、もう1年以上が経ちました。不思議なことに、話し合いでのケンカが激減したのです。口では言えなかった妻の『助けてほしい』という弱音や、私への『いつもありがとう』という温かい本音が、静かに、そしてしっかりと心に届くようになりました。",
    date: "現在まで続く奇跡",
    category: "夫婦の絆",
    prompt: "1年以上続けているという「交換日記」の具体的な効果や、どうやって始めたのかを教えてください。"
  },
  {
    id: "story_5",
    title: "胃がんステージ4宣告が変えた世界",
    short: "余命やがんという影の隣で目覚めた、失いたくない日常と「死ぬまで生きよう」の覚悟。",
    content: "アラフォーで胃がんステージ4の診断を受けたとき、頭の中が真っ白になりました。仕事の成功や将来の心配ばかりしていた手が、一瞬で空を掴んだような虚しさを感じました。しかし、病室で寄り添って涙を流し、何があっても私を守ると言って手を握ってくれた妻の存在に、心から救われたのです。その時、初めて『私の一番大切なものは、将来の成功やお金ではなく、今、この人と一緒に温かいご飯を食べて、子どもの成長を喜び笑い合う、この何気ない日常なのだ』と気づきました。だからこそ、私は消えていくのを待つのではなく、この愛おしい日々を精一杯、最後を笑顔で迎えるまで大切に生きようと心に決めました。",
    date: "人生の大きなターニングポイント",
    category: "生き方・がん宣告",
    prompt: "胃がんステージ4の宣告を受けて、目の前の大切なものに気づいた時の心境を教えてほしいです。"
  }
];

// Marriage Dialogue Cards
const DIALOGUE_CARDS: DialogueCard[] = [
  {
    id: "card_1",
    title: "対話カード No.12",
    challenge: "「今、隣にいる人は笑っていますか？」",
    advice: "スマホを裏返して、大切な人の表情をじっと眺めてみて。",
    sukeAdvice: "私は妻の怒った顔ばかり見ていたつもりでした。しかし、私がスマートフォンを見ているせいで、妻が笑うのをやめてしまっていたのですね。"
  },
  {
    id: "card_2",
    title: "対話カード No.04",
    challenge: "「今日、一番大変だった出来事は何だった？」",
    advice: "アドバイスは絶対に挟まない。『そうか、そんなことがあったんだね』とただ最後までうなずいて。",
    sukeAdvice: "『そんなの上司に言えばいいじゃないか』などと解決策を言う必要はありません。ただ『それは大変だったね、お疲れ様』。それだけで本当に十分なのです。"
  },
  {
    id: "card_3",
    title: "対話カード No.08",
    challenge: "「最近、お互いに言えずに我慢していることはない？」",
    advice: "お互いに怒らず、まずは『教えてくれてありがとう』と受け止めるゲームをしてみよう。",
    sukeAdvice: "我慢がついにコップから溢れると、感情の大爆発になってしまいます。少したまりかけた段階で『最近、困っていることはない？』と優しく聞いてみる勇気が大切です。"
  },
  {
    id: "card_4",
    title: "対話カード No.15",
    challenge: "「私たち夫婦の時間で、一番幸せに感じる瞬間はいつ？」",
    advice: "昔の思い出や、二人でいるいつもの何気ない穏やかな瞬間に目を向けてみて。",
    sukeAdvice: "宮古島で夕暮れの海を二人で黙って眺めていたとき、『何もないけれど、これ以上ないほど完璧だな』と感じました。そんな穏やかな時間の思い出を、ぜひ話してみてください。"
  }
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "おかえりなさい。今日も家族のために、自分の心のために、精一杯の奮闘、本当にお疲れ様です。\n\nここは答えを出す場所ではなく、あなたが肩の荷を静かに下ろすための「秘密基地」です。\n\n「なんだか最近妻とうまくいかない」「頑張っているのに味方が誰もいない気がする」「ついイライラして余計なことを言っちゃう」…どんな不器用な悩みでも構いません。\n\n私も胃がんになるまで、たくさんの失敗を積み重ねて、妻を何度も傷つけてしまいました。あなたの苦しさ、よかったらここで ぽつりぽつりとお話ししてみてくださいね。一緒に優しい風に当たりながら考えていきましょう。\n\n[対話カード：No.12 「今、隣にいる人は笑っていますか？」]\n\nもっと深く話したいパパは、👉 DADDY’S秘密基地ダイアローグへ",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhrase, setLoadingPhrase] = useState('宮古島の風を感じながら、島のパパが考えています...');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [secretBaseModalOpen, setSecretBaseModalOpen] = useState(false);
  
  // Letter simulation in Secret Base Modal
  const [letterName, setLetterName] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [letterSent, setLetterSent] = useState(false);

  // Copied indicator state for dialogue cards
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Rotate loading phrase for warmth
  useEffect(() => {
    if (!isLoading) return;
    const phrases = [
      '宮古島のさとうきび畑に吹く風を感じながら、島のパパが考えています...',
      '私もかつて通った道だな…と、島のパパがあなたの心を受け止めています...',
      '答えを急がずに、宮古島の青い空を思い浮かべながら、ちょっとお待ちくださいね...',
      '答えが見つかる場所じゃなくても、一人で抱えなくていいように…言葉を紡いでいます...'
    ];
    let idx = 0;
    const timer = setInterval(() => {
      idx = (idx + 1) % phrases.length;
      setLoadingPhrase(phrases[idx]);
    }, 4500);
    return () => clearInterval(timer);
  }, [isLoading]);

  // Handle message sending
  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Create lightweight chat history for /api/chat
      const historyPayload = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        text: msg.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload
        })
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setMessages(prev => [...prev, {
          id: `model_${Date.now()}`,
          role: 'model',
          text: data.text,
          timestamp: new Date()
        }]);
      } else {
        throw new Error(data.error || 'レスポンスが取得できませんでした。');
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `err_${Date.now()}`,
        role: 'model',
        text: `申し訳ありません。秘密基地との通信が繋がりにくくなっているようです。\n\n【お知らせ】AI Studioの Secrets パネル（右上の歯車アイコン > Secrets）で \`GEMINI_API_KEY\` が正しく設定されているか確認してみてくださいね。\n\nそれでも難しいときは、いつでも私の失敗談（右パネルの『「島のパパ」の実体験日誌』）を読んで、ゆっくり心を落ち着けてみてください。`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  // Copy helper
  const handleCopyText = (text: string, cardId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCardId(cardId);
    setTimeout(() => {
      setCopiedCardId(null);
    }, 2000);
  };

  // Simulate writing a letter
  const handleSendLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterContent.trim()) return;
    setLetterSent(true);
    setTimeout(() => {
      setLetterName('');
      setLetterContent('');
    }, 4000);
  };

  // Render welcome or customized message parses custom [対話カード] or [👉 Daddys秘密基地へ]
  const renderFormattedMessage = (msg: Message) => {
    const text = msg.text;
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      if (line.includes('[対話カード') || line.includes('[たいわカード')) {
        const cardTitle = line.replace(/[\[\]]/g, '');
        elements.push(
          <div key={`card_block_${index}`} className="my-4 bg-[#F8F6F2] rounded-2xl p-5 border border-dashed border-[#CBC4B9] shadow-inner font-serif transition-all duration-300 hover:border-[#5A5A40]/40">
            <div className="flex items-center gap-2 mb-2 text-[#5A5A40]">
              <Flame className="h-4 w-4 candle-flicker text-amber-500" />
              <span className="text-[10px] uppercase tracking-widest font-bold">秘密基地の対話カード</span>
            </div>
            <p className="text-base font-medium italic text-[#4A443F] leading-relaxed">{cardTitle}</p>
            <p className="text-xs text-[#9A948C] mt-2">※今日の夜、奥さんの表情をじっと見つめながら聞いてみてくださいね。</p>
          </div>
        );
        return;
      }

      if (line.includes('👉 Daddys秘密基地へ') || line.includes('👉 Daddys秘密基地') || line.includes('Daddys秘密基地へ') || line.includes('👉 DADDY’S秘密基地ダイアローグへ') || line.includes('👉 DADDY’S秘密基地') || line.includes('DADDY’S秘密基地ダイアローグへ')) {
        elements.push(
          <div key={`cta_block_${index}`} className="my-4 p-3 bg-[#EAE6DF] rounded-2xl border border-[#E5E2D9] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[10px] text-[#9A948C] tracking-widest block uppercase font-sans">Vulnerability Invitation</span>
              <p className="text-xs font-semibold text-[#4A443F] font-serif">一人で抱え込まずに、秘密基地の仲間として深く話してみませんか？</p>
            </div>
            <button
              onClick={() => setSecretBaseModalOpen(true)}
              className="w-full sm:w-auto bg-[#4A443F] hover:bg-[#5A5A40] text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 transition-all duration-300 transform active:scale-95 shadow-sm"
            >
              <span>秘密基地の扉を開く</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        );
        return;
      }

      if (line.trim() !== '') {
        elements.push(
          <p key={`p_${index}`} className="leading-relaxed mb-3 font-serif">
            {line}
          </p>
        );
      } else {
        elements.push(<div key={`space_${index}`} className="h-2" />);
      }
    });

    return elements;
  };

  return (
    <div id="daddys-base-root" className="min-h-screen bg-[#F8F6F2] text-[#4A443F] flex flex-col font-sans transition-all duration-500 select-text overflow-x-hidden">
      
      {/* HEADER SECTION */}
      <header id="main-header" className="border-b border-[#E5E2D9] py-5 px-4 sm:px-8 bg-[#F8F6F2]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-2 md:w-3 h-6 bg-[#5A5A40] rounded-sm"></div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#5A5A40] font-serif flex items-center gap-2">
                DADDY’S秘密基地ダイアローグ
                <span className="text-xs bg-[#5A5A40]/10 text-[#5A5A40] px-2 py-0.5 rounded-full font-sans tracking-normal font-normal">パパ専用</span>
              </h1>
            </div>
            <p className="text-[10px] md:text-xs uppercase tracking-widest text-[#9A948C] mt-1 font-sans font-medium">
              Powered by 島のパパ in Miyako Island • 「パパが変われば、家族が変わる」
            </p>
          </div>
          
          {/* Wave Sound Synthesizer & Candlelights */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <OceanWaves />
          </div>
        </div>
      </header>

      {/* CORE CONTENT LAYOUT */}
      <main id="core-grid" className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 sm:px-8 py-6 md:py-8">
        
        {/* LEFT COLUMN: CHAT ZONE (col-span-8) */}
        <section id="chat-column" className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Welcome Banner */}
          <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 shadow-sm border border-[#E5E2D9] flex flex-col sm:flex-row items-center sm:items-start gap-4 transition-transform hover:shadow-md duration-300">
            <div className="w-12 h-12 rounded-full bg-[#5A5A40] flex-shrink-0 flex items-center justify-center text-white text-[11px] font-sans font-bold shadow-sm px-1 text-center leading-tight">
              島のパパ
            </div>
            <div className="flex-1 text-center sm:text-left">
              <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-700 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider mb-2">
                <Compass className="h-3 w-3" />
                宮古島から、静かに寄り添う
              </span>
              <h2 className="text-lg font-bold font-serif text-[#4A443F] mb-1.5">おかえりなさい。一人で抱え込んでいませんか？</h2>
              <p className="text-sm text-[#7A746C] leading-relaxed font-serif">
                仕事、育児、男としての責任…本当によく頑張っていらっしゃいますね。でも、妻との会話ですれ違ったり、寂しさを誰にも吐けなかったりすること、ありますよね。
                私もかつて、たくさんの大きな失敗をして妻を悲しませてきました。ここは、あなたの「秘密基地」です。失敗してしまったお話、いびつな心のつぶやき、何でも聞かせてくださいね。
              </p>
            </div>
          </div>

          {/* CHAT INTERACTIVE WINDOW */}
          <div className="bg-white rounded-[24px] sm:rounded-[32px] border border-[#E5E2D9] shadow-sm flex flex-col h-[520px] overflow-hidden">
            
            {/* Thread Header */}
            <div className="bg-[#F8F6F2]/60 px-6 py-4 border-b border-[#E5E2D9] flex items-center justify-between text-xs text-[#7A746C] select-none">
              <span className="flex items-center gap-1.5 font-medium">
                <MessageCircle className="h-4 w-4 text-[#5A5A40]" />
                対話スレッド：島のパパとぽつりぽつりと話す
              </span>
              <span className="text-[10px] tracking-wide text-slate-400">宮古島時間 心地よい風</span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#FAF9F6]">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  id={`msg-${msg.id}`}
                  className={`flex items-start gap-3 sm:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold font-sans ${
                    msg.role === 'user' 
                      ? 'bg-[#EAE6DF] text-[#4A443F] border border-[#CBC4B9]' 
                      : 'bg-[#5A5A40] text-white shadow-sm px-1 text-center leading-tight'
                  }`}>
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : '島のパパ'}
                  </div>

                  {/* Bubble Container */}
                  <div className="flex flex-col max-w-[82%] sm:max-w-[75%]">
                    {/* Timestamp */}
                    <span className={`text-[9px] text-[#9A948C] mb-1 block ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* Bubble Content */}
                    <div className={`rounded-3xl p-4 sm:p-5 border text-sm sm:text-[15px] shadow-sm transition-all duration-300 ${
                      msg.role === 'user'
                        ? 'bg-[#EAE6DF]/60 text-[#4A443F] border-[#E5E2D9] rounded-tr-none'
                        : 'bg-white text-[#4A443F] border-[#E5E2D9] rounded-tl-none font-serif'
                    }`}>
                      {msg.role === 'user' ? (
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        renderFormattedMessage(msg)
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loader */}
              {isLoading && (
                <div className="flex items-start gap-3 sm:gap-4 animate-pulse">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#5A5A40]/50 text-white flex items-center justify-center text-[10px] font-bold font-sans px-1 text-center leading-tight">
                    島のパパ
                  </div>
                  <div className="flex flex-col max-w-[75%] bg-white rounded-3xl rounded-tl-none p-4 sm:p-5 border border-[#E5E2D9] shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-[#7A746C] font-serif">
                      <Flame className="h-4 w-4 text-amber-500 animate-bounce" />
                      <span>{loadingPhrase}</span>
                    </div>
                    <div className="flex space-x-1.5 mt-3 pl-1">
                      <div className="w-2 h-2 bg-[#5A5A40]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[#5A5A40]/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[#5A5A40]/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Topic Chips */}
            <div className="px-4 py-2 bg-[#F8F6F2]/30 border-t border-[#E5E2D9] overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
              <span className="text-[10px] font-bold text-[#9A948C] py-1 self-center mr-1 tracking-wider uppercase font-sans">試してみる:</span>
              <button
                onClick={() => sendMessage('妻と会話がすれ違ってばかりで、何を話してもケンカのようになってしまいます。')}
                className="bg-white hover:bg-[#EAE6DF] border border-[#E5E2D9] hover:border-[#CBC4B9] text-[#4A443F] px-3 py-1 rounded-full text-xs font-serif transition-all duration-300 cursor-pointer shadow-sm shrink-0"
              >
                💬 妻とのすれ違い
              </button>
              <button
                onClick={() => sendMessage('仕事が忙しく、家庭に気が回りません。ついつい妻の言葉にスマートフォンを見ながら生返事してしまいます。')}
                className="bg-white hover:bg-[#EAE6DF] border border-[#E5E2D9] hover:border-[#CBC4B9] text-[#4A443F] px-3 py-1 rounded-full text-xs font-serif transition-all duration-300 cursor-pointer shadow-sm shrink-0"
              >
                📱 スマホを見て生返事
              </button>
              <button
                onClick={() => sendMessage('良かれと思って提案したアドバイスで妻を怒らせてしまいました。どうすればよかったでしょうか。')}
                className="bg-white hover:bg-[#EAE6DF] border border-[#E5E2D9] hover:border-[#CBC4B9] text-[#4A443F] px-3 py-1 rounded-full text-xs font-serif transition-all duration-300 cursor-pointer shadow-sm shrink-0"
              >
                💡 不要なお説教グセ
              </button>
              <button
                onClick={() => sendMessage('夫婦の交換日記は、どのようなやり方がおすすめですか？始めるのに照れくささもあります。')}
                className="bg-white hover:bg-[#EAE6DF] border border-[#E5E2D9] hover:border-[#CBC4B9] text-[#4A443F] px-3 py-1 rounded-full text-xs font-serif transition-all duration-300 cursor-pointer shadow-sm shrink-0"
              >
                📔 交換日記を始めたい
              </button>
            </div>

            {/* Input Form Box */}
            <form onSubmit={handleFormSubmit} className="p-4 bg-white border-t border-[#E5E2D9] relative flex items-center">
              <input
                id="chat-user-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                placeholder="今のやりきれない気持ち、誰にも言えない弱音、何でもここに置いてみてくださいね。"
                className="w-full bg-[#F8F6F2] hover:bg-white border border-[#E5E2D9] focus:border-[#5A5A40] rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/10 font-serif italic text-base text-[#4A443F] transition-all duration-300 disabled:opacity-70"
              />
              <button
                id="chat-send-btn"
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#5A5A40] text-white rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#4A443F] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-sm hover:shadow active:scale-95"
                title="送信"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          <p className="text-center text-[11px] text-[#9A948C] font-serif leading-relaxed">
            宮古島の波音を流しながら、心の凝り固まったものを溶かしながら、ゆっくりと。
          </p>
        </section>

        {/* RIGHT COLUMN: BRAND DIARIES & DIALOGUE CARDS (col-span-4) */}
        <section id="sidebar-column" className="lg:col-span-4 flex flex-col gap-6">
          
          {/* BRAND PROFILE BEAUTIFUL CARD */}
          <div className="relative bg-[#5A5A40] rounded-[32px] sm:rounded-[40px] p-6 text-white overflow-hidden shadow-md flex flex-col justify-between aspect-[4/3] sm:aspect-auto sm:min-h-[220px] transition-all hover:shadow-lg duration-300">
            {/* Ambient subtle light layers */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full filter blur-md -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full filter blur-sm"></div>
            
            <div className="relative z-10">
              <span className="text-[9px] uppercase tracking-widest text-[#E5E2D9] font-semibold bg-white/10 px-2.5 py-0.5 rounded-full font-sans">Base Creator</span>
              <h3 className="text-2xl font-serif font-bold mt-2">島のパパ</h3>
              <p className="text-[11px] text-[#E5E2D9] mt-0.5 font-serif italic">宮古島在住 胃がんサバイバーパパ</p>
            </div>

            <div className="relative z-10 mt-4">
              <p className="text-[11px] sm:text-xs leading-relaxed text-[#F0EEE8] font-serif">
                15年間の結婚生活で数々の失敗を重ねてきました。アラフォーで胃がんステージ4の宣告を受け、「死ぬまで生きよう」を合言葉に妻と手を取り合っています。
                パパが変われば、家族が変わる。一人で抱えなくていい場所を、この島で守り続けています。
              </p>
            </div>
          </div>

          {/* FAILURE JOURNALS (Interactive stories) */}
          <div className="bg-white rounded-[24px] border border-[#E5E2D9] p-5 shadow-sm">
            <h4 className="text-sm font-bold tracking-wider text-[#5A5A40] uppercase mb-3 flex items-center gap-2 border-b border-[#F0EEE8] pb-2 font-sans">
              <BookOpen className="h-4 w-4" />
              「島のパパ」の実体験日誌（失敗と教訓）
            </h4>
            <p className="text-[11px] text-[#9A948C] mb-4 font-serif">
              私がかつて通ってきた、痛い失敗の記録です。クリックすると、お互いの知恵として「島のパパ」と対話することができますよ。
            </p>

            <div className="space-y-3">
              {SHIMA_NO_PAPA_STORIES.map((story) => (
                <div 
                  key={story.id}
                  onClick={() => {
                    setSelectedStory(story);
                    setStoryModalOpen(true);
                  }}
                  className="group border border-[#E5E2D9] hover:border-[#5A5A40]/40 rounded-xl p-3 bg-[#F8F6F2]/40 hover:bg-[#F8F6F2]/80 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[10px] text-[#5A5A40] font-sans font-bold uppercase tracking-wider">{story.category}</span>
                    <span className="text-[9px] text-[#9A948C]">{story.date}</span>
                  </div>
                  <h5 className="text-xs sm:text-sm font-bold text-[#4A443F] mt-1 group-hover:text-[#5A5A40] transition-colors duration-300 font-serif">
                    {story.title}
                  </h5>
                  <p className="text-[11px] text-[#7A746C] mt-1 font-serif line-clamp-2">
                    {story.short}
                  </p>
                  <div className="mt-2 flex items-center justify-end text-[10px] text-[#5A5A40] font-bold group-hover:translate-x-1 transition-transform duration-300 gap-0.5 font-sans">
                    <span>深く読む & 対話する</span>
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DIALOGUE CARDS TO COPE */}
          <div className="bg-white rounded-[24px] border border-[#E5E2D9] p-5 shadow-sm">
            <h4 className="text-sm font-bold tracking-wider text-[#5A5A40] uppercase mb-2 flex items-center gap-2 border-b border-[#F0EEE8] pb-2 font-sans">
              <ClipboardList className="h-4 w-4" />
              お守り「対話カード」ライブラリ
            </h4>
            <p className="text-[11px] text-[#9A948C] mb-4 font-serif">
              今日から、今すぐ奥さんに問いかけることができる「魔法のお守り」です。
            </p>

            <div className="grid grid-cols-1 gap-3">
              {DIALOGUE_CARDS.map((card) => (
                <div 
                  key={card.id}
                  className="bg-[#F8F6F2] rounded-xl p-3 border border-[#CBC4B9] border-dashed flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center justify-between text-[9px] text-[#9A948C] uppercase font-bold tracking-wider font-sans">
                      <span>{card.title}</span>
                      <span className="text-[#5A5A40] font-serif italic">夫婦をつなぐ言葉</span>
                    </div>
                    <p className="text-xs font-bold font-serif text-[#4A443F] mt-1.5 italic leading-relaxed">
                      {card.challenge}
                    </p>
                    <p className="text-[10px] text-[#7A746C] mt-1 leading-relaxed">
                      💡 {card.advice}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E2D9]/70 font-sans">
                    <button
                      onClick={() => handleCopyText(card.challenge, card.id)}
                      className="text-[9px] text-[#5A5A40] hover:text-[#4A443F] font-bold flex items-center gap-1 cursor-pointer"
                      title="質問をコピー"
                    >
                      {copiedCardId === card.id ? (
                        <>
                          <Check className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">コピーしました！</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>問いかけをコピー</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        setInputValue(`「${card.challenge}」について、妻と上手に向き合いたいのですが、どうやって切り出したらいいでしょうか？`);
                        document.getElementById('chat-user-input')?.focus();
                      }}
                      className="text-[9px] bg-white hover:bg-[#EAE6DF] border border-[#E5E2D9] px-2 py-0.5 rounded-full font-bold text-[#4A443F] shrink-0"
                    >
                      相談を相談する
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DADDYS SECRET BASE CTA CARD */}
          <div className="bg-[#EAE6DF] rounded-[24px] p-5 shadow-sm border border-[#E5E2D9] text-center flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-widest text-[#5A5A40] font-sans font-bold">Base Invitation</span>
            <p className="text-sm italic font-serif text-[#4A443F] leading-relaxed">
              「もっと深く話したいパパは」
            </p>
            <button 
              onClick={() => {
                setSecretBaseModalOpen(true);
              }}
              className="bg-[#4A443F] hover:bg-[#5A5A40] text-white px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 transform active:scale-95 shadow-md font-sans"
            >
              👉 DADDY’S秘密基地ダイアローグの扉を開く
            </button>
            <p className="text-[10px] text-[#7A746C] mt-1 font-serif leading-relaxed">
              一人で抱えなくていい。DADDY’S秘密基地ダイアローグは、そのためにあります。
            </p>
          </div>

        </section>

      </main>

      {/* FOOTER SECTION */}
      <footer id="main-footer" className="mt-12 px-4 sm:px-8 py-6 text-[10px] text-[#9A948C] flex flex-col md:flex-row justify-between items-center gap-4 border-t border-[#E5E2D9] max-w-7xl w-full mx-auto font-sans">
        <span>© 2026 DADDY’S秘密基地ダイアローグ — 島のパパ in Miyako Island. All rights reserved.</span>
        <span className="tracking-[0.15em] font-serif italic text-center md:text-right">
          答えが見つかる場所ではありません。でも、一人で抱えなくていい場所です。
        </span>
      </footer>


      {/* ================= MODAL DIALOGS ================= */}
      
      {/* 1. Failure Story Detail Modal */}
      {storyModalOpen && selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#4A443F]/60 backdrop-blur-sm" onClick={() => setStoryModalOpen(false)}></div>
          
          {/* Modal box */}
          <div className="relative bg-white rounded-[24px] border border-[#E5E2D9] max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl z-10 animate-fade-in font-serif">
            <button 
              onClick={() => setStoryModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-[#7A746C] cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <span className="text-[10px] inline-block bg-[#5A5A40]/10 tracking-widest text-[#5A5A40] uppercase font-bold font-sans px-3 py-1 rounded-full">
              実体験日記 — {selectedStory.category}
            </span>

            <h3 className="text-xl sm:text-2xl font-bold text-[#4A443F] mt-3 tracking-snug mb-1">
              {selectedStory.title}
            </h3>
            <span className="text-xs text-[#9A948C] italic block mb-4">{selectedStory.date}</span>

            <div className="h-px bg-[#F0EEE8] w-full mb-4"></div>

            <p className="text-sm sm:text-base text-[#4A443F] leading-relaxed mb-6 font-serif whitespace-pre-wrap animate-fade-in">
              {selectedStory.content}
            </p>

            <div className="bg-[#F8F6F2] rounded-xl p-4 border border-[#CBC4B9] border-dashed mb-5">
              <span className="text-[9px] text-[#9A948C] font-bold block uppercase tracking-wider mb-1 font-sans">
                このお話からパパが学べること
              </span>
              <p className="text-xs text-[#5A5A40] leading-relaxed">
                正論でお説教するのをやめて、ただ「大変だったね」とうなずいて寄り添うだけで、十分に妻を愛で満たせます。ルールで縛る計画よりも、毎晩クタクタになりながら一緒に寝落ちする時間こそが愛おしい関係をつくります。
                完璧な夫になろうと力まず、ノートに感謝を綴る小さな「交換日記」を1行始めるだけで、すれ違いはいつでも温かな愛へと戻っていくのです。
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-4 font-sans">
              <button
                onClick={() => {
                  setInputValue(selectedStory.prompt);
                  setStoryModalOpen(false);
                  document.getElementById('chat-user-input')?.focus();
                  sendMessage(selectedStory.prompt);
                }}
                className="w-full bg-[#5A5A40] text-white hover:bg-[#4A443F] px-5 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="h-4 w-4" />
                <span>このお話について「島のパパ」と対話する</span>
              </button>
              
              <button
                onClick={() => setStoryModalOpen(false)}
                className="w-full bg-white text-[#7A746C] hover:bg-slate-50 border border-[#E5E2D9] px-5 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Daddys秘密基地 Portal Modal */}
      {secretBaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#4A443F]/60 backdrop-blur-sm" onClick={() => setSecretBaseModalOpen(false)}></div>
          
          {/* Modal box */}
          <div className="relative bg-[#F8F6F2] rounded-[32px] border border-[#CBC4B9] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl z-10 animate-fade-in font-serif">
            <button 
              onClick={() => setSecretBaseModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-200/50 text-[#7A746C] cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Profile banner inside */}
            <div className="flex flex-col items-center text-center pb-6 border-b border-[#CBC4B9]/50">
              <div className="w-16 h-16 rounded-full bg-[#5A5A40] flex items-center justify-center text-white text-[11px] font-bold border-4 border-white shadow-md mb-3 font-sans px-1 text-center leading-tight">
                島のパパ
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#4A443F]">DADDY’S秘密基地ダイアローグへ、ようこそ。</h3>
              <p className="text-xs uppercase tracking-widest text-[#5A5A40] mt-1 font-sans font-bold">
                Miyako Island private space for fathers
              </p>
              <p className="text-xs text-[#7A746C] mt-2 max-w-md font-serif italic">
                「ここは、立派な良いパパになろうと肩肘を張る場所ではありません。
                いびつな心のまま、ありのままで語り合い、一人で抱えなくていい場所です。」
              </p>
            </div>

            {/* Core secret base pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              
              {/* Pillar 1: Exchange Diary secret booklet */}
              <div className="bg-white rounded-[20px] p-5 border border-[#E5E2D9] flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-amber-600">
                  <Flame className="h-4 w-4 candle-flicker" />
                  <span className="text-[10px] font-bold tracking-wider uppercase font-sans">Pillar 01 — 1行交換日記</span>
                </div>
                <h4 className="text-sm font-semibold text-[#4A443F] font-serif">夫婦を繋ぐ「言葉の温もり」</h4>
                <p className="text-[11px] text-[#7A746C] leading-relaxed">
                  口から出るとついつい言い返す言葉も、一冊のノートを通せばトゲが消えて優しさに変わります。毎晩たわいなく寝落ちしてもいい、今日気づいた相手の「温もりの事実」をそっと残す、「島のパパ」の実体験に基づいた心のバトンです。
                </p>
                <div className="mt-2 bg-[#F8F6F2] p-2.5 rounded-lg border border-[#CBC4B9]/60 text-[10px] italic">
                  📝 コツ: 要望や反論は書かず、感謝と事実だけを1行認める。
                </div>
              </div>

              {/* Pillar 2: Dialogue Gathering online */}
              <div className="bg-white rounded-[20px] p-5 border border-[#E5E2D9] flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-[#5A5A40]">
                  <Calendar className="h-4 w-4" />
                  <span className="text-[10px] font-bold tracking-wider uppercase font-sans">Pillar 02 — 月一パパ秘密対話会</span>
                </div>
                <h4 className="text-sm font-semibold text-[#4A443F] font-serif">オンライン「お疲れさま」広場</h4>
                <p className="text-[11px] text-[#7A746C] leading-relaxed">
                  毎月第一土曜日の夜、同じように仕事や家庭の狭間で悩む全国のパパたちが、宮古島の海に吹く風のように穏やかにオンラインで集まり、夫婦関係や子育ての寂しさをありのまま静かに話し合います。
                </p>
                <div className="mt-2 bg-[#F8F6F2] p-2.5 rounded-lg border border-[#CBC4B9]/60 text-[10px] italic font-sans animate-pulse">
                  🌾 次回: 宮古島からのオンライン対話会（無料・完全匿名参加可）
                </div>
              </div>

            </div>

            {/* Simulated Mailbox */}
            <div className="bg-white rounded-[24px] p-5 border border-[#E5E2D9] mb-6">
              <h4 className="text-sm font-bold text-[#4A443F] mb-1.5 flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-[#5A5A40]" />
                「島のパパ」への直通こっそりポスト
              </h4>
              <p className="text-[11px] text-[#7A746C] mb-3 leading-relaxed">
                人には言えない悩みの葛藤、ついつい力んでしまうプレッシャー、私への温かいメッセージなど、何でもこちらからそっと投函してください。手紙のように大切にお預かりいたします。
              </p>

              {letterSent ? (
                <div className="p-6 bg-[#F8F6F2] rounded-xl border border-dashed border-[#CBC4B9] text-center flex flex-col items-center gap-2 animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-[#5A5A40] text-white flex items-center justify-center text-sm font-bold animate-pulse">
                    ✓
                  </div>
                  <h5 className="text-sm font-bold text-[#4A443F] font-serif">手紙を大切にお預かりいたしました。</h5>
                  <p className="text-xs text-[#7A746C]">
                    宮古島の心地良い風に乗せて、島のパパに大切に届けます。一人で抱え込んでくれたあなたの勇気に、心からの敬意を。
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendLetter} className="space-y-3 font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={letterName}
                      onChange={(e) => setLetterName(e.target.value)}
                      placeholder="お名前（匿名・ニックネームで構いません）"
                      className="w-full bg-[#F8F6F2] border border-[#E5E2D9] focus:border-[#5A5A40] rounded-xl p-2.5 text-xs focus:outline-none"
                    />
                    <div className="text-[10px] text-[#9A948C] self-center">
                      ※ メールアドレスや住所の入力は一切不要です。
                    </div>
                  </div>
                  <textarea
                    value={letterContent}
                    onChange={(e) => setLetterContent(e.target.value)}
                    rows={3}
                    required
                    placeholder="夫婦のすれ違い、父親として抱えているやるせなさ、今の孤独な本音をありのままに語ってみてください。"
                    className="w-full bg-[#F8F6F2] border border-[#E5E2D9] focus:border-[#5A5A40] rounded-xl p-3 text-xs focus:outline-none placeholder:italic"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#4A443F] hover:bg-[#5A5A40] text-white text-[11px] font-bold px-4 py-2.5 rounded-full tracking-widest uppercase transition-all"
                    >
                      手紙を投函する
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Exit control */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-[#CBC4B9]/50 text-xs text-[#7A746C] font-sans">
              <span>一人で抱えなくていい。秘密基地は、そのためにあります。</span>
              <button
                onClick={() => setSecretBaseModalOpen(false)}
                className="w-full sm:w-auto bg-[#4A443F] text-white hover:bg-[#5A5A40] px-6 py-2.5 rounded-full font-bold uppercase transition-all duration-300"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
