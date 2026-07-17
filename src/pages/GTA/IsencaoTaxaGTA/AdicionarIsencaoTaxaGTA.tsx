import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Check, Info, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// --- lista de situações ---

const SITUACOES = ["Ativo", "Inativo"];
const toOptions = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));

// --- mocks ---

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}

// --- tipos ---

interface IsencaoTaxaGtaData {
  id?: number;
  motivo: string;
  situacao: "Ativo" | "Inativo";
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  // Presente em modo visualização/edição
  data?: IsencaoTaxaGtaData;
  // Quando true junto com "data", a tela abre em modo somente-leitura (AC4)
  readOnly?: boolean;
}

export function AdicionarIsencaoTaxaGtaPage({ onLogout, onNavigate, data, readOnly = false }: PageProps) {
  const isVisualizacao = !!data && readOnly;
  const isEdicao = !!data && !readOnly;
  const camposDesabilitados = isVisualizacao;

  const [motivo, setMotivo] = useState(data?.motivo ?? "");
  const [situacao, setSituacao] = useState<string>(data?.situacao ?? "Ativo");

  const [isSucesso, setIsSucesso] = useState(false);

  const formularioValido = motivo.trim() !== "";

  const titulo = isVisualizacao
    ? "Visualizar Isenção de Taxa de GTA"
    : isEdicao
    ? "Editar Isenção de Taxa de GTA"
    : "Adicionar Isenção de Taxa de GTA";

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="isencao-taxa-gta" hideSearch />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("isencao-taxa-gta")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todas as Isenções de Taxa de GTA
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">{titulo}</h1>

            {isVisualizacao ? (
              <button
                type="button"
                onClick={() => onNavigate("editar-isencao-taxa-gta", data)}
                className="px-5 py-3 flex items-center gap-2 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-bold rounded-md transition shadow-sm"
              >
                <Pencil size={14} /> Editar
              </button>
            ) : (
              <button
                type="button"
                disabled={!formularioValido}
                onClick={() => setIsSucesso(true)}
                className="px-5 py-3 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-bold rounded-md transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEdicao ? "Salvar" : "Adicionar"}
              </button>
            )}
          </div>
        </div>

        {/* Alerta de campos obrigatórios (não faz sentido na visualização) */}
        {!isVisualizacao && (
          <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3">
            <div className="text-gray-500 flex-shrink-0">
              <Info size={20} className="stroke-[2.5]" />
            </div>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
            </p>
          </div>
        )}

        {/* Informações Básicas (AC3) */}
        <Section title="Informações Básicas">
          <div className={`grid grid-cols-1 ${isEdicao || isVisualizacao ? "md:grid-cols-2" : ""} gap-4 items-center`}>
            <FloatInput
              label="Motivo da Isenção de Taxa de GTA"
              required
              disabled={camposDesabilitados}
              value={motivo}
              onChange={setMotivo}
              maxLength={255}
            />

            {/* Situação do Cadastro: só existe em visualização/edição (AC4/AC5) */}
            {(isEdicao || isVisualizacao) && (
              <FloatSelect
                label="Situação do Cadastro"
                required
                disabled={camposDesabilitados}
                value={situacao}
                onChange={setSituacao}
                options={toOptions(SITUACOES)}
              />
            )}
          </div>
        </Section>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {isEdicao ? "Isenção de Taxa de GTA atualizada com sucesso!" : "Isenção de Taxa de GTA cadastrada com sucesso!"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {motivo ? `A isenção "${motivo}"` : "A isenção"} foi {isEdicao ? "atualizada" : "cadastrada"}.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("isencao-taxa-gta");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("visualizar-isencao-taxa-gta", { id: data?.id, motivo, situacao });
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