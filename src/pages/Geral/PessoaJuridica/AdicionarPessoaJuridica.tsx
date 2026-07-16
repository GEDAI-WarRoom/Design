import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  PlusCircle,
  MapPin,
  Trash2,
  UserRound,
  Map,
  Info,
  X,
  Eye,
  Paperclip,
  Download,
  Calendar,
  Search
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";

import {
  FloatInput,
  FloatSelect,
  FloatCombobox,
  CustomRadio,
  UploadField,
  LargeTextArea,
  CustomButton,
  SearchModal
} from "../../../components/ui/FormKit"; 


const GREEN = "#1A7A3C";

const PESSOAS_MOCK = [
  { id: 1, nome: "Divino Alves Inácio", cpf: "940.877.688-72", sexo: "M", dataNascimento: "1978-04-15", estadoCivil: "casado" },
  { id: 2, nome: "Divino de Souza Sobrinho", cpf: "444.009.956-40", sexo: "M", dataNascimento: "1965-11-22", estadoCivil: "solteiro" },
  { id: 3, nome: "Divino José Fonseca", cpf: "017.704.896-49", sexo: "M", dataNascimento: "1982-08-03", estadoCivil: "divorciado" },
].sort((a, b) => a.nome.localeCompare(b.nome));

const CNPJ_MOCK: Record<string, { razaoSocial: string; nomeFantasia: string }> = {
  "12345678000199": {
    razaoSocial: "Agropecuária Vale Verde Ltda",
    nomeFantasia: "Vale Verde Agro"
  }
};

const MUNICIPIOS_MOCK = ["Lavras", "Belo Horizonte", "Abaeté", "Abadia dos Dourados", "Passos", "Uberlândia"];
const LOCALIDADES_MOCK = ["Centro", "Floresta", "Serrinha", "Vale do Sul"];
const DISTRITOS_MOCK = ["Abadia dos Dourados", "Abaeté", "Distrito de Campos do Meio", "Vale do Norte"];
const TIPOS_CONTATO = ["E-mail", "Telefone", "Celular", "Fax"];

const aplicarMascaraCPF = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
};

const aplicarMascaraCNPJ = (value: string) => {
  return value
    .replace(/\D/g, "") // Remove tudo o que não for número
    .slice(0, 14) // Limita a 14 dígitos
    .replace(/^(\d{2})(\d)/, "$1.$2") // Coloca o primeiro ponto
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3") // Coloca o segundo ponto
    .replace(/\.(\d{3})(\d)/, ".$1/$2") // Coloca a barra
    .replace(/(\d{4})(\d)/, "$1-$2"); // Coloca o hífen
};

const aplicarMascaraCEP = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
};



function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5 relative">{children}</div>}
    </div>
  );
}

// ==========================================
// FUNÇÕES DE MÁSCARA PARA FORMATO DMS
// ==========================================
const aplicarMascaraDMS = (value: string, direcaoPadrao: "S" | "W") => {
  const apenasNumeros = value.replace(/\D/g, "");
  if (!apenasNumeros) return "";

  const g = apenasNumeros.slice(0, 2);
  const m = apenasNumeros.slice(2, 4);
  let s = apenasNumeros.slice(4, 7);

  if (s.length === 3) {
    s = `${s.slice(0, 2)}.${s.slice(2)}`;
  }

  if (g && !m) return `${g}°`;
  if (g && m && !s) return `${g}° ${m}'`;
  return `${g}° ${m}' ${s}" ${direcaoPadrao}`;
};

// ==========================================
// COMPONENTE MAPMODAL ATUALIZADO
// ==========================================
interface MapModalProps {
  onClose: () => void;
  onConfirm: (lat: string, lng: string) => void;
  initialLat?: string;
  initialLng?: string;
}

function MapModal({ onClose, onConfirm, initialLat, initialLng }: MapModalProps) {
  const [mapType, setMapType] = useState<"mapa" | "satelite">("mapa");
  const [formatType, setFormatType] = useState<"dms" | "decimal">("dms");
  
  // Estados para o formato Decimal tradicional
  const [latDecimal, setLatDecimal] = useState("-21.233481");
  const [lngDecimal, setLngDecimal] = useState("-44.991278");

  // Estados para o formato DMS com máscara
  const [latDMS, setLatDMS] = useState("");
  const [lngDMS, setLngDMS] = useState("");

  const handleLatDMSChange = (val: string) => {
    if (val.length < latDMS.length && (latDMS.endsWith("S") || latDMS.endsWith('"'))) {
      setLatDMS("");
      return;
    }
    setLatDMS(aplicarMascaraDMS(val, "S"));
  };

  const handleLngDMSChange = (val: string) => {
    if (val.length < lngDMS.length && (lngDMS.endsWith("W") || lngDMS.endsWith('"'))) {
      setLngDMS("");
      return;
    }
    setLngDMS(aplicarMascaraDMS(val, "W"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      {/* ALTERADO DE max-w-2xl PARA max-w-4xl PARA DAR MAIS LARGURA AOS CAMPOS */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 flex flex-col gap-6 relative font-sans text-gray-800">
        
        {/* Botão de fechar absoluto no canto superior direito */}
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-sm font-medium transition"
        >
          ✕
        </button>

        {/* Cabeçalho centralizado */}
        <div className="flex flex-col items-center gap-2 text-center mt-2">
          <div className="flex items-center gap-2">
            <Map size={26} style={{ color: GREEN }} />
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Buscar no Mapa</h2>
          </div>
          <p className="text-sm text-gray-600 font-medium mt-2">Selecione a localização no mapa:</p>
        </div>

        {/* Corpo do Modal: Caixa do Mapa Restrito com Alternador */}
        <div className="w-full h-[240px] rounded-xl border border-gray-200 overflow-hidden relative bg-gray-100 select-none flex items-center justify-center">
          
          {/* Alternador de Tipo de Mapa */}
          <div className="absolute top-3 right-3 z-10 bg-white rounded-lg shadow-sm border border-gray-200 p-0.5 flex gap-0.5">
            <button
              type="button"
              onClick={() => setMapType("mapa")}
              className={`text-[10px] font-bold px-3 py-1.5 rounded transition ${mapType === "mapa" ? "bg-[#1A7A3C] text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Mapa
            </button>
            <button
              type="button"
              onClick={() => setMapType("satelite")}
              className={`text-[10px] font-bold px-3 py-1.5 rounded transition ${mapType === "satelite" ? "bg-[#1A7A3C] text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Satélite
            </button>
          </div>

          {/* Renderização Visual de Mock do Mapa */}
          {mapType === "mapa" ? (
            <div className="absolute inset-0 bg-[#ccece6] overflow-hidden opacity-90">
              <div className="absolute inset-x-0 top-1/2 h-4 bg-white border-y border-gray-300 -rotate-6 transform scale-110" />
              <div className="absolute top-1/3 left-1/3 text-[11px] text-gray-400 font-bold tracking-wider uppercase">Lavras</div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-[#1e2923] overflow-hidden">
              <div className="absolute inset-0 opacity-40 bg-radial from-emerald-900/30 via-transparent to-black" />
            </div>
          )}

          {/* Marcador Central Fixo */}
          <div className="relative z-20 flex flex-col items-center -mt-6">
            <MapPin size={34} className="text-[#1A7A3C] fill-[#1A7A3C] drop-shadow-md" />
            <div className="w-2 h-1 bg-black/20 rounded-full blur-[1px] mt-0.5" />
          </div>
        </div>

        {/* Inputs de Formulário de Entrada Alinhados Horizontalmente */}
        <div className="grid grid-cols-12 gap-4 items-end text-left w-full">
          
          {/* Componente FloatSelect padrão do seu sistema */}
          <div className="col-span-4">
            <FloatSelect
              label="Formato"
              required
              value={formatType}
              onChange={(v) => setFormatType(v as "dms" | "decimal")}
              options={[
                { value: "dms", label: "DMS (Graus, Minutos, Segundos)" },
                { value: "decimal", label: "DD (Decimal)" }
              ]}
            />
          </div>

          {/* Renderização Dinâmica com os componentes FloatInput padrão do seu sistema */}
          {formatType === "dms" ? (
            <>
              <div className="col-span-4">
                <FloatInput 
                  label="Latitude" 
                  required 
                  placeholder={'__° __\' __._"S'}
                  value={latDMS} 
                  onChange={handleLatDMSChange} 
                />
              </div>
              <div className="col-span-4">
                <FloatInput 
                  label="Longitude" 
                  required 
                  placeholder={'__° __\' __._"W'}
                  value={lngDMS} 
                  onChange={handleLngDMSChange} 
                />
              </div>
            </>
          ) : (
            <>
              <div className="col-span-4">
                <FloatInput 
                  label="Latitude" 
                  required 
                  value={latDecimal} 
                  onChange={(v) => setLatDecimal(v)} 
                />
              </div>
              <div className="col-span-4">
                <FloatInput 
                  label="Longitude" 
                  required 
                  value={lngDecimal} 
                  onChange={(v) => setLngDecimal(v)} 
                />
              </div>
            </>
          )}
        </div>

        {/* Rodapé com botão centralizado */}
        <div className="flex justify-center items-center gap-3 w-full pt-2">
          <button 
            type="button"
            onClick={onClose}
            className="px-10 py-2.5 bg-white text-[#1A7A3C] text-sm font-semibold rounded-md border border-[#1A7A3C] hover:bg-gray-50 shadow-sm transition"
          >
            Cancelar
          </button>
          <button 
            type="button"
            onClick={() => {
              if (formatType === "decimal") {
                onConfirm(latDecimal, lngDecimal);
              } else {
                onConfirm(latDMS, lngDMS);
              }
            }}
            className="px-10 py-2.5 text-white text-sm font-semibold rounded-md shadow-sm transition-all duration-200"
            style={{ backgroundColor: GREEN }}
          >
            Confirmar
          </button>
        </div>

      </div>
    </div>
  );
}
interface BuscarRepresentanteModalProps { onConfirm: (p: any) => void; onClose: () => void; }
function BuscarRepresentanteModal({ onConfirm, onClose }: BuscarRepresentanteModalProps) {
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState<any>(null);

  const resultadosFiltrados = PESSOAS_MOCK.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 flex flex-col gap-6 relative">
        {/* Botão de fechar opcional no topo direito caso queira */}
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-sm font-medium">
          ✕
        </button>

        {/* Cabeçalho centralizado conforme a imagem */}
        <div className="flex flex-col items-center gap-2 text-center mt-2">
          <div className="flex items-center gap-2">
            <UserRound size={26} style={{ color: GREEN }} />
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Buscar Representante Legal</h2>
          </div>
          <p className="text-sm text-gray-600 font-medium mt-2">Busque por um representante legal:</p>
        </div>
        
        {/* Input de busca com ícone de Lupa interno à direita */}
        <div className="relative w-full">
          <input 
            type="text" 
            value={busca} 
            onChange={(e) => {
              setBusca(e.target.value);
              setSelecionado(null);
            }} 
            placeholder="Digite para pesquisar..." 
            className="w-full border border-gray-300 rounded-md pl-4 pr-10 py-2.5 text-sm outline-none focus:border-[#1A7A3C] transition-all text-gray-700" 
          />
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Tabela de Resultados: Aparece apenas se houver texto digitado */}
        {busca.trim().length > 0 && (
          <div className="flex flex-col w-full min-h-[180px] transition-all duration-200">
            {resultadosFiltrados.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-800 tracking-wider uppercase">
                    <th className="pb-3 w-12"></th>
                    <th className="pb-3 px-4">
                      <div className="flex items-center gap-1 cursor-pointer select-none">
                        NOME <ChevronDown size={14} className="text-gray-500" />
                      </div>
                    </th>
                    <th className="pb-3 px-4">
                      <div className="flex items-center gap-1 cursor-pointer select-none">
                        CPF <ChevronDown size={14} className="text-gray-500" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {resultadosFiltrados.map(p => (
                    <tr 
                      key={p.id} 
                      onClick={() => setSelecionado(p)}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 text-center">
                        <CustomRadio 
                          name="modal_rep" 
                          value={String(p.id)} 
                          checked={selecionado?.id === p.id} 
                          onChange={() => setSelecionado(p)} 
                        />
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-600 font-medium">
                        {p.nome}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-500 font-normal">
                        {p.cpf}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-sm text-gray-400">
                Nenhum representante encontrado com este nome.
              </div>
            )}
          </div>
        )}

        {/* Rodapé com botão centralizado */}
        <div className="flex justify-center w-full pt-2">
          <button 
            type="button" 
            disabled={!selecionado} 
            onClick={() => onConfirm(selecionado)} 
            className="px-10 py-2.5 rounded-md font-semibold text-sm transition-all duration-200 shadow-sm" 
            style={{ 
              backgroundColor: selecionado ? GREEN : "#E2E4E8", 
              color: selecionado ? "#FFFFFF" : "#A3A7AF",
              cursor: selecionado ? "pointer" : "not-allowed"
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}


interface EnderecoState { zona: string; cep: string; estado: string; municipio: string; bairro: string; endereco: string; numero: string; complemento: string; localidade: string; distrito: string; latitude?: string; longitude?: string; }
interface BlocoEnderecoFieldsProps { title: string; data: EnderecoState; isCorrespondencia?: boolean; onChange: (key: keyof EnderecoState, value: string) => void; onSetMultipleFields: (fields: Partial<EnderecoState>) => void; onOpenMap: () => void; }

function BlocoEnderecoFields({ title, data, isCorrespondencia = false, onChange, onSetMultipleFields, onOpenMap }: BlocoEnderecoFieldsProps) {
  const handleZonaChange = (novaZona: string) => {
    if (novaZona === "Rural") {
      onSetMultipleFields({ zona: "Rural", estado: "Minas Gerais", cep: "", bairro: "", numero: "", complemento: "" });
    } else {
      onChange("zona", novaZona);
    }
  };

  const handleCepChange = async (val: string) => {
    const formatado = aplicarMascaraCEP(val);
    onChange("cep", formatado);
    const apenasNumeros = formatado.replace(/\D/g, "");
    if (apenasNumeros.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${apenasNumeros}/json/`);
        const json = await response.json();
        if (!json.erro) {
          onSetMultipleFields({
            cep: formatado,
            estado: json.uf === "MG" ? "Minas Gerais" : json.uf === "SP" ? "São Paulo" : json.uf || "",
            municipio: json.localidade || "",
            bairro: json.bairro || "",
            endereco: json.logradouro || "",
          });
        }
      } catch (error) { console.error(error); }
    }
  };

  const isRural = data.zona === "Rural";

  return (
    <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 first:border-0 first:pt-0">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <div className={`grid grid-cols-1 gap-3 ${isRural ? "md:grid-cols-3" : "md:grid-cols-5"}`}>
        <FloatSelect label="Zona" required value={data.zona} disabled={isCorrespondencia} onChange={handleZonaChange} options={[{ value: "Urbana", label: "Urbana" }, { value: "Rural", label: "Rural" }]} />
        {!isRural && <FloatInput label="CEP" required value={data.cep} onChange={handleCepChange} maxLength={9} />}
        <FloatSelect label="Estado" required value={data.estado} disabled={isRural} onChange={(v) => onChange("estado", v)} options={[{ value: "Minas Gerais", label: "Minas Gerais" }, { value: "São Paulo", label: "São Paulo" }]} />
        <FloatCombobox label="Município" required value={data.municipio} onChange={(v) => onChange("municipio", v)} options={MUNICIPIOS_MOCK} />
        {!isRural && <FloatInput label="Bairro" required value={data.bairro} onChange={(v) => onChange("bairro", v)} />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className={`relative hover:z-30 focus-within:z-30 ${isRural ? "md:col-span-12" : "md:col-span-7"}`}>
          <FloatInput label="Endereço" required value={data.endereco} onChange={(v) => onChange("endereco", v)} className="w-full" hasTooltip={isRural} tooltipText="Nome da estrada e o quilômetro de referência." />
        </div>
        {!isRural && (
          <>
            <FloatInput label="Número" required value={data.numero} onChange={(v) => onChange("numero", v)} className="md:col-span-2" />
            <FloatInput label="Complemento" value={data.complemento} onChange={(v) => onChange("complemento", v)} className="md:col-span-3" />
          </>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FloatCombobox label="Localidade" value={data.localidade} onChange={(v) => onChange("localidade", v)} options={LOCALIDADES_MOCK} />
        <FloatCombobox label="Distrito" value={data.distrito} onChange={(v) => onChange("distrito", v)} options={DISTRITOS_MOCK} />
      </div>
      {/* Se NÃO tiver coordenadas, mostra apenas o botão grandão inicial */}
{!(data.latitude && data.longitude) ? (
  <div className="flex flex-col gap-2">
    <button 
      type="button" 
      onClick={onOpenMap} 
      className="w-full flex items-center justify-center gap-2 border border-[#1A7A3C] rounded-md h-11 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50 transition shadow-sm"
    >
      <Map size={16} /> Adicionar Coordenadas
    </button>
  </div>
) : (
  /* Se TIVER coordenadas, o botão menor fica no LADO ESQUERDO, com bordas verdes e sem sombra */
  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end animate-fade-in">
    {/* Botão menor na esquerda (ocupa 2 colunas) - Com borda verde e sem sombra */}
    <div className="md:col-span-2">
      <button 
        type="button" 
        onClick={onOpenMap} 
        className="w-full flex items-center justify-center border border-[#1A7A3C] rounded-md h-11 bg-white hover:bg-green-50/30 text-[#1A7A3C] transition"
        title="Editar Localização"
      >
        <Map size={18} />
      </button>
    </div>

    {/* Latitude no meio (ocupa 5 colunas) */}
    <div className="md:col-span-5">
      <FloatInput 
        label="Latitude" 
        value={data.latitude} 
        onChange={(v) => onChange("latitude", v)} 
        disabled={true} 
      />
    </div>

    {/* Longitude na direita (ocupa 5 colunas) */}
    <div className="md:col-span-5">
      <FloatInput 
        label="Longitude" 
        value={data.longitude} 
        onChange={(v) => onChange("longitude", v)} 
        disabled={true} 
      />
    </div>
  </div>
)}
    </div>
  );
}

interface RepresentanteState {
  id: string;
  nome: string;
  cpf: string;
  descricao: string;
  documentoNome: string;
}

export function AdicionarPessoaJuridicaPage({ onLogout, onNavigate }: { onLogout: () => void; onNavigate: (screen: any) => void }) {
  const [cnpj, setCnpj] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [cpf, setCpf] = useState("");
  const [anexos, setAnexos] = useState<any[]>([]);
  const [anexoDescricao, setAnexoDescricao] = useState("");
  const [observacaoGeral, setObservacaoGeral] = useState("");
  const [isSucessoModalOpen, setIsSucessoModalOpen] = useState(false);

  const [representantes, setRepresentantes] = useState<RepresentanteState[]>([]);
  const [modalRepIndex, setModalRepIndex] = useState<number | null>(null);
  const [mapTarget, setMapTarget] = useState<"correspondencia" | "residencia" | null>(null);
  const [showContatoTooltip, setShowContatoTooltip] = useState(false);

  const [isEnderecoResidencia, setIsEnderecoResidencia] = useState<"Sim" | "Não">("Sim");
  const [observacaoResidencia, setObservacaoResidencia] = useState("");

  const [correspondencia, setCorrespondencia] = useState<EnderecoState>({ zona: "Urbana", cep: "", estado: "", municipio: "", bairro: "", endereco: "", numero: "", complemento: "", localidade: "", distrito: "" });
  const [residencia, setResidencia] = useState<EnderecoState>({ zona: "Urbana", cep: "", estado: "", municipio: "", bairro: "", endereco: "", numero: "", complemento: "", localidade: "", distrito: "" });

  const [contatosFixos, setContatosFixos] = useState([
    { id: "fixed-1", tipo: "E-mail", valor: "", observacao: "" },
    { id: "fixed-2", tipo: "Telefone", valor: "", observacao: "" }
  ]);
  const [outrosContatos, setOutrosContatos] = useState<any[]>([]);

  const handleCpfChange = (val: string) => {
    const formatado = aplicarMascaraCPF(val);
    setCpf(formatado);
    const limpo = formatado.replace(/\D/g, "");

    if (limpo.length === 11) {
      setNome("João da Silva");
      setSexo("M");
      setDataNascimento("1985-05-15");
      setEstadoCivil("casado");
    } else {
      setNome("");
      setSexo("");
      setDataNascimento("");
      setEstadoCivil("");
    }
  };

const handleCnpjChange = (val: string) => {
  const formatado = aplicarMascaraCNPJ(val);
  setCnpj(formatado);
  const limpo = formatado.replace(/\D/g, "");

  if (limpo.length === 14) {
    setRazaoSocial("Agropecuária Vale Verde Ltda");
    setNomeFantasia("Vale Verde Agro");
  } else {
    setRazaoSocial("");
    setNomeFantasia("");
  }
};
  
  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="pessoa-fisica" hideSearch />

      {modalRepIndex !== null && (
        <BuscarRepresentanteModal
          onConfirm={(p) => {
            setRepresentantes(prev => prev.map((r, i) => i === modalRepIndex ? { ...r, nome: p.nome, cpf: p.cpf } : r));
            setModalRepIndex(null);
          }}
          onClose={() => setModalRepIndex(null)}
        />
      )}

     

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
      <div>
  <button type="button" onClick={() => onNavigate("pessoa-juridica")} className="flex items-center gap-1 text-sm mb-3 text-[#1A7A3C] hover:opacity-70">
    <ArrowLeft size={15} /> Todas Pessoas Jurídicas
  </button>
  
  {/* Container que joga o botão verde para a direita */}
  <div className="flex justify-between items-center w-full">
    <h1 className="text-2xl font-semibold text-gray-900">Adicionar Pessoa Jurídica</h1>
    
    <button
      type="button"
      onClick={() => setIsSucessoModalOpen(true)} // Abre o modal de sucesso do cadastro inteiro
      className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition flex items-center gap-2 shadow-sm"
    >
      Adicionar
    </button>
  </div>
</div>

        {/* Alerta Superior: Campos Obrigatórios — Colado no título com espaçamento ideal para a seção */}
<div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-0 mb-0">
  
  {/* Ícone de Informação Azul/Cinza Discreto */}
  <div className="text-gray-500 flex-shrink-0">
    <Info size={20} className="stroke-[2.5]" />
  </div>
  
  <p className="text-sm text-gray-600 font-medium leading-relaxed">
    Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
  </p>
</div>

        

      <Section title="Informações Básicas">
  <div className="flex flex-col gap-3">
    {/* Primeira Linha: CNPJ (Largura Fixa) e Razão Social (Flexível) */}
    <div className="flex gap-3">
      <FloatInput 
        label="CNPJ" 
        required 
        value={cnpj} 
        onChange={handleCnpjChange} 
        maxLength={18} 
        className="w-[200px] flex-shrink-0" 
      />
      <FloatInput 
        label="Razão Social" 
        required 
        value={razaoSocial} 
        onChange={setRazaoSocial} 
        className="flex-1" 
      />
      <FloatInput 
        label="Nome Fantasia" 
        value={nomeFantasia} 
        onChange={setNomeFantasia} 
        className="flex-1" 
      />
    </div>

  
  </div>
</Section>

        
      {/* Representantes Legais */}
        <Section title="Representantes Legais">
          <div className="flex flex-col gap-6">
            {representantes.map((rep, index) => (
              <div key={rep.id} className="flex gap-4 items-start relative w-full rounded-xl p-4 bg-white">
                {/* Contador lateral esquerdo */}
                <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-3">
                  {index + 1}
                </div>

                <div className="flex-1 flex flex-col gap-4">
                  {/* Primeira Linha: Representante, CPF e Ações de Visualizar/Excluir */}
                  <div className="flex gap-3 items-end w-full">
                    <div className="flex-1">
                      <FloatInput
                        label="Representante Legal"
                        required
                        value={rep.nome}
                        onChange={() => {}}
                        icon={<UserRound size={18} />}
                        onClick={() => setModalRepIndex(index)}
                        className="flex-1"
                      />
                    </div>

                    {/* Exibe o campo de CPF condicionalmente se houver representante preenchido */}
                    {rep.nome && (
                      <div className="w-72">
                        <FloatInput
                          label="CPF"
                          required
                          value={rep.cpf}
                          onChange={() => {}}
                          disabled
                        />
                      </div>
                    )}

                    {/* Botões de Ação da primeira linha */}
                    <div className="flex gap-2 h-12 items-center">
                      {rep.nome && (
                        <button type="button" className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-lg transition">
                          <Eye size={20} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setRepresentantes((prev) => prev.filter((r) => r.id !== rep.id))}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                <div className="flex gap-3 items-start">
                  <UploadField
                    label="Documento"
                    required
                    fileName={rep.documentoNome}
                    onSelectFile={() =>
                      setRepresentantes(prev =>
                        prev.map((r, i) =>
                          i === index ? { ...r, documentoNome: `documento_rep_${index + 1}.pdf` } : r
                        )
                      )
                    }
                  />

                  {rep.documentoNome && (
                    <>
                      <div className="flex-1">
                        <FloatInput
                          label="Descrição"
                          value={rep.descricao}
                          placeholder="Descrição opcional..."
                          onChange={(val) =>
                            setRepresentantes(prev =>
                              prev.map((r, i) => i === index ? { ...r, descricao: val } : r)
                            )
                          }
                        />
                      </div>
                      <div className="h-12 flex items-center">
                        <button
                          type="button"
                          onClick={() => alert(`Fazendo download de: ${rep.documentoNome}`)}
                          className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                        >
                          <Download size={20} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
                      
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setRepresentantes((prev) => [
                  ...prev,
                  {
                    id: String(Date.now()),
                    nome: "",
                    cpf: "",
                    descricao: "",
                    documentoNome: "",
                  },
                ])
              }
              className="flex items-center gap-2 text-sm font-semibold px-4 h-11 rounded-lg border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 w-fit transition"
            >
              <PlusCircle size={18} />
              Adicionar Representante Legal
            </button>
          </div>
        </Section>

        {/* Informações de Localização */}

        {/* Informações de Localização */}
        <Section title="Informações de Localização">
          <div className="flex flex-col gap-6">
            <BlocoEnderecoFields
              title="Endereço de Correspondência"
              data={correspondencia}
              isCorrespondencia={true}
              onChange={(key, val) => setCorrespondencia((p) => ({ ...p, [key]: val }))}
              onSetMultipleFields={(fields) => setCorrespondencia((p) => ({ ...p, ...fields }))}
              onOpenMap={() => setMapTarget("correspondencia")}
            />

            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-700">
                É o endereço de residência?
              </span>
              <div className="flex items-center gap-6 mt-1">
                <CustomRadio
                  label="Sim"
                  name="res"
                  value="Sim"
                  checked={isEnderecoResidencia === "Sim"}
                  onChange={() => setIsEnderecoResidencia("Sim")}
                />
                <CustomRadio
                  label="Não"
                  name="res"
                  value="Não"
                  checked={isEnderecoResidencia === "Não"}
                  onChange={() => setIsEnderecoResidencia("Não")}
                />
              </div>
            </div>

            {isEnderecoResidencia === "Não" && (
              <div className="flex flex-col gap-5">
                <BlocoEnderecoFields
                  title="Endereço de Residência"
                  data={residencia}
                  isCorrespondencia={false}
                  onChange={(key, val) => setResidencia((p) => ({ ...p, [key]: val }))}
                  onSetMultipleFields={(fields) => setResidencia((p) => ({ ...p, ...fields }))}
                  onOpenMap={() => setMapTarget("residencia")}
                />

                <div className="relative border border-gray-300 rounded-md p-3 bg-white">
                  <label className="block text-[10px] text-gray-400 font-medium mb-1">
                    Observação
                  </label>
                  <textarea
                    value={observacaoResidencia}
                    onChange={(e) => setObservacaoResidencia(e.target.value.slice(0, 1500))}
                    rows={3}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none resize-none"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {observacaoResidencia.length}/1500
                  </div>
                </div>
              </div>
            )}
          </div>
        </Section>

   {/* Modal de Sucesso após Salvar Cadastro Inteiro */}
{isSucessoModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col items-center text-center gap-5 relative">
      
      {/* Textos do Modal */}
      <div className="flex flex-col gap-1 w-full">
        <h3 className="text-lg font-bold text-gray-900">Pessoa Jurídica Adicionada com Sucesso!</h3>
        <p className="text-sm text-gray-500 mt-1 px-2">
          <span className="font-semibold text-gray-700">
            {nomeFantasia ? nomeFantasia : "A nova pessoa jurídica"}
          </span> foi adicionada com sucesso.
        </p>
      </div>

      {/* Ações / Dois Botões Alinhados em uma Linha Inteira */}
      <div className="flex gap-3 w-full mt-1">
        {/* Botão Voltar (Bordas Verdes) */}
        <button
          type="button"
          onClick={() => {
            setIsSucessoModalOpen(false);
            onNavigate("pessoa-fisica");
          }}
          className="flex-1 h-11 bg-white border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50/40 text-sm font-semibold rounded-lg transition"
        >
          Voltar
        </button>

       {/* Botão Visualizar (Todo Verde) */}
<button
  type="button"
  onClick={() => {
    setIsSucessoModalOpen(false);
    // ENVIANDO OS DADOS COMPLETOS INCLUINDO OS CONTATOS
    onNavigate("visualizar-pessoa-juridica", {
      cnpj,
      razaoSocial,
      nomeFantasia,
      cpf,
      residencia, 
      correspondencia,
      contatosFixos,    // <--- Adicionado aqui
      outrosContatos    // <--- Adicionado aqui
    }); 
  }}
  className="flex-1 h-11 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold rounded-lg transition shadow-sm"
>
  Visualizar
</button>
      </div>

    </div>
  </div>
)}
        {/* Renderização do Modal de Mapa */}
   {mapTarget !== null && (
          <MapModal
            onClose={() => setMapTarget(null)}
            onConfirm={(lat, lng) => {
              if (mapTarget === "correspondencia") {
                setCorrespondencia((p) => ({ ...p, latitude: lat, longitude: lng }));
              } else {
                setResidencia((p) => ({ ...p, latitude: lat, longitude: lng }));
              }
              setMapTarget(null);
            }}
            initialLat={mapTarget === "correspondencia" ? correspondencia.latitude : residencia.latitude}
            initialLng={mapTarget === "correspondencia" ? correspondencia.longitude : residencia.longitude}
          />
        )}

        {/* Informações de Contato */}
        <Section title="Informações de Contato">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {contatosFixos.map((contato, index) => (
                <div key={contato.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                  <FloatSelect label="Tipo de Contato" required value={contato.tipo} disabled={true} onChange={(v) => setContatosFixos(prev => prev.map((c, i) => i === index ? { ...c, tipo: v } : c))} options={TIPOS_CONTATO.map(t => ({ value: t, label: t }))} className="md:col-span-3" />
                  <FloatInput label={contato.tipo === "E-mail" ? "Email" : "Número"} required value={contato.valor} onChange={(v) => setContatosFixos(prev => prev.map((c, i) => i === index ? { ...c, valor: v } : c))} className="md:col-span-4" />
                  <div className="md:col-span-5 relative border border-gray-300 rounded-md h-24 flex flex-col justify-between p-2.5 bg-white">
                    <label className="text-[10px] text-gray-400 font-medium">Observação</label>
                    <textarea value={contato.observacao} maxLength={1500} onChange={(e) => setContatosFixos(prev => prev.map((c, i) => i === index ? { ...c, observacao: e.target.value } : c))} className="w-full bg-transparent text-sm text-gray-800 outline-none resize-none flex-1 mt-1 leading-tight" />
                    <span className="text-right text-[9px] text-gray-400">{contato.observacao.length}/1500</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 relative">
                <span>Outros Contatos</span>
                <div className="cursor-pointer text-gray-400 hover:text-gray-600 transition flex items-center" onMouseEnter={() => setShowContatoTooltip(true)} onMouseLeave={() => setShowContatoTooltip(false)}>
                  <Info size={15} />
                  {showContatoTooltip && (
                    <div className="absolute left-32 bottom-6 bg-[#e0e0e0] border border-gray-300 text-gray-800 text-xs py-1.5 px-3 rounded shadow-md z-50 pointer-events-none flex items-center gap-1.5 whitespace-nowrap">
                      <Info size={13} className="text-gray-600 flex-shrink-0" />
                      <span>Além do contato principal, você também pode adicionar outros contatos opcionais.</span>
                    </div>
                  )}
                </div>
              </div>

              {outrosContatos.map((contato, index) => (
                <div key={contato.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start border border-gray-100 p-4 rounded-xl relative bg-gray-50/50">
                  <FloatSelect label="Tipo de Contato" required value={contato.tipo} onChange={(v) => setOutrosContatos(prev => prev.map((c, i) => i === index ? { ...c, tipo: v } : c))} options={TIPOS_CONTATO.map(t => ({ value: t, label: t }))} className="md:col-span-3" />
                  <FloatInput label={contato.tipo === "E-mail" ? "Email" : "Número"} required value={contato.valor} onChange={(v) => setOutrosContatos(prev => prev.map((c, i) => i === index ? { ...c, valor: v } : c))} className="md:col-span-4" />
                  <div className="md:col-span-4 relative border border-gray-300 rounded-md h-24 flex flex-col justify-between p-2.5 bg-white">
                    <label className="text-[10px] text-gray-400 font-medium">Observação</label>
                    <textarea value={contato.observacao} maxLength={1500} onChange={(e) => setOutrosContatos(prev => prev.map((c, i) => i === index ? { ...c, observacao: e.target.value } : c))} className="w-full bg-transparent text-sm text-gray-800 outline-none resize-none flex-1 mt-1 leading-tight" />
                    <span className="text-right text-[9px] text-gray-400">{contato.observacao.length}/1500</span>
                  </div>
                  <div className="md:col-span-1 flex justify-center pt-1.5">
                    <button type="button" onClick={() => setOutrosContatos(prev => prev.filter(c => c.id !== contato.id))} className="p-2.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
 
              <button type="button" onClick={() => setOutrosContatos(prev => [...prev, { id: String(Date.now()), tipo: "", valor: "", observacao: "" }])} className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition">
                <PlusCircle size={16} /> Adicionar Outro Contato
              </button>
            </div>
          </div>
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

       {/* Seção Observação Geral */}
          <Section title="Observação">
        <LargeTextArea
          label="Observação"
          value={observacaoResidencia}
          onChange={setObservacaoResidencia}
          hasTooltip
          tooltipText="Informações adicionais pertinentes ao cadastro."
        />
      </Section>
      </main>
      <SearchModal
        open={modalRepIndex !== null}
        onClose={() => setModalRepIndex(null)}
        title="Buscar Representante Legal"
        subtitle="Busque por um representante legal:"
        icon={<UserRound size={26} color="#1A7A3C" />}
        data={PESSOAS_MOCK}
        searchKeys={["nome", "cpf"]}
        searchPlaceholder="Busque por nome ou CPF"
        columns={[
          { label: "Nome", key: "nome" },
          { label: "CPF", key: "cpf" }
        ]}
        onConfirm={(pessoa) => {
          setRepresentantes(prev =>
            prev.map((r, i) =>
              i === modalRepIndex ? { ...r, nome: pessoa.nome, cpf: pessoa.cpf } : r
            )
          );
          setModalRepIndex(null);
  }}
/>
    </div>
  );
}