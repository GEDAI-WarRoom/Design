import React, { useState } from "react";
import { ArrowLeft, Check, Info, PlusCircle, X } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { MultiSearchModal } from "../../../components/ui/FormKit";
import {
  DynamicListWrapper,
  ProprietarioInput,
  DOENCAS_MOCK,
  BlocoEnderecoFields,
  BlocoContatoFields,
} from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

const uid = (p: string) =>
  `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ==========================================================
// HELPERS DE UI (mesmo padrão das demais páginas de cadastro)
// ==========================================================
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-5">
          {children}
        </div>
      )}
    </div>
  );
}

function SubGrupo({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-sm font-semibold text-gray-700">{titulo}</span>
      {children}
    </div>
  );
}

// ==========================================================
// ESTADOS AUXILIARES (Localização / Contato)
// ==========================================================
interface EnderecoState {
  zona: string;
  cep: string;
  estado: string;
  municipio: string;
  bairro: string;
  endereco: string;
  numero: string;
  complemento: string;
  localidade: string;
  distrito: string;
  latitude?: string;
  longitude?: string;
}

const enderecoVazio = (): EnderecoState => ({
  zona: "",
  cep: "",
  estado: "",
  municipio: "",
  bairro: "",
  endereco: "",
  numero: "",
  complemento: "",
  localidade: "",
  distrito: "",
  latitude: "",
  longitude: "",
});

interface ContatoState {
  utilizarContatoProprietario: "Sim" | "Não";
  proprietariosSelecionados: string[];
  emailFixo: string;
  emailFixoObs: string;
  telefoneFixo: string;
  telefoneFixoObs: string;
  contatosAdicionais: any[];
}

const contatoVazio = (): ContatoState => ({
  utilizarContatoProprietario: "Não",
  proprietariosSelecionados: [],
  emailFixo: "",
  emailFixoObs: "",
  telefoneFixo: "",
  telefoneFixoObs: "",
  contatosAdicionais: [],
});

// ==========================================================
// PÁGINA: ADICIONAR INSTITUIÇÃO DE ENSINO E PESQUISA
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarInstituicaoEnsinoPesquisaPage({
  onLogout,
  onNavigate,
}: PageProps) {
  // Proprietários (uma ou mais)
  const [proprietarios, setProprietarios] = useState<any[]>([
    { uid: uid("prop"), proprietario: null },
  ]);

  // Exames que Realiza (zero ou mais doenças, seleção via modal com tooltips/chips)
  const [modalDoencaAberto, setModalDoencaAberto] = useState(false);
  const [doencasSelecionadas, setDoencasSelecionadas] = useState<any[]>([]);

  // Localização Simples
  const [endereco, setEndereco] = useState<EnderecoState>(enderecoVazio());

  // Contato com Proprietários
  const [contato, setContato] = useState<ContatoState>(contatoVazio());

  const [isSucesso, setIsSucesso] = useState(false);

  // Lista de proprietários já selecionados, repassada para o bloco de Contato
  const proprietariosDisponiveis = proprietarios
    .filter((p) => p.proprietario)
    .map((p) => ({
      id: p.proprietario.documento,
      nome: p.proprietario.nome,
      cpf: p.proprietario.documento,
    }));

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="instituicao-ensino-pesquisa"
        hideSearch
      />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("instituicao-ensino-pesquisa")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todas as Instituições de Ensino e Pesquisa
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">
              Adicionar Instituição de Ensino e Pesquisa
            </h1>
            <button
              type="button"
              onClick={() => setIsSucesso(true)}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Alerta de Campos Obrigatórios */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-2">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com{" "}
            <span className="text-red-500 font-bold">*</span> são obrigatórios e
            deverão ser preenchidos.
          </p>
        </div>

        {/* 1. Informações Básicas — Proprietários */}
        <Section title="Informações Básicas">
          <SubGrupo titulo="Proprietários">
            <DynamicListWrapper
              items={proprietarios}
              behavior="at-least-one"
              variant="plain"
              addButtonLabel="Adicionar Proprietário"
              itemLabel="Proprietário"
              onAddItem={() =>
                setProprietarios((p) => [
                  ...p,
                  { uid: uid("prop"), proprietario: null },
                ])
              }
              onRemoveItem={(i: number) =>
                setProprietarios((p) => p.filter((_, idx) => idx !== i))
              }
            >
              {(item: any) => (
                <ProprietarioInput
                  value={item.proprietario ? item.proprietario.nome : ""}
                  label="Proprietário"
                  required
                  onChange={(entidadeSelecionada) =>
                    setProprietarios((p) =>
                      p.map((x) =>
                        x.uid === item.uid
                          ? { ...x, proprietario: entidadeSelecionada }
                          : x,
                      ),
                    )
                  }
                  onEyeClick={() => {
                    if (item.proprietario?.documento)
                      alert(
                        `Visualizar detalhes: ${item.proprietario.documento}`,
                      );
                    else
                      alert("Por favor, selecione um proprietário primeiro.");
                  }}
                />
              )}
            </DynamicListWrapper>
          </SubGrupo>
        </Section>

        {/* 2. Exames que Realiza (Zero ou mais) */}
        <Section title="Exames que Realiza">
          <div className="w-full border border-gray-200 rounded-xl bg-[#f9fafb]/50 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-500">
                  Doença Selecionada
                </span>
                {doencasSelecionadas.length > 0 && (
                  <span className="text-xs font-bold bg-[#E6F4EA] text-[#1A7A3C] px-2.5 py-1 rounded-full">
                    {doencasSelecionadas.length}{" "}
                    {doencasSelecionadas.length === 1
                      ? "Selecionada"
                      : "Selecionadas"}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setModalDoencaAberto(true)}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 transition cursor-pointer"
              >
                <PlusCircle size={14} /> Adicionar Doença
              </button>
            </div>

            <div className="p-5 flex flex-wrap gap-4">
              {doencasSelecionadas.length === 0 ? (
                <p className="text-xs text-gray-400 italic">
                  Nenhuma doença selecionada para esta instituição.
                </p>
              ) : (
                doencasSelecionadas.map((doenca) => (
                  <div
                    key={doenca.id}
                    className="flex flex-col bg-white border border-gray-200 rounded-xl p-2.5 min-w-[220px] shadow-sm transition hover:border-gray-300 relative group"
                  >
                    <div className="flex items-center justify-between gap-4 w-full">
                      <span className="text-sm font-bold text-[#1A7A3C]">
                        {doenca.nome}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setDoencasSelecionadas((prev) =>
                            prev.filter((d) => d.id !== doenca.id),
                          )
                        }
                        className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded-md hover:bg-gray-50 cursor-pointer"
                        title="Remover"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <MultiSearchModal
            open={modalDoencaAberto}
            onClose={() => setModalDoencaAberto(false)}
            title="Buscar Doenças"
            subtitle="Busque por uma ou mais doenças cadastradas no sistema:"
            icon={
              <img
                src={Icons.iconeDoencaUrl}
                alt="Doença"
                className="w-5 h-5 object-contain"
              />
            }
            data={DOENCAS_MOCK}
            columns={[{ label: "Nome da Doença", key: "nome" }]}
            searchKeys={["nome"]}
            searchPlaceholder="Busque pelo nome da doença."
            selectedItems={doencasSelecionadas}
            confirmLabel="Salvar Selecionadas"
            onConfirm={(doencas) => {
              setDoencasSelecionadas(doencas);
              setModalDoencaAberto(false);
            }}
          />
        </Section>

        {/* 3. Localização Simples */}
        <Section title="Localização">
          <BlocoEnderecoFields
            title="Endereço da Instituição"
            data={endereco}
            tipoEstado="normal"
            onChange={(key, value) =>
              setEndereco((prev) => ({ ...prev, [key]: value }))
            }
            onSetMultipleFields={(fields) =>
              setEndereco((prev) => ({ ...prev, ...fields }))
            }
          />
        </Section>

        {/* 4. Contato com Proprietários */}
        <Section title="Contato com Proprietários">
          <BlocoContatoFields
            data={contato}
            onChange={(updatedData) =>
              setContato((prev) => ({ ...prev, ...updatedData }))
            }
            proprietariosDisponiveis={proprietariosDisponiveis}
          />
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
              Instituição de Ensino e Pesquisa cadastrada com sucesso!
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              O cadastro foi realizado e a situação inicial será definida como
              Ativo.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("instituicao-ensino-pesquisa");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("visualizar-instituicao-ensino-pesquisa");
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
