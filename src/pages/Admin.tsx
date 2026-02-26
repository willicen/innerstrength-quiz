import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Download, RefreshCw, ShieldCheck, Key, BarChart3 } from "lucide-react";

interface CodeItem {
  id: string;
  code: string;
  is_used: boolean;
  used_at: string | null;
  created_at: string;
}

interface Stats {
  total: number;
  used: number;
  unused: number;
}

const Admin = () => {
  const [adminKey, setAdminKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateCount, setGenerateCount] = useState("1000");
  const [codes, setCodes] = useState<CodeItem[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, used: 0, unused: 0 });
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "used" | "unused">("all");

  const handleLogin = () => {
    if (adminKey.trim().length < 4) {
      toast({ title: "请输入管理员密钥", variant: "destructive" });
      return;
    }
    setAuthenticated(true);
    loadCodes(1, filter, adminKey.trim());
  };

  const loadCodes = useCallback(async (p: number, f: string, key?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("list-codes", {
        body: { admin_key: key || adminKey, page: p, page_size: 50, filter: f },
      });
      if (error || data?.error) {
        toast({ title: data?.error || "加载失败", variant: "destructive" });
        if (data?.error === "未授权访问") setAuthenticated(false);
        return;
      }
      setCodes(data.codes || []);
      setStats(data.stats || { total: 0, used: 0, unused: 0 });
      setPage(p);
    } catch {
      toast({ title: "网络错误", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  const handleGenerate = async () => {
    const num = parseInt(generateCount);
    if (isNaN(num) || num < 1 || num > 10000) {
      toast({ title: "请输入1-10000之间的数量", variant: "destructive" });
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-codes", {
        body: { admin_key: adminKey, count: num },
      });
      if (error || data?.error) {
        toast({ title: data?.error || "生成失败", variant: "destructive" });
        return;
      }
      toast({ title: `成功生成 ${data.generated} 个验证码！` });

      // Auto download CSV
      if (data.codes?.length) {
        downloadCSV(data.codes, `验证码_${new Date().toISOString().slice(0, 10)}_${data.generated}个.csv`);
      }

      loadCodes(1, filter);
    } catch {
      toast({ title: "网络错误", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const downloadCSV = (codeList: string[], filename: string) => {
    const header = "序号,验证码\n";
    const rows = codeList.map((c, i) => `${i + 1},${c}`).join("\n");
    const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllUnused = async () => {
    setLoading(true);
    try {
      // Fetch all unused codes via multiple pages
      const allUnused: string[] = [];
      let p = 1;
      let hasMore = true;
      while (hasMore) {
        const { data } = await supabase.functions.invoke("list-codes", {
          body: { admin_key: adminKey, page: p, page_size: 50, filter: "unused" },
        });
        if (data?.codes?.length) {
          allUnused.push(...data.codes.map((c: CodeItem) => c.code));
          if (data.codes.length < 50) hasMore = false;
          else p++;
        } else {
          hasMore = false;
        }
      }
      if (allUnused.length === 0) {
        toast({ title: "没有未使用的验证码", variant: "destructive" });
        return;
      }
      downloadCSV(allUnused, `未使用验证码_${new Date().toISOString().slice(0, 10)}.csv`);
      toast({ title: `已导出 ${allUnused.length} 个未使用验证码` });
    } catch {
      toast({ title: "导出失败", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 w-full max-w-md text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-semibold mb-2">管理后台</h1>
          <p className="text-muted-foreground text-sm mb-6">请输入管理员密钥</p>
          <Input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="管理员密钥"
            className="mb-4 text-center"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <Button onClick={handleLogin} className="w-full">进入管理</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-semibold text-foreground">验证码管理</h1>
          <Button variant="ghost" size="sm" onClick={() => setAuthenticated(false)}>退出</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "总计", value: stats.total, icon: Key },
            { label: "已使用", value: stats.used, icon: BarChart3 },
            { label: "未使用", value: stats.unused, icon: ShieldCheck },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass-card p-5 text-center">
              <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Generate */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold mb-4">批量生成验证码</h2>
          <div className="flex gap-3">
            <Input
              type="number"
              value={generateCount}
              onChange={(e) => setGenerateCount(e.target.value)}
              placeholder="数量 (1-10000)"
              min={1}
              max={10000}
              className="max-w-[200px]"
            />
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />生成中...</> : "生成并下载CSV"}
            </Button>
            <Button variant="outline" onClick={exportAllUnused} disabled={loading}>
              <Download className="w-4 h-4 mr-2" />导出未使用
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">生成后会自动下载CSV文件，可直接发给客服使用</p>
        </div>

        {/* Filter & List */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {(["all", "unused", "used"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setFilter(f); loadCodes(1, f); }}
                >
                  {{ all: "全部", unused: "未使用", used: "已使用" }[f]}
                </Button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => loadCodes(page, filter)}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">加载中...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 px-3">验证码</th>
                    <th className="py-2 px-3">状态</th>
                    <th className="py-2 px-3">使用时间</th>
                    <th className="py-2 px-3">创建时间</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((c) => (
                    <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2 px-3 font-mono tracking-wider">{c.code}</td>
                      <td className="py-2 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                          c.is_used
                            ? "bg-destructive/10 text-destructive"
                            : "bg-primary/10 text-primary"
                        }`}>
                          {c.is_used ? "已使用" : "未使用"}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">
                        {c.used_at ? new Date(c.used_at).toLocaleString("zh-CN") : "-"}
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">
                        {new Date(c.created_at).toLocaleString("zh-CN")}
                      </td>
                    </tr>
                  ))}
                  {codes.length === 0 && (
                    <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">暂无数据</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => loadCodes(page - 1, filter)}
            >
              上一页
            </Button>
            <span className="text-sm text-muted-foreground leading-9">第 {page} 页</span>
            <Button
              variant="outline"
              size="sm"
              disabled={codes.length < 50}
              onClick={() => loadCodes(page + 1, filter)}
            >
              下一页
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
