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

export default function ResultDisplay({ 
  originalQuestion, 
  optimizedPrompt, 
  analysisData, 
  options, 
  customOptions,
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
    <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
      {/* Original Question */}
      <Card className="shadow-xl border-none bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base md:text-lg text-slate-900">元の質問</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">{originalQuestion}</p>
        </CardContent>
      </Card>

      {/* Optimized Prompt */}
      <Card className="shadow-xl border-none bg-gradient-to-br from-sky-50 to-blue-50">
        <CardHeader className="border-b border-sky-100 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-sky-600" />
              最適化されたプロンプト
            </CardTitle>
            <Button
              onClick={handleCopy}
              className="bg-sky-600 hover:bg-sky-700 text-white text-sm h-9 md:h-10"
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
        <CardContent className="pt-4">
          <div className="bg-white rounded-lg p-4 md:p-5 mb-4">
            <p className="text-sm md:text-base text-slate-900 whitespace-pre-wrap leading-relaxed">
              {optimizedPrompt}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {customOptions?.map((option) => {
              const value = options[option.key];
              const valueLabel = option.values.find(v => v.value === value)?.label || value;

              return (
                <Badge key={option.key} variant="secondary" className="bg-sky-100 text-sky-800 text-xs">
                  {option.label}: {valueLabel}
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
              <CardHeader className="cursor-pointer hover:bg-blue-100/50 transition-colors pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Target className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    最適化ポイント
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                      タップして表示
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
              <CardContent className="pt-0 pb-4 md:pb-6">
                <div className="space-y-3 md:space-y-4">
                  <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                    <div className="bg-white rounded-lg p-3 md:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-sky-600" />
                        <span className="text-xs md:text-sm font-semibold text-slate-700">推奨ペルソナ</span>
                      </div>
                      <p className="text-sm md:text-base text-slate-900 font-medium">{analysisData.persona}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 md:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
                        <span className="text-xs md:text-sm font-semibold text-slate-700">回答手法</span>
                      </div>
                      <p className="text-sm md:text-base text-slate-900 font-medium">{analysisData.method}</p>
                    </div>
                  </div>
                  
                  {analysisData.question_type && (
                    <div className="bg-white rounded-lg p-3 md:p-4">
                      <span className="text-xs md:text-sm font-semibold text-slate-700 block mb-2">質問タイプ</span>
                      <Badge className="bg-blue-100 text-blue-700 text-xs">{analysisData.question_type}</Badge>
                    </div>
                  )}

                  {analysisData.context && (
                    <div className="bg-white rounded-lg p-3 md:p-4">
                      <span className="text-xs md:text-sm font-semibold text-slate-700 block mb-2">分析した文脈</span>
                      <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{analysisData.context}</p>
                    </div>
                  )}
                  
                  {analysisData.key_points && analysisData.key_points.length > 0 && (
                    <div className="bg-white rounded-lg p-3 md:p-4">
                      <span className="text-xs md:text-sm font-semibold text-slate-700 block mb-3">考慮すべきポイント</span>
                      <ul className="space-y-2">
                        {analysisData.key_points.map((point, index) => (
                          <li key={index} className="text-xs md:text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5 font-semibold">{index + 1}.</span>
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
      <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 pt-2">
        <Button
          onClick={onBackToOptions}
          variant="outline"
          className="px-6 md:px-8 h-10 md:h-11 text-sm"
        >
          <Edit className="w-4 h-4 mr-2" />
          オプションを調整
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="px-6 md:px-8 h-10 md:h-11 text-sm"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          新しい質問
        </Button>
      </div>

      {/* Instructions */}
      <Card className="shadow-lg border-none bg-blue-50">
        <CardContent className="pt-4 md:pt-5 pb-4 md:pb-5">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs md:text-sm font-bold">!</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1.5 text-sm md:text-base">次のステップ</h4>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                上の「最適化されたプロンプト」をコピーして、ChatGPTやClaude、Geminiなどの
                AIチャットボットに貼り付けてください。格段に精度の高い回答が得られます。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}