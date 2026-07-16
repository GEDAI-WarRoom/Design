import { useMemo, useState } from "react";
import { ArrowLeft, Building2, Calendar, ChevronLeft, ChevronRight, Eye, Pencil, Search, Stethoscope } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

import {
  ESCRITORIOS_SECCIONAIS,
  MEDICOS_VETERINARIOS_GTA,
  SITUACOES_REGISTRO_VENDA_GTA,
  formatarData,
  listarRegistrosVendaGTA,
  quantidadeDisponivel,
  type EscritorioSeccional,
  type MedicoVendaGTA,
} from "./registroVendaGTADigitalData";

const GREEN = "#1A7A3C";

interface Props {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function RegistroVendaGTADigitalPage({ onLogout, onNavigate }: Props) {
  const [escritorio, setEscritorio] = useState<EscritorioSeccional | null>(null);
  const [medico, setMedico] = useState<MedicoVendaGTA | null>(null);
  const [dataCadastro, setDataCadastro] = useState("");
  const [situacao, setSituacao] = useState("");
  const [pesquisou, setPesquisou] = useState(false);
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  const resultados = useMemo(() => listarRegistrosVendaGTA().filter((registro) =>
    (!escritorio || registro.escritorio.id === escritorio.id) &&
    (!medico || registro.medico.id === medico.id) &&
    (!dataCadastro || registro.dataCadastro === dataCadastro) &&
    (!situacao || registro.situacao === situacao)
  ), [escritorio, medico, dataCadastro, situacao, pesquisou]);

  const totalPaginas = Math.max(1, Math.ceil(resultados.length / porPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const linhas = resultados.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina);
  const inicio = resultados.length ? (paginaAtual - 1) * porPagina + 1 : 0;
  const fim = Math.min(paginaAtual * porPagina, resultados.length);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="registro-venda-gta-digital" hideSearch />
      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        <button type="button" onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C] hover:opacity-70">
          <ArrowLeft size={15} /> Inicial
        </button>
        <div className="flex items-center justify-between gap-4 mb-5">
          <h1 className="text-2xl font-semibold text-gray-900">Registro de Venda de GTA Digital</h1>
          <button type="button" onClick={() => onNavigate("adicionar-registro-venda-gta-digital")} className="px-5 py-3 rounded-md text-white text-sm font-semibold hover:opacity-90" style={{ backgroundColor: GREEN }}>
            Adicionar Nova
          </button>
        </div>

        <section className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <EntitySearchInput
              label="Escritório Seccional"
              placeholder="Buscar por nome ou sigla"
              value={escritorio?.nome ?? ""}
              data={ESCRITORIOS_SECCIONAIS}
              searchKeys={["nome", "sigla"]}
              columns={[{ label: "Escritório Seccional", key: "nome" }, { label: "Sigla", key: "sigla" }]}
              icon={
                  Icons.iconeUnidadeAdministrativaUrl ? (
                    <img
                      src={Icons.iconeUnidadeAdministrativaUrl}
                      alt="Escritório Seccional"
                      className="w-5 h-5 object-contain"
                    />
                  ) : undefined
                }

              title="Buscar Escritório Seccional"
              subtitle="Busque po um escritório seccional cadastrado:"
              confirmLabel="Selecionar"
              onChange={setEscritorio}
            />
            <EntitySearchInput
              label="Médico Veterinário"
              placeholder="Buscar por nome ou CPF"
              value={medico?.nome ?? ""}
              data={MEDICOS_VETERINARIOS_GTA}
              searchKeys={["nome", "cpf"]}
              columns={[{ label: "Nome", key: "nome" }, { label: "CPF", key: "cpf" }]}
              icon={
                  Icons.iconeProfissionalAnimalUrl ? (
                    <img
                      src={Icons.iconeProfissionalAnimalUrl}
                      alt="Médico Veterinário"
                      className="w-5 h-5 object-contain"
                    />
                  ) : undefined
                }
              title="Buscar Médico Veterinário"
              subtitle="Busque por um médico veterinário cadastrado:"
              confirmLabel="Selecionar"
              onChange={setMedico}
            />
            <FloatInput
              label="Data do cadastro"
              type="date"
              value={dataCadastro}
              onChange={setDataCadastro}
              icon={<Calendar size={18} />}
            />
            <FloatSelect
              label="Situação"
              value={situacao}
              onChange={setSituacao}
              options={SITUACOES_REGISTRO_VENDA_GTA}
            />
            <button 
              type="button" 
              onClick={() => { setPesquisou(true); setPagina(1); }} 
              className="h-11 px-6 rounded-md text-white text-sm font-semibold flex items-center justify-center gap-2" 
              style={{ backgroundColor: GREEN }}
            >
              Pesquisar
            </button>
          </div>

         

          {!pesquisou ? (
            <div className="py-12 text-center text-sm text-gray-500">Busque por registro de venda de GTA utilizando os filtros acima.</div>
          ) : linhas.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">Nenhum resultado foi encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="border-b border-gray-100">
                  {["Escritório Seccional", "Qtd. comprada", "Qtd. utilizada", "Qtd. disponível", "Médico Veterinário", "Data de cadastro", "Situação"].map((titulo) => <th key={titulo} className="text-left px-3 py-3 font-semibold uppercase text-gray-600 whitespace-nowrap">{titulo}</th>)}
                  <th className="px-3 py-3 w-[100px]" />
                </tr></thead>
                <tbody>{linhas.map((registro) => (
                  <tr key={registro.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="px-3 py-3 text-gray-500">{registro.escritorio.nome}</td>
                    <td className="px-3 py-3 text-gray-500">{registro.quantidadeComprada}</td>
                    <td className="px-3 py-3 text-gray-500">{registro.quantidadeUtilizada}</td>
                    <td className="px-3 py-3 text-gray-500">{quantidadeDisponivel(registro)}</td>
                    <td className="px-3 py-3 text-gray-500 ">{registro.medico.cpf} - {registro.medico.nome}</td>
                    <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{formatarData(registro.dataCadastro)}</td>
                    <td className="px-3 py-3 text-gray-500">{registro.situacao}</td>
                    <td className="px-3 py-3"><div className="flex justify-end gap-1">
                      <button type="button" title="Visualizar" onClick={() => onNavigate("visualizar-registro-venda-gta-digital", registro)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md"><Eye size={18} /></button>
                      <button type="button" title="Editar" onClick={() => onNavigate("editar-registro-venda-gta-digital", registro)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md"><Pencil size={17} /></button>
                    </div></td>
                  </tr>
                ))}</tbody>
              </table>
              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {porPagina}</span>
                <div className="flex items-center gap-3"><span>{inicio} - {fim} de {resultados.length}</span>
                  <button type="button" disabled={paginaAtual === 1} onClick={() => setPagina((valor) => Math.max(1, valor - 1))} className="disabled:opacity-30"><ChevronLeft size={18} /></button>
                  <button type="button" disabled={paginaAtual === totalPaginas} onClick={() => setPagina((valor) => Math.min(totalPaginas, valor + 1))} className="disabled:opacity-30"><ChevronRight size={18} /></button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
