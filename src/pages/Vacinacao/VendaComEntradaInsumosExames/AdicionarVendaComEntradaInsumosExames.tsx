import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Info,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { Navbar } from "../../../components/Navbar";
import {
  DynamicListWrapper,
  EntitySearchInput,
  FornecedorVacinaInput,
  RevendedoraInput,
} from "../../../components/ui/EntitySearch";
import {
  FloatCombobox,
  FloatInput,
  FloatSelect,
} from "../../../components/ui/FormKit";

import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// --- mock ---

const REVENDEDORAS_MG_MOCK = [
  { id: 1, codigo: "3120938028", nome: "Comercial AgroVat", uf: "MG" },
  { id: 2, codigo: "3120938045", nome: "Agropecuária Vale Verde", uf: "MG" },
  { id: 3, codigo: "3120938090", nome: "Casa do Produtor Lavras", uf: "MG" },
];

const FORNECEDORES_VACINA_MOCK = [
  {
    id: 1,
    codigo: "LAB-0001",
    nome: "Laboratório BioMed",
    tipo: "Laboratório",
    uf: "SP",
  },
  {
    id: 2,
    codigo: "LAB-0002",
    nome: "Vacinas Imunotech",
    tipo: "Laboratório",
    uf: "PR",
  },
  {
    id: 3,
    codigo: "3520938028",
    nome: "AgroVet Distribuidora",
    tipo: "Revendedora",
    uf: "SP",
  },
];

export interface MockExamSupplyType {
  id: string;
  diseaseId: string;
  name: string;
}

export const mockExamSupplyTypes: MockExamSupplyType[] = [
  // Brucelose
  {
    id: "1",
    diseaseId: "brucelose",
    name: "Soro",
  },
  {
    id: "2",
    diseaseId: "brucelose",
    name: "Leite",
  },

  // Tuberculose
  {
    id: "3",
    diseaseId: "tuberculose",
    name: "Escarro",
  },
  {
    id: "4",
    diseaseId: "tuberculose",
    name: "Fragmento de Tecido",
  },

  // Raiva
  {
    id: "5",
    diseaseId: "raiva",
    name: "Cérebro",
  },

  // Influenza Aviária
  {
    id: "6",
    diseaseId: "influenza-aviaria",
    name: "Swab Traqueal",
  },
  {
    id: "7",
    diseaseId: "influenza-aviaria",
    name: "Swab Cloacal",
  },
];

const LABORATORIOS_MOCK = [
  { id: 1, codigo: "LAB-0001", nome: "Laboratório BioMed" },
  { id: 2, codigo: "LAB-0002", nome: "Vacinas Imunotech" },
  { id: 3, codigo: "LAB-0003", nome: "ImunoVet Biológicos" },
];

const DOENCAS_MOCK = [
  {
    id: 1,
    codigo: "D-001",
    nome: "Brucelose",
    diseaseId: "brucelose",
    tiposVacina: ["B19", "RB51"],
  },
  {
    id: 2,
    codigo: "D-002",
    nome: "Raiva",
    diseaseId: "raiva",
    tiposVacina: [],
  },
  {
    id: 3,
    codigo: "D-003",
    nome: "Febre Aftosa",
    diseaseId: "febre-aftosa",
    tiposVacina: ["O1 Campos", "A24 Cruzeiro"],
  },
];

const ESTADOS_BR = [
  "Acre",
  "Alagoas",
  "Amapá",
  "Amazonas",
  "Bahia",
  "Ceará",
  "Distrito Federal",
  "Espírito Santo",
  "Goiás",
  "Maranhão",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Pará",
  "Paraíba",
  "Paraná",
  "Pernambuco",
  "Piauí",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondônia",
  "Roraima",
  "Santa Catarina",
  "São Paulo",
  "Sergipe",
  "Tocantins",
];

// ==========================================================
// HELPERS LOCAIS
// ==========================================================
function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
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
  comDivisor = false,
}: {
  titulo: string;
  children: React.ReactNode;
  comDivisor?: boolean;
}) {
  return (
    <>
      {comDivisor && <hr className="border-gray-100 my-2" />}
      <div className="flex flex-col gap-4">
        <span className="text-sm font-semibold text-gray-700">{titulo}</span>
        {children}
      </div>
    </>
  );
}

const uid = (p: string) =>
  `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
// 💡 Removido "validade" daqui
const novaApresentacao = () => ({
  uid: uid("ap"),
  frascos: "",
  dosesPorFrasco: "",
});
// 💡 Adicionado "validade" ao nível do lote
const novoLote = () => ({
  uid: uid("lt"),
  numeroPartida: "",
  laboratorio: null as any,
  doenca: null as any,
  tipoVacina: "",
  tipoInsumoExame: "",
  validade: "",
  apresentacoes: [novaApresentacao()],
});

const totalDosesApresentacao = (frascos: string, dosesPorFrasco: string) =>
  (Number(frascos) || 0) * (Number(dosesPorFrasco) || 0);

interface LoteCardItemProps {
  lote: any;
  index: number;
  fornecedor: any;
  fornecedorEhLaboratorio: boolean;
  updateLote: (loteUid: string, patch: any) => void;
  addApresentacao: (loteUid: string) => void;
  removeApresentacao: (loteUid: string, index: number) => void;
  updateApresentacao: (loteUid: string, apUid: string, patch: any) => void;
}

// ==========================================================
// COMPONENTE ISOLADO DO CARD DO LOTE
// ==========================================================
export function LoteCardItem({
  lote,
  index,
  fornecedor,
  fornecedorEhLaboratorio,
  updateLote,
  addApresentacao,
  removeApresentacao,
  updateApresentacao,
}: LoteCardItemProps) {
  const totalDosesLote =
    lote.apresentacoes?.reduce((sum: number, ap: any) => {
      return sum + totalDosesApresentacao(ap.frascos, ap.dosesPorFrasco);
    }, 0) || 0;

  const examSupplyTypes = mockExamSupplyTypes.filter(
    (item) => item.diseaseId === lote.doenca?.diseaseId,
  );
  const doencaTemTipo =
    lote.doenca &&
    lote.doenca.tiposVacina &&
    lote.doenca.tiposVacina.length > 0;

  return (
    <div className="flex flex-col gap-4 w-full pb-4">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 items-end">
        <FloatInput
          label="Número de Partida"
          required
          placeholder="0013225/19"
          value={lote.numeroPartida}
          onChange={(v) => updateLote(lote.uid, { numeroPartida: v })}
          maxLength={10}
        />

        <EntitySearchInput
          label="Laboratório"
          placeholder="Buscar laboratório..."
          value={lote.laboratorio ? lote.laboratorio.nome : ""}
          data={LABORATORIOS_MOCK}
          searchKeys={["nome"]}
          columns={[{ label: "Nome do Laboratório", key: "nome" }]}
          icon={<FlaskConical size={18} color={GREEN} />}
          title="Buscar Laboratório"
          subtitle="Busque por um laboratório cadastrado:"
          onChange={(ent) => updateLote(lote.uid, { laboratorio: ent })}
        />
      </div>

      {/* Grid contendo Doença, Tipo de Vacina (se houver) e Validade alinhados */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 items-end`}>
        <EntitySearchInput
          label="Doença"
          placeholder="Buscar doença..."
          value={lote.doenca ? lote.doenca.nome : ""}
          data={DOENCAS_MOCK}
          searchKeys={["nome"]}
          columns={[{ label: "Nome da Doença", key: "nome" }]}
          icon={
            <img
              src={Icons.iconeDoencaUrl || (Icons as any).iconedoencaurl}
              alt="Doença"
              className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0"
            />
          }
          title="Buscar Doença"
          subtitle="Busque por uma doença cadastrada:"
          onChange={(ent) =>
            updateLote(lote.uid, { doenca: ent, tipoVacina: "" })
          }
        />
        <FloatSelect
          label="Tipo de Insumo de Exame"
          options={examSupplyTypes.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          value={lote.tipoInsumoExame || ""}
          onChange={(v) => updateLote(lote.uid, { tipoInsumoExame: v })}
        />
        <FloatInput
          label="Validade"
          required
          icon={<Calendar size={18} />}
          type="month"
          placeholder="mm/aaaa"
          value={lote.validade || ""}
          onChange={(v) => updateLote(lote.uid, { validade: v })}
        />
      </div>

      <SubGrupo titulo="Apresentação de Insumos" comDivisor>
        <DynamicListWrapper
          items={lote.apresentacoes}
          behavior="at-least-one"
          addButtonLabel="Adicionar Apresentação"
          itemLabel=""
          onAddItem={() => addApresentacao(lote.uid)}
          onRemoveItem={(i: number) => removeApresentacao(lote.uid, i)}
          variant="plain"
          showCounter={true}
          smallCounter={true}
        >
          {(ap: any) => (
            // Grid de apresentações agora possui apenas 3 colunas, ficando visualmente mais limpo e espaçoso!
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end w-full">
              <FloatInput
                label="Nº de Doses por Frasco"
                required
                type="text"
                value={ap.dosesPorFrasco}
                onChange={(v) =>
                  updateApresentacao(lote.uid, ap.uid, {
                    dosesPorFrasco: v.replace(/\D/g, "").slice(0, 10),
                  })
                }
              />
              <FloatInput
                label="Nº de Frascos Adquiridos"
                required
                type="text"
                value={ap.frascos}
                onChange={(v) =>
                  updateApresentacao(lote.uid, ap.uid, {
                    frascos: v.replace(/\D/g, "").slice(0, 10),
                  })
                }
              />

              <FloatInput
                label="Total de Doses"
                required
                disabled
                value={String(
                  totalDosesApresentacao(ap.frascos, ap.dosesPorFrasco) || "",
                )}
                onChange={() => {}}
              />
            </div>
          )}
        </DynamicListWrapper>
      </SubGrupo>

      <SubGrupo titulo="Total do Lote" comDivisor>
        <FloatInput
          label="Total de Doses Adquiridas"
          required
          disabled
          value={String(totalDosesLote || "")}
          onChange={() => {}}
          className="md:w-1/2"
        />
      </SubGrupo>
    </div>
  );
}

// ==========================================================
// PÁGINA PRINCIPAL
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarVendaComEntradaInsumosExamesPage({
  onLogout,
  onNavigate,
}: PageProps) {
  const [revendedora, setRevendedora] = useState<any | null>(null);
  const [fornecedor, setFornecedor] = useState<any | null>(null);
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState("");
  const [ufNotaFiscal, setUfNotaFiscal] = useState("");
  const [lotes, setLotes] = useState<any[]>([novoLote()]);
  const [isSucesso, setIsSucesso] = useState(false);

  const fornecedorEhLaboratorio = fornecedor?.tipo === "Laboratório";

  const updateLote = (loteUid: string, patch: any) =>
    setLotes((ls) =>
      ls.map((l) => (l.uid === loteUid ? { ...l, ...patch } : l)),
    );
  const addLote = () => setLotes((ls) => [...ls, novoLote()]);
  const removeLote = (index: number) =>
    setLotes((ls) => ls.filter((_, i) => i !== index));

  const addApresentacao = (loteUid: string) =>
    setLotes((ls) =>
      ls.map((l) =>
        l.uid === loteUid
          ? { ...l, apresentacoes: [...l.apresentacoes, novaApresentacao()] }
          : l,
      ),
    );
  const removeApresentacao = (loteUid: string, index: number) =>
    setLotes((ls) =>
      ls.map((l) =>
        l.uid === loteUid
          ? {
              ...l,
              apresentacoes: l.apresentacoes.filter(
                (_: any, i: number) => i !== index,
              ),
            }
          : l,
      ),
    );
  const updateApresentacao = (loteUid: string, apUid: string, patch: any) =>
    setLotes((ls) =>
      ls.map((l) =>
        l.uid === loteUid
          ? {
              ...l,
              apresentacoes: l.apresentacoes.map((a: any) =>
                a.uid === apUid ? { ...a, ...patch } : a,
              ),
            }
          : l,
      ),
    );

  const totaisPorDoenca = useMemo(() => {
    const map = new Map<string, number>();
    lotes.forEach((l) => {
      const nome = l.doenca?.nome;
      if (!nome) return;
      const totalLote = l.apresentacoes.reduce(
        (s: number, a: any) =>
          s + totalDosesApresentacao(a.frascos, a.dosesPorFrasco),
        0,
      );
      map.set(nome, (map.get(nome) || 0) + totalLote);
    });
    return Array.from(map, ([doenca, total]) => ({ doenca, total }));
  }, [lotes]);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="venda-entrada-vacina"
        hideSearch
      />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("venda-entrada-insumos-exames")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todas Vendas com Entrada de Insumos para Exames
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">
              Adicionar Venda com Entrada de Insumos para Exames
            </h1>
            <button
              type="button"
              onClick={() => setIsSucesso(true)}
              className="px-5 py-3 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold rounded-md transition shadow-sm cursor-pointer"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3">
            <div className="text-gray-500 flex-shrink-0">
              <Info size={20} className="stroke-[2.5]" />
            </div>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Campos indicados com{" "}
              <span className="text-red-500 font-bold">*</span> são obrigatórios
              e deverão ser preenchidos.
            </p>
          </div>

          <Section title="Origem dos Insumos Adquiridos">
            <div className="flex flex-col gap-3">
              <FornecedorVacinaInput
                value={fornecedor ? fornecedor.codigo : ""}
                required
                tooltipText="Não encontrou a Fornecedora de Vacina? Entre em contato com o Escritório Seccional do IMA de sua região."
                onChange={(entidadeSelecionada) =>
                  setFornecedor(entidadeSelecionada)
                }
                onEyeClick={() => {
                  if (fornecedor?.codigo)
                    alert(`Visualizar detalhes: ${fornecedor.codigo}`);
                  else
                    alert(
                      "Por favor, digite ou selecione um fornecedor primeiro.",
                    );
                }}
              />
            </div>
          </Section>

          <Section title="Estabelecimento Recebedor de Insumos">
            <div className="flex flex-col gap-3">
              <RevendedoraInput
                value={revendedora ? revendedora.codigo : ""}
                required
                onChange={(entidadeSelecionada) =>
                  setRevendedora(entidadeSelecionada)
                }
                onEyeClick={() => {
                  if (revendedora?.codigo)
                    alert(`Visualizar detalhes: ${revendedora.codigo}`);
                  else
                    alert(
                      "Por favor, digite ou selecione uma revendedora primeiro.",
                    );
                }}
              />
            </div>
          </Section>

          <Section title="Nota Fiscal">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <FloatInput
                  label="Número da Nota Fiscal"
                  required
                  type="text"
                  value={numeroNotaFiscal}
                  onChange={(v) =>
                    setNumeroNotaFiscal(v.replace(/\D/g, "").slice(0, 10))
                  }
                />
                <FloatCombobox
                  label="UF da Nota Fiscal"
                  required
                  value={ufNotaFiscal}
                  onChange={setUfNotaFiscal}
                  options={ESTADOS_BR}
                />
              </div>

              <DynamicListWrapper
                items={lotes}
                behavior="at-least-one"
                addButtonLabel="Adicionar Lote"
                itemLabel="Lote de Insumos de Exames"
                onAddItem={addLote}
                onRemoveItem={removeLote}
                showCounter={false}
              >
                {(lote: any, index: number) => (
                  <LoteCardItem
                    key={lote.uid}
                    lote={lote}
                    index={index}
                    fornecedor={fornecedor}
                    fornecedorEhLaboratorio={fornecedorEhLaboratorio}
                    updateLote={updateLote}
                    addApresentacao={addApresentacao}
                    removeApresentacao={removeApresentacao}
                    updateApresentacao={updateApresentacao}
                  />
                )}
              </DynamicListWrapper>

              <SubGrupo titulo="Total da Nota" comDivisor>
                {totaisPorDoenca.length === 0 ? (
                  <span className="text-sm text-gray-400 italic pl-1">
                    Selecione a doença e as doses nos lotes para ver os totais.
                  </span>
                ) : (
                  <div className="flex flex-col gap-3">
                    {totaisPorDoenca.map((t) => (
                      <div
                        key={t.doenca}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
                      >
                        <FloatInput
                          label="Doença"
                          disabled
                          value={t.doenca}
                          onChange={() => {}}
                        />
                        <FloatInput
                          label="Total de Doses Adquiridas"
                          disabled
                          value={String(t.total)}
                          onChange={() => {}}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </SubGrupo>
            </div>
          </Section>
        </div>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Venda com entrada de insumos para exames adicionada com sucesso!
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {numeroNotaFiscal
                ? `Nota Fiscal nº ${numeroNotaFiscal}`
                : "A venda"}{" "}
              foi registrada.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("venda-entrada-insumos-exames");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("visualizar-venda-entrada-insumos-exames");
                }}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition cursor-pointer"
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

export default AdicionarVendaComEntradaInsumosExamesPage;
