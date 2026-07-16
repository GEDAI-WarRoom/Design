import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Check, AlertTriangle, Eye  } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, CustomButton } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS DE ENTIDADE (substituir por API)
// ==========================================================

// Apenas unidades administrativas do tipo "Escritório Seccional"
const ESCRITORIOS_SECCIONAIS_MOCK = [
  { id: 1, nome: "Escritório Seccional de Lavras" },
  { id: 2, nome: "Escritório Seccional de Belo Horizonte" },
  { id: 3, nome: "Escritório Seccional de Uberlândia" },
  { id: 4, nome: "Escritório Seccional de Varginha" },
];

interface FormularioGTA {
  id: number;
  escritorioId: number;
  serie: string;
  numeroInicial: number;
  numeroFinal: number;
  situacao: "Ativo" | "Cancelado";
}

// Faixas já cadastradas no sistema (usado para validar interseção — Detalhes da HU)
const FORMULARIOS_CADASTRADOS_MOCK: FormularioGTA[] = [
  { id: 1, escritorioId: 1, serie: "A1", numeroInicial: 1, numeroFinal: 500, situacao: "Ativo" },
  { id: 2, escritorioId: 1, serie: "A1", numeroInicial: 501, numeroFinal: 1000, situacao: "Cancelado" },
  { id: 3, escritorioId: 2, serie: "B2", numeroInicial: 1, numeroFinal: 750, situacao: "Ativo" },
  { id: 4, escritorioId: 3, serie: "C3", numeroInicial: 1, numeroFinal: 300, situacao: "Ativo" },
];

// ==========================================================
// HELPERS DE UI
// ==========================================================
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}

const pad = (n: number, len: number) => String(n).padStart(len, "0");

// ==========================================================
// PÁGINA: ADICIONAR DISTRIBUIÇÃO DE FORMULÁRIOS DE GTA
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

interface Erros {
  escritorio?: string;
  serie?: string;
  numeroInicial?: string;
  numeroFinal?: string;
  faixa?: string;
}

export function AdicionarDistribuicaoFormulariosGta({ onLogout, onNavigate }: PageProps) {
  const [escritorio, setEscritorio] = useState<any | null>(null);
  const [serie, setSerie] = useState("");
  const [numeroInicial, setNumeroInicial] = useState("");
  const [numeroFinal, setNumeroFinal] = useState("");

  const [erros, setErros] = useState<Erros>({});
  const [isSucesso, setIsSucesso] = useState(false);

  const validar = (): boolean => {
    const novosErros: Erros = {};

    if (!escritorio) novosErros.escritorio = "O Escritório Seccional é obrigatório.";
    if (!serie.trim()) novosErros.serie = "A Série é obrigatória.";
    else if (serie.trim().length !== 2) novosErros.serie = "A Série deve possuir exatamente 2 caracteres.";

    if (!numeroInicial.trim()) novosErros.numeroInicial = "O Número do Formulário Inicial é obrigatório.";
    if (!numeroFinal.trim()) novosErros.numeroFinal = "O Número do Formulário Final é obrigatório.";

    const inicial = Number(numeroInicial);
    const final = Number(numeroFinal);

    if (numeroInicial.trim() && numeroFinal.trim() && !novosErros.numeroInicial && !novosErros.numeroFinal) {
      if (final <= inicial) {
        novosErros.numeroFinal = "O Número do Formulário Final deve ser maior que o Número do Formulário Inicial.";
      } else {
        // Validação de interseção: não pode haver sobreposição de faixas para a mesma Série
        const existeIntersecao = FORMULARIOS_CADASTRADOS_MOCK.some(
          (f) => f.serie.toUpperCase() === serie.toUpperCase() && inicial <= f.numeroFinal && f.numeroInicial <= final
        );
        if (existeIntersecao) {
          novosErros.faixa = "Já existe uma faixa de formulário cadastrada para esta Série que intercepta o intervalo informado.";
        }
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = () => {
    if (!validar()) return;
    // Aqui entraria a chamada à API para persistir o cadastro
    setIsSucesso(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="distribuicao-formularios-gta" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Topo da Página */}
        <div>
          <button
            onClick={() => onNavigate("distribuicao-formularios-gta")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todas Distribuições de Formulários de GTA
          </button>
          <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-semibold text-gray-900">Adicionar Distribuição de Formulários de GTA</h1>
           <button type="button" onClick={() => setIsSucesso(true)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Adicionar</button>
          </div>
        </div>

        {/* Seção: Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
            {/* Container pai com flex para alinhar o input e o botão lado a lado na base */}
      <div className="md:col-span-2 flex items-end gap-2 w-full relative">
        <div className="flex-1">
          <EntitySearchInput
            label="Escritório Seccional"
            required
            placeholder="Buscar por nome do escritório seccional."
            value={escritorio ? escritorio.nome : ""}
            data={ESCRITORIOS_SECCIONAIS_MOCK}
            searchKeys={["nome"]}
            columns={[{ label: "Escritório Seccional", key: "nome" }]}
            icon={
              Icons.iconeUnidadeAdministrativaUrl ? (
                <img src={Icons.iconeUnidadeAdministrativaUrl} alt="Escritório Seccional" className="w-5 h-5 object-contain" />
              ) : undefined
            }
            title="Buscar Escritório Seccional"
            subtitle="Busque por um escritório seccional cadastrado:"
            onChange={(ent) => { 
              setEscritorio(ent); 
              setErros((e) => ({ ...e, escritorio: undefined })); 
            }}
          />
        </div>

        {/* 🚀 Botão do Olhinho renderizado externamente apenas se houver escritório */}
        {escritorio && (
          <button 
            type="button" 
            onClick={() => alert(`Visualizar detalhes de: ${escritorio.nome}`)}
            className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-lg transition bg-white h-[44px] w-[44px] flex items-center justify-center flex-shrink-0"
            title="Visualizar Escritório"
          >
            <Eye size={20} />
          </button>
        )}
      </div>
                {erros.escritorio && <p className="text-sm text-red-500 mt-1">{erros.escritorio}</p>}
              </div>

              <div>
                <FloatInput
                  label="Série"
                  required
                  value={serie}
                  maxLength={2}
                  onChange={(v) => { setSerie(v.toUpperCase()); setErros((e) => ({ ...e, serie: undefined, faixa: undefined })); }}
                />
                {erros.serie && <p className="text-sm text-red-500 mt-1">{erros.serie}</p>}
              </div>

              <div />

              <div>
                <FloatInput
                  label="Número do Formulário Inicial"
                  required
                  value={numeroInicial}
                  maxLength={6}
                  onChange={(v) => { setNumeroInicial(v.replace(/\D/g, "")); setErros((e) => ({ ...e, numeroInicial: undefined, numeroFinal: undefined, faixa: undefined })); }}
                />
                {erros.numeroInicial && <p className="text-sm text-red-500 mt-1">{erros.numeroInicial}</p>}
              </div>

              <div>
                <FloatInput
                  label="Número do Formulário Final"
                  required
                  value={numeroFinal}
                  maxLength={6}
                  onChange={(v) => { setNumeroFinal(v.replace(/\D/g, "")); setErros((e) => ({ ...e, numeroFinal: undefined, faixa: undefined })); }}
                />
                {erros.numeroFinal && <p className="text-sm text-red-500 mt-1">{erros.numeroFinal}</p>}
              </div>
            </div>

            {erros.faixa && (
              <div className="flex items-start gap-2 bg-[#FDEDEC] border border-[#F5B7B1] text-[#B91C1C] text-sm rounded-md px-4 py-3">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{erros.faixa}</span>
              </div>
            )}

            {/* Pré-visualização da faixa informada */}
            {numeroInicial && numeroFinal && !erros.numeroInicial && !erros.numeroFinal && !erros.faixa && Number(numeroFinal) > Number(numeroInicial) && (
              <p className="text-sm text-gray-500">
                Faixa a ser cadastrada: <span className="font-semibold text-gray-700">{pad(Number(numeroInicial), 6)} - {pad(Number(numeroFinal), 6)}</span>
              </p>
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
            <h3 className="text-lg font-bold text-gray-900">Distribuição de formulário cadastrada com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">
              A faixa {pad(Number(numeroInicial), 6)} - {pad(Number(numeroFinal), 6)} da Série {serie} foi cadastrada com situação "Ativo".
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => { setIsSucesso(false); onNavigate("distribuicao-formularios-gta"); }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                onClick={() => { setIsSucesso(false); onNavigate("visualizar-distribuicao-formularios-gta"); }}
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