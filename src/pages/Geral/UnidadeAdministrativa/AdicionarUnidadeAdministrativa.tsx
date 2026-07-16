import React, { useState } from "react";
import { ArrowLeft, Info, Check, PlusCircle, Trash2, Building2 } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import {
  UnidadeAdministrativaInput,
  BlocoEnderecoFields,
  BlocoContatoFields,
  DynamicListWrapper,
} from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";

const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const TIPOS_UNIDADE = [
  "Almoxarifado",
  "Barreira Sanitária",
  "Coordenadoria Regional",
  "Escritório Central",
  "Escritório Municipal",
  "Escritório Seccional",
  "Laboratório",
  "Posto de Atendimento",
  "Serviço de Inspeção Permanente",
];

// Hierarquia da US036 (do diagrama): tipo pai imediato de cada tipo.
// Escritório Central não tem pai → Unidade Pai não é exibida.
const TIPO_PAI: Record<string, string> = {
  "Almoxarifado": "Escritório Central",
  "Laboratório": "Escritório Central",
  "Coordenadoria Regional": "Escritório Central",
  "Escritório Seccional": "Coordenadoria Regional",
  "Escritório Municipal": "Escritório Seccional",
  "Posto de Atendimento": "Escritório Seccional",
  "Barreira Sanitária": "Escritório Seccional",
  "Serviço de Inspeção Permanente": "Escritório Seccional",
  // "Escritório Central": sem pai
};

// ==========================================================
// HELPERS DE UI (mesmo padrão do fluxo de cadastro)
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

// máscara de telefone (XX) XXXXX-XXXX
function mascaraTelefone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// ==========================================================
// PÁGINA: CADASTRAR UNIDADE ADMINISTRATIVA (US036 - AC1)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarUnidadeAdministrativaPage({ onLogout, onNavigate }: PageProps) {
  // Informações Básicas
  const [tipo, setTipo] = useState("");
  const [nome, setNome] = useState("");
  const [unidadePai, setUnidadePai] = useState<any | null>(null);
  const [sigla, setSigla] = useState("");

  // Localização (Zona + CEP/Estado/Município/lat-long) via BlocoEnderecoFields
  const [endereco, setEndereco] = useState({
    zona: "Urbana",
    cep: "",
    estado: "",
    municipio: "",
    bairro: "",
    endereco: "",
    numero: "",
    complemento: "",
    localidade: "",
    distrito: "",
    latitude: "",
    longitude: "",
  });

  // Contato (email + telefones um ou mais)
  const [email, setEmail] = useState("");
  const [telefones, setTelefones] = useState<any[]>([{ uid: uid("tel"), numero: "", observacao: "" }]);

  const [isSucesso, setIsSucesso] = useState(false);

  // Unidade Pai só quando o tipo ≠ Escritório Central
  const mostrarUnidadePai = tipo !== "" && tipo !== "Escritório Central";
  const tipoPaiImediato = tipo ? TIPO_PAI[tipo] : undefined;

  const onChangeTipo = (v: string) => {
    setTipo(v);
    setUnidadePai(null); // a unidade pai depende do tipo
  };

  // telefones (um ou mais)
  const addTelefone = () => setTelefones((p) => [...p, { uid: uid("tel"), numero: "", observacao: "" }]);
  const removeTelefone = (u: string) => setTelefones((p) => (p.length === 1 ? p : p.filter((t) => t.uid !== u)));
  const patchTelefone = (u: string, patch: any) => setTelefones((p) => p.map((t) => (t.uid === u ? { ...t, ...patch } : t)));

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="unidade-administrativa" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("unidade-administrativa")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas as Unidades Administrativas
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Unidade Administrativa</h1>
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
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FloatSelect
                label="Tipo da Unidade Administrativa"
                required
                value={tipo}
                onChange={onChangeTipo}
                options={TIPOS_UNIDADE.map((t) => ({ value: t, label: t }))}
              />
              <FloatInput
                label="Nome da Unidade Administrativa"
                required
                value={nome}
                onChange={setNome}
                maxLength={255}
              />
            </div>

                      {mostrarUnidadePai && (
            <UnidadeAdministrativaInput
              label="Unidade Pai"
              required
              tipoFiltro={tipoPaiImediato}
              value={unidadePai ? unidadePai.nome : ""}
              onChange={(ent: any) => setUnidadePai(ent)}
              onEyeClick={() => unidadePai && onNavigate("visualizar-unidade-administrativa", unidadePai)}
            />
          )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Unidade Pai — só se o tipo ≠ Escritório Central; lista do tipo pai imediato */}


              <FloatInput
                label="Sigla da Unidade"
                required
                value={sigla}
                onChange={(v: string) => setSigla(v.toUpperCase())}
                maxLength={10}
              />
            </div>
          </div>
        </Section>

        {/* 2. Informações de Localização (Zona Rural/Urbana + CEP/Estado/Município/lat-long) */}
        <Section title="Informações de Localização">
          <BlocoEnderecoFields
            title="Localização"
            tipoEstado="livre"
            data={endereco}
            onChange={(key, val) => setEndereco((p) => ({ ...p, [key]: val }))}
            onSetMultipleFields={(fields) => setEndereco((p) => ({ ...p, ...fields }))}
          />
        </Section>

        {/* 3. Informações de Contato */}
        <Section title="Informações de Contato">
          <div className="flex flex-col gap-6">
            <FloatInput label="Email" type="email" value={email} onChange={setEmail} maxLength={255} />

            {/* Telefones de contato (um ou mais) */}
            <DynamicListWrapper
              items={telefones}
              behavior="at-least-one"
              addButtonLabel="Adicionar Telefone"
              onAddItem={addTelefone}
              onRemoveItem={(i: number) => setTelefones((p) => p.filter((_, idx) => idx !== i))}
              variant="plain"
              showCounter={true}
              sectionTitle="Telefones de Contato"
            >
              {(item: any) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <FloatInput
                    label="Número"
                    required
                    value={item.numero}
                    onChange={(v: string) => patchTelefone(item.uid, { numero: mascaraTelefone(v) })}
                    placeholder="(XX) XXXXX-XXXX"
                  />
                  <FloatInput
                    label="Observação"
                    value={item.observacao}
                    onChange={(v: string) => patchTelefone(item.uid, { observacao: v })}
                    maxLength={255}
                    placeholder="Ex.: É WhatsApp"
                  />
                </div>
              )}
            </DynamicListWrapper>
          </div>
        </Section>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Unidade administrativa adicionada com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">{nome ? `"${nome}"` : "A unidade administrativa"} foi adicionada.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("unidade-administrativa"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-unidade-administrativa", {
                nome, sigla, tipo,
                unidadePai: unidadePai?.nome ?? "",
                situacao: "Ativo",
              }); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}