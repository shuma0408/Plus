import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Copy, ArrowRight, Wand2, Settings, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import OptionsDrawer from "../components/prompt/OptionsDrawer";
import ResultDisplay from "../components/prompt/ResultDisplay";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [step, setStep] = useState("input");
  const [options, setOptions] = useState(null);
  const [customOptions, setCustomOptions] = useState(null);
  const [optimizedPrompt, setOptimizedPrompt] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const handleAnalyze = async () => {
    if (!question.trim()) {
      toast.error("質問を入力してください");
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysisPrompt = `
【重要な制約】
- 質問の内容のみに基づいて分析すること
- 推測や仮定は一切行わないこと
- 確実に判断できる情報のみを使用すること
- 不明な点がある場合は汎用的な選択肢を提供すること

以下のユーザーの質問を分析し、適切なカスタマイズオプションを生成してください。

ユーザーの質問：
${question}

【参考：オプションテンプレートの例（146個）】
※これはあくまで参考例です。テンプレートから厳密に選ぶ必要はありません。
質問の内容に本当に適したオプションを柔軟に生成してください。

① 長さ：短め / 普通 / 長め / 指定しない / その他
② わかりやすさ：小学生向け / 中高生向け / 初心者向け / 専門用語あり / 例え話多め / ステップ説明 / 指定しない / その他
③ 専門性：基礎 / 中級 / 上級 / ビジネスレベル / 研究者レベル / 指定しない / その他
④ 論理構造：結論→理由→例 / 3ポイント整理 / メリデメ比較 / 問題→原因→解決 / 反論も含める / 指定しない / その他
⑤ 温度・感情：冷静 / 穏やか / 熱量高め / 厳しめ / 優しめ / 本音でズバッと / 指定しない / その他
⑥ 創造性・発想：アイデア3つ / アイデア5つ / 変化球 / 現実的 / データ重視 / 指定しない / その他
⑦ 抽象度/具体度：抽象的 / バランス / 具体的 / 具体例多め / 数値化 / 指定しない / その他
⑧ 説得力：論理重視 / 感情重視 / データ重視 / 客観的 / 異論も提示 / 指定しない / その他
⑨ 視点：中立的 / 批判的 / 肯定的 / 両方の角度から / 学生視点 / ビジネス視点 / 顧客視点 / 専門家視点 / 指定しない / その他
⑩ 目的別：レポート / 企画書 / プレゼン / SNS投稿 / 学習用 / 指定しない / その他
⑪ 文体：ゆるい / 丁寧 / かしこまった / 友達口調 / 簡潔 / 指定しない / その他
⑫ テンション：中立的 / 批判的 / 肯定的 / 両方の角度から / ポジティブ / ネガティブ / ユーモア / 指定しない / その他
⑬ 出力形式：箇条書き / 表形式 / ステップ / ストーリー / フレームワーク / 指定しない / その他
⑭ 情報の粒度：ざっくり / 適度 / 詳しく / 背景から / 結論のみ / 指定しない / その他

【選択基準】
- 質問の内容を深く理解し、本当に必要なカテゴリーのみを選ぶ（3〜6個）
- 例：「おすすめの〇〇」なら → 創造性（アイデア数）、視点（中立/肯定/批判/両面）、論理構造
- 例：「〇〇を学びたい」なら → わかりやすさ、専門性、論理構造
- 例：「説明したい」なら → わかりやすさ、論理構造、文体、視点
- 各カテゴリーは3〜7個の選択肢を用意（テンプレートはあくまで参考）
- 長さは「短め/普通/長め」などの相対的表現（具体的文字数は不要）
- 視点・テンションは「中立的/批判的/肯定的/両方の角度から」など
- 必ず「指定しない」と「その他」を含める
- 【重要】論理構造カテゴリーは必ず含め、質問に最も適した論理構造を自動推奨する（defaultに設定）

以下のJSON形式で返してください：
{
  "persona": "最適なペルソナ",
  "method": "推奨される回答手法",
  "key_points": ["重要ポイント1", "ポイント2", "ポイント3"],
  "context": "質問の背景や意図",
  "question_type": "質問のカテゴリー",
  "custom_options": [
    {
      "key": "logic_structure",
      "label": "論理構造",
      "description": "説明の構成方法",
      "values": [
        {"value": "conclusion_first", "label": "結論→理由→例"},
        {"value": "three_points", "label": "3ポイント整理"},
        {"value": "pros_cons", "label": "メリデメ比較"},
        {"value": "not_specified", "label": "指定しない"},
        {"value": "other", "label": "その他"}
      ],
      "default": "conclusion_first",
      "recommended": "conclusion_first"
    },
    {
      "key": "creativity",
      "label": "創造性・発想",
      "description": "どんなアイデアがほしいか",
      "values": [
        {"value": "idea_3", "label": "アイデア3つ"},
        {"value": "idea_5", "label": "アイデア5つ"},
        {"value": "realistic", "label": "現実的な発想"},
        {"value": "not_specified", "label": "指定しない"},
        {"value": "other", "label": "その他"}
      ],
      "default": "not_specified"
    }
  ]
}

重要：
- テンプレートはあくまで参考。質問に本当に適したオプションを柔軟に生成する
- 長さは相対的表現（短め/普通/長め）、文字数指定は不要
- 視点・テンションは「中立的/批判的/肯定的/両方の角度から」など
- 必ず「指定しない」と「その他」を各オプションに含める
- 【重要】論理構造カテゴリーは必須。質問に最適な論理構造を選び、defaultとrecommendedに設定する
- 論理構造以外のdefaultは"not_specified"
- recommendedフィールドで推奨選択肢を明示（論理構造以外も推奨がある場合は設定可能）
`;

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: analysisPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            persona: { type: "string" },
            method: { type: "string" },
            key_points: { type: "array", items: { type: "string" } },
            context: { type: "string" },
            question_type: { type: "string" },
            custom_options: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  key: { type: "string" },
                  label: { type: "string" },
                  description: { type: "string" },
                  values: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        value: { type: "string" },
                        label: { type: "string" }
                      }
                    }
                  },
                  default: { type: "string" },
                  recommended: { type: "string" }
                }
              }
            }
          }
        }
      });

      setAnalysisData(analysis);
      setCustomOptions(analysis.custom_options);
      
      const initialOptions = {};
      analysis.custom_options.forEach(opt => {
        initialOptions[opt.key] = opt.default || "not_specified";
      });
      setOptions(initialOptions);
      
      setIsOptionsOpen(true);
      toast.success("質問を分析しました！");
    } catch (error) {
      console.error("Error analyzing question:", error);
      toast.error("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuickGenerate = async () => {
    setIsGenerating(true);
    try {
      const analysisPrompt = `
【重要な制約】
- 質問の内容のみに基づいて分析すること
- 推測や仮定は一切行わないこと  
- 確実に判断できる情報のみを使用すること

以下のユーザーの質問を分析してください。

ユーザーの質問：
${question}

以下のJSON形式で返してください：
{
  "persona": "最適なペルソナ（例：戦略コンサルタント、UXデザイナー、心理カウンセラー、技術アーキテクトなど）",
  "method": "推奨される回答手法（例：PREP法、デザイン思考、5Why分析、SWOT分析など）",
  "key_points": ["考慮すべき重要ポイント1", "ポイント2", "ポイント3"],
  "context": "質問の背景や意図",
  "question_type": "質問のカテゴリー"
}
`;

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: analysisPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            persona: { type: "string" },
            method: { type: "string" },
            key_points: { type: "array", items: { type: "string" } },
            context: { type: "string" },
            question_type: { type: "string" }
          }
        }
      });

      const optimizationPrompt = `
以下のユーザーの質問を、AIに対する高品質なプロンプトに変換してください。

【元の質問】
${question}

【分析結果】
- 質問タイプ: ${analysis.question_type}
- 推奨ペルソナ: ${analysis.persona}
- 推奨手法: ${analysis.method}
- 重要ポイント: ${analysis.key_points.join(", ")}
- 文脈: ${analysis.context}

【プロンプト最適化の原則】
1. ペルソナを明確に：「${analysis.persona}として回答してください」
2. 出力構造を指定：${analysis.method}に基づいた構成（結論→理由→例→まとめなど）
3. 禁止事項を明記：「一般論でまとめない」「抽象的な表現で逃げない」「推測や憶測で答えない」「知らないことは知らないと言う」など
4. 曖昧語を定義：「わかりやすく＝具体例を必ず入れる」など
5. 反対視点も要求：メリット・デメリット、成功例・失敗例など両面を
6. ノイズを削除：余計な前置きや挨拶なし、必要な情報のみ
7. 出力の幅を限定：抽象度や専門性のレベルを明示
8. 思考ステップを強制：「まず〜、次に〜、最後に〜」のように段階指定
9. 強度を指定：主張・批判・感情表現の強さを調整
10. 前提の世界を与える：「誰に対して、どんな状況で使う回答か」を明示
11. 【ハルシネーション防止】「確実な情報のみを提供すること」「不確実な場合は明示すること」「推測で補わないこと」を必ず含める

上記を踏まえ、以下の要素を含む最適化されたプロンプトを作成：
• ペルソナ指定（${analysis.persona}として）
• 出力構造の明示（${analysis.method}の形式で）
• 具体的な禁止事項（曖昧な回答をしない、推測しない、知らないことは知らないと言う、など）
• ハルシネーション防止策（「確実な情報のみ提供」「不確実な場合は明示」「事実に基づいて回答」を明記）
• 考慮すべきポイント（${analysis.key_points.join(", ")}）
• 元の質問内容

最適化されたプロンプトのみを返してください。前置きや説明は不要です。
`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: optimizationPrompt
      });

      setOptimizedPrompt(result);
      setAnalysisData(analysis);
      setStep("result");

      await base44.entities.PromptHistory.create({
        original_question: question,
        optimized_prompt: result,
        options: {},
        persona: analysis.persona,
        method: analysis.method
      });

      toast.success("プロンプトを生成しました！");
    } catch (error) {
      console.error("Error generating prompt:", error);
      toast.error("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateWithOptions = async () => {
    setIsGenerating(true);
    setIsOptionsOpen(false);
    try {
      const optionsDescription = customOptions.map(opt => {
        const selectedValue = options[opt.key];
        const selectedLabel = opt.values.find(v => v.value === selectedValue)?.label || selectedValue;
        
        if (selectedValue === 'not_specified' || selectedLabel === '指定しない') {
          return null;
        }
        
        return `- ${opt.label}: ${selectedLabel}`;
      }).filter(Boolean).join('\n');

      const optimizationPrompt = `
以下のユーザーの質問を、AIに対する高品質なプロンプトに変換してください。

【元の質問】
${question}

【分析結果】
- 質問タイプ: ${analysisData.question_type}
- ペルソナ: ${analysisData.persona}
- 回答手法: ${analysisData.method}
- 重要ポイント: ${analysisData.key_points.join(", ")}
- 文脈: ${analysisData.context}

${optionsDescription ? `【ユーザーの希望】\n${optionsDescription}` : ''}

【プロンプト最適化の原則】
1. ペルソナを明確に：「${analysisData.persona}として回答してください」
2. 出力構造を指定：${analysisData.method}に基づいた構成（結論→理由→例→まとめなど）
3. 禁止事項を明記：「一般論でまとめない」「抽象的な表現で逃げない」など
4. 曖昧語を定義：「わかりやすく＝具体例を必ず入れる」など
5. 反対視点も要求：メリット・デメリット、成功例・失敗例など両面を
6. ノイズを削除：余計な前置きや挨拶なし、必要な情報のみ
7. 出力の幅を限定：抽象度や専門性のレベルを明示
8. 思考ステップを強制：「まず〜、次に〜、最後に〜」のように段階指定
9. 強度を指定：主張・批判・感情表現の強さを調整
10. 前提の世界を与える：「誰に対して、どんな状況で使う回答か」を明示

上記を踏まえ、以下の要素を含む最適化されたプロンプトを作成：
• ペルソナ指定（${analysisData.persona}として）
• 出力構造の明示（${analysisData.method}の形式で）
• 具体的な禁止事項（曖昧な回答をしない、推測しない、知らないことは知らないと言う、など）
• ハルシネーション防止策（「確実な情報のみ提供」「不確実な場合は明示」「事実に基づいて回答」を明記）
• ユーザーの希望条件（指定されている場合）
• 考慮すべきポイント（${analysisData.key_points.join(", ")}）
• 元の質問内容

最適化されたプロンプトのみを返してください。前置きや説明は不要です。
`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: optimizationPrompt
      });

      setOptimizedPrompt(result);
      setStep("result");

      await base44.entities.PromptHistory.create({
        original_question: question,
        optimized_prompt: result,
        options: options,
        persona: analysisData.persona,
        method: analysisData.method
      });

      toast.success("プロンプトを生成しました！");
    } catch (error) {
      console.error("Error generating prompt:", error);
      toast.error("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setQuestion("");
    setStep("input");
    setOptions(null);
    setCustomOptions(null);
    setOptimizedPrompt(null);
    setAnalysisData(null);
  };

  const handleBackToInput = () => {
    setStep("input");
    setOptimizedPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-sky-100 to-blue-100 rounded-full mb-3 md:mb-4">
            <div className="w-5 h-5 flex items-center justify-center">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691b2d7a553ce20461470bd8/9c02490eb_icon_code_brackets.png" 
                alt="Q+" 
                className="w-5 h-5"
                style={{ filter: 'invert(57%) sepia(82%) saturate(3000%) hue-rotate(175deg) brightness(95%) contrast(101%)' }}
              />
            </div>
            <span className="text-xs md:text-sm font-medium bg-gradient-to-r from-sky-900 to-blue-900 bg-clip-text text-transparent">Question Plus</span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-2 md:mb-3">
            AIの力を、最大限に引き出す
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto px-4">
            質問をプロフェッショナルなプロンプトに変換して、AIから最高の回答を
          </p>
        </div>

        {step === "input" && (
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl border-none bg-white/90 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-100 pb-3 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Wand2 className="w-4 h-4 md:w-5 md:h-5 text-sky-600" />
                  質問を入力してください
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 md:pt-5">
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="例：上司にアイデアを提案したいけど、どう説明したらいい？"
                  className="min-h-[140px] md:min-h-[180px] text-sm md:text-base resize-none border-slate-200 focus:border-sky-400 focus:ring-sky-400"
                />
                <div className="mt-3 md:mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <span className="text-xs md:text-sm text-slate-500">
                    {question.length} 文字
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || isGenerating || !question.trim()}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
                          分析中...
                        </>
                      ) : (
                        <>
                          <SlidersHorizontal className="w-4 h-4" />
                          カスタマイズオプション
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleQuickGenerate}
                      disabled={isAnalyzing || isGenerating || !question.trim()}
                      className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          生成中...
                        </>
                      ) : (
                        <>
                          生成
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 md:mt-12 grid grid-cols-3 gap-4 md:gap-6">
              <div className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-sky-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-sky-600" />
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-slate-900 mb-1">自動分析</h3>
                <p className="text-xs text-slate-600 hidden md:block">
                  質問内容から最適な<br />ペルソナと手法を選択
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Wand2 className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-slate-900 mb-1">プロ級変換</h3>
                <p className="text-xs text-slate-600 hidden md:block">
                  誰でも使えるのに<br />結果は高品質
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Copy className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-slate-900 mb-1">すぐ使える</h3>
                <p className="text-xs text-slate-600 hidden md:block">
                  コピーしてそのまま<br />AIに質問できる
                </p>
              </div>
            </div>
          </div>
        )}

        {step === "result" && (
          <ResultDisplay
            originalQuestion={question}
            optimizedPrompt={optimizedPrompt}
            analysisData={analysisData}
            options={options}
            customOptions={customOptions}
            onReset={handleReset}
            onBackToOptions={handleBackToInput}
          />
        )}
      </div>

      <OptionsDrawer
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        options={options}
        setOptions={setOptions}
        customOptions={customOptions}
        onGenerate={handleGenerateWithOptions}
        isProcessing={isGenerating}
      />
    </div>
  );
}