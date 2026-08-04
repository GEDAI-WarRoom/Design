import React, { useState } from "react";
import { ArrowLeft, Pencil, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition border-b border-gray-100">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="p-6 flex flex-col gap-5 bg-white">{children}</div>}
    </div>
  );
}

export function VisualizarVendaComEntradaInsumosExamesPage({ dados, onLogout, onNavigate }: any) {
  // Puxa os dados que vieram do clique na tabela.
  const venda = dados || {};

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="venda-entrada-insumos-exames" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("venda-entrada-insumos-exames")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todas as Vendas com Entrada de Insumos para Exame
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Venda com Entrada de Insumos para Exame</h1>
            <button type="button" onClick={() => onNavigate("editar-venda-entrada-insumos-exames", venda)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2">
              <Pencil size={14} /> Editar
            </button>
          </div>
        </div>

        <Section title="Informações da Venda">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Fornecedor" value={venda.fornecedor || "-"} disabled onChange={() => {}} />
            
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <FloatInput label="Destinatário" value={venda.revendedoraNome ? `${venda.revendedoraCodigo} - ${venda.revendedoraNome}` : "-"} disabled onChange={() => {}} />
              </div>
              <button type="button" onClick={() => alert(`Detalhes de ${venda.revendedoraNome}`)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition h-12 flex items-center flex-shrink-0 border border-transparent hover:border-[#1A7A3C] bg-white">
                <Eye size={20} />
              </button>
            </div>

            <FloatInput label="Número da Nota Fiscal" value={venda.numeroNotaFiscal || "-"} disabled onChange={() => {}} />
            <FloatInput label="Número da Partida" value={venda.numeroPartida || "-"} disabled onChange={() => {}} />
            <FloatInput label="Doença" value={venda.doenca || "-"} disabled onChange={() => {}} />
            
            <FloatInput label="Situação" value={venda.situacao || "Gravada"} disabled onChange={() => {}} />
          </div>
        </Section>
      </main>
    </div>
  );
}