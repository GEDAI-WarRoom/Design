import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { VendaComSaidaInsumoForm } from "./VendaComSaidaInsumoForm";
import { criarVendaSaidaInsumoVazia, salvarVendaSaidaInsumo, type VendaSaidaInsumo } from "./vendaComSaidaInsumoData";

export function AdicionarVendaComSaidaInsumoPage({ onLogout, onNavigate }: any) {
  const [form, setForm] = useState(criarVendaSaidaInsumoVazia);
  const [erros, setErros] = useState<string[]>([]);
  const [salvo, setSalvo] = useState<VendaSaidaInsumo | null>(null);
  const validar = () => {
    const mensagens = [];
    if (!form.emitente.nome) mensagens.push("Selecione a revendedora emitente.");
    if (!form.destinatario.nome) mensagens.push("Informe o destinatário.");
    if (!form.numeroNotaFiscal) mensagens.push("Informe o número da nota fiscal.");
    if (!form.dataNotaFiscal) mensagens.push("Informe a data da nota fiscal.");
    if (form.dataNotaFiscal && form.dataNotaFiscal > new Date().toISOString().slice(0, 10)) mensagens.push("A data da nota fiscal não pode ser futura.");
    if (form.lotes.length === 0) mensagens.push("Selecione pelo menos um lote.");
    if (!form.requerimento) mensagens.push("Anexe o requerimento.");
    setErros(mensagens);
    if (mensagens.length === 0) setSalvo(salvarVendaSaidaInsumo(form));
  };

  return <div className="min-h-screen bg-[#f2f3f5] pb-20"><Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="venda-saida-insumo" hideSearch /><main className="mx-auto flex max-w-[1200px] flex-col gap-5 px-4 py-6 md:px-6"><header><button type="button" onClick={() => onNavigate("venda-saida-insumo")} className="mb-3 flex items-center gap-1 text-sm text-[#1A7A3C]"><ArrowLeft size={15} /> Todas as Vendas com Saída de Insumo</button><div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-gray-900">Adicionar Venda com Saída de Insumo</h1><button type="button" onClick={validar} className="h-11 rounded-md bg-[#1A7A3C] px-6 text-sm font-semibold text-white">Adicionar</button></div></header>{erros.length > 0 && <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"><p className="font-semibold">Revise os campos obrigatórios:</p><ul className="mt-1 list-disc pl-5">{erros.map((erro) => <li key={erro}>{erro}</li>)}</ul></div>}<VendaComSaidaInsumoForm value={form} onChange={(valor) => { setForm(valor); setErros([]); }} mode="create" /></main>{salvo && <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4EA]"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div><h2 className="text-lg font-bold text-gray-900">Venda com saída de insumo cadastrada com sucesso!</h2><p className="mt-1 text-sm text-gray-500">Nota Fiscal nº {salvo.numeroNotaFiscal} registrada.</p><div className="mt-6 flex justify-center gap-3"><button type="button" onClick={() => onNavigate("venda-saida-insumo")} className="h-11 rounded-md border border-[#1A7A3C] px-6 text-sm font-semibold text-[#1A7A3C]">Voltar</button><button type="button" onClick={() => onNavigate("visualizar-venda-saida-insumo", salvo)} className="h-11 rounded-md bg-[#1A7A3C] px-6 text-sm font-semibold text-white">Visualizar</button></div></div></div>}</div>;
}
