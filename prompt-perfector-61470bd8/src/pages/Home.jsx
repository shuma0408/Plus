import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Copy, ArrowRight, Wand2, Settings } from "lucide-react";
import { toast } from "sonner";
import OptionsPanel from "../components/prompt/OptionsPanel";
import ResultDisplay from "../components/prompt/ResultDisplay";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [step, setStep] = useState("input"); // "input", "options", "result"
  const [options, setOptions] = useState(null);
  const [optimizedPrompt, setOptimizedPrompt] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [recommendedOptions, setRecommendedOptions] = useState(null);
  const [availableOptions, setAvailableOptions] = useState(null);

  const handleAnalyze = async () => {
    if (!question.trim()) {
      toast.error("質問を入力してください");
      return;
    }

    setIsProcessing(true);
    try {
      const analysisPrompt = `
以下のユーザーの質問を分析し、最適な回答を生成するための情報を提供してください。

ユーザーの質問：
${question}

以下のJSON形式で返してください：
{
  "persona": "最適なペルソナ（例：外資系コンサルタント、ベテラン教師、プロのライターなど）",
  "method": "推奨される回答手法（例：PREP法、5W1H、ストーリーテリングなど）",
  "key_points": ["考慮すべき重要ポイント1", "ポイント2", "ポイント3"],
  "context": "質問の背景や文脈についての簡単な説明",
  "question_type": "質問のカテゴリー（例：ビジネス提案、学習相談、クリエイティブ、技術的問題解決、人間関係など）",
  "recommended_options": {
    "tone": "friendly/balanced/formal/strict のいずれか",
    "length": "short/medium/long のいずれか",
    "format": "paragraph/bullet/step のいずれか",
    "idea_count": "1/3/5/10 のいずれか（文字列）",
    "depth": "surface/moderate/deep のいずれか",
    "examples": "none/some/many のいずれか",
    "risk_analysis": "none/basic/balanced/comprehensive のいずれか",
    "perspectives": "single/multiple/diverse のいずれか",
    "audience_level": "beginner/general/expert のいずれか",
    "timeframe": "immediate/short_term/long_term/comprehensive のいずれか",
    "practicality": "theoretical/balanced/highly_practical のいずれか"
  },
  "relevant_options": ["この質問に特に関連性の高いオプション名のリスト。最も重要なものから順に5-8個選択（例: ['tone', 'depth', 'examples', 'risk_analysis', 'perspectives', 'audience_level']）"],
  "option_reasons": {
    "tone": "このオプションを推奨する理由",
    "depth": "このオプションを推奨する理由",
    "その他関連するオプション": "理由"
  }
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
            question_type: { type: "string" },
            recommended_options: {
              type: "object",
              properties: {
                tone: { type: "string" },
                length: { type: "string" },
                format: { type: "string" },
                idea_count: { type: "string" },
                depth: { type: "string" },
                examples: { type: "string" },
                risk_analysis: { type: "string" },
                perspectives: { type: "string" },
                audience_level: { type: "string" },
                timeframe: { type: "string" },
                practicality: { type: "string" }
              }
            },
            relevant_options: { type: "array", items: { type: "string" } },
            option_reasons: { type: "object" }
          }
        }
      });

      setAnalysisData(analysis);
      setRecommendedOptions(analysis.recommended_options);
      setAvailableOptions(analysis.relevant_options);
      setOptions(analysis.recommended_options);
      setStep("options");
      
      toast.success("質問を分析しました！オプションを確認してください");
    } catch (error) {
      console.error("Error analyzing question:", error);
      toast.error("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerate = async () => {
    setIsProcessing(true);
    try {
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

【ユーザーの希望】
- 文体: ${getToneDescription(options.tone)}
- 長さ: ${getLengthDescription(options.length)}
- 出力形式: ${getFormatDescription(options.format)}
- アイデア数: ${options.idea_count}個
- 思考の深さ: ${getDepthDescription(options.depth)}
- 実例: ${getExamplesDescription(options.examples)}
- リスク分析: ${getRiskAnalysisDescription(options.risk_analysis)}
- 視点の多様性: ${getPerspectivesDescription(options.perspectives)}
- 対象者レベル: ${getAudienceLevelDescription(options.audience_level)}
- 時間軸: ${getTimeframeDescription(options.timeframe)}
- 実用性: ${getPracticalityDescription(options.practicality)}

上記を踏まえて、以下の要素を含む最適化されたプロンプトを作成してください：
1. ${analysisData.persona}の視点で回答するよう指示
2. ${analysisData.method}を使って構成するよう指示
3. 重要なポイントを漏れなく考慮するよう指示
4. ユーザーの希望する文体・形式・長さ・深さ・実例・視点などに従うよう指示
5. 元の質問内容を明確に提示

最適化されたプロンプトのみを返してください。前置きや説明は不要です。
`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: optimizationPrompt
      });

      setOptimizedPrompt(result);
      setStep("result");

      // Save to history
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
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setQuestion("");
    setStep("input");
    setOptions(null);
    setOptimizedPrompt(null);
    setAnalysisData(null);
    setRecommendedOptions(null);
    setAvailableOptions(null);
  };

  const handleBackToOptions = () => {
    setStep("options");
    setOptimizedPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">AI時代の質問補助装置</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            質問を、プロレベルに。
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            あなたの質問を自動で分析し、AIから最高の回答を引き出す<br className="hidden md:block" />
            プロフェッショナルなプロンプトに変換します
          </p>
        </div>

        {/* Step Indicator */}
        {step !== "input" && (
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                  ✓
                </div>
                <span className="text-sm font-medium text-slate-700">質問分析</span>
              </div>
              <div className="w-12 h-0.5 bg-purple-600" />
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step === "result" ? "bg-purple-600 text-white" : "bg-purple-200 text-purple-700"
                }`}>
                  {step === "result" ? "✓" : "2"}
                </div>
                <span className={`text-sm font-medium ${
                  step === "result" ? "text-slate-700" : "text-slate-500"
                }`}>
                  オプション選択
                </span>
              </div>
              {step === "result" && (
                <>
                  <div className="w-12 h-0.5 bg-purple-600" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                      ✓
                    </div>
                    <span className="text-sm font-medium text-slate-700">完成</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Input Step */}
        {step === "input" && (
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-xl border-none bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Wand2 className="w-5 h-5 text-purple-600" />
                  質問を入力してください
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="例：上司にアイデアを提案したいけど、どう説明したらいい？"
                  className="min-h-[240px] text-base resize-none border-slate-200 focus:border-purple-400 focus:ring-purple-400"
                />
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    {question.length} 文字
                  </span>
                  <Button
                    onClick={handleAnalyze}
                    disabled={isProcessing || !question.trim()}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        分析中...
                      </>
                    ) : (
                      <>
                        質問を分析
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Options Step */}
        {step === "options" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-none bg-white/80 backdrop-blur-sm mb-6">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="text-lg">あなたの質問</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-slate-700 leading-relaxed">{question}</p>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-none bg-gradient-to-br from-purple-50 to-indigo-50">
                <CardHeader className="border-b border-purple-100">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="w-5 h-5 text-purple-600" />
                    質問に最適なオプションを選択しました
                  </CardTitle>
                  <p className="text-sm text-slate-600 mt-2">
                    {analysisData?.question_type && (
                      <span className="inline-block bg-white px-3 py-1 rounded-full text-xs font-medium">
                        📋 {analysisData.question_type}
                      </span>
                    )}
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-slate-600 mb-4">
                    推奨値をセットしましたが、お好みに応じて調整できます。<br />
                    オプションを確認したら「プロンプトを生成」をクリックしてください。
                  </p>
                  <Button
                    onClick={handleGenerate}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        生成中...
                      </>
                    ) : (
                      <>
                        プロンプトを生成
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <OptionsPanel 
                options={options} 
                setOptions={setOptions}
                recommendedOptions={recommendedOptions}
                availableOptions={availableOptions}
                analysisData={analysisData}
              />
            </div>
          </div>
        )}

        {/* Result Step */}
        {step === "result" && (
          <ResultDisplay
            originalQuestion={question}
            optimizedPrompt={optimizedPrompt}
            analysisData={analysisData}
            options={options}
            availableOptions={availableOptions}
            onReset={handleReset}
            onBackToOptions={handleBackToOptions}
          />
        )}

        {/* Features Section */}
        {step === "input" && (
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">自動分析</h3>
              <p className="text-sm text-slate-600">
                質問内容から最適なペルソナと<br />回答手法を自動で選択
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wand2 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">プロ級変換</h3>
              <p className="text-sm text-slate-600">
                誰でも使えるのに<br />結果は圧倒的に高品質
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Copy className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">すぐ使える</h3>
              <p className="text-sm text-slate-600">
                変換結果をコピーして<br />そのままAIに質問できる
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getToneDescription(tone) {
  const descriptions = {
    friendly: "優しく親しみやすい",
    balanced: "バランスの取れた",
    formal: "フォーマルで丁寧な",
    strict: "厳しく率直な"
  };
  return descriptions[tone] || "バランスの取れた";
}

function getLengthDescription(length) {
  const descriptions = {
    short: "簡潔に（短め）",
    medium: "適度な長さで",
    long: "詳細に（長め）"
  };
  return descriptions[length] || "適度な長さで";
}

function getFormatDescription(format) {
  const descriptions = {
    paragraph: "文章形式",
    bullet: "箇条書き",
    step: "ステップバイステップ"
  };
  return descriptions[format] || "文章形式";
}

function getDepthDescription(depth) {
  const descriptions = {
    surface: "表面的な理解でOK",
    moderate: "適度な深さで",
    deep: "深く掘り下げて"
  };
  return descriptions[depth] || "適度な深さで";
}

function getExamplesDescription(examples) {
  const descriptions = {
    none: "実例不要",
    some: "いくつか実例を含めて",
    many: "多数の実例を含めて"
  };
  return descriptions[examples] || "いくつか実例を含めて";
}

function getRiskAnalysisDescription(risk) {
  const descriptions = {
    none: "リスク分析なし",
    basic: "基本的なリスクのみ",
    balanced: "バランスの取れたリスク分析",
    comprehensive: "包括的なリスク分析"
  };
  return descriptions[risk] || "バランスの取れたリスク分析";
}

function getPerspectivesDescription(perspectives) {
  const descriptions = {
    single: "単一の視点で",
    multiple: "複数の視点から",
    diverse: "多様な視点から"
  };
  return descriptions[perspectives] || "複数の視点から";
}

function getAudienceLevelDescription(level) {
  const descriptions = {
    beginner: "初心者向けに",
    general: "一般向けに",
    expert: "専門家向けに"
  };
  return descriptions[level] || "一般向けに";
}

function getTimeframeDescription(timeframe) {
  const descriptions = {
    immediate: "即座に実行可能な",
    short_term: "短期的な視点で",
    long_term: "長期的な視点で",
    comprehensive: "全時間軸を考慮して"
  };
  return descriptions[timeframe] || "即座に実行可能な";
}

function getPracticalityDescription(practicality) {
  const descriptions = {
    theoretical: "理論重視で",
    balanced: "理論と実践のバランスで",
    highly_practical: "実践重視で"
  };
  return descriptions[practicality] || "理論と実践のバランスで";
}