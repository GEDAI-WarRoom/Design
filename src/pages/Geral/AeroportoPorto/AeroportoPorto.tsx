import { useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Eye as ViewIcon,
  Pencil,
  Check,
  Minus,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatSelect,
  FloatCombobox,
  SearchModal,
  FloatInput,
} from "../../../components/ui/FormKit";
import {
  EntitySearchInput,
  SelectedChipsContainer,
  ProprietarioInput,
} from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";


const GREEN = "#1A7A3C";

// MOCKS (substituir por integração real)
const ESTADOS_BR = [
  "Minas Gerais",
  "São Paulo",
  "Rio de Janeiro",
];

const MUNICIPIOS_POR_ESTADO: Record<string, string[]> = {
  "Minas Gerais": ["Belo Horizonte","Lavras","Oliveira","Uberlândia","Varginha"],
  "São Paulo": ["Campinas","Ribeirão Preto","Santos","São Paulo"],
  "Rio de Janeiro": ["Niterói","Petrópolis","Rio de Janeiro"],
};

const sanitizeOptions = (arr: unknown): string[] =>
  Array.isArray(arr) ? arr.filter((o): o is string => typeof o === "string" && o.trim() !== "") : [];

const PROPRIETARIOS_MOCK: ProprietarioEntidade[] = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "Pessoa física" },
  { id: 2, nome: "Divino de Souza Sobrinho", documento: "444.009.956-40", tipo: "Pessoa física" },
  { id: 3, nome: "Agro Cooperativa IMA", documento: "12.345.678/0001-90", tipo: "Pessoa jurídica" },
];
const MUNICIPIOS_MG = [
  "Abadia dos Dourados", "Abaeté", "Belo Horizonte", "Campo Belo", "Carrancas",
  "Divino", "Esmeraldas", "Lavras", "Oliveira", "Varginha",
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];
const TIPO_LOCAL = [
  { value: "Aeroporto", label: "Aeroporto" },
  { value: "Porto", label: "Porto" },
];

interface AeroportoPorto {
  id: number;
  codigo: string;
  nome: string;
  proprietarios: string[];
  municipio: string;
  uf: string;
  tipo: "Aeroporto" | "Porto";
  situacao: "Ativo" | "Inativo";
}

const DADOS_MOCK: AeroportoPorto[] = [
  {
    id: 1,
    codigo: "3100000001",
    nome: "Aeroporto Internacional de BH",
    proprietarios: [
      "12.345.678/0001-99 - Aero Concessões Ltda",
    ],
    municipio: "Belo Horizonte",
    uf: "MG",
    tipo: "Aeroporto",
    situacao: "Ativo",
  },
  {
    id: 2,
    codigo: "3100000002",
    nome: "Porto Seco de Uberlândia",
    proprietarios: ["99.888.777/0001-00 - Logística Sul S.A"],
    municipio: "Uberlândia",
    uf: "MG",
    tipo: "Porto",
    situacao: "Ativo",
  },
];

export function AeroportoPorto({
  onLogout,
  onNavigate,
}: {
  onLogout: () => void;
  onNavigate: (s: string, d?: any) => void;
}) {
   const [busca, setBusca] = useState(""); 
  const [tipoPessoa, setTipoPessoa] = useState("Pessoa física"); 
  const [proprietario, setProprietario] = useState<ProprietarioEntidade | null>(null); 
  const [modalProprietario, setModalProprietario] = useState(false); 
  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [tipoLocal, setTipoLocal] = useState("");
  const [situacao, setSituacao] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
    const [erroFiltro, setErroFiltro] = useState(false);

    const estadosOptions = sanitizeOptions(ESTADOS_BR);


    const onChangeEstado = (v: string) => { setEstado(v); setMunicipio(""); if (erroFiltro) setErroFiltro(false); };


  const proprietariosFiltradosModal = PROPRIETARIOS_MOCK.filter(
    (p) => p.tipo === tipoPessoa
  );

    const colunasModal = [
    { 
      label: tipoPessoa === "PF" ? "Nome" : tipoPessoa === "PJ" ? "Razão Social" : "Nome / Razão Social", 
      key: "nome" 
    },
    { 
      label: tipoPessoa === "PJ" ? "CNPJ" : tipoPessoa === "PF" ? "CPF" : "CPF / CNPJ", 
      key: "documento" 
    }
  ];

  const handlePesquisar = () => setHasSearched(true);

  const filtrados = DADOS_MOCK.filter((r) => {
    const b = busca.toLowerCase();
    return (
      (!busca ||
        r.nome.toLowerCase().includes(b) ||
        r.codigo.includes(b)) &&
      (!proprietario ||
        r.proprietarios.some((p) =>
          p.includes(proprietario.nome),
        )) &&
      (!estado ||
        r.uf === (estado === "Minas Gerais" ? "MG" : "SP")) &&
      (!municipio || r.municipio === municipio) &&
      (!tipoLocal || r.tipo === tipoLocal) &&
      (!situacao || r.situacao === situacao)
    );
  });

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="aeroporto-porto"
        hideSearch
      />
      <main className="max-w-[1300px] mx-auto px-6 py-6">
        <div className="mb-6">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm text-[#1A7A3C] font-semibold mb-3 hover:opacity-70"
          >
            <ArrowLeft size={15} /> Inicial
          </button>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Aeroportos e Portos
            </h1>
            <button
              onClick={() =>
                onNavigate("adicionar-aeroporto-porto")
              }
              className="px-5 py-3 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold hover:opacity-90"
            >
              Adicionar Novo
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="flex gap-3">
            <div className="flex-1 border border-gray-300 rounded-md px-3 h-12 flex items-center bg-white">
              <input
                type="text"
                placeholder="Código ou Nome do Aeroporto / Porto"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full h-full text-sm outline-none"
              />
              <Search size={18} className="text-gray-400" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 border rounded-md flex items-center gap-2 ${showFilters ? "bg-transparent text-[#1A7A3C] border-[#1A7A3C]" : "bg-[#1A7A3C] text-white border-[#1A7A3C]"}`}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
               <FloatInput
                label="Proprietário"
                value={proprietario ? `${proprietario.nome} ` : ""}
                icon={<img src={Icons.iconeProdutorUrl} alt="Proprietário" className="w-5 h-5 object-contain" />} 
                onClick={() => setModalProprietario(true)}
                readOnly
              />  
             
                <FloatCombobox label="Estado" value={estado} onChange={onChangeEstado} options={estadosOptions} />
               
              <button
                onClick={handlePesquisar}
                className="h-12 bg-[#1A7A3C] text-white rounded-md font-semibold text-sm hover:opacity-90"
              >
                Pesquisar
              </button>

               {estado && (
                <FloatCombobox label="Município" value={municipio} onChange={setMunicipio} options={MUNICIPIOS_MG} />
                ) }
              
              <FloatSelect
                label="Aeroporto ou Porto?"
                value={tipoLocal}
                onChange={setTipoLocal}
                options={TIPO_LOCAL}
              />
              <FloatSelect
                label="Situação"
                value={situacao}
                onChange={setSituacao}
                options={SITUACOES}
              />
            </div>
          )}

          {hasSearched && (
            <div className="overflow-x-auto ">
              <table className="w-full text-sm text-left">
                <thead className=" text-gray-600 uppercase">
                  <tr>
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Proprietários</th>
                    <th className="px-4 py-3">
                      Município - UF
                    </th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Situação</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-gray-600">
                        {r.codigo}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {r.nome}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {r.proprietarios.join(", ")}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {r.municipio} - {r.uf}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {r.tipo}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {r.situacao}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() =>
                            onNavigate("visualizar", r)
                          }
                          className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md"
                        >
                          <ViewIcon size={18} />
                        </button>
                        <button
                          onClick={() =>
                            onNavigate("editar", r)
                          }
                          className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md"
                        >
                          <Pencil size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal do Proprietário */}
      <SearchModal<ProprietarioEntidade>
        open={modalProprietario}
        onClose={() => {
          setModalProprietario(false);
          setTipoPessoa("Pessoa física");
        }}
        title="Buscar Proprietário"
        subtitle="Busque por um proprietário cadastrado no sistema:"
        icon={<img src={Icons.iconeProdutorUrl || Icons.iconeProdutorUrl} alt="Proprietário" className="w-8 h-8 object-contain" />} 
        data={proprietariosFiltradosModal}
        columns={colunasModal} // INSERIDO AQUI CONFORME SOLICITADO
        searchKeys={["nome", "documento"]}
        searchPlaceholder="Buscar Proprietário"
        confirmLabel="Confirmar"
        onConfirm={(p) => {
          setProprietario(p);
          setModalProprietario(false);
        }}
        headerActions={
          <FloatSelect
            label="Tipo de Pessoa"
            required
            value={tipoPessoa}
            onChange={(v) => setTipoPessoa(v)}
            options={[
              { value: "Pessoa física", label: "Pessoa Física" },
              { value: "Pessoa jurídica", label: "Pessoa Jurídica" },
            ]}
          />
        }
      />
    </div>
  );
}