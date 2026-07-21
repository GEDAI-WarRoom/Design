import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Search,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
import {
  DOENCAS_COM_INSUMO_MOCK,
  formatarDoencas,
  formatarNotas,
  formatarPartidas,
  listarAjustesDosesInsumo,
  REVENDEDORAS_INSUMO_MOCK,
  SITUACOES_AJUSTE_DOSES_INSUMO,
  type AjusteDosesInsumo,
  type DoencaInsumoExame,
  type RevendedoraInsumo,
} from "./ajusteDosesInsumoData";

const GREEN = "#1A7A3C";
const PARTIDA_PATTERN = /^[A-Za-z0-9]{7}\/\d{2}$/;

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AjusteDosesInsumoPage({ onLogout, onNavigate }: PageProps) {
  const [revendedora, setRevendedora] = useState<RevendedoraInsumo | null>(null);
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState("");
  const [numeroPartida, setNumeroPartida] = useState("");
  const [doenca, setDoenca] = useState<DoencaInsumoExame | null>(null);
  const [tipoInsumo, setTipoInsumo] = useState("");
  const [periodoDe, setPeriodoDe] = useState("");
  const [periodoAte, setPeriodoAte] = useState("");
  const [situacao, setSituacao] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [erro, setErro] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const partidaInvalida = numeroPartida !== "" && !PARTIDA_PATTERN.test(numeroPartida);
  const periodoInvalido = periodoDe !== "" && periodoAte !== "" && periodoDe > periodoAte;
  const tiposInsumo = (doenca?.tiposInsumo ?? []).map((tipo) => ({ value: tipo, label: tipo }));

  const resultados = useMemo(() => listarAjustesDosesInsumo().filter((item) => {
    const notas = item.notasFiscais;
    const matchRevendedora = !revendedora || item.revendedora.codigo === revendedora.codigo;
    const matchNota = numeroNotaFiscal === "" || notas.some((nota) => nota.numero.includes(numeroNotaFiscal));
    const matchPartida = numeroPartida === "" || notas.some((nota) => (
      nota.itens.some((insumo) => insumo.numeroPartida.toLowerCase().includes(numeroPartida.toLowerCase()))
    ));
    const matchDoenca = !doenca || notas.some((nota) => nota.itens.some((insumo) => insumo.doenca === doenca.nome));
    const matchTipo = tipoInsumo === "" || notas.some((nota) => nota.itens.some((insumo) => insumo.tipoInsumo === tipoInsumo));
    const matchPeriodo = (!periodoDe || item.dataCadastro >= periodoDe)
      && (!periodoAte || item.dataCadastro <= periodoAte);
    const matchSituacao = situacao === "" || item.situacao === situacao;
    return matchRevendedora && matchNota && matchPartida && matchDoenca && matchTipo && matchPeriodo && matchSituacao;
  }), [
    doenca,
    numeroNotaFiscal,
    numeroPartida,
    periodoAte,
    periodoDe,
    revendedora,
    situacao,
    tipoInsumo,
  ]);

  const pesquisar = () => {
    if (!revendedora || !periodoDe || !periodoAte) {
      setErro("Selecione a revendedora e informe as datas inicial e final do período para pesquisar.");
      setHasSearched(false);
      return;
    }
    if (partidaInvalida) {
      setErro("Informe o número da partida no formato de 7 caracteres, barra e ano com 2 dígitos (ex.: 0001245/26).");
      setHasSearched(false);
      return;
    }
    if (periodoInvalido) {
      setErro("A data do campo Período - De deve ser menor ou igual à data do campo Período - Até.");
      setHasSearched(false);
      return;
    }
    setErro("");
    setHasSearched(true);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(resultados.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = resultados.length ? (currentPage - 1) * perPage + 1 : 0;
  const end = Math.min(currentPage * perPage, resultados.length);
  const rows = resultados.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="ajuste-doses-insumo" hideSearch />

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
          style={{ color: GREEN }}
        >
          <ArrowLeft size={15} /> Inicial
        </button>
        <div className="flex items-center justify-between gap-4 mb-5">
          <h1 className="text-2xl font-semibold text-gray-900">Ajuste de Doses de Insumo</h1>
          <button
            type="button"
            onClick={() => onNavigate("adicionar-ajuste-doses-insumo")}
            className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: GREEN }}
          >
            Adicionar Novo
          </button>
        </div>

        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_180px] gap-4 items-end">
              <EntitySearchInput
                label="Revendedora de Insumos"
                placeholder="Buscar por código ou nome."
                required
                value={revendedora?.nome ?? ""}
                data={REVENDEDORAS_INSUMO_MOCK}
                searchKeys={["codigo", "nome"]}
                columns={[
                  { label: "Código", key: "codigo" },
                  { label: "Nome", key: "nome" },
                  { label: "UF", key: "uf" },
                ]}
                icon={<img src={Icons.iconeInsumoUrl} alt="Revendedora de Insumos" className="w-5 h-5 object-contain" />}
                title="Buscar Revendedora de Insumos"
                subtitle="Busque por revendedoras habilitadas para insumos de exames de brucelose e tuberculose:"
                onChange={(item) => { setRevendedora(item); setErro(""); }}
              />

              <FloatInput
                label="Período - De"
                required
                type="date"
                value={periodoDe}
                icon={<Calendar size={17} />}
                onChange={setPeriodoDe}
              />
              <FloatInput
                label="Período - Até"
                required
                type="date"
                value={periodoAte}
                icon={<Calendar size={17} />}
                onChange={setPeriodoAte}
              />
              <button
                type="button"
                onClick={pesquisar}
                className="h-12 px-6 rounded-md text-white text-sm font-semibold flex items-center justify-center gap-2 transition hover:opacity-90"
                style={{ backgroundColor: GREEN }}
              >
                Pesquisar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end">
              <FloatInput
                label="Número da Nota Fiscal"
                value={numeroNotaFiscal}
                type="number"
                onChange={(value) => setNumeroNotaFiscal(value.replace(/\D/g, ""))}
              />
              <FloatInput
                label="Número da Partida"
                value={numeroPartida}
                maxLength={10}
                placeholder="0001245/26"
                onChange={(value) => setNumeroPartida(value.toUpperCase().slice(0, 10))}
              />
              <EntitySearchInput
                label="Doença"
                placeholder="Buscar pelo nome da doença."
                value={doenca?.nome ?? ""}
                data={DOENCAS_COM_INSUMO_MOCK}
                searchKeys={["nome"]}
                columns={[{ label: "Doença", key: "nome" }]}
                icon={<img src={Icons.iconeDoencaUrl} alt="Doença" className="w-5 h-5 object-contain" />}
                title="Buscar Doença"
                subtitle="Busque por doenças que possuem insumos de exame vinculados:"
                onChange={(item) => { setDoenca(item); setTipoInsumo(""); }}
              />
              {doenca && tiposInsumo.length > 0 && (
                <FloatSelect
                  label="Tipo de Insumo de Exame"
                  value={tipoInsumo}
                  options={tiposInsumo}
                  onChange={setTipoInsumo}
                />
              )}
              <FloatSelect
                label="Situação"
                value={situacao}
                options={SITUACOES_AJUSTE_DOSES_INSUMO}
                onChange={setSituacao}
              />
            </div>

            {partidaInvalida && (
              <p className="text-xs text-red-500">O número da partida deve possuir 7 caracteres, barra e ano com 2 dígitos.</p>
            )}
            {periodoInvalido && (
              <p className="text-xs text-red-500">A data inicial do período não pode ser posterior à data final.</p>
            )}
            {erro && <p className="text-sm text-red-500 font-medium">{erro}</p>}
          </div>

          {!hasSearched ? (
            <div className="p-12 text-center text-sm text-gray-500">
              Busque pelos ajustes de doses de insumo utilizando os filtros acima.
            </div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">Nenhum resultado foi encontrado.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-4 py-3 uppercase font-semibold text-gray-600 min-w-[260px]">Revendedora de Insumos</th>
                      <th className="text-left px-4 py-3 uppercase font-semibold text-gray-600 whitespace-nowrap">Número da Nota Fiscal</th>
                      <th className="text-left px-4 py-3 uppercase font-semibold text-gray-600 whitespace-nowrap">Número da Partida</th>
                      <th className="text-left px-4 py-3 uppercase font-semibold text-gray-600 min-w-[260px]">Doença</th>
                      <th className="text-left px-4 py-3 uppercase font-semibold text-gray-600 whitespace-nowrap">Situação</th>
                      <th className="px-4 py-3 w-[100px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((item: AjusteDosesInsumo) => (
                      <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-500">{item.revendedora.codigo} - {item.revendedora.nome}</td>
                        <td className="px-4 py-3 text-gray-500">{formatarNotas(item.notasFiscais)}</td>
                        <td className="px-4 py-3 text-gray-500">{formatarPartidas(item.notasFiscais)}</td>
                        <td className="px-4 py-3 text-gray-500">{formatarDoencas(item.notasFiscais)}</td>
                        <td className="px-4 py-3 text-gray-500">{item.situacao}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => onNavigate("visualizar-ajuste-doses-insumo", item)}
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Visualizar"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onNavigate("editar-ajuste-doses-insumo", item)}
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Editar"
                            >
                              <Pencil size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between p-4 text-sm text-gray-500 border-t border-gray-100">
                <span>Itens por página: {perPage}</span>
                <div className="flex items-center gap-4">
                  <span>{start} - {end} de {resultados.length}</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} className="p-1 disabled:opacity-30">
                      <ChevronLeft size={18} />
                    </button>
                    <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages} className="p-1 disabled:opacity-30">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
