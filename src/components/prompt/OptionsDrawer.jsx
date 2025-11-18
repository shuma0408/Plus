import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function OptionsDrawer({ isOpen, onClose, options, setOptions, customOptions, onGenerate, isProcessing }) {
  const [otherInputs, setOtherInputs] = useState({});

  const handleOptionChange = (key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
    
    if (value !== 'other') {
      setOtherInputs(prev => {
        const newInputs = { ...prev };
        delete newInputs[key];
        return newInputs;
      });
    }
  };

  const handleOtherInputChange = (key, value) => {
    setOtherInputs(prev => ({ ...prev, [key]: value }));
    setOptions(prev => ({ ...prev, [key]: `other:${value}` }));
  };

  if (!customOptions || customOptions.length === 0) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-6 pb-4 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                カスタマイズオプション
              </SheetTitle>
              <p className="text-xs text-slate-500 mt-1.5">
                質問に最適化されたオプションです
              </p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-190px)]">
          <div className="p-6 space-y-6">
            {customOptions.map((option) => {
              const currentValue = options[option.key] || option.default || 'not_specified';
              const isOther = currentValue.startsWith('other:');
              const displayValue = isOther ? 'other' : currentValue;

              return (
                <div key={option.key} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-1.5 flex-1">
                      <Label className="text-sm font-semibold text-slate-900">
                        {option.label}
                      </Label>
                      {option.recommended && option.recommended !== 'not_specified' && (
                        <span className="text-xs px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full">
                          おすすめ
                        </span>
                      )}
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
                    value={displayValue} 
                    onValueChange={(value) => handleOptionChange(option.key, value)}
                  >
                    <div className="space-y-2.5">
                      {option.values.map((item) => {
                        const isSelected = displayValue === item.value;
                        const isNotSpecified = item.value === 'not_specified';
                        const isRecommended = item.value === option.recommended;

                        return (
                          <div 
                            key={item.value} 
                            className={`flex items-center space-x-3 transition-all rounded-lg p-2.5 -m-2.5 ${
                              isSelected 
                                ? 'bg-sky-100 border-2 border-sky-300' 
                                : isRecommended
                                  ? 'bg-sky-50 border border-sky-200'
                                : isNotSpecified 
                                  ? 'bg-slate-50' 
                                  : 'hover:bg-slate-50'
                            }`}
                          >
                            <RadioGroupItem 
                              value={item.value} 
                              id={`${option.key}-${item.value}`}
                              className="flex-shrink-0"
                            />
                            <Label 
                              htmlFor={`${option.key}-${item.value}`} 
                              className="cursor-pointer text-sm flex-1 leading-snug flex items-center justify-between"
                            >
                              <span className={isSelected ? 'font-medium text-sky-900' : ''}>
                                {item.label}
                              </span>
                              {isRecommended && !isSelected && (
                                <Sparkles className="w-3 h-3 text-sky-600 ml-2 flex-shrink-0" />
                              )}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </RadioGroup>
                  
                  {displayValue === 'other' && (
                    <div className="mt-3">
                      <Input
                        value={otherInputs[option.key] || ''}
                        onChange={(e) => handleOtherInputChange(option.key, e.target.value)}
                        placeholder="具体的に入力してください"
                        className="text-sm"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white">
          <Button 
            onClick={onGenerate}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
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
        </div>
      </SheetContent>
    </Sheet>
  );
}