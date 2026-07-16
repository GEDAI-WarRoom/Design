import React, { useState, useEffect } from "react";
import { ArrowLeft, Check, Info, Eye } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import { UnidadeAdministrativaInput, MedicoVeterinarioInput, EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";
const FATOR_VALOR_GTA = 5.50;

interface EscritorioSeccional {
  id: number;
  nome: string;
  sigla: string;
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <span className="text-base font-semibold text-gray-800">{title}</span>
      </div>
      {open && <div className="px-6 py-5">{children}</div>}
    </div>
  );
}

export const ESCRITORIOS_SECCIONAIS: EscritorioSeccional[] = [
  { id: 1, nome: "Escritório Seccional de Lavras", sigla: "SECLAV3820" },
  { id: 2, nome: "Escritório Seccional de Uberlândia", sigla: "SECUDI2140" },
  { id: 3, nome: "Escritório Seccional de Juiz de Fora", sigla: "SECJDF3310" },
];

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function AdicionarRegistroVendaGtaFisicaPage({ onLogout, onNavigate }: PageProps) {
  const [medico, setMedico] = useState<any | null>(null);
  const [escritorio, setEscritorio] = useState<any | null>(null);
  const [serie, setSerie] = useState("");
  const [numInicial, setNumInicial] = useState("");
  const [numFinal, setNumFinal] = useState("");
  
  const [quantidade, setQuantidade] = useState(0);
  const [valor, setValor] = useState(0);

  const [isSucesso, setIsSucesso] = useState(false);
  const [erroFaixa, setErroFaixa] = useState("");

  // O cálculo agora roda dinamicamente se houver qualquer número digitado
  useEffect(() => {
    const calc = () => {
      if (numInicial && numFinal) {
        const inicial = parseInt(numInicial, 10);
        const final = parseInt(numFinal, 10);

        if (!isNaN(inicial) && !isNaN(final)) {
          if (final >= inicial) {
            const qtd = final - inicial + 1;
            setQuantidade(qtd);
            setValor(qtd * FATOR_VALOR_GTA);
            setErroFaixa("");
          } else {
            setQuantidade(0);
            setValor(0);
            setErroFaixa("O Número Final deve ser maior ou igual ao Número Inicial.");
          }
        }
      } else {
        setQuantidade(0);
        setValor(0);
        setErroFaixa("");
      }
    };

    calc();
  }, [numInicial, numFinal]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  const handleSalvar = () => {
    if (!medico || !escritorio || !serie || numInicial.length !== 6 || numFinal.length !== 6 || erroFaixa) return;
    setIsSucesso(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="registro-venda-gta" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("busca-venda-gta")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todos os Registros de Venda
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Registro de Venda de GTA Física</h1>
            <button
              type="button"
              onClick={handleSalvar}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        <Section title="Informações Básicas">
          <div className="flex flex-col gap-6">
            
            <div className="grid grid-cols-1 gap-4">
              <MedicoVeterinarioInput
                value={medico ? medico.nome : ""}
                required
                onChange={(ent) => setMedico(ent)}
                onEyeClick={() => {}}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-end gap-2 w-full">
                <div className="flex-1">
                  <EntitySearchInput
                    label="Escritório Seccional"
                    placeholder="Buscar por nome ou sigla"
                    required
                    value={escritorio ? escritorio.nome : ""}
                    data={ESCRITORIOS_SECCIONAIS}
                    searchKeys={["nome", "sigla"]}
                    columns={[{ label: "Escritório Seccional", key: "nome" }, { label: "Sigla", key: "sigla" }]}
                    icon={
                      Icons.iconeUnidadeAdministrativaUrl ? (
                        <img
                          src={Icons.iconeUnidadeAdministrativaUrl}
                          alt="Escritório Seccional"
                          className="w-5 h-5 object-contain"
                        />
                      ) : undefined
                    }
                    title="Buscar Escritório Seccional"
                    subtitle="Busque por um escritório seccional cadastrado:"
                    confirmLabel="Selecionar"
                    onChange={(ent) => setEscritorio(ent)}
                  />
                </div>

                {escritorio && (
                  <button
                    type="button"
                    onClick={() => alert(`Visualizar detalhes de: ${escritorio.nome}`)}
                    className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-lg transition bg-white h-[44px] w-[44px] flex items-center justify-center flex-shrink-0 mb-[1px] border border-gray-200"
                    title="Visualizar Escritório"
                  >
                    <Eye size={20} />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FloatInput
                label="Série"
                required
                maxLength={2}
                value={serie}
                onChange={setSerie}
              />

              <div className="flex flex-col">
                <FloatInput
                  label="Número do Formulário Inicial"
                  required
                  maxLength={6}
                  value={numInicial}
                  onChange={(v) => setNumInicial(v.replace(/\D/g, ""))}
                />
              </div>

              <div className="flex flex-col">
                <FloatInput
                  label="Número do Formulário Final"
                  required
                  maxLength={6}
                  value={numFinal}
                  onChange={(v) => setNumFinal(v.replace(/\D/g, ""))}
                />
                {erroFaixa && <span className="text-xs text-red-500 mt-1 pl-1">{erroFaixa}</span>}
              </div>
            </div>

            {/* ARRUMADO: Removida a condicional. Agora os campos ficam visíveis permanentemente e atualizam em tempo real */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatInput
                label="Quantidade de Formulários"
                value={String(quantidade)}
                required
                disabled
                onChange={() => {}}
              />
              <FloatInput
                label="Valor"
                value={formatCurrency(valor)}
                required
                disabled
                onChange={() => {}}
              />
            </div>

          </div>
        </Section>
      </main>

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Registro de Venda gravado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">Os formulários foram atribuídos ao médico veterinário.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => { setIsSucesso(false); onNavigate("busca-venda-gta"); }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                onClick={() => { setIsSucesso(false); onNavigate("visualizar-venda-gta"); }}
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