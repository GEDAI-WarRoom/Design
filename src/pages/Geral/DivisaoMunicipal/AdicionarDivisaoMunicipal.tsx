import React, { useState } from "react";
import { ArrowLeft, Info, Check, MapPin, Map, X } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, FloatCombobox } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

const TIPOS = [
  { value: "Distrito", label: "Distrito" },
  { value: "Localidade", label: "Localidade" },
];

const ESTADOS_MOCK = ["Minas Gerais", "São Paulo", "Rio de Janeiro"];
const MUNICIPIOS_MOCK = ["Lavras", "Belo Horizonte", "Abaeté", "Passos", "Uberlândia"];

// ==========================================================
// HELPERS DE UI
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

// ==========================================================
// PÁGINA: ADICIONAR DIVISÃO MUNICIPAL (Campos Diretos)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarDivisaoMunicipalPage({ onLogout, onNavigate }: PageProps) {
  const [tipo, setTipo] = useState("");
  const [nome, setNome] = useState("");

  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [isSucesso, setIsSucesso] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="divisao-municipal" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("divisao-municipal")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas as Divisões Municipais
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Divisão Municipal</h1>
            <button type="button" onClick={() => setIsSucesso(true)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Adicionar</button>
          </div>
        </div>

        {/* Info box */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FloatSelect label="Tipo" required value={tipo} onChange={(v) => setTipo(v ?? "")} options={TIPOS} />
            <FloatInput label="Divisão Municipal" required value={nome} onChange={(v) => setNome(v ?? "")} maxLength={255} />
          <FloatCombobox label="Estado" required value={estado} onChange={(v) => { setEstado(v ?? ""); setMunicipio(""); }} options={ESTADOS_MOCK} />
              <FloatCombobox label="Município" required value={municipio} onChange={(v) => setMunicipio(v ?? "")} options={MUNICIPIOS_MOCK} />
           
          </div>

          <div className="pt-4">
              
              {!(latitude && longitude) ? (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 border border-[#1A7A3C] rounded-md h-11 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50/50 transition shadow-sm cursor-pointer"
                >
                  <MapPin size={16} /> Adicionar Coordenadas no Mapa
                </button>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full flex items-center justify-center border border-[#1A7A3C] rounded-md h-11 bg-white hover:bg-green-50/30 text-[#1A7A3C] transition cursor-pointer"
                      title="Editar Coordenadas"
                    >
                      <MapPin size={18} />
                    </button>
                  </div>
                  <div className="sm:col-span-5">
                    <FloatInput label="Latitude" value={latitude} onChange={(v) => setLatitude(v ?? "")} disabled />
                  </div>
                  <div className="sm:col-span-5">
                    <FloatInput label="Longitude" value={longitude} onChange={(v) => setLongitude(v ?? "")} disabled />
                  </div>
                </div>
              )}
            </div>
        </Section>

      
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Divisão municipal adicionada com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">{nome ? `"${nome}"` : "A divisão municipal"} foi adicionada.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("divisao-municipal"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { 
                setIsSucesso(false); 
                onNavigate("visualizar-divisao-municipal", {
                  nome, 
                  tipo,
                  estado, 
                  municipio,
                  latitude: Number(latitude) || 0, 
                  longitude: Number(longitude) || 0,
                  situacao: "Ativo",
                }); 
              }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}

      {/* Renderizador do Modal mapeado exatamente conforme o EntitySearch */}
      {isModalOpen && (
        <MapModal
          onClose={() => setIsModalOpen(false)}
          onConfirm={(lat, lng) => {
            setLatitude(lat ?? "");
            setLongitude(lng ?? "");
            setIsModalOpen(false);
          }}
          initialLat={latitude}
          initialLng={longitude}
        />
      )}
    </div>
  );
}


interface MapModalProps {
  onClose: () => void;
  onConfirm: (lat: string, lng: string) => void;
  initialLat?: string;
  initialLng?: string;
}

function MapModal({ onClose, onConfirm, initialLat, initialLng }: MapModalProps) {
  const [mapType, setMapType] = useState<"mapa" | "satelite">("mapa");
  const [formatType, setFormatType] = useState<"dms" | "decimal">("dms");

  const [latDecimal, setLatDecimal] = useState(initialLat || "-21.233481");
  const [lngDecimal, setLngDecimal] = useState(initialLng || "-44.991278");

  const [latDMS, setLatDMS] = useState("");
  const [lngDMS, setLngDMS] = useState("");

  const aplicarMascaraDMS = (value: string, direcaoPadrao: "S" | "W") => {
    const apenasNumeros = value.replace(/\D/g, "");
    if (!apenasNumeros) return "";
    const g = apenasNumeros.slice(0, 2);
    const m = apenasNumeros.slice(2, 4);
    let s = apenasNumeros.slice(4, 7);
    if (s.length === 3) s = `${s.slice(0, 2)}.${s.slice(2)}`;
    if (g && !m) return `${g}°`;
    if (g && m && !s) return `${g}° ${m}'`;
    return `${g}° ${m}' ${s}" ${direcaoPadrao}`;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 flex flex-col gap-6 relative font-sans text-gray-800 animate-in fade-in zoom-in-95 duration-150">
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg font-bold transition p-1"
        >
          ✕
        </button>

        <div className="flex flex-col items-center gap-2 text-center mt-2">
          <div className="flex items-center gap-2">
            <Map size={26} className="text-[#1A7A3C]" />
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Buscar no Mapa</h2>
          </div>
          <p className="text-sm text-gray-600 font-medium mt-1">Selecione a localização no mapa:</p>
        </div>

        {/* Simulador visual do mapa */}
        <div className="w-full h-[240px] rounded-xl border border-gray-200 overflow-hidden relative bg-gray-100 flex items-center justify-center">
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

          <div className="relative z-20 flex flex-col items-center">
            <MapPin size={34} className="text-[#1A7A3C] fill-[#1A7A3C] drop-shadow-md animate-bounce" />
          </div>
          <div className="absolute inset-0 bg-[#ccece6] opacity-40 pattern-grid" />
        </div>

        {/* Inputs de Formato */}
        <div className="grid grid-cols-12 gap-4 items-end text-left w-full">
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

          {formatType === "dms" ? (
            <>
              <div className="col-span-4">
                <FloatInput label="Latitude" required placeholder={'__° __\' __._"S'} value={latDMS} onChange={(v) => setLatDMS(aplicarMascaraDMS(v, "S"))} />
              </div>
              <div className="col-span-4">
                <FloatInput label="Longitude" required placeholder={'__° __\' __._"W'} value={lngDMS} onChange={(v) => setLngDMS(aplicarMascaraDMS(v, "W"))} />
              </div>
            </>
          ) : (
            <>
              <div className="col-span-4">
                <FloatInput label="Latitude" required value={latDecimal} onChange={setLatDecimal} />
              </div>
              <div className="col-span-4">
                <FloatInput label="Longitude" required value={lngDecimal} onChange={setLngDecimal} />
              </div>
            </>
          )}
        </div>

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
            onClick={() => formatType === "decimal" ? onConfirm(latDecimal, lngDecimal) : onConfirm(latDMS, lngDMS)}
            className="px-10 py-2.5 text-white text-sm font-semibold rounded-md shadow-sm bg-[#1A7A3C] hover:bg-[#15612F] transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
