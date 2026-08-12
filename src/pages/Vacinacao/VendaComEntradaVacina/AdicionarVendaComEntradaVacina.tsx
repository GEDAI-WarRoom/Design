import React, { useState, useMemo } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Check, Info, FlaskConical, Calendar } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, FloatCombobox } from "../../../components/ui/FormKit";
import { EntitySearchInput, DynamicListWrapper, RevendedoraInput, FornecedorVacinaInput } from "../../../components/ui/EntitySearch";

import * as Icons from "../../../imports/icons";
import { CadastroVacinacaoHeader, cadastroVacinacaoPageClass, mensagemSucessoCadastro, preencherComExemplo, type CadastroVacinacaoModeProps } from "../shared/CadastroVacinacaoMode";

const GREEN = "#1A7A3C";
const HOJE = new Date().toISOString().slice(0, 10);
const MES_ATUAL = HOJE.slice(0, 7);

// ==========================================================
// MOCKS DE ENTIDADE (substituir por API)
// ==========================================================
const REVENDEDORAS_MG_MOCK = [
  { id: 1, codigo: "3120938028", nome: "Comercial AgroVat", uf: "MG" },
  { id: 2, codigo: "3120938045", nome: "Agropecuária Vale Verde", uf: "MG" },
  { id: 3, codigo: "3120938090", nome: "Casa do Produtor Lavras", uf: "MG" },
];

const FORNECEDORES_VACINA_MOCK = [
  { id: 1, codigo: "LAB-0001", nome: "Laboratório BioMed", tipo: "Laboratório", uf: "SP" },
  { id: 2, codigo: "LAB-0002", nome: "Vacinas Imunotech", tipo: "Laboratório", uf: "PR" },
  { id: 3, codigo: "3520938028", nome: "AgroVet Distribuidora", tipo: "Revendedora", uf: "SP" },
];

const LABORATORIOS_MOCK = [
  { id: 1, codigo: "LAB-0001", nome: "Laboratório BioMed" },
  { id: 2, codigo: "LAB-0002", nome: "Vacinas Imunotech" },
  { id: 3, codigo: "LAB-0003", nome: "ImunoVet Biológicos" },
];

const DOENCAS_MOCK = [
  { id: 1, codigo: "D-001", nome: "Brucelose", tiposVacina: ["B19", "RB51"] },
  { id: 2, codigo: "D-002", nome: "Raiva", tiposVacina: [] },
  { id: 3, codigo: "D-003", nome: "Febre Aftosa", tiposVacina: ["O1 Campos", "A24 Cruzeiro"] },
];

const ESTADOS_BR = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
];

// ==========================================================
// HELPERS LOCAIS
// ==========================================================
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}

function SubGrupo({ titulo, children, comDivisor = false }: { titulo: string; children: React.ReactNode; comDivisor?: boolean }) {
  return (
    <>
      {comDivisor && <hr className="border-gray-100 my-2" />}
      <div className="flex flex-col gap-4">
        <span className="text-sm font-semibold text-gray-700">{titulo}</span>
        {children}
      </div>
    </>
  );
}

const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
// 💡 Removido "validade" daqui
const novaApresentacao = () => ({ uid: uid("ap"), frascos: "", dosesPorFrasco: "" });
// 💡 Adicionado "validade" ao nível do lote
const novoLote = () => ({ uid: uid("lt"), numeroPartida: "", laboratorio: null as any, doenca: null as any, tipoVacina: "", validade: "", apresentacoes: [novaApresentacao()] });

const totalDosesApresentacao = (frascos: string, dosesPorFrasco: string) =>
  (Number(frascos) || 0) * (Number(dosesPorFrasco) || 0);

interface LoteCardItemProps {
  lote: any;
  index: number;
  fornecedor: any;
  fornecedorEhLaboratorio: boolean;
  updateLote: (loteUid: string, patch: any) => void;
  addApresentacao: (loteUid: string) => void;
  removeApresentacao: (loteUid: string, index: number) => void;
  updateApresentacao: (loteUid: string, apUid: string, patch: any) => void;
}

// ==========================================================
// COMPONENTE ISOLADO DO CARD DO LOTE
// ==========================================================
export function LoteCardItem({
  lote,
  index,
  fornecedor,
  fornecedorEhLaboratorio,
  updateLote,
  addApresentacao,
  removeApresentacao,
  updateApresentacao,
}: LoteCardItemProps) {

  const totalDosesLote = lote.apresentacoes?.reduce((sum: number, ap: any) => {
    return sum + totalDosesApresentacao(ap.frascos, ap.dosesPorFrasco);
  }, 0) || 0;

  const doencaTemTipo = lote.doenca && lote.doenca.tiposVacina && lote.doenca.tiposVacina.length > 0;

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <FloatInput
          label="Número de Partida"
          required
          placeholder="0013225/19"
          value={lote.numeroPartida}
          onChange={(v) => updateLote(lote.uid, { numeroPartida: v.replace(/[^0-9/]/g, "").slice(0, 10) })}
          maxLength={10}
        />

        {fornecedorEhLaboratorio ? (
          <FloatInput
            label="Laboratório (fornecedor)"
            required
            disabled
            value={fornecedor?.nome || lote.laboratorio?.nome || ""}
            onChange={() => {}}
            icon={<FlaskConical size={18} />}
          />
        ) : (
          <EntitySearchInput
            label="Laboratório"
            placeholder="Buscar laboratório..."
            required
            value={lote.laboratorio ? lote.laboratorio.nome : ""}
            data={LABORATORIOS_MOCK}
            searchKeys={["nome"]}
            columns={[{ label: "Nome do Laboratório", key: "nome" }]}
            icon={<FlaskConical size={18} color={GREEN} />}
            title="Buscar Laboratório"
            subtitle="Busque por um laboratório cadastrado:"
            onChange={(ent) => updateLote(lote.uid, { laboratorio: ent })}
          />
        )}
      </div>

      {/* Grid contendo Doença, Tipo de Vacina (se houver) e Validade alinhados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

        {/* 💡 Validade movida com sucesso para o Lote inteiro */}
        <FloatInput
          label="Validade"
          required
          icon={<Calendar size={18} />}
          type="month"
          placeholder="mm/aaaa"
          min={MES_ATUAL}
          value={lote.validade || ""}
          onChange={(v) => updateLote(lote.uid, { validade: v })}
        />
        <EntitySearchInput
          label="Doença"
          placeholder="Buscar doença..."
          required
          value={lote.doenca ? lote.doenca.nome : ""}
          data={DOENCAS_MOCK}
          searchKeys={["nome"]}
          columns={[{ label: "Nome da Doença", key: "nome" }]}
          icon={<img src={Icons.iconeDoencaUrl} alt="Doença" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}
          title="Buscar Doença"
          subtitle="Busque por uma doença cadastrada:"
          onChange={(ent) => updateLote(lote.uid, { doenca: ent, tipoVacina: "" })}
        />

        {doencaTemTipo ? (
          <FloatSelect
            label="Tipo de Vacina"
            required
            value={lote.tipoVacina}
            onChange={(v) => updateLote(lote.uid, { tipoVacina: v })}
            options={lote.doenca.tiposVacina.map((t: string) => ({ value: t, label: t }))}
          />
        ) : (
          /* Elemento fantasma para manter o alinhamento de 3 colunas do grid se a doença não tiver tipo */
          <div className="hidden md:block" />
        )}


      </div>

      <SubGrupo titulo="Apresentação de Vacinas" comDivisor>
        <DynamicListWrapper
          items={lote.apresentacoes}
          behavior="at-least-one"
          addButtonLabel="Adicionar Apresentação"
          itemLabel=""
          onAddItem={() => addApresentacao(lote.uid)}
          onRemoveItem={(i: number) => removeApresentacao(lote.uid, i)}
          variant="plain"
          showCounter={true}
          smallCounter={true}
        >
          {(ap: any) => (
            // Grid de apresentações agora possui apenas 3 colunas, ficando visualmente mais limpo e espaçoso!
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end w-full">
              <FloatInput
                label="Nº de Doses por Frasco"
                required
                type="text"
                value={ap.dosesPorFrasco}
                onChange={(v) => updateApresentacao(lote.uid, ap.uid, { dosesPorFrasco: v.replace(/\D/g, "").slice(0, 10) })}
              />
              <FloatInput
                label="Nº de Frascos Adquiridos"
                required
                type="text"
                value={ap.frascos}
                onChange={(v) => updateApresentacao(lote.uid, ap.uid, { frascos: v.replace(/\D/g, "").slice(0, 10) })}
              />

              <FloatInput
                label="Total de Doses"
                required
                disabled
                value={String(totalDosesApresentacao(ap.frascos, ap.dosesPorFrasco) || "")}
                onChange={() => { }}
              />
            </div>
          )}
        </DynamicListWrapper>
      </SubGrupo>

      <SubGrupo titulo="Total do Lote" comDivisor>
        <FloatInput label="Total de Doses Adquiridas" required disabled value={String(totalDosesLote || "")} onChange={() => { }} className="md:w-1/2" />
      </SubGrupo>
    </div>
  );
}

// ==========================================================
// PÁGINA PRINCIPAL
// ==========================================================
interface PageProps extends CadastroVacinacaoModeProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarVendaComEntradaVacinaPage({ onLogout, onNavigate, mode = "create", dados }: PageProps) {
  const preenchendoRegistro = mode !== "create";
  const [revendedora, setRevendedora] = useState<any | null>(dados?.revendedora ?? (dados?.revendedoraNome ? { codigo: dados.revendedoraCodigo, nome: dados.revendedoraNome } : preenchendoRegistro ? { codigo: "3120938028", nome: "Comercial AgroVat" } : null));
  const [fornecedor, setFornecedor] = useState<any | null>(dados?.fornecedorEntidade ?? (dados?.fornecedor ? { codigo: `FOR-${dados.id ?? "001"}`, nome: dados.fornecedor, tipo: "Laboratório" } : preenchendoRegistro ? { codigo: "FOR-001", nome: "Laboratório BioMed", tipo: "Laboratório" } : null));
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState(dados?.numeroNotaFiscal ?? "");
  const [ufNotaFiscal, setUfNotaFiscal] = useState(dados?.ufNotaFiscal ?? (preenchendoRegistro ? "MG" : ""));
  const [dataNotaFiscal, setDataNotaFiscal] = useState(dados?.dataNotaFiscal ?? (preenchendoRegistro ? "2026-08-01" : ""));
  const [situacao, setSituacao] = useState<"Gravada" | "Cancelada">(dados?.situacao ?? "Gravada");
  const [lotes, setLotes] = useState<any[]>(dados?.lotes?.length
    ? dados.lotes
    : dados?.numeroPartida
      ? [{
          ...novoLote(),
          numeroPartida: dados.numeroPartida,
          laboratorio: dados.laboratorio ? { nome: dados.laboratorio } : null,
          doenca: dados.doenca ? { nome: dados.doenca } : null,
          tipoVacina: dados.tipoVacina ?? "",
          validade: dados.validade ?? "2026-12",
          apresentacoes: dados.apresentacoes?.length ? dados.apresentacoes : [{ uid: uid("ap"), dosesPorFrasco: "20", frascos: "5" }],
        }]
      : [novoLote()]);
  const [isSucesso, setIsSucesso] = useState(false);

  const fornecedorEhLaboratorio = fornecedor?.tipo === "Laboratório";

  const updateLote = (loteUid: string, patch: any) =>
    setLotes((ls) => ls.map((l) => (l.uid === loteUid ? { ...l, ...patch } : l)));
  const addLote = () => setLotes((ls) => [...ls, novoLote()]);
  const removeLote = (index: number) => setLotes((ls) => ls.filter((_, i) => i !== index));

  const addApresentacao = (loteUid: string) =>
    setLotes((ls) => ls.map((l) => (l.uid === loteUid ? { ...l, apresentacoes: [...l.apresentacoes, novaApresentacao()] } : l)));
  const removeApresentacao = (loteUid: string, index: number) =>
    setLotes((ls) => ls.map((l) => (l.uid === loteUid ? { ...l, apresentacoes: l.apresentacoes.filter((_: any, i: number) => i !== index) } : l)));
  const updateApresentacao = (loteUid: string, apUid: string, patch: any) =>
    setLotes((ls) => ls.map((l) => (l.uid === loteUid
      ? { ...l, apresentacoes: l.apresentacoes.map((a: any) => (a.uid === apUid ? { ...a, ...patch } : a)) }
      : l)));

  const totaisPorDoenca = useMemo(() => {
    const map = new Map<string, number>();
    lotes.forEach((l) => {
      const nome = l.doenca?.nome;
      if (!nome) return;
      const totalLote = l.apresentacoes.reduce(
        (s: number, a: any) => s + totalDosesApresentacao(a.frascos, a.dosesPorFrasco), 0
      );
      map.set(nome, (map.get(nome) || 0) + totalLote);
    });
    return Array.from(map, ([doenca, total]) => ({ doenca, total }));
  }, [lotes]);

  const registroAtual = preencherComExemplo({
    ...(dados ?? {}),
    id: dados?.id ?? `venda-entrada-${Date.now()}`,
    revendedora,
    revendedoraCodigo: revendedora?.codigo,
    revendedoraNome: revendedora?.nome,
    fornecedorEntidade: fornecedor,
    fornecedor: fornecedor?.nome,
    numeroNotaFiscal,
    ufNotaFiscal,
    dataNotaFiscal,
    situacao,
    lotes,
  }, {
    id: "venda-entrada-exemplo",
    revendedora: { id: 1, codigo: "3120938028", nome: "Comercial AgroVat", uf: "MG" },
    revendedoraCodigo: "3120938028",
    revendedoraNome: "Comercial AgroVat",
    fornecedorEntidade: { id: 1, codigo: "FOR-001", nome: "Laboratório BioMed", tipo: "Laboratório", uf: "SP" },
    fornecedor: "Laboratório BioMed",
    numeroNotaFiscal: "1234567",
    ufNotaFiscal: "MG",
    dataNotaFiscal: "2026-08-01",
    situacao: "Gravada",
    lotes: [{
      uid: "lote-exemplo", numeroPartida: "0013225/24", laboratorio: { id: 1, nome: "Laboratório Biovet" },
      doenca: { id: 1, nome: "Brucelose", tiposVacina: ["B19", "RB51"] }, tipoVacina: "B19", validade: "2026-12",
      apresentacoes: [{ uid: "apresentacao-exemplo", dosesPorFrasco: "20", frascos: "5", validade: "2026-12" }],
    }],
  });

  return (
    <div className={cadastroVacinacaoPageClass(mode, "min-h-screen bg-[#f2f3f5]")}>
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="venda-entrada-vacina" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">

        <div>
          <button type="button" onClick={() => onNavigate("venda-entrada-vacina")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas Vendas com Entrada de Vacina
          </button>
          <CadastroVacinacaoHeader mode={mode} nomeCadastro="Venda com Entrada de Vacina" rotaEditar="editar-venda-entrada-vacina" dados={dados} onNavigate={onNavigate} onSubmit={() => setIsSucesso(true)} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3">
            <div className="text-gray-500 flex-shrink-0">
              <Info size={20} className="stroke-[2.5]" />
            </div>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
            </p>
          </div>

          <div className={`flex flex-col gap-6 ${mode === "edit" ? "pointer-events-none opacity-75" : ""}`}>
          <Section title="Emitente">
            <div className="flex flex-col gap-3">
              <FornecedorVacinaInput
                value={fornecedor ? fornecedor.codigo : ""}
                required
                tooltipText="Não encontrou a Fornecedora de Vacina? Entre em contato com o Escritório Seccional do IMA de sua região."
                onChange={(entidadeSelecionada) => setFornecedor(entidadeSelecionada)}
                onEyeClick={() => {
                  if (fornecedor?.codigo) alert(`Visualizar detalhes: ${fornecedor.codigo}`);
                  else alert("Por favor, digite ou selecione um fornecedor primeiro.");
                }}
              />
            </div>
          </Section>

          <Section title="Destinatário">
            <div className="flex flex-col gap-3">
              <RevendedoraInput
                value={revendedora ? revendedora.codigo : ""}
                required
                onChange={(entidadeSelecionada) => setRevendedora(entidadeSelecionada)}
                onEyeClick={() => {
                  if (revendedora?.codigo) alert(`Visualizar detalhes: ${revendedora.codigo}`);
                  else alert("Por favor, digite ou selecione uma revendedora primeiro.");
                }}
              />
            </div>
          </Section>

          <Section title="Nota Fiscal">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <FloatInput
                  label="Número da Nota Fiscal"
                  required
                  type="text"
                  value={numeroNotaFiscal}
                  onChange={(v) => setNumeroNotaFiscal(v.replace(/\D/g, "").slice(0, 10))}
                />
                <FloatCombobox label="UF da Nota Fiscal" required value={ufNotaFiscal} onChange={setUfNotaFiscal} options={ESTADOS_BR} />
                <FloatInput
                  label="Data da Nota Fiscal"
                  required
                  type="date"
                  max={HOJE}
                  icon={<Calendar size={18} />}
                  value={dataNotaFiscal}
                  onChange={setDataNotaFiscal}
                />
              </div>

              <DynamicListWrapper
                items={lotes}
                behavior="at-least-one"
                addButtonLabel="Adicionar Lote"
                itemLabel="Lote de Vacina"
                onAddItem={addLote}
                onRemoveItem={removeLote}
                showCounter={false}
              >
                {(lote: any, index: number) => (
                  <LoteCardItem
                    key={lote.uid}
                    lote={lote}
                    index={index}
                    fornecedor={fornecedor}
                    fornecedorEhLaboratorio={fornecedorEhLaboratorio}
                    updateLote={updateLote}
                    addApresentacao={addApresentacao}
                    removeApresentacao={removeApresentacao}
                    updateApresentacao={updateApresentacao}
                  />
                )}
              </DynamicListWrapper>

              <SubGrupo titulo="Total da Nota" comDivisor>
                {totaisPorDoenca.length === 0 ? (
                  <span className="text-sm text-gray-400 italic pl-1">Selecione a doença e as doses nos lotes para ver os totais.</span>
                ) : (
                  <div className="flex flex-col gap-3">
                    {totaisPorDoenca.map((t) => (
                      <div key={t.doenca} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <FloatInput label="Doença" disabled value={t.doenca} onChange={() => { }} />
                        <FloatInput label="Total de Doses Adquiridas" disabled value={String(t.total)} onChange={() => { }} />
                      </div>
                    ))}
                  </div>
                )}
              </SubGrupo>
            </div>
          </Section>
          </div>

          <Section title="Situação do cadastro">
            <div className="max-w-sm">
              <FloatSelect
                label="Situação"
                value={situacao}
                onChange={(v) => setSituacao(v as "Gravada" | "Cancelada")}
                options={[{ value: "Gravada", label: "Gravada" }, { value: "Cancelada", label: "Cancelada" }]}
                disabled={mode === "view" || mode === "create"}
              />
              {mode === "edit" && situacao === "Cancelada" && (
                <p className="mt-2 text-xs text-amber-700">O cancelamento é irreversível e só pode ser realizado se não houver venda posterior.</p>
              )}
            </div>
          </Section>
        </div>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{mensagemSucessoCadastro(mode, "Venda com Entrada de Vacina")}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {numeroNotaFiscal ? `Nota Fiscal nº ${numeroNotaFiscal}` : "A venda"} foi registrada.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("venda-entrada-vacina"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition cursor-pointer">
                Voltar
              </button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-venda-entrada-vacina", registroAtual); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition cursor-pointer">
                Visualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdicionarVendaComEntradaVacinaPage;
