import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, RotateCcw, Sparkles, ChevronDown, ChevronUp, Edit, Target, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const optionLabels = {
  tone: { label: "文体", values: { friendly: "優しい", balanced: "バランス", formal: "フォーマル", strict: "厳しい" } },
  length: { label: "長さ", values: { short: "短め", medium: "普通", long: "長め" } },
  format: { label: "形式", values: { paragraph: "文章", bullet: "箇条書き", step: "ステップ" } },
  idea_count: { label: "アイデア数", values: {} },
  depth: { label: "深さ", values: { surface: "表面的", moderate: "適度", deep: "深堀り" } },
  examples: { label: "実例", values: { none: "なし", some: "いくつか", many: "多数" } },
  risk_analysis: { label: "リスク分析", values: { none: "なし", basic: "基本", balanced: "バランス", comprehensive: "包括的" } },
  perspectives: { label: "視点", values: { single: "単一", multiple: "複数", diverse: "多様" } },
  audience_level: { label: "対象者", values: { beginner: "初心者", general: "一般", expert: "専門家" } },
  timeframe: { label: "時間軸", values: { immediate: "即時", short_term: "短期", long_term: "長期", comprehensive: "全体" } },
  practicality: { label: "実用性", values: { theoretical: "理論", balanced: "バランス", highly_practical: "実践" } }
};

export default function ResultDisplay({ 
  originalQuestion, 
  optimizedPrompt, 
  analysisData, 
  options, 
  availableOptions,
  onReset,
  onBackToOptions 
}) {
  const [copied, setCopied] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedPrompt);
    setCopied(true);
    toast.success("コピーしました！そのままAIに質問できます");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Original Question */}
      <Card className="shadow-xl border-none bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-lg text-slate-900">元の質問</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-slate-600 leading-relaxed">{originalQuestion}</p>
        </CardContent>
      </Card>

      {/* Optimized Prompt */}
      <Card className="shadow-xl border-none bg-gradient-to-br from-emerald-50 to-teal-50">
        <CardHeader className="border-b border-emerald-100">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              最適化されたプロンプト
            </CardTitle>
            <Button
              onClick={handleCopy}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  コピー済み
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  コピー
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-white rounded-lg p-6 mb-4">
            <p className="text-slate-900 whitespace-pre-wrap leading-relaxed">
              {optimizedPrompt}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableOptions?.map((optionKey) => {
              const optionInfo = optionLabels[optionKey];
              if (!optionInfo || !options[optionKey]) return null;
              
              const displayValue = optionKey === 'idea_count' 
                ? `${options[optionKey]}個` 
                : optionInfo.values[options[optionKey]] || options[optionKey];

              return (
                <Badge key={optionKey} variant="secondary" className="bg-emerald-100 text-emerald-800">
                  {optionInfo.label}: {displayValue}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Points - Collapsible */}
      {analysisData && (
        <Collapsible open={isAnalysisOpen} onOpenChange={setIsAnalysisOpen}>
          <Card className="shadow-lg border-none bg-gradient-to-br from-blue-50 to-indigo-50">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-blue-100/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                    最適化ポイント
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                      詳細を見る
                    </Badge>
                  </CardTitle>
                  {isAnalysisOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 pb-6">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-semibold text-slate-700">推奨ペルソナ</span>
                      </div>
                      <p className="text-slate-900 font-medium">{analysisData.persona}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-semibold text-slate-700">回答手法</span>
                      </div>
                      <p className="text-slate-900 font-medium">{analysisData.method}</p>
                    </div>
                  </div>
                  
                  {analysisData.question_type && (
                    <div className="bg-white rounded-lg p-4">
                      <span className="text-sm font-semibold text-slate-700 block mb-2">質問タイプ</span>
                      <Badge className="bg-indigo-100 text-indigo-700">{analysisData.question_type}</Badge>
                    </div>
                  )}

                  {analysisData.context && (
                    <div className="bg-white rounded-lg p-4">
                      <span className="text-sm font-semibold text-slate-700 block mb-2">分析した文脈</span>
                      <p className="text-sm text-slate-600 leading-relaxed">{analysisData.context}</p>
                    </div>
                  )}
                  
                  {analysisData.key_points && analysisData.key_points.length > 0 && (
                    <div className="bg-white rounded-lg p-4">
                      <span className="text-sm font-semibold text-slate-700 block mb-3">考慮すべきポイント</span>
                      <ul className="space-y-2">
                        {analysisData.key_points.map((point, index) => (
                          <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-blue-600 mt-1 font-semibold">{index + 1}.</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={onBackToOptions}
          variant="outline"
          size="lg"
          className="px-8"
        >
          <Edit className="w-4 h-4 mr-2" />
          オプションを調整
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          size="lg"
          className="px-8"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          新しい質問を入力
        </Button>
      </div>

      {/* Instructions */}
      <Card className="shadow-lg border-none bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">!</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">次のステップ</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                上の「最適化されたプロンプト」をコピーして、ChatGPTやClaude、Geminiなどの<br />
                AIチャットボットに貼り付けてください。格段に精度の高い回答が得られます。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}