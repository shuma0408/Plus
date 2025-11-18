import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { History as HistoryIcon, Search, Copy, Check, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const { data: history, isLoading, refetch } = useQuery({
    queryKey: ['promptHistory'],
    queryFn: () => base44.entities.PromptHistory.list("-created_date"),
    initialData: [],
  });

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("コピーしました！");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    try {
      await base44.entities.PromptHistory.delete(id);
      toast.success("削除しました");
      refetch();
    } catch (error) {
      toast.error("削除に失敗しました");
    }
  };

  const filteredHistory = history.filter(item =>
    item.original_question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.optimized_prompt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center">
                <HistoryIcon className="w-5 h-5 text-white" />
              </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">履歴</h1>
              <p className="text-slate-600">過去に変換した質問を確認できます</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="履歴を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-slate-200"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm">
            <CardContent className="py-20 text-center">
              <HistoryIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {searchQuery ? "該当する履歴が見つかりません" : "まだ履歴がありません"}
              </h3>
              <p className="text-slate-600">
                {searchQuery ? "別のキーワードで検索してみてください" : "質問を最適化すると、ここに履歴が表示されます"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <Card key={item.id} className="shadow-lg border-none bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader className="border-b border-slate-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-slate-500">
                          {format(new Date(item.created_date), "yyyy年MM月dd日 HH:mm", { locale: ja })}
                        </span>
                        {item.persona && (
                          <Badge variant="secondary" className="bg-sky-100 text-sky-700">
                            {item.persona}
                          </Badge>
                        )}
                        {item.method && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            {item.method}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg text-slate-900">
                        {item.original_question}
                      </CardTitle>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>履歴を削除しますか？</AlertDialogTitle>
                          <AlertDialogDescription>
                            この操作は取り消せません。本当に削除してもよろしいですか？
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>キャンセル</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-700">
                            削除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-slate-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">最適化されたプロンプト</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(item.optimized_prompt, item.id)}
                        className="h-8"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-4 h-4 mr-2 text-green-600" />
                            <span className="text-green-600">コピー済み</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            コピー
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {item.optimized_prompt}
                    </p>
                  </div>
                  {item.options && (
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        文体: {getOptionLabel('tone', item.options.tone)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        長さ: {getOptionLabel('length', item.options.length)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        形式: {getOptionLabel('format', item.options.format)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        アイデア数: {item.options.idea_count}個
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getOptionLabel(type, value) {
  const labels = {
    tone: {
      friendly: "優しい",
      balanced: "バランス",
      formal: "フォーマル",
      strict: "厳しい"
    },
    length: {
      short: "短め",
      medium: "普通",
      long: "長め"
    },
    format: {
      paragraph: "文章",
      bullet: "箇条書き",
      step: "ステップ"
    }
  };
  return labels[type]?.[value] || value;
}