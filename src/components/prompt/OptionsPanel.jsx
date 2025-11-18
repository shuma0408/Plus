import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings2, Sparkles, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function OptionsPanel({ options, setOptions, customOptions }) {
  const handleOptionChange = (key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  if (!customOptions || customOptions.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-xl border-none bg-white/90 backdrop-blur-sm lg:sticky lg:top-6">
      <CardHeader className="border-b border-slate-100 pb-3">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Settings2 className="w-4 h-4 md:w-5 md:h-5 text-sky-600" />
          カスタマイズ
        </CardTitle>
        <p className="text-xs text-slate-500 mt-1.5">
          <Sparkles className="w-3 h-3 inline mr-1" />
          質問に特化したオプション
        </p>
      </CardHeader>
      <ScrollArea className="h-[calc(100vh-280px)] md:h-[calc(100vh-230px)]">
        <CardContent className="pt-4 pb-6 space-y-5 md:space-y-6 pr-4">
          {customOptions.map((option) => {
            const isRecommended = options[option.key] === option.recommended;

            return (
              <div key={option.key}>
                <div className="flex items-start justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 flex-1">
                    <Label className="text-sm font-semibold text-slate-900">
                      {option.label}
                    </Label>
                    {option.description && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-slate-400 cursor-help flex-shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">{option.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
                <RadioGroup 
                  value={options[option.key] || option.recommended} 
                  onValueChange={(value) => handleOptionChange(option.key, value)}
                >
                  <div className="space-y-2">
                    {option.values.map((item) => {
                      const isThisRecommended = item.value === option.recommended;
                      return (
                        <div 
                          key={item.value} 
                          className={`flex items-center space-x-2 transition-colors rounded-lg ${
                            isThisRecommended ? 'bg-sky-50 p-2 -m-2' : ''
                          }`}
                        >
                          <RadioGroupItem 
                            value={item.value} 
                            id={`${option.key}-${item.value}`}
                            className="flex-shrink-0"
                          />
                          <Label 
                            htmlFor={`${option.key}-${item.value}`} 
                            className="cursor-pointer text-sm flex-1 flex items-center justify-between leading-snug"
                          >
                            <span>{item.label}</span>
                            {isThisRecommended && (
                              <Sparkles className="w-3 h-3 text-sky-600 ml-2 flex-shrink-0" />
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