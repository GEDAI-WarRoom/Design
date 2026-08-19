import { Calendar, Dna, MoreVertical } from "lucide-react";
import { AccordionCardGroup } from "./ui/FormKit";
import * as Icons from "../imports/icons";

const HABILITACOES_EXEMPLO = [
  { id: 1, numero: "654132", data: "05/08/2027", cadastro: "14/04/2012", especies: ["Aves", "Suídeos"] },
  { id: 2, numero: "654132", data: "05/08/2027", cadastro: "14/04/2012", especies: ["Bovídeos", "Suídeos"] },
  { id: 3, numero: "12134", data: "05/08/2027", cadastro: "14/04/2012", especies: ["Bovídeos", "Suídeos"] },
];

const HABILITACAO_BRUCELOSE = [{ id: 4, numero: "152134", data: "", cadastro: "14/04/2012", especies: [] }];
const HABILITACAO_MORMO = [{ id: 5, numero: "152134", data: "", cadastro: "14/04/2012", especies: [] }];

function HabilitacaoCard({ item }: { item: typeof HABILITACOES_EXEMPLO[number] }) {
  return <article className="min-w-0 w-full overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm">
    <div className="h-1 bg-[#008446]" />
    <div className="flex min-h-[195px] flex-col gap-4 p-4">
      <div className="flex items-center justify-between text-[10px] text-gray-700"><span><strong>Cadastro:</strong> {item.cadastro}</span><span>Ativo</span></div>
      <div className="flex items-start gap-3"><img src={Icons.iconeHabilitacaoUrl} alt="Habilitação" className="h-6 w-6 shrink-0 object-contain" /><div><p className="text-sm font-medium text-gray-800">{item.numero}</p><p className="text-[10px] text-gray-600">Número da Habilitação</p></div></div>
      {item.data && <div className="flex items-start gap-3"><Calendar size={21} className="shrink-0 text-[#008446]" /><div><p className="text-sm text-gray-800">{item.data}</p><p className="text-[10px] text-gray-600">Data da Habilitação</p></div></div>}
      {item.especies.length > 0 && <div className="flex items-start gap-3"><Dna size={22} className="shrink-0 text-[#008446]" /><div><p className="text-[10px] text-gray-600">Espécies</p><div className="mt-1 flex flex-wrap gap-1">{item.especies.map((especie) => <span key={especie} className="rounded-full border border-gray-200 px-2 py-1 text-[10px] text-gray-700">{especie}</span>)}</div></div></div>}
    </div>
    <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-4 py-3"><button type="button" className="h-9 rounded bg-[#008446] px-7 text-sm font-semibold text-white hover:bg-[#006f3b]">Visualizar</button><MoreVertical size={19} className="text-gray-500" /></div>
  </article>;
}

export function HabilitacoesProfissionalAnimalTab() {
  return <div className="flex flex-col gap-4">
    <AccordionCardGroup title="Emissão de GTA" activeCountText={`${HABILITACOES_EXEMPLO.length} Habilitações Ativas`} variant="sem-vinculacao" historicoTitle="Histórico de Inativos" groupNumber={1}>{HABILITACOES_EXEMPLO.map((item) => <HabilitacaoCard key={item.id} item={item} />)}</AccordionCardGroup>
    <AccordionCardGroup title="Exame de Brucelose/Tuberculose" activeCountText="1 Habilitação Ativa" variant="sem-vinculacao" historicoTitle="Histórico de Inativos" groupNumber={2}>{HABILITACAO_BRUCELOSE.map((item) => <HabilitacaoCard key={item.id} item={item} />)}</AccordionCardGroup>
    <AccordionCardGroup title="Exame de Mormo" activeCountText="1 Habilitação Ativa" variant="sem-vinculacao" historicoTitle="Histórico de Inativos" groupNumber={3}>{HABILITACAO_MORMO.map((item) => <HabilitacaoCard key={item.id} item={item} />)}</AccordionCardGroup>
  </div>;
}
