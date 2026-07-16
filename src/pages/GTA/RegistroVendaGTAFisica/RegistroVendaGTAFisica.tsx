import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye as ViewIcon,
  Pencil,
  X,
  Check,
  PauseCircle,
  Info,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatSelect,
  FloatInput,
} from "../../../components/ui/FormKit";
import {
  UnidadeAdministrativaInput,
  MedicoVeterinarioInput,
  EntitySearchInput
} from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";


const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS DE ENTIDADE (Substituir por chamadas à API)
// ==========================================================

const SITUACOES = [
  { value: "Gravada", label: "Gravada" },
  { value: "Reservado", label: "Reservado" },
  { value: "Cancelado", label: "Cancelado" },
  { value: "Vendido", label: "Vendido" },
];

export const ESCRITORIOS_SECCIONAIS: EscritorioSeccional[] = [
  { id: 1, nome: "Escritório Seccional de Lavras", sigla: "SECLAV3820" },
  { id: 2, nome: "Escritório Seccional de Uberlândia", sigla: "SECUDI2140" },
  { id: 3, nome: "Escritório Seccional de Juiz de Fora", sigla: "SECJDF3310" },
];

interface VendaGta {
  id: number;
  medicoCpf: string;
  medicoNome: string;
  serie: string;
  numInicial: string;
  numFinal: string;
  substituidos: string;
  substitutos: string;
  escritorioCodigo: string;
  escritorioNome: string;
  situacao: "Gravada" | "Reservado" | "Cancelado" | "Vendido";
}

const VENDAS_GTA_MOCK: VendaGta[] = [
  {
    id: 1,
    medicoCpf: "123.456.789-00",
    medicoNome: "Dr. Carlos Eduardo Silva",
    serie: "A1",
    numInicial: "000001",
    numFinal: "000050",
    substituidos: "—",
    substitutos: "—",
    escritorioCodigo: "1",
    escritorioNome: "Coordenadoria Regional de Belo Horizonte",
    situacao: "Gravada",
  },
  {
    id: 2,
    medicoCpf: "987.654.321-11",
    medicoNome: "Dra. Mariana Costa Alencar",
    serie: "B2",
    numInicial: "000100",
    numFinal: "000200",
    substituidos: "000150, 000151",
    substitutos: "000201, 000202",
    escritorioCodigo: "2",
    escritorioNome: "Coordenadoria Regional de Lavras",
    situacao: "Vendido",
  },
  {
    id: 3,
    medicoCpf: "456.789.123-22",
    medicoNome: "Dr. Roberto Antunes Vieira",
    serie: "C3",
    numInicial: "000500",
    numFinal: "000550",
    substituidos: "—",
    substitutos: "—",
    escritorioCodigo: "3",
    escritorioNome: "Coordenadoria Regional de Uberlândia",
    situacao: "Reservado",
  },
  {
    id: 4,
    medicoCpf: "123.456.789-00",
    medicoNome: "Dr. Carlos Eduardo Silva",
    serie: "A1",
    numInicial: "000051",
    numFinal: "000099",
    substituidos: "—",
    substitutos: "—",
    escritorioCodigo: "1",
    escritorioNome: "Coordenadoria Regional de Belo Horizonte",
    situacao: "Cancelado",
  },
];

export const MEDICOS_VETERINARIOS_GTA: MedicoVendaGTA[] = [
  { id: 1, nome: "Dr. Carlos Eduardo Silva", cpf: "123.456.789-00", gtaDisponiveis: 0 },
  { id: 2, nome: "Dra. Mariana Costa Alencar", cpf: "987.654.321-11", gtaDisponiveis: 12 },
  { id: 3, nome: "Dr. Roberto Antunes Vieira", cpf: "456.789.123-22", gtaDisponiveis: 0 },
];

// ==========================================================
// COMPONENTES DE UI
// ==========================================================

function SituacaoBadge({
  situacao,
}: {
  situacao: VendaGta["situacao"];
}) {
  const map = {
    Gravada: {
      bg: "#EBF5FF",
      border: "#A4CAFE",
      text: "#1E40AF",
      Icon: Info,
    },
    Reservado: {
      bg: "#FEF3E2",
      border: "#FCD9A3",
      text: "#B45309",
      Icon: PauseCircle,
    },
    Cancelado: {
      bg: "#FEE2E2",
      border: "#FECACA",
      text: "#991B1B",
      Icon: X,
    },
    Vendido: {
      bg: "#E6F4EA",
      border: "#A3E2B8",
      text: "#1A7A3C",
      Icon: Check,
    },
  } as const;

  const { bg, border, text, Icon } = map[situacao];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{
        backgroundColor: bg,
        border: `1px solid ${border}`,
        color: text,
      }}
    >
      <Icon size={13} strokeWidth={3} />
      {situacao}
    </span>
  );
}

function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button
        onClick={onRemove}
        className="hover:opacity-80 transition flex-shrink-0"
      >
        <X size={14} className="stroke-[2.5]" />
      </button>
    </div>
  );
}

// ==========================================================
// PÁGINA PRINCIPAL
// ==========================================================

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function RegistroVendaGtaFisicaPage({
  onLogout,
  onNavigate,
}: PageProps) {
  // Estados do Filtro
  const [numeroFormulario, setNumeroFormulario] = useState("");
  const [escritorio, setEscritorio] = useState<any | null>(
    null,
  );
    const [medico, setMedico] = useState<MedicoVendaGTA | null>(null);

  const [veterinario, setVeterinario] = useState<any | null>(
    null,
  );
  const [serie, setSerie] = useState("");
  const [numero, setNumero] = useState(""); // Adicione esta linha!
  const [situacao, setSituacao] = useState("");

  // Estados da UI
  const [showFilters, setShowFilters] = useState(false);
  const [focusNumero, setFocusNumero] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handlePesquisar = () => {
    setHasSearched(true);
    setPage(1);
  };

  // Lógica de Filtragem
  const filtrados = VENDAS_GTA_MOCK.filter((v) => {
    const matchNumero =
      numeroFormulario === "" ||
      v.numInicial.includes(numeroFormulario) ||
      v.numFinal.includes(numeroFormulario);
    const matchEscritorio =
      !escritorio || v.escritorioNome === escritorio.nome;
    const matchVeterinario =
      !veterinario || v.medicoNome === veterinario.nome;
    const matchSerie =
      serie === "" ||
      v.serie.toLowerCase().includes(serie.toLowerCase());
    const matchSituacao =
      situacao === "" || v.situacao === situacao;

    return (
      matchNumero &&
      matchEscritorio &&
      matchVeterinario &&
      matchSerie &&
      matchSituacao
    );
  });

  // Paginação
  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio =
    total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice(
    (pageAtual - 1) * perPage,
    pageAtual * perPage,
  );

  const temFiltroAtivo =
    escritorio || veterinario || serie || situacao;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="registro-venda-gta"
        hideSearch
      />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        {/* Topo da Página */}
        <div className="mb-4">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              Registro de Venda de GTA Física
            </h1>
            <button
              onClick={() => onNavigate("adicionar-registro-venda-gta-fisica")}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Novo
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
         

            <div className="animate-fadeIn flex flex-col gap-4 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1.4fr_180px] gap-4 items-end w-full">
               <EntitySearchInput
              label="Escritório Seccional"
              placeholder="Buscar por nome ou sigla"
              value={escritorio?.nome ?? ""}
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
              subtitle="Busque po um escritório seccional cadastrado:"
              confirmLabel="Selecionar"
              onChange={setEscritorio}
            />

                <EntitySearchInput
              label="Médico Veterinário"
              placeholder="Buscar por nome ou CPF"
              value={medico?.nome ?? ""}
              data={MEDICOS_VETERINARIOS_GTA}
              searchKeys={["nome", "cpf"]}
              columns={[{ label: "Nome", key: "nome" }, { label: "CPF", key: "cpf" }]}
              icon={
                  Icons.iconeProfissionalAnimalUrl ? (
                    <img
                      src={Icons.iconeProfissionalAnimalUrl}
                      alt="Médico Veterinário"
                      className="w-5 h-5 object-contain"
                    />
                  ) : undefined
                }
              title="Buscar Médico Veterinário"
              subtitle="Busque por um médico veterinário cadastrado:"
              confirmLabel="Selecionar"
              onChange={setMedico}
            />

                <button
                  onClick={handlePesquisar}
                  className="h-12 w-full rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center"
                  style={{ backgroundColor: GREEN }}
                >
                  Pesquisar
                </button>
              </div>

             {/* Ajustado para md:grid-cols-12 para usar o padrão nativo do Tailwind */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end w-full">

  {/* Ocupa 3 colunas de 12 */}
  <div className="md:col-span-3">
    <FloatInput
      label="Série do Formulário"
      value={serie}
      onChange={setSerie}
      maxLength={2}
    />
  </div>

  {/* CORRIGIDO: Ocupa 5 colunas de 12 e alterado para usar as variáveis corretas do Número */}
  <div className="md:col-span-5">
    <FloatInput
      label="Número do Formulário"
      value={numero} // Alterado de 'serie' para 'numero'
      onChange={setNumero} // Alterado de 'setSerie' para 'setNumero'
    />
  </div>

  {/* Ocupa 4 colunas de 12 (3 + 5 + 4 = 12 colunas perfeitas na mesma linha) */}
  <div className="md:col-span-4">
    <FloatSelect
      label="Situação"
      value={situacao}
      onChange={setSituacao}
      options={SITUACOES}
    />
  </div>

</div>
            </div>
         

          {/* Chips de Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {escritorio && (
                <Chip
                  label={`Escritório: ${escritorio.nome}`}
                  onRemove={() => setEscritorio(null)}
                />
              )}
              {veterinario && (
                <Chip
                  label={`Veterinário: ${veterinario.nome}`}
                  onRemove={() => setVeterinario(null)}
                />
              )}
              {serie && (
                <Chip
                  label={`Série: ${serie}`}
                  onRemove={() => setSerie("")}
                />
              )}
              {situacao && (
                <Chip
                  label={`Situação: ${situacao}`}
                  onRemove={() => setSituacao("")}
                />
              )}
            </div>
          )}

          {/* Linha Divisória */}
          {hasSearched && (
            <div className="border-t border-gray-100 my-1" />
          )}

          {/* ÁREA DE RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">
                Busque por registros de venda utilizando os filtros acima.
              </p>
            </div>
          ) : total === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">
                Nenhum resultado foi encontrado.
              </p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto  rounded-lg">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className=" border-b border-gray-100">
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal min-w-[180px]">
                        Médico Veterinário
                      </th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal min-w-[80px]">
                        Série
                      </th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal min-w-[140px]">
                        Faixa de Formulários
                      </th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal min-w-[140px]">
                        Formulários Substituídos
                      </th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal min-w-[140px]">
                        Formulários Substitutos
                      </th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal min-w-[180px]">
                        Escritório Seccional
                      </th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal min-w-[120px]">
                        Situação
                      </th>
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((v) => (
                      <tr
                        key={v.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition"
                      >
                        {/* Médico Veterinário */}
                        <td className="px-4 py-3 text-gray-500  text-sm whitespace-normal">
                          <div>{v.medicoCpf}</div>
                          <div className="font-normal text-gray-500">
                            {v.medicoNome}
                          </div>
                        </td>

                        {/* Série */}
                        <td className="px-4 py-3 text-gray-500 text-sm">
                          {v.serie}
                        </td>

                        {/* Faixa de Formulários */}
                        <td className="px-4 py-3 text-gray-500 text-sm font-normal">
                          {v.numInicial} - {v.numFinal}
                        </td>

                        {/* Substituídos */}
                        <td className="px-4 py-3 text-gray-500 text-sm">
                          {v.substituidos}
                        </td>

                        {/* Substitutos */}
                        <td className="px-4 py-3 text-gray-500 text-sm">
                          {v.substitutos}
                        </td>

                        {/* Escritório Seccional */}
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {v.escritorioNome}
                        </td>

                        {/* Situação */}
                        <td className="px-4 py-3 text-gray-500 text-sm">
                          {v.situacao}
                        </td>

                        {/* Ações */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() =>
                                onNavigate(
                                  "visualizar-venda-gta",
                                  v,
                                )
                              }
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Visualizar"
                            >
                              <ViewIcon size={18} />
                            </button>
                            <button
                              onClick={() =>
                                onNavigate(
                                  "editar-venda-gta",
                                  v,
                                )
                              }
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Editar"
                            >
                              <Pencil size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {perPage}</span>
                <div className="flex items-center gap-4">
                  <span>
                    {inicio} - {fim} de {total}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setPage((p) => Math.max(1, p - 1))
                      }
                      disabled={pageAtual === 1}
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setPage((p) =>
                          Math.min(totalPages, p + 1),
                        )
                      }
                      disabled={pageAtual === totalPages}
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}