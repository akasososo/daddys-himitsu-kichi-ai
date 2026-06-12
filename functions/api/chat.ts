import { SUKE_SYSTEM_PROMPT } from '../../server/prompt';

interface Env {
  GEMINI_API_KEY: string;
}

interface ChatMessage {
  role: string;
  text: string;
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
            parts: [{ text: SUKE_SYSTEM_PROMPT }],
          },
          contents: [
            ...formattedHistory,
            { role: 'user', parts: [{ text: message }] },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1024,
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
