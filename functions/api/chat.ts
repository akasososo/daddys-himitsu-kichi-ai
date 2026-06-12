import { SUKE_SYSTEM_PROMPT } from '../../server/prompt';

interface Env {
  GEMINI_API_KEY: string;
}

interface ChatMessage {
  role: string;
  text: string;
}

const SHEET_ID = '1f2ijK-nvkLWbWeIS6hu7HhFifUCKwnsJm7TwUaTY4YY';

async function fetchSheet(gid: string): Promise<string> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  const res = await fetch(url);
  if (!res.ok) return '';
  return res.text();
}

function findRelevantQA(csv: string, question: string): string {
  const lines = csv.split('\n').slice(1);
  const q = question.toLowerCase();
  const matched: string[] = [];

  for (const line of lines) {
    const cols = line.split(',');
    const questionCol = (cols[0] || '').replace(/"/g, '').toLowerCase();
    const answerCol = (cols[1] || '').replace(/"/g, '');
    if (!questionCol || !answerCol) continue;

    // 質問との関連度チェック（共通ワードで簡易マッチ）
    const words = q.split(/[\s　、。？！]+/).filter(w => w.length > 1);
    const hit = words.some(w => questionCol.includes(w));
    if (hit) {
      matched.push(`Q: ${cols[0].replace(/"/g, '')}\nA: ${answerCol}`);
    }
    if (matched.length >= 3) break;
  }
  return matched.join('\n\n');
}

function getRandomCard(csv: string): string {
  const lines = csv.split('\n').slice(1).filter(l => l.trim());
  if (!lines.length) return '';
  const line = lines[Math.floor(Math.random() * lines.length)];
  const cols = line.split(',');
  return (cols[0] || '').replace(/"/g, '').trim();
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const { message, history } = await context.request.json<{
      message: string;
      history: ChatMessage[];
    }>();

    if (!message || typeof message !== 'string') {
      return Response.json(
        { error: 'メッセージが指定されていません' },
        { status: 400, headers: corsHeaders }
      );
    }

    const apiKey = context.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'APIキーが設定されていません' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Google Sheetから並列取得
    const [qaCsv, cardCsv] = await Promise.all([
      fetchSheet('0'),
      fetchSheet('1625115856'),
    ]);

    // 関連Q&Aを検索
    const relevantQA = findRelevantQA(qaCsv, message);

    // ランダム対話カードを取得
    const dialogueCard = getRandomCard(cardCsv);

    // プロンプトにSheetデータを追加
    const enrichedPrompt = `${SUKE_SYSTEM_PROMPT}

---
【参考：関連するQ&Aデータ】
${relevantQA || '（該当なし）'}

【今日の対話カード候補】
${dialogueCard || '最近、相手の頑張りを感じた瞬間は？'}
---`;

    // 会話履歴を整形
    const formattedHistory = (history || []).map((h: ChatMessage) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    }));

    // Gemini API呼び出し
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: enrichedPrompt }],
          },
          contents: [
            ...formattedHistory,
            { role: 'user', parts: [{ text: message }] },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const data = await response.json<any>();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text) {
      throw new Error('Geminiからの応答が空でした');
    }

    return Response.json({ text }, { headers: corsHeaders });

  } catch (error: any) {
    console.error('Error:', error);
    return Response.json(
      { error: 'エラーが発生しました。しばらく経ってからもう一度お試しください。' },
      { status: 500, headers: corsHeaders }
    );
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

