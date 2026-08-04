import React, { useState } from "react";
import { ArrowLeft, Info, Check, MapPin, ChevronDown, ChevronUp, X } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, LargeTextArea, FloatCombobox } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

const ESTADOS_MOCK = ["Minas Gerais", "São Paulo", "Rio de Janeiro", "Espírito Santo", "Bahia", "Goiás"];
const MUNICIPIOS_MOCK = ["Lavras", "Belo Horizonte", "Abaeté", "Passos", "Uberlândia", "Varginha"];

// Formato correto esperado pelo FloatSelect
const TIPOS_DIVISAO = [
  { value: "Distrito", label: "Distrito" },
  { value: "Localidade", label: "Localidade" },
];

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition border-b border-gray-100"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="p-6 flex flex-col gap-5 bg-white">{children}</div>}
    </div>
  );
}

// ==========================================================
// MODAL DE COORDENADAS (DECIMAL / DMS)
// ==========================================================
function ModalCoordenadas({
  isOpen,
  onClose,
  onConfirm,
  latAtual,
  lngAtual,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (lat: string, lng: string) => void;
  latAtual: string;
  lngAtual: string;
}) {
  const [formatType, setFormatType] = useState<"decimal" | "dms">("decimal");
  const [latDecimal, setLatDecimal] = useState(latAtual || "");
  const [lngDecimal, setLngDecimal] = useState(lngAtual || "");
  const [latDMS, setLatDMS] = useState("");
  const [lngDMS, setLngDMS] = useState("");

  if (!isOpen) return null;

  const aplicarMascaraDMS = (value: string, direcaoPadrão: "S" | "W") => {
    const nums = value.replace(/\D/g, "");
    if (!nums) return "";
    const g = nums.slice(0, 2);
    const m = nums.slice(2, 4);
    const s = nums.slice(4, 6);
    const d = nums.slice(6, 7);
    let res = "";
    if (g) res += `${g}° `;
    if (m) res += `${m}' `;
    if (s) res += `${s}`;
    if (d) res += `.${d}"`;
    return `${res}${direcaoPadrão}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 flex flex-col gap-5">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
            <MapPin className="text-[#1A7A3C]" size={20} />
            <span>Coordenadas Geográficas</span>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Seleção do Formato */}
        <div className="flex gap-4 border-b pb-3">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
            <input
              type="radio"
              name="formatTypeEdit"
              checked={formatType === "decimal"}
              onChange={() => setFormatType("decimal")}
              className="accent-[#1A7A3C]"
            />
            Graus Decimais (Ex: -21.2452)
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
            <input
              type="radio"
              name="formatTypeEdit"
              checked={formatType === "dms"}
              onChange={() => setFormatType("dms")}
              className="accent-[#1A7A3C]"
            />
            Graus, Minutos e Segundos (DMS)
          </label>
        </div>

        {/* Inputs das Coordenadas */}
        <div className="grid grid-cols-8 gap-4">
          {formatType === "dms" ? (
            <>
              <div className="col-span-4">
                <FloatInput
                  label="Latitude"
                  required
                  placeholder={'__° __\' __._"S'}
                  value={latDMS}
                  onChange={(v) => setLatDMS(aplicarMascaraDMS(v, "S"))}
                />
              </div>
              <div className="col-span-4">
                <FloatInput
                  label="Longitude"
                  required
                  placeholder={'__° __\' __._"W'}
                  value={lngDMS}
                  onChange={(v) => setLngDMS(aplicarMascaraDMS(v, "W"))}
                />
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

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white text-[#1A7A3C] text-sm font-semibold rounded-md border border-[#1A7A3C] hover:bg-gray-50 transition"
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
              onClose();
            }}
            className="px-5 py-2.5 text-white text-sm font-semibold rounded-md shadow-sm bg-[#1A7A3C] hover:bg-[#15612F] transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================================
// COMPONENTE PRINCIPAL
// ==========================================================
export function EditarDivisaoMunicipalPage({
  dados,
  onLogout,
  onNavigate,
}: {
  dados?: any;
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}) {
  const [isSucesso, setIsSucesso] = useState(false);
  const [isModalCoordOpen, setIsModalCoordOpen] = useState(false);

  // Estados dos campos
  const [codigo] = useState(dados?.codigo || "DM-000001");
  const [tipo, setTipo] = useState(dados?.tipo || dados?.tipoDivisao || "Distrito");
  const [nome, setNome] = useState(dados?.nome || dados?.nomeDivisao || "Rosário de Minas");
  const [estado, setEstado] = useState(dados?.estado || dados?.uf || "Minas Gerais");
  const [municipio, setMunicipio] = useState(dados?.municipio || "Lavras");
  const [latitude, setLatitude] = useState(dados?.latitude || "-21.245263");
  const [longitude, setLongitude] = useState(dados?.longitude || "-44.999281");
  const [situacao] = useState(dados?.situacao || "Ativo");
  const [observacao, setObservacao] = useState(
    dados?.observacao || "Divisão municipal cadastrada para fins administrativos e de controle territorial."
  );

  const handleSalvar = () => {
    setIsSucesso(true);
  };

  const dadosAtualizados = {
    ...dados,
    codigo,
    tipo,
    nome,
    estado,
    municipio,
    latitude,
    longitude,
    situacao,
    observacao,
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="divisao-municipal" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("divisao-municipal")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} /> Todas as Divisões Municipais
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Divisão Municipal</h1>
            <button
              type="button"
              onClick={handleSalvar}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
            >
              Salvar
            </button>
          </div>
        </div>

        {/* Banner Informativo */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-2">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* Seção: Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatSelect
              label="Tipo"
              required
              value={tipo}
              onChange={setTipo}
              options={TIPOS_DIVISAO}
            />

            <FloatInput
              label="Divisão Municipal"
              required
              value={nome}
              onChange={setNome}
              maxLength={255}
            />

            <FloatCombobox
              label="Estado"
              required
              value={estado}
              onChange={setEstado}
              options={ESTADOS_MOCK}
            />

            <FloatCombobox
              label="Município"
              required
              value={municipio}
              onChange={setMunicipio}
              options={MUNICIPIOS_MOCK}
            />

            <div className="relative">
              <FloatInput
                label="Latitude"
                required
                value={latitude}
                onChange={setLatitude}
              />
            </div>

            <div className="relative flex items-center gap-2">
              <div className="flex-1">
                <FloatInput
                  label="Longitude"
                  required
                  value={longitude}
                  onChange={setLongitude}
                />
              </div>
              <button
                type="button"
                onClick={() => setIsModalCoordOpen(true)}
                title="Inserir via Modal / Mapa"
                className="h-[50px] w-[50px] flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition border border-gray-300 flex-shrink-0"
              >
                <MapPin size={20} className="text-[#1A7A3C]" />
              </button>
            </div>
          </div>
        </Section>


      </main>

      {/* Modal de Coordenadas Geográficas */}
      <ModalCoordenadas
        isOpen={isModalCoordOpen}
        onClose={() => setIsModalCoordOpen(false)}
        latAtual={latitude}
        lngAtual={longitude}
        onConfirm={(lat, lng) => {
          setLatitude(lat);
          setLongitude(lng);
        }}
      />

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center animate-fadeIn">

            <h3 className="text-lg font-bold text-gray-900">Alterações salvas!</h3>
            <p className="text-sm text-gray-500 mt-1">
              O cadastro da divisão "{nome}" foi atualizado com sucesso.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("divisao-municipal");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("visualizar-divisao-municipal", dadosAtualizados);
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