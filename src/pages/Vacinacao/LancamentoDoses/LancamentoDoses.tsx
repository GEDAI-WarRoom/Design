import { useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye as ViewIcon,
  Pencil,
  X,
  Calendar
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, FloatInput } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { listarRegistrosMock } from "../../../components/ui/mockCollectionStorage";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

const DOENCAS_MOCK = [
  { id: 1, codigo: "D-001", nome: "Brucelose", tiposVacina: ["B19", "RB51"] },
  { id: 2, codigo: "D-002", nome: "Raiva", tiposVacina: [] },
  { id: 3, codigo: "D-003", nome: "Febre Aftosa", tiposVacina: ["O1 Campos", "A24 Cruzeiro"] },
];

const TIPOS_DESTINATARIO = [
  { value: "produtor", label: "Produtor" },
  { value: "vacinador", label: "Vacinador" },
  { value: "medico_veterinario", label: "Médico Veterinário" },
  { value: "revendedora", label: "Revendedora de Produtos Agropecuários" },
];

const SITUACOES = [
  { value: "Gravada", label: "Gravada" },
  { value: "Cancelada", label: "Cancelada" },
];

interface Lancamento {
  id: number;
  tipoDestinatario: "produtor" | "vacinador" | "medico_veterinario" | "revendedora";
  destinatarioDocumento: string;
  destinatarioNome: string;
  numeroPartida: string;
  doenca: string;
  tipoVacina: string;
  dataAjuste: string;
  situacao: "Gravada" | "Cancelada";
}

const LANCAMENTOS_MOCK: Lancamento[] = [
  { id: 1, tipoDestinatario: "revendedora", destinatarioDocumento: "3120938028", destinatarioNome: "Comercial AgroVat", numeroPartida: "025/24", doenca: "Brucelose", tipoVacina: "B19", dataAjuste: "2026-07-03", situacao: "Gravada" },
  { id: 2, tipoDestinatario: "produtor", destinatarioDocumento: "55566677788", destinatarioNome: "José Aarão Neto", numeroPartida: "006/23", doenca: "Febre Aftosa", tipoVacina: "O1 Campos", dataAjuste: "2026-06-18", situacao: "Cancelada" },
  { id: 3, tipoDestinatario: "vacinador", destinatarioDocumento: "11122233344", destinatarioNome: "Ana Pereira", numeroPartida: "100/24", doenca: "Raiva", tipoVacina: "", dataAjuste: "2026-08-01", situacao: "Gravada" },
  { id: 4, tipoDestinatario: "medico_veterinario", destinatarioDocumento: "98765432100", destinatarioNome: "Carlos Mendes", numeroPartida: "041/26", doenca: "Brucelose", tipoVacina: "RB51", dataAjuste: "2026-08-08", situacao: "Gravada" },
];

function normalizarTexto(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button onClick={onRemove} className="hover:opacity-80 transition flex-shrink-0"><X size={14} className="stroke-[2.5]" /></button>
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function LancamentoDosesVacinaPage({ onLogout, onNavigate }: PageProps) {
  const [tipoDestinatario, setTipoDestinatario] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [destinatarioDocumento, setDestinatarioDocumento] = useState("");
  const [numeroPartida, setNumeroPartida] = useState("");
  const [doenca, setDoenca] = useState<any | null>(null);
  const [tipoVacina, setTipoVacina] = useState("");
  const [periodoDe, setPeriodoDe] = useState("");
  const [periodoAte, setPeriodoAte] = useState("");
  const [situacao, setSituacao] = useState("");

  const [hasSearched, setHasSearched] = useState(false);

  const [page, setPage] = useState(1);
  const perPage = 10;

  const tiposVacinaDisponiveis = (doenca?.tiposVacina ?? []).map((t: string) => ({ value: t, label: t }));
  const doencaTemTipoVacina = (doenca?.tiposVacina?.length ?? 0) > 0;

  const periodoInvalido = periodoDe && periodoAte && periodoAte < periodoDe;

  const handlePesquisar = () => {
    if (periodoInvalido) {
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    setPage(1);
  };

  const filtrados = listarRegistrosMock("lancamentos-doses-vacina", LANCAMENTOS_MOCK).filter((l) => {
    const matchTipoDestinatario = !tipoDestinatario || l.tipoDestinatario === tipoDestinatario;
    const matchDestinatario = !destinatario || normalizarTexto(l.destinatarioNome).includes(normalizarTexto(destinatario));
    const matchDocumento = !destinatarioDocumento || l.destinatarioDocumento.replace(/\D/g, "").includes(destinatarioDocumento);
    const matchPartida = numeroPartida === "" || l.numeroPartida.includes(numeroPartida);
    const matchDoenca = !doenca || l.doenca === doenca.nome;
    const matchTipoVacina = tipoVacina === "" || l.tipoVacina === tipoVacina;
    const matchPeriodoDe = !periodoDe || l.dataAjuste >= periodoDe;
    const matchPeriodoAte = !periodoAte || l.dataAjuste <= periodoAte;
    const matchSituacao = !situacao || l.situacao === situacao;
    return matchTipoDestinatario && matchDestinatario && matchDocumento && matchPartida && matchDoenca && matchTipoVacina && matchPeriodoDe && matchPeriodoAte && matchSituacao;
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const temFiltroAtivo = Boolean(tipoDestinatario || destinatario || destinatarioDocumento || numeroPartida || doenca || tipoVacina || periodoDe || periodoAte || situacao);
  const tipoDestinatarioLabel = TIPOS_DESTINATARIO.find((tipo) => tipo.value === tipoDestinatario)?.label;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="lancamento-doses-vacina" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6">
        <div className="mb-1">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Ajuste de Doses de Vacina</h1>
            <button onClick={() => onNavigate("adicionar-lancamento-doses-vacina")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Novo
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm mt-5 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <FloatSelect
                label="Tipo de Destinatário"
                value={tipoDestinatario}
                onChange={setTipoDestinatario}
                options={TIPOS_DESTINATARIO}
              />
              <FloatInput label="Destinatário" value={destinatario} maxLength={255} onChange={setDestinatario} />
              <FloatInput
                label="CPF/CNPJ do Destinatário"
                value={destinatarioDocumento}
                maxLength={14}
                onChange={(valor) => setDestinatarioDocumento(valor.replace(/\D/g, "").slice(0, 14))}
              />

              <div className="relative border border-gray-300 rounded-md h-12 flex items-end px-3 pb-1.5 bg-white focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
                <label className={`absolute left-3 transition-all ${numeroPartida ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>Número da Partida</label>
                <input type="text" inputMode="numeric" maxLength={9} value={numeroPartida} onChange={(e) => setNumeroPartida(e.target.value)} className="w-full bg-transparent text-sm text-gray-800 outline-none h-6 placeholder:text-gray-300" />
              </div>

              <EntitySearchInput
                label="Doença"
                placeholder="Buscar pelo nome da doença"
                value={doenca ? doenca.nome : ""}
                data={DOENCAS_MOCK}
                searchKeys={["nome"]}
                columns={[{ label: "Doença", key: "nome" }]}
                icon={<img src={Icons.iconeDoencaUrl} alt="Doença" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}
                title="Buscar Doença"
                subtitle="Busque por uma doença cadastrada:"
                onChange={(ent) => { setDoenca(ent); setTipoVacina(""); }}
              />

              {doencaTemTipoVacina && (
                <FloatSelect label="Tipo de Vacina" value={tipoVacina} onChange={setTipoVacina} options={tiposVacinaDisponiveis} />
              )}
              <FloatInput label="Período - De" type="date" value={periodoDe} icon={<Calendar size={18} color={GREEN} />} onChange={setPeriodoDe} />
              <FloatInput label="Período - Até" type="date" value={periodoAte} icon={<Calendar size={18} color={GREEN} />} onChange={setPeriodoAte} />
              <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
              <button onClick={handlePesquisar} className="h-11 px-8 rounded-md text-white text-sm font-semibold transition hover:opacity-90" style={{ backgroundColor: GREEN }}>
                Pesquisar
              </button>
            </div>

            {periodoInvalido && (
              <p className="text-sm text-red-500 mt-3">A data "Até" deve ser maior ou igual à data "De".</p>
            )}
            {temFiltroAtivo && (
              <div className="flex flex-wrap gap-2 mt-4 animate-fadeIn">
                {tipoDestinatario && <Chip label={`Tipo de Destinatário: ${tipoDestinatarioLabel}`} onRemove={() => setTipoDestinatario("")} />}
                {destinatario && <Chip label={`Destinatário: ${destinatario}`} onRemove={() => setDestinatario("")} />}
                {destinatarioDocumento && <Chip label={`CPF/CNPJ: ${destinatarioDocumento}`} onRemove={() => setDestinatarioDocumento("")} />}
                {numeroPartida && <Chip label={`Partida: ${numeroPartida}`} onRemove={() => setNumeroPartida("")} />}
                {doenca && <Chip label={`Doença: ${doenca.nome}`} onRemove={() => { setDoenca(null); setTipoVacina(""); }} />}
                {tipoVacina && <Chip label={`Tipo de Vacina: ${tipoVacina}`} onRemove={() => setTipoVacina("")} />}
                {periodoDe && <Chip label={`De: ${periodoDe.split("-").reverse().join("/")}`} onRemove={() => setPeriodoDe("")} />}
                {periodoAte && <Chip label={`Até: ${periodoAte.split("-").reverse().join("/")}`} onRemove={() => setPeriodoAte("")} />}
                {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
              </div>
            )}
          </div>

          <div>
            {!hasSearched ? (
              <div className="p-12 text-center">
                <p className="text-sm text-gray-500">Busque pelo ajuste de doses utilizando os filtros acima.</p>
              </div>
            ) : total === 0 ? (
              <div className="p-12 text-center">
                <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className=" border-b border-gray-100">
                        <th className="text-left px-4 py-3 uppercase font-semibold text-gray-600 w-80">
                          Destinatário
                        </th>
                        <th className="text-left px-4 py-3 uppercase font-semibold text-gray-600 whitespace-nowrap w-44">
                          Número da Partida
                        </th>
                        <th className="text-left px-4 py-3 uppercase font-semibold text-gray-600">
                          Doença
                        </th>
                        <th className="text-left px-4 py-3 uppercase font-semibold text-gray-600 whitespace-nowrap w-40">
                          Situação
                        </th>
                        <th className="text-right px-4 py-3 uppercase font-semibold text-gray-600 w-24">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagina.map((l) => (
                        <tr key={l.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition text-sm text-gray-700">
                          <td className="px-4 py-3 max-w-[300px] leading-relaxed font-normal break-words">
                            {l.destinatarioDocumento} - {l.destinatarioNome}
                          </td>
                          <td className="px-4 py-3 font-normal text-gray-700 whitespace-nowrap">{l.numeroPartida}</td>
                          <td className="px-4 py-3 font-normal text-gray-700 whitespace-nowrap">{l.doenca}{l.tipoVacina ? ` (${l.tipoVacina})` : ""}</td>
                          <td className="px-4 py-3 font-normal text-gray-700 whitespace-nowrap">{l.situacao}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 justify-end">
              
                              <button onClick={() => onNavigate("visualizar-lancamento-doses-vacina", l)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar">
                                <ViewIcon size={18} />
                              </button>
                              <button onClick={() => onNavigate("editar-lancamento-doses-vacina", l)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar">
                                <Pencil size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500 bg-gray-50/30">
                  <span>Itens por página: {perPage}</span>
                  <div className="flex items-center gap-4">
                    <span>{inicio} - {fim} de {total}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageAtual === 1} className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronLeft size={18} /></button>
                      <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageAtual === totalPages} className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronRight size={18} /></button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
