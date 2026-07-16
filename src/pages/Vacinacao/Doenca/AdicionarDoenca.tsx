import { useState } from "react";
import {
  ArrowLeft,
  Dna,
  PlusCircle,
  Trash2,
  CheckCircle2,
  X,
  Info, ChevronUp
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, CheckboxGroup, SearchModal, CustomRadio, SimNao  } from "../../../components/ui/FormKit";
import { EntitySearchInput, DynamicListWrapper } from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS DE ENTIDADE (substituir por API)
// "sexoDefinido" decide se a Faixa Etária é separada por Macho/Fêmea
// ou única. As faixas vêm da espécie selecionada.
// ==========================================================
interface EspecieEntidade {
  id: number;
  nome: string;
  grupo: string;
  sexoDefinido: boolean;
  faixas: string[];
}

const ESPECIES_MOCK: EspecieEntidade[] = [
  { id: 1, nome: "Bovino", grupo: "Bovídeos", sexoDefinido: true, faixas: ["De 0 a 12 meses", "De 13 a 24 meses", "De 25 a 36 meses", "Acima de 36 meses"] },
  { id: 2, nome: "Suíno", grupo: "Suídeos", sexoDefinido: true, faixas: ["De 0 a 6 meses", "De 7 a 12 meses", "Acima de 12 meses"] },
  { id: 3, nome: "Abelha", grupo: "Abelhas", sexoDefinido: false, faixas: ["Enxame novo", "Enxame estabelecido"] },
  { id: 4, nome: "Galinha", grupo: "Aves", sexoDefinido: false, faixas: ["Pinto", "Frango", "Adulto"] },
];

const SIM_NAO = [
  { value: "Sim", label: "Sim" },
  { value: "Não", label: "Não" },
];

// ==========================================================
// MODELO DE UMA ESPÉCIE SUSCETÍVEL (bloco repetível)
// ==========================================================
const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

interface EspecieSuscetivel {
  uid: string;
  especie: EspecieEntidade | null;
  possuiVacina: string; // "Sim" | "Não" | ""
  faixasUnico: string[]; // espécie sem sexo definido
  faixasMacho: string[]; // espécie com sexo definido
  faixasFemea: string[];
  exigeReceituario: string; // "Sim" | "Não" | ""
  possuiVacinacaoOficial: string; // "Sim" | "Não" | ""
  possuiTipoVacina: string; // "Sim" | "Não" | ""
  tiposVacina: { uid: string; nome: string }[];
}

const novaEspecie = (): EspecieSuscetivel => ({
  uid: uid("esp"),
  especie: null,
  possuiVacina: "",
  faixasUnico: [],
  faixasMacho: [],
  faixasFemea: [],
  exigeReceituario: "",
  possuiVacinacaoOficial: "",
  possuiTipoVacina: "",
  tiposVacina: [{ uid: uid("tv"), nome: "" }],
});

// ==========================================================
// SUBCOMPONENTES
// ==========================================================


function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5 relative">{children}</div>}
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarDoencaPage({ onLogout, onNavigate }: PageProps) {
  const [nome, setNome] = useState("");
  const [especies, setEspecies] = useState<EspecieSuscetivel[]>([novaEspecie()]);

  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // modal de seleção de espécie: guarda qual bloco está selecionando
  const [modalEspecieUid, setModalEspecieUid] = useState<string | null>(null);

  // ---- helpers de atualização imutável ----
  const patchEspecie = (u: string, patch: Partial<EspecieSuscetivel>) =>
    setEspecies((prev) => prev.map((e) => (e.uid === u ? { ...e, ...patch } : e)));

  const addEspecie = () => setEspecies((prev) => [...prev, novaEspecie()]);
  const removeEspecie = (u: string) => setEspecies((prev) => (prev.length === 1 ? prev : prev.filter((e) => e.uid !== u)));

  const addTipoVacina = (u: string) =>
    setEspecies((prev) => prev.map((e) => (e.uid === u ? { ...e, tiposVacina: [...e.tiposVacina, { uid: uid("tv"), nome: "" }] } : e)));
  const removeTipoVacina = (u: string, tvUid: string) =>
    setEspecies((prev) => prev.map((e) => (e.uid === u ? { ...e, tiposVacina: e.tiposVacina.length === 1 ? e.tiposVacina : e.tiposVacina.filter((t) => t.uid !== tvUid) } : e)));
  const patchTipoVacina = (u: string, tvUid: string, nome: string) =>
    setEspecies((prev) => prev.map((e) => (e.uid === u ? { ...e, tiposVacina: e.tiposVacina.map((t) => (t.uid === tvUid ? { ...t, nome } : t)) } : e)));

  // quando escolhe a espécie, limpa as faixas (que dependem dela)
  const onSelectEspecie = (u: string, ent: EspecieEntidade) => {
    patchEspecie(u, { especie: ent, faixasUnico: [], faixasMacho: [], faixasFemea: [] });
    setModalEspecieUid(null);
  };

  // ---- validação por bloco (AC3) ----
  const especieValida = (e: EspecieSuscetivel): boolean => {
    if (!e.especie) return false;
    if (e.possuiVacina === "") return false;
    if (e.possuiVacina === "Sim") {
      if (e.exigeReceituario === "" || e.possuiVacinacaoOficial === "" || e.possuiTipoVacina === "") return false;
      if (e.possuiTipoVacina === "Sim" && e.tiposVacina.every((t) => t.nome.trim() === "")) return false;
    }
    return true;
  };

  const formValido = nome.trim() !== "" && especies.length > 0 && especies.every(especieValida);

  const handleSalvar = () => {
    setTentouSalvar(true);
    if (!formValido) return;
    setSucesso(true);
  };

  const err = (cond: boolean) => (tentouSalvar && cond ? "Campo obrigatório." : undefined);

  // espécie do modal ativo (para filtrar já selecionadas, se quiser)
  const especieAtiva = especies.find((e) => e.uid === modalEspecieUid) ?? null;

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-24">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="doenca" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        {/* Topo da Página */}
        <div>
          <button onClick={() => onNavigate("doenca")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas Doenças
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Adicionar Doença</h1>
        
        </div>

         <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* ============ INFORMAÇÕES BÁSICAS ============ */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            <FloatInput
              label="Nome da Doença"
              required
              maxLength={255}
              value={nome}
              onChange={setNome}
              error={err(nome.trim() === "")}
            />
          </div>
        </Section>

     {/* ============ ESPÉCIES SUSCETÍVEIS (DynamicListWrapper) ============ */}
        <Section title="Espécies Suscetíveis">

        
<DynamicListWrapper
            items={especies}
            behavior="at-least-one"
            addButtonLabel="Adicionar Espécie"
            itemLabel="Espécie"
            onAddItem={addEspecie}
            onRemoveItem={(i: number) => {
              // Converte o índice do array para a remoção por UID que seu estado usa
              const especieAlvo = especies[i];
              if (especieAlvo) removeEspecie(especieAlvo.uid);
            }}
            showCounter={true}
          >
            {(e: any) => {
              const sexoDefinido = e.especie?.sexoDefinido ?? false;
              const faixasDisponiveis = e.especie?.faixas ?? [];
              const mostrarVacinaCampos = e.possuiVacina === "Sim";

              return (
                /* 💡 Envelopado em uma div principal com 'w-full' e 'mb-6' para estruturar cada item da lista */
                <div className="w-full mb-6">
                  
                  {/* Grid Inicial */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Espécie */}
                    <EntitySearchInput
                      label="Espécie"
                      required
                      placeholder="Buscar por nome da espécie"
                      value={e.especie ? e.especie.nome : ""}
                      data={ESPECIES_MOCK}
                      searchKeys={["nome", "grupo"]}
                      columns={[
                        { label: "Espécie", key: "nome" },
                        { label: "Grupo", key: "grupo" },
                      ]}
                      icon={<Dna size={18} color={GREEN} />}
                      title="Buscar Espécie"
                      subtitle="Busque por uma espécie cadastrada:"
                      onChange={(ent: any) => {
                        patchEspecie(e.uid, { especie: ent });
                      }}
                      readOnly
                      error={err(!e.especie)}
                    />

                    {/* Possui Vacina? */}
              <SimNao
                label="Possui Vacina?"
                required
                name={`possuiVacina-${e.uid}`}
                value={e.possuiVacina} // Aceita "Sim", "Não", true ou false conforme tratado internamente pelo SimNao
                onChange={(boolValue: boolean) => {
                  // Converte o booleano de volta para a string "Sim"/"Não" esperado pelo seu estado (patchEspecie)
                  patchEspecie(e.uid, { possuiVacina: boolValue ? "Sim" : "Não" });
                }}
                hasTooltip={true} // O componente SimNao usa hasTooltip e tooltipText para exibir a dica
                tooltipText="Possui vacina para pelo menos uma das espécies suscetíveis à doença?"
              />
                  </div>

                 {/* ---- Campos condicionais se Possui Vacina? = Sim ---- */}
{mostrarVacinaCampos && (
  <div className="flex flex-col gap-4 pt-4 mt-4">
    
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-end mt-2">
  
  <SimNao
    label="Exige receituário para venda de vacina?"
    required
    name={`exigeReceituario-${e.uid}`}
    value={e.exigeReceituario} // Aceita "Sim" / "Não" ou true/false
    onChange={(boolValue: boolean) => {
      // Converte o booleano de volta para a string "Sim"/"Não" que seu estado usa
      patchEspecie(e.uid, { exigeReceituario: boolValue ? "Sim" : "Não" });
    }}
  />
  
  <SimNao
    label="Possui Vacinação Oficial?"
    required
    name={`possuiVacinacaoOficial-${e.uid}`}
    value={e.possuiVacinacaoOficial}
    onChange={(boolValue: boolean) => {
      patchEspecie(e.uid, { possuiVacinacaoOficial: boolValue ? "Sim" : "Não" });
    }}
  />
  
  <SimNao
    label="Possui Tipo de Vacina?"
    required
    name={`possuiTipoVacina-${e.uid}`}
    value={e.possuiTipoVacina}
    onChange={(boolValue: boolean) => {
      patchEspecie(e.uid, { possuiTipoVacina: boolValue ? "Sim" : "Não" });
    }}
  />

</div>

                      {/* ---- Tipos de Vacina (se Possui Tipo de Vacina? = Sim) ---- */}
                      {e.possuiTipoVacina === "Sim" && (
                        <div className="flex flex-col gap-3 pt-4">
                         

                          <div className="flex flex-col gap-3">
                            {e.tiposVacina.map((t: any, tIdx: number) => (
                              <div key={t.uid} className="flex items-start gap-2">
                                <div className="flex-1">
                                  <FloatInput
                                    label={`Tipo de Vacina ${tIdx + 1}`}
                                    required
                                    maxLength={255}
                                    value={t.nome}
                                    onChange={(v: string) => patchTipoVacina(e.uid, t.uid, v)}
                                    error={err(e.possuiTipoVacina === "Sim" && t.nome.trim() === "" && e.tiposVacina.length === 1)}
                                  />
                                </div>
                                {e.tiposVacina.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeTipoVacina(e.uid, t.uid)}
                                    className="mt-2.5 p-2 rounded-md text-red-500 hover:bg-red-50 transition"
                                    aria-label={`Remover tipo de vacina ${tIdx + 1}`}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                           <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => addTipoVacina(e.uid)}
                              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2.5 rounded-md border transition hover:bg-green-50"
                              style={{ borderColor: GREEN, color: GREEN }}
                            >
                              <PlusCircle size={15} />
                              Adicionar Tipo
                            </button>
                          </div>
                        </div>
                      )}
    {/* Faixa Etária de Vacinação Obrigatória */}
    <div className="flex flex-col gap-3">

      {e.especie && (
    sexoDefinido ? (
        /* Espécie COM sexo definido → separado por Macho e Fêmea */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CheckboxGroup
            key={`macho-${e.uid}`}
            title="Faixa Etária de Vacinação Obrigatória — Machos" // 💡 Corrigido de 'label' para 'title'
            defaultValue={e.faixasMacho || []} // 💡 Corrigido de 'value' para 'defaultValue'
            onChange={(v: string[]) => patchEspecie(e.uid, { faixasMacho: v })}
            // 💡 Corrigido abaixo: trocado 'value:' por 'id:'
            options={faixasDisponiveis.map((f) => ({ id: String(f), label: String(f) }))}
          />
          <CheckboxGroup
            key={`femea-${e.uid}`}
            title="Faixa Etária de Vacinação Obrigatória — Fêmeas" // 💡 Corrigido de 'label' para 'title'
            defaultValue={e.faixasFemea || []} // 💡 Corrigido de 'value' para 'defaultValue'
            onChange={(v: string[]) => patchEspecie(e.uid, { faixasFemea: v })}
            // 💡 Corrigido abaixo: trocado 'value:' por 'id:'
            options={faixasDisponiveis.map((f) => ({ id: String(f), label: String(f) }))}
          />
        </div>
      ) : (
        /* Espécie SEM sexo definido → campo único */
        <CheckboxGroup
          key={`unico-${e.uid}`}
          title="Faixa Etária de Vacinação Obrigatória" // 💡 Corrigido de 'label' para 'title'
          defaultValue={e.faixasUnico || []} // 💡 Corrigido de 'value' para 'defaultValue'
          onChange={(v: string[]) => patchEspecie(e.uid, { faixasUnico: v })}
          // 💡 Corrigido abaixo: trocado 'value:' por 'id:'
          options={faixasDisponiveis.map((f) => ({ id: String(f), label: String(f) }))}
        />
      ))}
    </div>

                    </div>
                  )}
                  
                </div>
              );
            }}
          </DynamicListWrapper>
        </Section>
      </main>

     
    

      {/* ============ MODAL DE SELEÇÃO DE ESPÉCIE ============ */}
      <SearchModal<EspecieEntidade>
        open={modalEspecieUid !== null}
        onClose={() => setModalEspecieUid(null)}
        title="Buscar Espécie"
        subtitle="Busque por uma espécie cadastrada:"
        icon={<Dna size={28} color={GREEN} />}
        data={ESPECIES_MOCK}
        columns={[
          { label: "Espécie", key: "nome" },
          { label: "Grupo", key: "grupo" },
        ]}
        searchKeys={["nome", "grupo"]}
        searchPlaceholder="Buscar por nome ou grupo..."
        confirmLabel="Selecionar"
        onConfirm={(ent) => { if (especieAtiva) onSelectEspecie(especieAtiva.uid, ent); }}
      />

      {/* ============ CARD DE SUCESSO ============ */}
      {sucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
            <div className="flex justify-center mb-4"><CheckCircle2 size={48} style={{ color: GREEN }} /></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Doença adicionada com sucesso!</h3>
            <p className="text-sm text-gray-500 mb-6">
              A doença <span className="font-medium text-gray-700">{nome}</span> foi cadastrada no sistema.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => onNavigate("doenca")}
                className="px-5 py-2.5 rounded-md text-sm font-semibold border border-gray-300 text-gray-700 transition hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={() => onNavigate("visualizar-doenca", {
                  nome,
                  possuiVacina: especies.some((e) => e.possuiVacina === "Sim") ? "Sim" : "Não",
                  possuiVacinacaoOficial: especies.some((e) => e.possuiVacinacaoOficial === "Sim") ? "Sim" : "Não",
                  situacao: "Ativo",
                  especies,
                })}
                className="px-5 py-2.5 rounded-md text-white text-sm font-semibold transition hover:opacity-90"
                style={{ backgroundColor: GREEN }}
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