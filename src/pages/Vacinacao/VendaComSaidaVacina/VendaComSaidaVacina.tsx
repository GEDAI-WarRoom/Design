import React, { useState } from "react";
import iconeDoencaUrl from "../../../imports/icons/Ícone=Doença.png"; 


import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Eye as ViewIcon, 
  Pencil,
  X,
  User,
  FlaskConical,
  Store
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { 
  FloatInput, 
  FloatSelect, 
  SearchModal 
} from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

const FORNECEDORES_MOCK = [
  { id: 1, nome: "Distribuidora de Vacinas Alfa LTDA", cnpj: "3190987753" },
  { id: 2, nome: "Comercial Agropecuária Beta S/A", cnpj: "3190987745" },
];

const LABORATORIOS_MOCK = [
  { id: 1, nome: "Laboratório Biovet", codigo: "LAB-001" },
  { id: 2, nome: "Zoetis Indústria Química", codigo: "LAB-002" },
];

const DOENCAS_MOCK = [
  { id: 1, nome: "Febre Aftosa", codigo: "D-01" },
  { id: 2, nome: "Brucelose", codigo: "D-02" },
  { id: 3, nome: "Raiva dos Herbívoros", codigo: "D-03" },
];

const VENDAS_MOCK = [
  { 
    id: "1", 
    fornecedor: "Distribuidora de Vacinas Alfa LTDA", 
    destinatario: "João da Silva Sauro", 
    tipoDestinatario: "produtor", 
    notaFiscal: "15420", 
    partida: "0013225/24",
    laboratorio: "Laboratório Biovet",
    doenca: "Febre Aftosa",
    situacao: "Ativo" 
  },
  { 
    id: "2", 
    fornecedor: "Comercial Agropecuária Beta S/A", 
    destinatario: "Carlos Antunes Medeiros", 
    tipoDestinatario: "vacinador", 
    notaFiscal: "15421", 
    partida: "0013225/24",
    laboratorio: "Zoetis Indústria Química",
    doenca: "Brucelose",
    situacao: "Ativo" 
  },
  { 
    id: "3", 
    fornecedor: "Distribuidora de Vacinas Alfa LTDA", 
    destinatario: "Mariana Costa Silva", 
    tipoDestinatario: "Médico Veterinário", 
    notaFiscal: "16890", 
    partida: "0013225/24",
    laboratorio: "Laboratório Biovet",
    doenca: "Raiva dos Herbívoros",
    situacao: "Inativo" 
  },
  { 
    id: "4", 
    fornecedor: "Comercial Agropecuária Beta S/A", 
    destinatario: "AgroForte Produtos Rurais", 
    tipoDestinatario: "revendedora", 
    notaFiscal: "17200", 
    partida: "0013225/24",
    laboratorio: "Zoetis Indústria Química",
    doenca: "Febre Aftosa",
    situacao: "Ativo" 
  },
  { 
    id: "5", 
    fornecedor: "Distribuidora de Vacinas Alfa LTDA", 
    destinatario: "Pedro Pedreira", 
    tipoDestinatario: "produtor", 
    notaFiscal: "18102", 
    partida: "0013225/24",
    laboratorio: "Laboratório Biovet",
    doenca: "Brucelose",
    situacao: "Inativo" 
  }
];

interface VendaComSaidaVacinaProps {
  onLogout: () => void;
  onNavigate: (screen: any) => void;
}

export function VendaComSaidaVacinaPage({ onLogout, onNavigate }: VendaComSaidaVacinaProps) {
  // Estados dos Filtros
  const [fornecedor, setFornecedor] = useState("");
  const [tipoDestinatario, setTipoDestinatario] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [cpfCnpjDestinatario, setCpfCnpjDestinatario] = useState("");
  const [notaFiscal, setNotaFiscal] = useState("");
  const [numeroPartida, setNumeroPartida] = useState("");
  const [laboratorio, setLaboratorio] = useState("");
  const [doenca, setDoenca] = useState("");
  const [situacao, setSituacao] = useState("");

  // Estado que guarda os filtros aplicados de fato após clicar em "Pesquisar"
  const [filtrosAplicados, setFiltrosAplicados] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Modais
  const [modalFornecedorOpen, setModalFornecedorOpen] = useState(false);
  const [modalLaboratorioOpen, setModalLaboratorioOpen] = useState(false);
  const [modalDoencaOpen, setModalDoencaOpen] = useState(false);

  const [page, setPage] = useState(1);
  const perPage = 10;

  // Função disparada ao clicar no botão "Pesquisar"
  const handlePesquisar = () => {
    setFiltrosAplicados({
      fornecedor,
      tipoDestinatario,
      destinatario,
      cpfCnpjDestinatario,
      notaFiscal,
      numeroPartida,
      laboratorio,
      doenca,
      situacao
    });
    setHasSearched(true);
    setPage(1);
  };

  // Filtragem dos dados baseando-se no clique do botão
  const dadosFiltrados = VENDAS_MOCK.filter((venda) => {
    if (!filtrosAplicados) return true;

    const f = filtrosAplicados;
    if (f.fornecedor && !venda.fornecedor.toLowerCase().includes(f.fornecedor.toLowerCase())) return false;
    if (f.tipoDestinatario && venda.tipoDestinatario !== f.tipoDestinatario) return false;
    if (f.destinatario && !venda.destinatario.toLowerCase().includes(f.destinatario.toLowerCase())) return false;
    if (f.notaFiscal && !venda.notaFiscal.includes(f.notaFiscal)) return false;
    if (f.numeroPartida && !venda.partida.toLowerCase().includes(f.numeroPartida.toLowerCase())) return false;
    if (f.laboratorio && !venda.laboratorio.toLowerCase().includes(f.laboratorio.toLowerCase())) return false;
    if (f.doenca && !venda.doenca.toLowerCase().includes(f.doenca.toLowerCase())) return false;
    if (f.situacao && venda.situacao !== f.situacao) return false;

    return true;
  });

  const totalResults = dadosFiltrados.length;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="venda-saida-vacina" hideSearch={true} />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div className="mb-1">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Venda com Saída de Vacina</h1>
            <button
              onClick={() => onNavigate("adicionar-venda-saida-vacina")}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Nova
            </button>
          </div>
        </div>

       <div className="bg-white rounded-xl shadow-sm p-6 mt-5">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            
            <FloatInput
              label="Fornecedor"
              value={fornecedor}
              icon={<Store size={16} />}
              onClick={() => setModalFornecedorOpen(true)}
            />

            <FloatSelect
              label="Tipo de Destinatário"
              value={tipoDestinatario}
              onChange={setTipoDestinatario}
              options={[
                { value: "produtor", label: "Produtor" },
                { value: "vacinador", label: "Vacinador" },
                { value: "medico_veterinario", label: "Médico Veterinário" },
                { value: "revendedora", label: "Revendedora de Produtos Agropecuários" },
              ]}
            />

            <FloatInput
              label="Destinatário"
              value={destinatario}
              onChange={setDestinatario}
            />

            <FloatInput
              label="CPF/CNPJ do Destinatário"
              value={cpfCnpjDestinatario}
              onChange={setCpfCnpjDestinatario}
            />

            <button
              type="button"
              onClick={handlePesquisar}
              className="px-6 py-2 rounded-md text-white text-sm font-semibold hover:opacity-90 transition"
              style={{ backgroundColor: GREEN }}
            >
              Pesquisar
            </button>

            <FloatInput
              label="Número da Nota Fiscal"
              value={notaFiscal}
              onChange={setNotaFiscal}
            />

            <FloatInput
              label="Número da Partida"
              value={numeroPartida}
              onChange={setNumeroPartida}
            />

            <FloatInput
              label="Laboratório"
              value={laboratorio}
              icon={<FlaskConical size={16} />}
              onClick={() => setModalLaboratorioOpen(true)}
            />

            <FloatInput
              label="Doença"
              value={doenca}
              icon={<img src={iconeDoencaUrl} alt="Doença" className="w-4 h-4 object-contain" />} 
              onClick={() => setModalDoencaOpen(true)}
            />

            <FloatSelect
              label="Situação"
              value={situacao}
              onChange={setSituacao}
              options={[
                { value: "Ativo", label: "Ativo" },
                { value: "Inativo", label: "Inativo" },
              ]}
            />
          </div>

         {/* Área de Chips de Filtros Ativos */}
{(fornecedor || tipoDestinatario || destinatario || cpfCnpjDestinatario || notaFiscal || numeroPartida || laboratorio || doenca || situacao) && (
  <div className="flex flex-wrap gap-2 mt-4 animate-fadeIn">
    {fornecedor && (
      <div className="flex items-center gap-1.5 bg-[#1A7A3C] text-white text-xs px-2.5 py-1.5 rounded-md">
        <span>Fornecedor: {fornecedor}</span>
        <button onClick={() => { setFornecedor(""); setFiltrosAplicados(prev => prev ? { ...prev, fornecedor: "" } : null); }}><X size={12} /></button>
      </div>
    )}
    {tipoDestinatario && (
      <div className="flex items-center gap-1.5 bg-[#1A7A3C] text-white text-xs px-2.5 py-1.5 rounded-md">
        <span>Tipo: {tipoDestinatario}</span>
        <button onClick={() => { setTipoDestinatario(""); setFiltrosAplicados(prev => prev ? { ...prev, tipoDestinatario: "" } : null); }}><X size={12} /></button>
      </div>
    )}
    {destinatario && (
      <div className="flex items-center gap-1.5 bg-[#1A7A3C] text-white text-xs px-2.5 py-1.5 rounded-md">
        <span>Destinatário: {destinatario}</span>
        <button onClick={() => { setDestinatario(""); setFiltrosAplicados(prev => prev ? { ...prev, destinatario: "" } : null); }}><X size={12} /></button>
      </div>
    )}
    {cpfCnpjDestinatario && (
      <div className="flex items-center gap-1.5 bg-[#1A7A3C] text-white text-xs px-2.5 py-1.5 rounded-md">
        <span>CPF/CNPJ: {cpfCnpjDestinatario}</span>
        <button onClick={() => { setCpfCnpjDestinatario(""); setFiltrosAplicados(prev => prev ? { ...prev, cpfCnpjDestinatario: "" } : null); }}><X size={12} /></button>
      </div>
    )}
    {/* 🚀 ADICIONADO: Chip do Número da Nota Fiscal */}
    {notaFiscal && (
      <div className="flex items-center gap-1.5 bg-[#1A7A3C] text-white text-xs px-2.5 py-1.5 rounded-md">
        <span>Nº NF: {notaFiscal}</span>
        <button onClick={() => { setNotaFiscal(""); setFiltrosAplicados(prev => prev ? { ...prev, notaFiscal: "" } : null); }}><X size={12} /></button>
      </div>
    )}
    {laboratorio && (
      <div className="flex items-center gap-1.5 bg-[#1A7A3C] text-white text-xs px-2.5 py-1.5 rounded-md">
        <span>Laboratório: {laboratorio}</span>
        <button onClick={() => { setLaboratorio(""); setFiltrosAplicados(prev => prev ? { ...prev, laboratorio: "" } : null); }}><X size={12} /></button>
      </div>
    )}
    {doenca && (
      <div className="flex items-center gap-1.5 bg-[#1A7A3C] text-white text-xs px-2.5 py-1.5 rounded-md">
        <span>Doença: {doenca}</span>
        <button onClick={() => { setDoenca(""); setFiltrosAplicados(prev => prev ? { ...prev, doenca: "" } : null); }}><X size={12} /></button>
      </div>
    )}
    {situacao && (
      <div className="flex items-center gap-1.5 bg-[#1A7A3C] text-white text-xs px-2.5 py-1.5 rounded-md">
        <span>Situação: {situacao}</span>
        <button onClick={() => { setSituacao(""); setFiltrosAplicados(prev => prev ? { ...prev, situacao: "" } : null); }}><X size={12} /></button>
      </div>
    )}
  </div>
)}

          {/* Área de Resultados Condicional */}
          {!hasSearched ? (
            <div className="text-center py-12 mt-2 border-t border-gray-100">
              <p className="text-sm text-gray-400">
                Busque por venda de vacina utilizando o campo de busca e os filtros acima.
              </p>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {["FORNECEDOR", "DESTINATÁRIO", "NÚMERO DA NOTA FISCAL", "NÚMERO DA PARTIDA", "DOENÇA", "SITUAÇÃO", "AÇÕES"].map((h) => (
                        <th key={h} className="text-xs font-semibold text-gray-500 pb-2 pr-4 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                 <tbody>
  {dadosFiltrados.length === 0 ? (
    <tr>
      <td colSpan={7} className="text-center py-8 text-gray-400 text-sm">
        Nenhum registro encontrado.
      </td>
    </tr>
  ) : (
    dadosFiltrados.map((row) => {
      // Busca o CNPJ do fornecedor correspondente para exibir na tabela
      const dadosFornecedor = FORNECEDORES_MOCK.find(f => f.nome === row.fornecedor);
      const cnpjFornecedor = dadosFornecedor ? dadosFornecedor.cnpj : "---";

      return (
        <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition align-top">
          {/* COLUNA FORNECEDOR: Código/CNPJ em cima, Nome embaixo */}
          <td className="py-3 pr-4 text-gray-500 max-w-[180px]">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-400">{cnpjFornecedor}</span>
              <span className="truncate text-sm text-gray-400 font-medium" title={row.fornecedor}>
                {row.fornecedor}
              </span>
            </div>
          </td>

          {/* COLUNA DESTINATÁRIO: CPF/CNPJ fictício (ou estático) em cima, Nome embaixo */}
          <td className="py-3 pr-4 text-gray-400">
            <div className="flex flex-col">
              {/* Como o mock de vendas não possui CPF próprio, simulamos um baseado no ID ou usamos um padrão */}
              <span className="text-xs font-semibold text-gray-400">
                {row.id === "1" ? "000.111.222-33" : "11.222.333/0001-44"}
              </span>
              <span className="text-sm text-gray-400 font-medium">
                {row.destinatario}
              </span>
            </div>
          </td>

          <td className="py-3 pr-4 text-gray-500 vertical-inherit">{row.notaFiscal}</td>
          <td className="py-3 pr-4 text-gray-500 vertical-inherit">{row.partida}</td>
          <td className="py-3 pr-4 text-gray-500 vertical-inherit">{row.doenca}</td>
          <td className="py-3 pr-4 text-gray-500 vertical-inherit">{row.situacao}</td>
          
          <td className="py-3 vertical-inherit">
            <div className="flex items-center gap-3">
              <button className="hover:opacity-70 transition text-[#1A7A3C] cursor-pointer">
                <ViewIcon size={16} />
              </button>
              <button className="hover:opacity-70 transition text-[#1A7A3C] cursor-pointer">
                <Pencil size={15} />
              </button>
            </div>
          </td>
        </tr>
      );
    })
  )}
</tbody>
                </table>
              </div>

              {totalResults > 0 && (
                <div className="flex flex-wrap items-center justify-between mt-5 gap-2 text-sm text-gray-500">
                  <span>Itens por página: {perPage}</span>
                  <div className="flex items-center gap-2">
                    <span>Mostrando de 1 a {totalResults} de {totalResults} resultados</span>
                    <button disabled className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition">
                      <ChevronLeft size={16} />
                    </button>
                    <button disabled className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* MODAL DE BUSCA: FORNECEDOR */}
      <SearchModal
        open={modalFornecedorOpen}
        onClose={() => setModalFornecedorOpen(false)}
        title="Buscar Fornecedor"
        subtitle="Busque por uma revendedora de produtos agropecuários fornecedora:"
        icon={<Store size={26} color={GREEN} />}
        data={FORNECEDORES_MOCK}
        searchKeys={["nome", "cnpj"]}
        searchPlaceholder="Busque por nome ou código"
        columns={[
          { label: "Nome", key: "nome" },
          { label: "Código", key: "cnpj" }
        ]}
        onConfirm={(item) => {
          setFornecedor(item.nome);
          setModalFornecedorOpen(false);
        }}
      />

      {/* MODAL DE BUSCA: LABORATÓRIO */}
      <SearchModal
        open={modalLaboratorioOpen}
        onClose={() => setModalLaboratorioOpen(false)}
        title="Buscar Laboratório"
        subtitle="Busque por laboratório:"
        icon={<FlaskConical size={26} color={GREEN} />}
        data={LABORATORIOS_MOCK}
        searchKeys={["nome"]}
        searchPlaceholder="Busque por nome do laboratório."
        columns={[
          { label: "Nome", key: "nome" },
        ]}
        onConfirm={(item) => {
          setLaboratorio(item.nome);
          setModalLaboratorioOpen(false);
        }}
      />

      {/* MODAL DE BUSCA: DOENÇA */}
      <SearchModal
        open={modalDoencaOpen}
        onClose={() => setModalDoencaOpen(false)}
        title="Buscar Doença"
        subtitle="Busque por Doença:"
        icon={<img src={iconeDoencaUrl} alt="Doença" className="w-6 h-6 object-contain" />}        
        data={DOENCAS_MOCK}
        searchKeys={["nome"]}
        searchPlaceholder="Busque por nome da doença."
        columns={[
          { label: "Nome da Doença", key: "nome" },
        ]}
        onConfirm={(item) => {
          setDoenca(item.nome);
          setModalDoencaOpen(false);
        }}
      />
    </div>
  );
}