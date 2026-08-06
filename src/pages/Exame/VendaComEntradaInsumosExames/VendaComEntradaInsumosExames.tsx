import { ArrowLeft, X, ChevronLeft, ChevronRight, Pencil, Store, Eye as ViewIcon, Stethoscope, } from "lucide-react";
import { useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatSelect, FloatInput } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// --- MOCKS ---
const REVENDEDORAS_MG_MOCK = [
  { id: 1, codigo: "3120938028", nome: "Comercial AgroVat", uf: "MG" },
  { id: 2, codigo: "3120938045", nome: "Agropecuária Vale Verde", uf: "MG" },
  { id: 3, codigo: "3120938090", nome: "Casa do Produtor Lavras", uf: "MG" },
];

const MEDICOS_VETERINARIOS_MOCK = [
  { id: 1, codigo: "111.111.111-11", nome: "José Firmino", uf: "MG" },
  { id: 2, codigo: "222.222.222-22", nome: "Mariana Oliveira", uf: "MG" },
  { id: 3, codigo: "333.333.333-33", nome: "Carlos Henrique Souza", uf: "MG" },
  { id: 4, codigo: "444.444.444-44", nome: "Fernanda Almeida", uf: "MG" },
  { id: 5, codigo: "555.555.555-55", nome: "Ricardo Mendes", uf: "MG" },
];

const FORNECEDORES_INSUMO_MOCK = [
  { id: 1, codigo: "3540987753", nome: "Laboratório BioMed", tipo: "Laboratório", uf: "SP" },
  { id: 2, codigo: "3190987753", nome: "Insumos Diagnósticos Imunotech", tipo: "Laboratório", uf: "PR" },
  { id: 3, codigo: "3520938028", nome: "AgroVet Distribuidora", tipo: "Revendedora", uf: "SP" },
];

const DOENCAS_MOCK = [
  { id: 1, codigo: "D-001", nome: "Brucelose (Bovina e Bubalina)", diseaseId: "brucelose" },
  { id: 2, codigo: "D-002", nome: "Tuberculose (Bovina e Bubalina)", diseaseId: "tuberculose" },
  { id: 3, codigo: "D-003", nome: "Anemia Infecciosa Equina (AIE)", diseaseId: "aie" },
  { id: 4, codigo: "D-004", nome: "Mormo (Equídeos)", diseaseId: "mormo" },
  { id: 5, codigo: "D-005", nome: "Raiva dos Herbívoros / Outras Doenças", diseaseId: "raiva-herbivoros" },
];

const SITUACOES = [
  { value: "Gravada", label: "Gravada" },
  { value: "Cancelada", label: "Cancelada" },
];

const TIPOS_DESTINATARIOS = [
  { value: "REVENDEDORA", label: "Revendedora de Produtos Agropecuários" },
  { value: "MEDICO_VETERINARIO", label: "Médico Veterinário" },
];

interface VendaEntrada {
  id: number;
  revendedoraCodigo: string;
  revendedoraNome: string;
  numeroNotaFiscal: string;
  numeroPartida: string;
  fornecedor: string;
  doenca: string;
  tipoInsumo: string;
  situacao: "Gravada" | "Cancelada";
}

const VENDAS_MOCK: VendaEntrada[] = [
  {
    id: 1,
    revendedoraCodigo: "3120938028",
    revendedoraNome: "Comercial AgroVat",
    numeroNotaFiscal: "1234567",
    numeroPartida: "0013225/24",
    fornecedor: "Laboratório BioMed",
    doenca: "Brucelose (Bovina e Bubalina)",
    tipoInsumo: "Antígeno Acidificado Tamponado (AAT)",
    situacao: "Gravada",
  },
  {
    id: 2,
    revendedoraCodigo: "3120938045",
    revendedoraNome: "Agropecuária Vale Verde",
    numeroNotaFiscal: "7654321",
    numeroPartida: "0044120/23",
    fornecedor: "AgroVet Distribuidora",
    doenca: "Tuberculose (Bovina e Bubalina)",
    tipoInsumo: "Tuberculina PPD Bovina",
    situacao: "Cancelada",
  },
  {
    id: 3,
    revendedoraCodigo: "3120938090",
    revendedoraNome: "Casa do Produtor Lavras",
    numeroNotaFiscal: "9080706",
    numeroPartida: "0099001/24",
    fornecedor: "Insumos Diagnósticos Imunotech",
    doenca: "Raiva dos Herbívoros / Outras Doenças",
    tipoInsumo: "Tuberculina PPD Aviária",
    situacao: "Gravada",
  },
];

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button onClick={onRemove} className="hover:opacity-80 transition flex-shrink-0" type="button">
        <X size={14} className="stroke-[2.5]" />
      </button>
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function VendaComEntradaInsumosExamesPage({
  onLogout,
  onNavigate,
}: PageProps) {
  // Estados dos Filtros
  const [fornecedor, setFornecedor] = useState<any | null>(null);
  const [tipoDestinatario, setTipoDestinatario] = useState("");
  const [destinatario, setDestinatario] = useState<any | null>(null);
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState("");
  const [numeroPartida, setNumeroPartida] = useState("");
  const [doenca, setDoenca] = useState<any | null>(null);
  const [situacao, setSituacao] = useState("");

  const [hasSearched, setHasSearched] = useState(false);
  const [erroValidacao, setErroValidacao] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const algumFiltroPreenchido =
    !!fornecedor ||
    !!tipoDestinatario ||
    !!destinatario ||
    numeroNotaFiscal !== "" ||
    numeroPartida !== "" ||
    !!doenca ||
    situacao !== "";

  const handlePesquisar = () => {
    if (!algumFiltroPreenchido) {
      setErroValidacao(true);
      setHasSearched(false);
      return;
    }
    setErroValidacao(false);
    setHasSearched(true);
    setPage(1);
  };

  const limparErro = () => {
    if (erroValidacao) setErroValidacao(false);
  };

  // Lógica de Filtragem dos Dados
  const filtrados = VENDAS_MOCK.filter((v) => {
    const matchFornecedor = !fornecedor || v.fornecedor === fornecedor.nome;
    const matchDestinatario =
      !destinatario ||
      v.revendedoraCodigo === destinatario.codigo ||
      v.revendedoraNome === destinatario.nome;
    const matchNF = numeroNotaFiscal === "" || v.numeroNotaFiscal.includes(numeroNotaFiscal);
    const matchPartida = numeroPartida === "" || v.numeroPartida.includes(numeroPartida);
    const matchDoenca = !doenca || v.doenca === doenca.nome;
    const matchSituacao = situacao === "" || v.situacao === situacao;

    return (
      matchFornecedor &&
      matchDestinatario &&
      matchNF &&
      matchPartida &&
      matchDoenca &&
      matchSituacao
    );
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice(
    (pageAtual - 1) * perPage,
    pageAtual * perPage
  );

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="venda-entrada-insumos-exames" hideSearch />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        {/* Cabeçalho */}
        <div className="mb-5">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} /> Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              Venda com Entrada de Insumos para Exame
            </h1>
            <button
              onClick={() => onNavigate("adicionar-venda-entrada-insumos-exames")}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Nova
            </button>
          </div>
        </div>

        {/* Card Unificado (Filtros + Tabela) */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          
          <div className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              {/* 1. Fornecedor */}
              <EntitySearchInput
                label="Fornecedor"
                placeholder="Buscar por nome ou código."
                value={fornecedor ? fornecedor.nome : ""}
                data={FORNECEDORES_INSUMO_MOCK}
                searchKeys={["codigo", "nome", "tipo"]}
                columns={[
                  { label: "Tipo", key: "tipo" },
                  { label: "Nome", key: "nome" },
                  { label: "Código", key: "codigo" },
                  { label: "UF", key: "uf" },
                ]}
                icon={
                  <img
                    src={Icons.iconeFornecedorUrl}
                    alt="Fornecedor"
                    className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0"
                  />
                }
                title="Buscar Fornecedor"
                subtitle="Busque por laboratórios ou revendedoras cadastrados:"
                onChange={(ent) => {
                  setFornecedor(ent);
                  limparErro();
                }}
              />

              {/* 2. Tipo de Destinatário */}
              <FloatSelect
                label="Tipo de Destinatário"
                value={tipoDestinatario}
                onChange={(val) => {
                  setTipoDestinatario(val);
                  setDestinatario(null); // Limpa o destinatário anterior ao mudar de tipo
                  limparErro();
                }}
                options={TIPOS_DESTINATARIOS}
              />

              {/* 3. Destinatário Condicional (Revendedora ou Médico Veterinário) */}
              {tipoDestinatario === "REVENDEDORA" ? (
                <EntitySearchInput
                  label="Revendedora de Insumos"
                  placeholder="Buscar por código ou nome."
                  value={destinatario ? destinatario.nome : ""}
                  data={REVENDEDORAS_MG_MOCK}
                  searchKeys={["codigo", "nome"]}
                  columns={[
                    { label: "Código", key: "codigo" },
                    { label: "Nome", key: "nome" },
                    { label: "UF", key: "uf" },
                  ]}
                  icon={<Store size={18} color={GREEN} />}
                  title="Buscar Revendedora de Insumos"
                  subtitle="Busque por revendedoras habilitadas:"
                  confirmLabel="Selecionar"
                  onChange={(item) => {
                    setDestinatario(item);
                    limparErro();
                  }}
                />
              ) : tipoDestinatario === "MEDICO_VETERINARIO" ? (
                <EntitySearchInput
                  label="Médico Veterinário"
                  placeholder="Buscar por CPF ou nome."
                  value={destinatario ? destinatario.nome : ""}
                  data={MEDICOS_VETERINARIOS_MOCK}
                  searchKeys={["codigo", "nome"]}
                  columns={[
                    { label: "CPF", key: "codigo" },
                    { label: "Nome", key: "nome" },
                  ]}
                  icon={<img src={Icons.iconeProfissionalAnimalUrl} alt="Médico Veterinário" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}
                  title="Buscar Médico Veterinário"
                  subtitle="Busque por médicos veterinários cadastrados:"
                  confirmLabel="Selecionar"
                  onChange={(item) => {
                    setDestinatario(item);
                    limparErro();
                  }}
                />
              ) : null}

              {/* 4. Número da Nota Fiscal */}
              <FloatInput
                label="Número da Nota Fiscal"
                value={numeroNotaFiscal}
                onChange={(value) => {
                  setNumeroNotaFiscal(value.replace(/\D/g, ""));
                  limparErro();
                }}
                maxLength={10}
              />

              {/* 5. Número da Partida */}
              <FloatInput
                label="Número da Partida"
                value={numeroPartida}
                onChange={(value) => {
                  setNumeroPartida(value);
                  limparErro();
                }}
                maxLength={10}
              />

              {/* 6. Doença */}
              <EntitySearchInput
                label="Doença"
                placeholder="Buscar pelo nome da doença"
                value={doenca ? doenca.nome : ""}
                data={DOENCAS_MOCK}
                searchKeys={["nome"]}
                columns={[{ label: "Nome da Doença", key: "nome" }]}
                icon={
                  <img
                    src={Icons.iconeDoencaUrl}
                    alt="Doença"
                    className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0"
                  />
                }
                title="Buscar Doença"
                subtitle="Busque por uma doença cadastrada:"
                onChange={(ent) => {
                  setDoenca(ent);
                  limparErro();
                }}
              />

              {/* 7. Situação */}
              <FloatSelect
                label="Situação"
                value={situacao}
                onChange={(val) => {
                  setSituacao(val);
                  limparErro();
                }}
                options={SITUACOES}
              />

              {/* 8. Botão Pesquisar - Ajustado para ocupar o restante da 2ª linha */}
              <button
                type="button"
                onClick={handlePesquisar}
                className={`${tipoDestinatario ? "md:col-span-1" : "md:col-span-2"} w-full h-12 px-5 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center flex-shrink-0`}
                style={{ backgroundColor: GREEN }}
              >
                Pesquisar
              </button>
            </div>

            {/* Mensagem de Erro / Validação */}
            {erroValidacao && !algumFiltroPreenchido && (
              <p className="text-sm text-red-500 mt-3 font-medium">
                Preencha ao menos um dos filtros acima para realizar a consulta.
              </p>
            )}

            {/* Chips dos Filtros Ativos */}
            {(fornecedor || tipoDestinatario || destinatario || numeroNotaFiscal || numeroPartida || doenca || situacao) && (
              <div className="flex flex-wrap gap-2 mt-4 animate-fadeIn">
                {fornecedor && (
                  <Chip label={`Fornecedor: ${fornecedor.nome}`} onRemove={() => setFornecedor(null)} />
                )}
                {tipoDestinatario && (
                  <Chip label={`Tipo: ${TIPOS_DESTINATARIOS.find((t) => t.value === tipoDestinatario)?.label}`} onRemove={() => { setTipoDestinatario(""); setDestinatario(null); }} />
                )}
                {destinatario && (
                  <Chip label={`Destinatário: ${destinatario.nome}`} onRemove={() => setDestinatario(null)} />
                )}
                {numeroNotaFiscal && (
                  <Chip label={`NF: ${numeroNotaFiscal}`} onRemove={() => setNumeroNotaFiscal("")} />
                )}
                {numeroPartida && (
                  <Chip label={`Partida: ${numeroPartida}`} onRemove={() => setNumeroPartida("")} />
                )}
                {doenca && (
                  <Chip label={`Doença: ${doenca.nome}`} onRemove={() => setDoenca(null)} />
                )}
                {situacao && (
                  <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />
                )}
              </div>
            )}
          </div>

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* Tabela / Resultados */}
          <div className="bg-gray-50/50">
            {!hasSearched ? (
              <div className="p-6 text-center bg-white">
                <p className="text-sm text-gray-500">
                  Busque por venda com entrada de insumos para exame utilizando os filtros acima.
                </p>
              </div>
            ) : total === 0 ? (
              <div className="p-6 text-center bg-white border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Nenhum resultado foi encontrado.
                </p>
              </div>
            ) : (
              <div className="bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-30 border-b border-gray-100">
                        <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase text-xs tracking-wider">
                          Fornecedor
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase text-xs tracking-wider">
                          Número da <br /> Nota Fiscal
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase text-xs tracking-wider">
                          Número da <br /> Partida
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase text-xs tracking-wider">
                          Destinatário
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase text-xs tracking-wider">
                          Doença
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase text-xs tracking-wider">
                          Situação
                        </th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {pagina.map((v) => (
                        <tr key={v.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500 ">
                                {v.revendedoraCodigo}
                              </span>
                              <span className="text-sm font-medium text-gray-500">
                                {v.revendedoraNome}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                            {v.numeroNotaFiscal}
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                            {v.numeroPartida}
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                            {v.fornecedor}
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                            {v.doenca}
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                            {v.situacao}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              {/* AQUI ESTÁ A CORREÇÃO: Passando 'v' no onNavigate */}
                              <button 
                                onClick={() => onNavigate("visualizar-venda-entrada-insumos-exames", v)} 
                                className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition" 
                                title="Visualizar"
                              >
                                <ViewIcon size={18} />
                              </button>
                              <button 
                                onClick={() => onNavigate("editar-venda-entrada-insumos-exames", v)} 
                                className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition" 
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
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500 bg-white">
                  <span>Itens por página: {perPage}</span>
                  <div className="flex items-center gap-4">
                    <span>
                      {inicio} - {fim} de {total}
                    </span>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageAtual === 1} className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition">
                        <ChevronLeft size={18} />
                      </button>
                      <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageAtual === totalPages} className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
