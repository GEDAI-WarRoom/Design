import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Check,
  Info,
  Ruler,
  FileText,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput,
  FloatSelect,
  SimNao,
} from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";

// --- dados ---

export const UNIDADES_MEDIDA_ENTIDADE = [
  {
    id: 1,
    codigo: "UND",
    sigla: "un",
    nome: "Unidade",
    descricao: "Quantidade unitária",
  },
  {
    id: 2,
    codigo: "KG",
    sigla: "kg",
    nome: "Quilograma",
    descricao: "Massa em quilogramas",
  },
  {
    id: 3,
    codigo: "G",
    sigla: "g",
    nome: "Grama",
    descricao: "Massa em gramas",
  },
  {
    id: 4,
    codigo: "L",
    sigla: "L",
    nome: "Litro",
    descricao: "Volume em litros",
  },
  {
    id: 5,
    codigo: "ML",
    sigla: "mL",
    nome: "Mililitro",
    descricao: "Volume em mililitros",
  },
  {
    id: 6,
    codigo: "CX",
    sigla: "cx",
    nome: "Caixa",
    descricao: "Quantidade por caixa",
  },
  {
    id: 7,
    codigo: "SC",
    sigla: "sc",
    nome: "Saca",
    descricao: "Quantidade por saca",
  },
  {
    id: 8,
    codigo: "FR",
    sigla: "fr",
    nome: "Frasco",
    descricao: "Quantidade por frasco",
  },
];
export const RECEITAS_ENTIDADE = [
  {
    id: 1,
    codigo: "REC000001",
    nome: "Vacinação Contra Brucelose",
    descricao:
      "Receita destinada à vacinação obrigatória contra Brucelose.",
    unidadeMedida: "Dose",
    quantidadePadrao: 1,
    ativo: true,
  },
  {
    id: 2,
    codigo: "REC000002",
    nome: "Tratamento Antiparasitário",
    descricao:
      "Receita para controle de endoparasitas e ectoparasitas.",
    unidadeMedida: "mL",
    quantidadePadrao: 50,
    ativo: true,
  },
  {
    id: 3,
    codigo: "REC000003",
    nome: "Suplementação Mineral",
    descricao: "Receita para suplementação mineral do rebanho.",
    unidadeMedida: "kg",
    quantidadePadrao: 25,
    ativo: true,
  },
  {
    id: 4,
    codigo: "REC000004",
    nome: "Antibiótico Veterinário",
    descricao:
      "Receita para tratamento de infecções bacterianas.",
    unidadeMedida: "Frasco",
    quantidadePadrao: 1,
    ativo: true,
  },
  {
    id: 5,
    codigo: "REC000005",
    nome: "Anti-inflamatório Veterinário",
    descricao:
      "Receita para tratamento de processos inflamatórios.",
    unidadeMedida: "mL",
    quantidadePadrao: 20,
    ativo: false,
  },
];
const INDICES = ["UFEMG", "UFEMG"];
const CONTRIBUICAO_FUNDO = ["Sim", "Não"];
const SITUACOES = ["Ativo", "Inativo"];

// const MEIOS_TRANSPORTE = ["Aéreo", "A Pé", "Ferroviário", "Marítimo/Fluvial", "Rodoviário"];
// const SITUACOES = ["Ativo", "Inativo"];
const toOptions = (arr: string[]) =>
  arr.map((v) => ({ value: v, label: v }));

// --- helpers ---

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
    <div className="bg-white rounded-xl shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">
          {title}
        </span>
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

// --- tipos ---

interface ItemReceitaData {
  id: number;
  itemReceita: string;
  unidadeMedida: string;
  receita: string;
  indice: string;
  quantidadeIndice: number;
  contribuicaoFundo: boolean;
  situacao: "Ativo" | "Inativo";
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  // Quando presente, a tela entra em modo de edição e a Situação passa a ficar disponível
  data?: ItemReceitaData;
}

export function AdicionarItemReceitaPage({
  onLogout,
  onNavigate,
  data,
}: PageProps) {
  const isEdicao = !!data;

  const [itemReceita, setItemReceita] = useState(
    data?.itemReceita ?? "",
  );
  const [unidadeMedida, setUnidadeMedida] = useState("");
  const [receita, setReceita] = useState(data?.receita ?? "");
  const [indice, setIndice] = useState(data?.indice ?? "");
  const [quantidadeIndice, setQuantidadeIndice] = useState("");
  const [contribuicaoFundo, setContribuicaoFundo] = useState(
    data?.contribuicaoFundo ?? "Sim",
  );
  const [situacao, setSituacao] = useState<string>(
    data?.situacao ?? "Ativo",
  );

  const [isSucesso, setIsSucesso] = useState(false);

  const formularioValido =
    itemReceita.trim() !== "" &&
    unidadeMedida !== "" &&
    receita !== "" &&
    indice !== "" &&
    Number(quantidadeIndice) !== 0 &&
    contribuicaoFundo !== "" &&
    situacao !== "";

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="tipo-veiculo"
        hideSearch
      />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("item-receita")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todos os Itens de Receita
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEdicao
                ? "Editar Item de Receita"
                : "Adicionar Item de Receita"}
            </h1>
            <button
              type="button"
              disabled={!formularioValido}
              onClick={() => setIsSucesso(true)}
              className="px-5 py-3 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-bold rounded-md transition shadow-sm"
            >
              {isEdicao ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center gap-3">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com{" "}
            <span className="text-red-500 font-bold">*</span>{" "}
            são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        <Section title="Informações Básicas">
          <div
            className={`grid grid-cols-1 ${isEdicao ? "md:grid-cols-3" : "md:grid-cols-2"} gap-4 items-center`}
          >
            <FloatInput
              label="Item da Receita"
              required
              value={itemReceita}
              onChange={setItemReceita}
              maxLength={255}
            />
            <EntitySearchInput
              label="Unidade de Medida"
              placeholder="Buscar por unidade de medida"
              value={unidadeMedida ? unidadeMedida : ""}
              data={UNIDADES_MEDIDA_ENTIDADE}
              searchKeys={["nome", "sigla", "descricao"]}
              columns={[
                { label: "Codigo", key: "codigo" },
                { label: "Sigla", key: "sigla" },
                { label: "Nome", key: "nome" },
                { label: "Descrição", key: "descricao" },
              ]}
              icon={<Ruler size={18} color={GREEN} />}
              title="Buscar Unidade de Medida"
              subtitle="Busque por uma unidade de medida cadastrada:"
              onChange={(ent) => {
                setUnidadeMedida(ent.nome);
              }}
              required
            />
            <EntitySearchInput
              label="Receitas"
              placeholder="Buscar por receita"
              value={receita ? receita : ""}
              data={RECEITAS_ENTIDADE}
              searchKeys={["nome", "sigla", "descricao"]}
              columns={[
                { label: "Nome", key: "nome" },
                {
                  label: "Unidade de Medida",
                  key: "unidadeMedida",
                },
                { label: "Descrição", key: "descricao" },
              ]}
              icon={<FileText size={18} color={GREEN} />}
              title="Buscar Receita"
              subtitle="Busque por uma receita cadastrada:"
              onChange={(ent) => {
                setReceita(ent.nome);
              }}
              required
            />
            <FloatSelect
              label="Indice"
              required
              value={indice}
              onChange={setIndice}
              options={toOptions(INDICES)}
            />
            <FloatInput
              label="Quantidade do Indice"
              required
              value={quantidadeIndice}
              onChange={setQuantidadeIndice}
              maxLength={2}
            />
            <SimNao
              label="Possui Contribuição ao Fundo?"
              name="possui-venc"
              required
              value={contribuicaoFundo}
              onChange={setContribuicaoFundo}
            />
            {isEdicao && (
              <FloatSelect
                label="Situação"
                required
                value={situacao}
                onChange={setSituacao}
                options={toOptions(SITUACOES)}
              />
            )}
          </div>
        </Section>
      </main>

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check
                size={28}
                className="text-[#1A7A3C]"
                strokeWidth={3}
              />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {isEdicao
                ? "Item de receita atualizado com sucesso!"
                : "Item de receita cadastrado com sucesso!"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {itemReceita
                ? `O Item de receita "${itemReceita}"`
                : "O Item de receita"}{" "}
              foi {isEdicao ? "atualizado" : "cadastrado"}.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("item-receita");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">
                Visualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}