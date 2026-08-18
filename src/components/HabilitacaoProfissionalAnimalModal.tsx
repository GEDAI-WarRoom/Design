import { useState } from "react";
import { Calendar, ChevronDown, ChevronUp, Dna, Plus } from "lucide-react";
import { FloatInput, FloatSelect, ModalBase, UploadField } from "./ui/FormKit";
import * as Icons from "../imports/icons";

const TIPOS = ["Emissão de GTA", "Exame de Brucelose/Tuberculose", "Exame de Mormo"].map((value) => ({ value, label: value }));

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return <section className="overflow-visible rounded-2xl border border-gray-200 bg-white"><button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left"><span className="text-base font-semibold text-gray-800">{title}</span>{open ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}</button>{open && <div className="border-t border-gray-100 p-5">{children}</div>}</section>;
}

export function HabilitacaoProfissionalAnimalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tipo, setTipo] = useState(TIPOS[0].value);
  const [numero, setNumero] = useState("");
  const [data, setData] = useState("");
  const [arquivo, setArquivo] = useState("");
  const [especie, setEspecie] = useState("");
  const simples = tipo === "Exame de Brucelose/Tuberculose";
  const gta = tipo === "Emissão de GTA";

  return <ModalBase open={open} onClose={onClose} onCancel={onClose} onSave={onClose} title="Habilitação" subtitle="Preencha os campos para adicionar uma habilitação ao profissional:" icon={<img src={Icons.iconeHabilitacaoUrl} alt="Habilitação" className="h-6 w-6 object-contain" />} width="1000px">
    <div className="flex w-full flex-col gap-5">
      <Section title="Informações Gerais"><FloatSelect label="Habilitação" required value={tipo} onChange={(value) => { setTipo(value); setNumero(""); setData(""); setArquivo(""); }} options={TIPOS} /></Section>
      <Section title={gta ? "Emissão de GTA" : `Habilitação para ${tipo}`}>
        <div className="flex flex-col gap-5">
          <div className={simples ? "max-w-[285px]" : "grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_300px]"}>
            <FloatInput label="Número da Habilitação" required value={numero} onChange={setNumero} />
            {!simples && <FloatInput label="Data da Habilitação" type="date" required value={data} onChange={setData} icon={<Calendar size={16} color="#008446" />} />}
          </div>
          {!simples && <>
            <UploadField label="Portaria de Habilitação" required fileName={arquivo} onSelectFile={() => setArquivo(`portaria_${Date.now()}.pdf`)} />
            <FloatInput label="Escritório Seccional Vinculado" required value="" onChange={() => {}} placeholder="Buscar escritório seccional" icon={<img src={Icons.iconeUnidadeAdministrativaUrl} alt="Escritório Seccional" className="h-5 w-5 object-contain" />} />
          </>}
        </div>
      </Section>
      {gta && <Section title="Espécies da Habilitação"><div className="flex flex-col gap-3"><FloatInput label="Espécie" required value={especie} onChange={setEspecie} icon={<Dna size={18} color="#008446" />} /><button type="button" className="flex h-11 w-fit items-center gap-2 rounded-md border border-[#008446] px-5 text-sm font-semibold text-[#008446]"><Plus size={18} />Adicionar Espécie</button></div></Section>}
    </div>
  </ModalBase>;
}
