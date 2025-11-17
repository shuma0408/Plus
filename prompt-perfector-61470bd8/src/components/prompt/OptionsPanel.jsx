import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings2, Sparkles, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const allOptions = {
  tone: {
    label: "文体",
    values: [
      { value: "friendly", label: "優しく親しみやすい" },
      { value: "balanced", label: "バランスの取れた" },
      { value: "formal", label: "フォーマルで丁寧" },
      { value: "strict", label: "厳しく率直" }
    ]
  },
  length: {
    label: "回答の長さ",
    values: [
      { value: "short", label: "短め" },
      { value: "medium", label: "普通" },
      { value: "long", label: "長め・詳細" }
    ]
  },
  format: {
    label: "出力形式",
    values: [
      { value: "paragraph", label: "文章形式" },
      { value: "bullet", label: "箇条書き" },
      { value: "step", label: "ステップ形式" }
    ]
  },
  idea_count: {
    label: "アイデア数",
    values: [
      { value: "1", label: "1つ" },
      { value: "3", label: "3つ" },
      { value: "5", label: "5つ" },
      { value: "10", label: "10個" }
    ]
  },
  depth: {
    label: "思考の深さ",
    values: [
      { value: "surface", label: "表面的でOK" },
      { value: "moderate", label: "適度な深さ" },
      { value: "deep", label: "深く掘り下げる" }
    ]
  },
  examples: {
    label: "実例の有無",
    values: [
      { value: "none", label: "実例不要" },
      { value: "some", label: "いくつか含める" },
      { value: "many", label: "多数含める" }
    ]
  },
  risk_analysis: {
    label: "リスク分析",
    values: [
      { value: "none", label: "不要" },
      { value: "basic", label: "基本的なリスクのみ" },
      { value: "balanced", label: "バランス重視" },
      { value: "comprehensive", label: "包括的に分析" }
    ]
  },
  perspectives: {
    label: "視点の多様性",
    values: [
      { value: "single", label: "単一の視点" },
      { value: "multiple", label: "複数の視点" },
      { value: "diverse", label: "多様な視点" }
    ]
  },
  audience_level: {
    label: "対象者レベル",
    values: [
      { value: "beginner", label: "初心者" },
      { value: "general", label: "一般" },
      { value: "expert", label: "専門家" }
    ]
  },
  timeframe: {
    label: "時間軸",
    values: [
      { value: "immediate", label: "今すぐ実行" },
      { value: "short_term", label: "短期的" },
      { value: "long_term", label: "長期的" },
      { value: "comprehensive", label: "全時間軸" }
    ]
  },
  practicality: {
    label: "実用性重視度",
    values: [
      { value: "theoretical", label: "理論重視" },
      { value: "balanced", label: "バランス" },
      { value: "highly_practical", label: "実践重視" }
    ]
  }
};

export default function OptionsPanel({ options, setOptions, recommendedOptions, availableOptions, analysisData }) {
  const handleOptionChange = (key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const optionsToShow = availableOptions || Object.keys(allOptions);
  const optionReasons = analysisData?.option_reasons || {};

  return (
    <Card className="shadow-xl border-none bg-white/80 backdrop-blur-sm h-fit sticky top-6">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings2 className="w-5 h-5 text-indigo-600" />
          カスタマイズオプション
        </CardTitle>
        <p className="text-xs text-slate-500 mt-2">
          <Sparkles className="w-3 h-3 inline mr-1" />
          この質問に最適なオプションを厳選しました
        </p>
      </CardHeader>
      <ScrollArea className="max-h-[calc(100vh-250px)]">
        <CardContent className="pt-6 space-y-6">
          {optionsToShow.map((optionKey) => {
            const option = allOptions[optionKey];
            if (!option) return null;

            const isRecommended = recommendedOptions && recommendedOptions[optionKey] === options[optionKey];
            const reason = optionReasons[optionKey];

            return (
              <div key={optionKey}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-semibold text-slate-900">
                      {option.label}
                    </Label>
                    {reason && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">{reason}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  {isRecommended && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      推奨
                    </Badge>
                  )}
                </div>
                <RadioGroup 
                  value={options[optionKey]} 
                  onValueChange={(value) => handleOptionChange(optionKey, value)}
                >
                  <div className="space-y-2">
                    {option.values.map((item) => {
                      const isThisRecommended = recommendedOptions && recommendedOptions[optionKey] === item.value;
                      return (
                        <div 
                          key={item.value} 
                          className={`flex items-center space-x-2 transition-colors ${
                            isThisRecommended ? 'bg-purple-50 rounded-lg p-2 -m-2' : ''
                          }`}
                        >
                          <RadioGroupItem value={item.value} id={`${optionKey}-${item.value}`} />
                          <Label 
                            htmlFor={`${optionKey}-${item.value}`} 
                            className="cursor-pointer text-sm flex-1 flex items-center justify-between"
                          >
                            <span>{item.label}</span>
                            {isThisRecommended && (
                              <Sparkles className="w-3 h-3 text-purple-600 ml-2" />
                            )}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </div>
            );
          })}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}