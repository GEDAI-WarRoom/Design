import React, { useState } from "react";
import { ArrowLeft, Check, Info } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// Listas de Opções
const INDICES = [{ value: "UFEMG", label: "UFEMG" }];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" }
];
const toOptions = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm px-6 py-5 flex flex-col gap-5 border border-gray-100">
      <span className="text-base font-semibold text-gray-800">{title}</span>
      {children}
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any; // Recebe os dados para edição
}

export function AdicionarValorIndicePage({ onLogout, onNavigate, dados }: PageProps) {
  const isEdicao = !!dados; // Verifica se é modo edição
  
  // Estados preenchidos com os dados recebidos (se existirem)
  const [indice, setIndice] = useState(dados?.indice ?? "");
  const [mes, setMes] = useState(dados?.mes ?? "");
  const [ano, setAno] = useState(dados?.ano ?? "");
  // Formata o valor numérico para texto caso venha do mock
  const [valor, setValor] = useState(dados?.valor ? String(dados.valor) : "");
  const [situacao, setSituacao] = useState(dados?.situacao ?? "Ativo");
  
  const [isSucesso, setIsSucesso] = useState(false);

  const formularioValido = indice && mes && ano && valor;

  const handleAdicionar = () => {
    if (!formularioValido) return;
    setIsSucesso(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="valor-indice" hideSearch />
      
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("valor-indice")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold text-[#1A7A3C]"
          >
            <ArrowLeft size={15} /> Todos os Valores por Índice
          </button>
          
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEdicao ? "Editar Valor por Índice" : "Adicionar Valor por Índice"}
            </h1>
            <button
              type="button"
              disabled={!formularioValido}
              onClick={handleAdicionar}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEdicao ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </div>

        {/* Alerta de Campos Obrigatórios */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-2">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* Dados do Valor por Índice */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            <FloatInput
              label="Valor"
              required
              placeholder="0,00"
              value={valor}
              onChange={(v) => setValor(v.replace(/[^0-9,]/g, ""))}
            />
            <FloatSelect
              label="Índice"
              required
              value={indice}
              onChange={setIndice}
              options={INDICES}
            />
            <FloatInput
              label="Ano"
              required
              placeholder="0000"
              value={ano}
              onChange={(v) => setAno(v.replace(/\D/g, "").slice(0, 4))}
              maxLength={4}
            />
            <FloatSelect
              label="Mês"
              required
              value={mes}
              onChange={setMes}
              options={toOptions(MESES)}
            />
            {/* Situação só aparece na edição */}
            {isEdicao && (
              <FloatSelect
                label="Situação"
                required
                value={situacao}
                onChange={setSituacao}
                options={SITUACOES}
              />
            )}
          </div>
        </Section>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {isEdicao ? "Valor por Índice atualizado com sucesso!" : "Valor por Índice cadastrado com sucesso!"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              O valor do índice {indice} referente a {mes}/{ano} foi {isEdicao ? "atualizado" : "cadastrado"}.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("valor-indice");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] bg-white text-sm font-semibold hover:bg-green-50 transition"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("visualizar-valor-indice", { indice, mes, ano, valor, situacao });
                }}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition"
              >
                Visualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}