import { useState } from "react";
import { Calendar, Eye, Plus, ChevronDown, ChevronUp, Store } from "lucide-react";
import { FloatInput, FloatSelect, ModalBase, UploadField } from "./ui/FormKit";
import { EntitySearchInput } from "./ui/EntitySearch";
import * as Icons from "../imports/icons";

const TIPOS = [
  "RT de Evento Pecuário",
  "RT de Estabelecimento Agropecuário",
  "RT de Estabelecimento Agroindustrial POA",
  "RT de Estabelecimento Agroindustrial POV",
  "RT de Revendedora de Animais Vivos",
  "RT de Integradora/Cooperativa",
].map((value) => ({ value, label: value }));

const ENTIDADES = [
  { id: 1, nome: "Fazenda Rio Preto", codigo: "34523423567" },
  { id: 2, nome: "Fazenda Santa Fé", codigo: "3100000001" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return <section className="relative overflow-visible rounded-2xl border border-gray-200 bg-white"><button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left"><span className="text-base font-semibold text-gray-800">{title}</span>{open ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}</button>{open && <div className="border-t border-gray-100 p-5">{children}</div>}</section>;
}

export function ResponsabilidadeTecnicaModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tipo, setTipo] = useState(TIPOS[0].value);
  const [data, setData] = useState("");
  const [arquivo, setArquivo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [entidade, setEntidade] = useState<any | null>(null);
  const evento = tipo === "RT de Evento Pecuário";
  const entidadeLabel = tipo === "RT de Estabelecimento Agropecuário"
    ? "Estabelecimento Agropecuário"
    : tipo === "RT de Estabelecimento Agroindustrial POA"
      ? "Estabelecimento Agroindustrial POA"
      : tipo === "RT de Estabelecimento Agroindustrial POV"
        ? "Estabelecimento Agroindustrial POV"
        : tipo === "RT de Revendedora de Animais Vivos"
          ? "Revendedora de Animais Vivos"
          : "Integradora/Cooperativa";
  const entidadeIcon = tipo.includes("Agroindustrial")
    ? <img src={Icons.iconeEstabelecimentoAgroindustrialUrl} alt={entidadeLabel} className="h-5 w-5 object-contain" />
    : tipo.includes("Revendedora")
      ? <Store size={18} color="#1A7A3C" />
      : tipo.includes("Integradora")
        ? <img src={Icons.iconeGrupoUrl} alt={entidadeLabel} className="h-5 w-5 object-contain" />
        : <img src={Icons.iconeEstabelecimentoUrl} alt={entidadeLabel} className="h-5 w-5 object-contain" />;

  return <ModalBase open={open} onClose={onClose} onCancel={onClose} onSave={onClose} title="Responsabilidade Técnica" subtitle="Preencha os campos para adicionar uma responsabilidade técnica ao profissional:" icon={<img src={Icons.iconeFormularioUrl} alt="Responsabilidade Técnica" className="h-6 w-6 object-contain" />} width="1000px">
    <div className="flex w-full flex-col gap-5">
      <Section title="Informações Gerais"><FloatSelect label="Responsabilidade Técnica" required value={tipo} onChange={(value) => { setTipo(value); setData(""); setArquivo(""); setEntidade(null); }} options={TIPOS} /></Section>
      <Section title={tipo}>
        <div className="flex flex-col gap-5">
          <FloatInput label={evento ? "Data do Certificado de Treinamento" : "Data do DRT"} type="date" required value={data} onChange={setData} icon={<Calendar size={16} color="#1A7A3C" />} />
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-start">
            <UploadField label={evento ? "Certificado de Treinamento" : "DRT"} tooltipText={!evento ? "Documento de Responsabilidade Técnica" : undefined} required fileName={arquivo} onSelectFile={() => setArquivo(`documento_${Date.now()}.pdf`)} />
            {arquivo && <div className="w-full max-w-[340px]"><FloatInput label="Descrição" value={descricao} onChange={setDescricao} /></div>}
          </div>
          {!evento && <div className="flex flex-col gap-3">
            <div className="flex items-end gap-3">
              <div className="min-w-0 flex-1"><EntitySearchInput label={entidadeLabel} placeholder="Buscar por nome ou código" value={entidade?.nome || ""} data={ENTIDADES} searchKeys={["nome", "codigo"]} columns={[{ label: "Nome", key: "nome" } , { label: "Código", key: "codigo" }]} icon={entidadeIcon} title={`Buscar ${entidadeLabel}`} subtitle={`Busque por ${entidadeLabel.toLowerCase()} cadastrado:`} required onChange={setEntidade} /></div>
              {entidade && <div className="w-56 shrink-0"><FloatInput label="Código" value={entidade.codigo || ""} disabled /></div>}
              {entidade && <button type="button" className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-[#1A7A3C] hover:bg-green-50" title="Visualizar estabelecimento"><Eye size={19} /></button>}
            </div>
            <button type="button" className="flex h-11 w-fit items-center gap-2 rounded-md border border-[#008446] px-5 text-sm font-semibold text-[#008446]"><Plus size={18} />Adicionar {entidadeLabel}</button>
          </div>}
        </div>
      </Section>
    </div>
  </ModalBase>;
}
