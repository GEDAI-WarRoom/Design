import React, { useState } from "react";
import { ArrowLeft, Info, Check, PlusCircle, Trash2, Download } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, UploadField, LargeTextArea } from "../../../components/ui/FormKit";
import {
  ProfissionalAnimalInput,
  UnidadeAdministrativaInput,
  DynamicListWrapper,
  PessoaFisicaInput,
} from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";

const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const ESFERAS = [
  { value: "Municipal", label: "Municipal" },
  { value: "Estadual", label: "Estadual" },
  { value: "Federal", label: "Federal" },
];

// Máscara do MASP: "XXXXXXX-X" — 8 dígitos preenchidos da direita para a
// esquerda, completando com zeros à esquerda. Ex.: "10171858" → "1017185-8".
function aplicarMascaraMasp(valor: string): string {
  const digitos = valor.replace(/\D/g, "").slice(-8); // mantém no máx. 8 dígitos
  if (digitos === "") return "";
  const cheio = digitos.padStart(8, "0"); // zeros à esquerda
  return `${cheio.slice(0, 7)}-${cheio.slice(7)}`;
}

// ==========================================================
// HELPERS DE UI (mesmo padrão do fluxo de cadastro)
// ==========================================================
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-base font-semibold text-gray-800">{title}</span>
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}

function SubGrupo({ titulo, children, comDivisor = false }: { titulo: string; children: React.ReactNode; comDivisor?: boolean }) {
  return (
    <>
      {comDivisor && <hr className="border-gray-100" />}
      <div className="flex flex-col gap-4">
        <span className="text-sm font-semibold text-gray-700">{titulo}</span>
        {children}
      </div>
    </>
  );
}

// ==========================================================
// PÁGINA: ADICIONAR PROFISSIONAL DE SERVIÇO OFICIAL (US063 - AC1)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarProfissionalOficialPage({ onLogout, onNavigate }: PageProps) {
  // Informações Básicas
  const [pessoa, setPessoa] = useState<any | null>(null);

  // Serviço Oficial
  const [esfera, setEsfera] = useState("");
  const [masp, setMasp] = useState("");

  // Unidade Administrativa
  const [unidade, setUnidade] = useState<any | null>(null);

  // Anexos (zero ou mais) e Observações
  const [anexos, setAnexos] = useState<any[]>([]);
  const [observacao, setObservacao] = useState("");

  const [isSucesso, setIsSucesso] = useState(false);

  // MASP só aparece quando a esfera é "Estadual"
  const mostrarMasp = esfera === "Estadual";

  const handleEsfera = (v: string) => {
    setEsfera(v);
    if (v !== "Estadual") setMasp(""); // limpa MASP fora de "Estadual"
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="profissional-servico-oficial" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("profissional-servico-oficial")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todos os Profissionais de Serviço Oficial
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Profissional de Serviço Oficial</h1>
            <button type="button" onClick={() => setIsSucesso(true)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Adicionar</button>
          </div>
        </div>

        {/* Info box de campos obrigatórios */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
            <PessoaFisicaInput
              label="Pessoa Física"
              required
              value={pessoa ? pessoa.nome : ""}
              onChange={(ent: any) => setPessoa(ent)}
              onEyeClick={() => pessoa && onNavigate("visualizar-pessoa", pessoa)}
            />

          
        {/* 2. Serviço Oficial */}
        <SubGrupo title="Serviço Oficial">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FloatSelect label="Esfera do Serviço Oficial" required value={esfera} onChange={handleEsfera} options={ESFERAS} />
            {/* MASP — só se a Esfera for "Estadual" */}
            {mostrarMasp && (
              <FloatInput
                label="MASP"
                required
                value={masp}
                onChange={(v: string) => setMasp(aplicarMascaraMasp(v))}
                placeholder="XXXXXXX-X"
                hasTooltip
                tooltipText="Módulo de Autorização de Serviços Profissionais. Gerencia as habilitações, extensões e autorizações do profissional habilitado."
              />
            )}
          </div>
        </SubGrupo>
           
        </Section>

        

        {/* 3. Unidade Administrativa de Vinculação */}
<Section title="Unidade Administrativa de Vinculação">

    <UnidadeAdministrativaInput
      label="Unidade Administrativa"
      required
      value={unidade?.nome || ""} // 💡 Garante o envio do texto amigável para o input principal
      onChange={(ent: any) => setUnidade(ent)} // 💡 Salva o objeto selecionado completo no estado
      onEyeClick={() => unidade && onNavigate("visualizar-unidade-administrativa", unidade)}
    />

</Section>
{/* Seção Anexo Geral Dinâmica com Numeração */}
        <Section title="Anexo">
          <div className="flex flex-col gap-6">
            {anexos.map((anexo, index) => (
              <div key={anexo.id} className="flex gap-4 items-start relative w-full rounded-xl p-4 bg-white">

                {/* Número indicador do anexo (Igual ao Representante Legal) */}
                <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-3">
                  {index + 1}
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex gap-3 items-start w-full">

                    <UploadField
                      label="Documento"
                      required
                      fileName={anexo.nome}
                      onSelectFile={() =>
                        setAnexos(prev =>
                          prev.map((a, i) =>
                            i === index ? { ...a, nome: `documento_geral_${index + 1}.pdf` } : a
                          )
                        )
                      }
                    />



                    {/* Campos de Descrição e Download (Só abrem se houver documento anexado) */}
                    {anexo.nome && (
                      <>
                        <div className="flex-1">
                          <FloatInput
                            label="Descrição"
                            value={anexo.descricao || ""}
                            placeholder="Descrição opcional..."
                            onChange={(v) => setAnexos(prev => prev.map((a, i) => i === index ? { ...a, descricao: v } : a))}
                          />
                        </div>
                        <div className="h-12 flex items-center">
                          <button
                            type="button"
                            onClick={() => alert(`Fazendo download de: ${anexo.nome}`)}
                            className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                          >
                            <Download size={20} />
                          </button>
                        </div>
                      </>
                    )}

                    {/* Botão de Excluir o Anexo */}
                    <div className="h-12 flex items-center">
                      <button
                        type="button"
                        onClick={() => setAnexos(prev => prev.filter(a => a.id !== anexo.id))}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}

            {/* Botão para Adicionar Novo Anexo */}
            <button
              type="button"
              onClick={() => setAnexos(prev => [...prev, { id: String(Date.now()), nome: "", descricao: "" }])}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition"
            >
              <PlusCircle size={16} /> Adicionar Anexo
            </button>
          </div>
        </Section>

         {/* 5. Observações */}
        <Section title="Observações">
          <LargeTextArea
            label="Observação"
            value={observacao}
            onChange={setObservacao}
            maxLength={1500}
            hasTooltip
            tooltipText="Informações adicionais pertinentes ao cadastro."
          />
        </Section>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Profissional adicionado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">{pessoa?.nome ? `"${pessoa.nome}"` : "O profissional"} foi cadastrado como profissional de serviço oficial.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("profissional-servico-oficial"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-profissional-servico-oficial", {
                nome: pessoa?.nome, cpf: pessoa?.cpf,
                esfera, masp,
                unidade: unidade?.nome,
                situacao: "Ativo",
              }); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}