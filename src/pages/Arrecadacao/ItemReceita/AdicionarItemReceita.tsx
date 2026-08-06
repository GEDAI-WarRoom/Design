import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
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
import { listarIndices } from "../Indice/indiceIndice";
import { listarReceitas } from "../Receita/receitaData";
import { listarUnidadesMedida } from "../../Geral/UnidadeMedida/unidadeMedidaData";
import {
  salvarItemReceita,
  type ItemReceitaVisual,
} from "./itemReceitaData";

const GREEN = "#1A7A3C";

const SITUACOES = ["Ativo", "Inativo"];

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

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  data?: ItemReceitaVisual;
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
  const [unidadeMedida, setUnidadeMedida] = useState(data?.unidadeMedida ?? "");
  const [unidadeMedidaId, setUnidadeMedidaId] = useState(data?.unidadeMedidaId ?? 0);
  const [receita, setReceita] = useState(data?.receita ?? "");
  const [receitaId, setReceitaId] = useState(data?.receitaId ?? 0);
  const [indice, setIndice] = useState(data?.indice ?? "");
  const [indiceId, setIndiceId] = useState(data?.indiceId ?? "");
  const [quantidadeIndice, setQuantidadeIndice] = useState(data?.quantidadeIndice ? String(data.quantidadeIndice) : "");
  const [contribuicaoFundo, setContribuicaoFundo] = useState(
    data ? data.contribuicaoFundo : "Sim",
  );
  const [situacao, setSituacao] = useState<string>(
    data?.situacao ?? "Ativo",
  );

  const [isSucesso, setIsSucesso] = useState(false);
  const [registroSalvo, setRegistroSalvo] = useState<ItemReceitaVisual | null>(null);

  const salvar = () => {
    const unidade = listarUnidadesMedida().find((item) => item.id === unidadeMedidaId) ?? listarUnidadesMedida().find((item) => item.situacao === "Ativo")!;
    const receitaSelecionada = listarReceitas().find((item) => item.id === receitaId) ?? listarReceitas().find((item) => item.situacao === "Ativo")!;
    const indiceSelecionado = listarIndices().find((item) => item.id === indiceId) ?? listarIndices().find((item) => item.situacao === "Ativo")!;
    const salvo = salvarItemReceita({
      id: data?.id,
      codigo: data?.codigo,
      descricao: itemReceita.trim() || "Taxa de Expediente Geral",
      unidadeMedidaId: unidade.id,
      receitaId: receitaSelecionada.id,
      indiceId: indiceSelecionado.id,
      quantidadeIndice: Number((quantidadeIndice || "1,50").replace(",", ".")),
      permiteContribuicaoFundo: contribuicaoFundo === "Sim",
      situacao: situacao as "Ativo" | "Inativo",
    });
    setRegistroSalvo(salvo);
    setItemReceita(salvo.descricao);
    setUnidadeMedida(salvo.unidadeMedida);
    setReceita(salvo.receita);
    setIndice(salvo.indice);
    setIsSucesso(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="item-receita"
        hideSearch
      />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("item-receita")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
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
              onClick={salvar}
              className="px-6 py-3 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-bold rounded-md transition shadow-sm"
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
            className={`grid grid-cols-1 ${isEdicao ? "md:grid-cols-3" : "md:grid-cols-2"
              } gap-4 items-center`}
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
              value={unidadeMedida}
              data={listarUnidadesMedida().filter((item) => item.situacao === "Ativo")}
              searchKeys={["nome", "sigla", "descricao"]}
              columns={[
                { label: "Unidade de Medida", key: "sigla" },
                { label: "Descrição", key: "nome" },
              ]}
              icon={<Ruler size={18} color={GREEN} />}
              title="Buscar Unidade de Medida"
              subtitle="Busque por uma unidade de medida cadastrada:"
              onChange={(ent) => {
                setUnidadeMedida(ent.nome);
                setUnidadeMedidaId(ent.id);
              }}
              required
            />
            <EntitySearchInput
              label="Receitas"
              placeholder="Buscar por receita"
              value={receita}
              data={listarReceitas().filter((item) => item.situacao === "Ativo")}
              searchKeys={["codigo", "descricao"]}
              columns={[
                { label: "Código", key: "codigo" },
                { label: "Descrição", key: "descricao" },
              ]}
              icon={<FileText size={18} color={GREEN} />}
              title="Buscar Receita"
              subtitle="Busque por uma receita cadastrada:"
              onChange={(ent) => {
                setReceita(ent.descricao);
                setReceitaId(ent.id);
              }}
              required
            />
            <FloatSelect
              label="Índice"
              required
              value={indiceId}
              onChange={(value) => {
                setIndiceId(value);
                setIndice(listarIndices().find((item) => item.id === value)?.nome ?? "");
              }}
              options={listarIndices().filter((item) => item.situacao === "Ativo").map((item) => ({ value: item.id, label: item.nome }))}
            />
            <FloatInput
              label="Quantidade do Índice"
              required
              value={quantidadeIndice}
              onChange={setQuantidadeIndice}
              maxLength={12}
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

      {/* Modal de Sucesso com largura expandida */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 text-center animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-900">
              {isEdicao
                ? "Item de receita atualizado com sucesso!"
                : "Item de receita cadastrado com sucesso!"}
            </h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-md mx-auto">
              {itemReceita
                ? `O Item de receita "${itemReceita}"`
                : "O Item de receita"}{" "}
              foi {isEdicao ? "atualizado" : "cadastrado"} com sucesso no sistema.
            </p>
            <div className="flex gap-3 justify-center mt-8">
              <button
                type="button"
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("item-receita");
                }}
                className="px-8 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/50 transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("visualizar-item-receita", registroSalvo);
                }}
                className="px-8 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition shadow-sm"
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
