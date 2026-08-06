import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Beef,
  Check,
  ChevronDown,
  ChevronUp,
  Dna,
  Download,
  Fish,
  Info,
  Milk,
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  CheckboxGroup,
  FloatInput,
  FloatSelect,
  LargeTextArea,
  SimNao,
  UploadField,
} from "../../../components/ui/FormKit";
import {
  BlocoContatoFields,
  BlocoEnderecoFields,
  DynamicListWrapper,
  EntitySearchInput,
  ProprietarioInput,
} from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";
const TIPOS_INSPECAO = ["SIM", "SIE/Outros Estados", "SIF"];
const AREAS_ATUACAO = ["Carne", "Leite", "Mel", "Ovos", "Pescado"];
const CLASSIFICACOES_CARNE = [
  "Abatedouro Frigorífico",
  "Unidade de beneficiamento de carne e produtos cárneos",
];
const CLASSIFICACOES_LEITE = [
  "Entreposto de laticínios",
  "Granja leiteira",
  "Posto de refrigeração",
  "Queijaria",
  "Unidade de beneficiamento de leite e derivados",
];
const CLASSIFICACOES_PESCADO = [
  "Abatedouro frigorífico",
  "Unidade de beneficiamento de pescado e produtos de pescado",
];

const ESPECIES_CARNE = [
  { id: 1, codigo: "ESP-001", nome: "Bovino", grupo: "Bovídeos" },
  { id: 2, codigo: "ESP-002", nome: "Suíno", grupo: "Suídeos" },
  { id: 3, codigo: "ESP-003", nome: "Frango", grupo: "Aves" },
  { id: 4, codigo: "ESP-004", nome: "Equino", grupo: "Equídeos" },
  { id: 5, codigo: "ESP-005", nome: "Coelho", grupo: "Outras Espécies" },
];
const ESPECIES_PESCADO = [
  { id: 10, codigo: "ESP-010", nome: "Rã-touro", grupo: "Anfíbios" },
  { id: 11, codigo: "ESP-011", nome: "Jacaré-do-pantanal", grupo: "Répteis" },
];

const UF_IBGE: Record<string, string> = {
  Acre: "12", Alagoas: "27", Amapá: "16", Amazonas: "13", Bahia: "29", Ceará: "23",
  "Distrito Federal": "53", "Espírito Santo": "32", Goiás: "52", Maranhão: "21",
  "Mato Grosso": "51", "Mato Grosso do Sul": "50", "Minas Gerais": "31", Pará: "15",
  Paraíba: "25", Paraná: "41", Pernambuco: "26", Piauí: "22", "Rio de Janeiro": "33",
  "Rio Grande do Norte": "24", "Rio Grande do Sul": "43", Rondônia: "11", Roraima: "14",
  "Santa Catarina": "42", "São Paulo": "35", Sergipe: "28", Tocantins: "17",
};

const uid = (prefixo: string) => `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const toOptions = (valores: string[]) => valores.map((valor) => ({ value: valor, label: valor }));
let sequencialCadastro = 2;

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [aberta, setAberta] = useState(true);
  return (
    <section className="bg-white rounded-xl shadow-sm overflow-visible">
      <button type="button" onClick={() => setAberta((valor) => !valor)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {aberta ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {aberta && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </section>
  );
}

function BlocoArea({ titulo, icon, children }: { titulo: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-5 bg-gray-50 border-l-4 border-[#1A7A3C] p-6 rounded-r-xl rounded-l-sm shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-[#1A7A3C] flex items-center justify-center text-white flex-shrink-0">{icon}</div>
        <span className="text-sm font-bold text-gray-800">{titulo}</span>
      </div>
      {children}
    </div>
  );
}

export const EXEMPLO_AGROINDUSTRIAL_OUTRAS_INSPECOES = {
  id: 1,
  codigo: "3100000001",
  situacao: "Ativo",
  nomeComercial: "Agroindústria Serra Verde",
  possuiIsencaoIE: false,
  inscricaoEstadual: "1453705800094",
  proprietarios: [{ uid: "prop-exemplo", proprietario: { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40" } }],
  tipoInspecao: "SIM",
  codigoInspecao: "17126",
  areaAtuacao: ["Carne"],
  classifCarne: ["Abatedouro Frigorífico"],
  especiesCarne: [{ uid: "esp-carne-exemplo", especie: ESPECIES_CARNE[0] }],
  especiesPescado: [{ uid: "esp-pescado-exemplo", especie: ESPECIES_PESCADO[0] }],
  endereco: {
    zona: "Urbana", cep: "01310-100", estado: "São Paulo", municipio: "São Paulo", bairro: "Bela Vista",
    endereco: "Avenida Paulista", numero: "1000", complemento: "Galpão 4", localidade: "", distrito: "",
    latitude: "-23.5613", longitude: "-46.6565",
  },
  contato: {
    utilizarContatoProprietario: "Não", proprietariosSelecionados: [], emailFixo: "contato@serraverde.com.br",
    emailFixoObs: "Comercial", telefoneFixo: "(11) 3333-4455", telefoneFixoObs: "Recepção", contatosAdicionais: [],
  },
  anexos: [{ id: "anexo-exemplo", nome: "registro_inspecao.pdf", descricao: "Registro do serviço de inspeção" }],
  observacao: "Estabelecimento registrado em serviço de inspeção municipal.",
};

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
  modo?: "adicionar" | "visualizar" | "editar";
}

export function AdicionarEstabelecimentoAgroindustrialOutrasInspecoesPage({
  onLogout,
  onNavigate,
  dados,
  modo = "adicionar",
}: PageProps) {
  const isView = modo === "visualizar";
  const isEdit = modo === "editar";
  const inicial: any = modo === "adicionar" ? {} : { ...EXEMPLO_AGROINDUSTRIAL_OUTRAS_INSPECOES, ...(dados || {}) };

  const areasIniciais = Array.isArray(inicial.areaAtuacao)
    ? inicial.areaAtuacao
    : String(inicial.areaAtuacao || "").split(",").map((item) => item.trim()).filter(Boolean);
  const [codigo, setCodigo] = useState(inicial.codigo || inicial.codigoUnico || "");
  const [situacao, setSituacao] = useState(inicial.situacao || "Ativo");
  const [nomeComercial, setNomeComercial] = useState(inicial.nomeComercial || inicial.nome || "");
  const [possuiIsencaoIE, setPossuiIsencaoIE] = useState<boolean | "">(inicial.possuiIsencaoIE ?? false);
  const [inscricaoEstadual, setInscricaoEstadual] = useState(inicial.inscricaoEstadual || "");
  const [proprietarios, setProprietarios] = useState<any[]>(inicial.proprietarios || [{ uid: uid("prop"), proprietario: null }]);
  const [tipoInspecao, setTipoInspecao] = useState(inicial.tipoInspecao || "");
  const [codigoInspecao, setCodigoInspecao] = useState(inicial.codigoInspecao || "");
  const [areaAtuacao, setAreaAtuacao] = useState<string[]>(areasIniciais);
  const [classifCarne, setClassifCarne] = useState<string[]>(inicial.classifCarne || (inicial.classificacao && areasIniciais.includes("Carne") ? [inicial.classificacao] : []));
  const [classifLeite, setClassifLeite] = useState<string[]>(inicial.classifLeite || (inicial.classificacao && areasIniciais.includes("Leite") ? [inicial.classificacao] : []));
  const [classifPescado, setClassifPescado] = useState<string[]>(inicial.classifPescado || (inicial.classificacao && areasIniciais.includes("Pescado") ? [inicial.classificacao] : []));
  const [especiesCarne, setEspeciesCarne] = useState<any[]>(inicial.especiesCarne || [{ uid: uid("esp-carne"), especie: null }]);
  const [especiesPescado, setEspeciesPescado] = useState<any[]>(inicial.especiesPescado || [{ uid: uid("esp-pescado"), especie: null }]);
  const [endereco, setEndereco] = useState<any>(inicial.endereco || {
    zona: "", cep: "", estado: "", municipio: "", bairro: "", endereco: "", numero: "", complemento: "",
    localidade: "", distrito: "", latitude: "", longitude: "",
  });
  const [contato, setContato] = useState<any>(inicial.contato || {
    utilizarContatoProprietario: "Não", proprietariosSelecionados: [], emailFixo: "", emailFixoObs: "",
    telefoneFixo: "", telefoneFixoObs: "", contatosAdicionais: [],
  });
  const [anexos, setAnexos] = useState<any[]>(inicial.anexos || []);
  const [observacao, setObservacao] = useState(inicial.observacao || "");
  const [sucesso, setSucesso] = useState(false);
  const [confirmarEdicao, setConfirmarEdicao] = useState(false);

  const somenteCarne = areaAtuacao.length === 1 && areaAtuacao[0] === "Carne";
  const somenteLeite = areaAtuacao.length === 1 && areaAtuacao[0] === "Leite";
  const somentePescado = areaAtuacao.length === 1 && areaAtuacao[0] === "Pescado";
  const temAbateCarne = classifCarne.includes("Abatedouro Frigorífico");
  const temAbatePescado = classifPescado.some((item) => item.toLowerCase() === "abatedouro frigorífico");

  const montarRegistro = (codigoGerado = codigo) => ({
    id: dados?.id || codigoGerado || Date.now(), codigo: codigoGerado, codigoUnico: codigoGerado, situacao,
    nome: nomeComercial, nomeComercial, possuiIsencaoIE, inscricaoEstadual, proprietarios, tipoInspecao,
    codigoInspecao, areaAtuacao, areaAtuacaoTexto: areaAtuacao.join(", "),
    classificacao: [...classifCarne, ...classifLeite, ...classifPescado].join(", "),
    classifCarne, classifLeite, classifPescado, especiesCarne, especiesPescado, endereco,
    municipioUf: endereco.municipio ? `${endereco.municipio} - ${siglaEstado(endereco.estado)}` : "",
    contato, anexos, observacao,
  });

  const concluir = () => {
    const codigoGerado = codigo || `${UF_IBGE[endereco.estado] || "31"}${String(sequencialCadastro++).padStart(8, "0")}`;
    if (!codigo) setCodigo(codigoGerado);
    if (isEdit) {
      setConfirmarEdicao(true);
      return;
    }
    setSucesso(true);
  };

  const titulo = isView
    ? "Visualizar Estabelecimento Agroindustrial POA — Outras Inspeções"
    : isEdit
      ? "Editar Estabelecimento Agroindustrial POA — Outras Inspeções"
      : "Adicionar Estabelecimento Agroindustrial POA — Outras Inspeções";

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="agroindustrial-outras-inspecoes" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <header>
          <button type="button" onClick={() => onNavigate("agroindustrial-outras-inspecoes")} className="flex items-center gap-1 text-sm mb-3 text-[#1A7A3C] hover:opacity-70 transition">
            <ArrowLeft size={15} /> Todos os Estabelecimentos Agroindustriais POA — Outras Inspeções
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">{titulo}</h1>
            {isView ? (
              <button type="button" onClick={() => onNavigate("editar-agroindustrial-outras-inspecoes", montarRegistro())} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold rounded-md transition flex items-center gap-2">
                <Pencil size={16} /> Editar
              </button>
            ) : (
              <button type="button" onClick={concluir} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold rounded-md transition">
                {isEdit ? "Salvar" : "Adicionar"}
              </button>
            )}
          </div>
        </header>

        {!isView && (
          <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-2">
            <Info size={20} className="text-gray-500 flex-shrink-0" />
            <p className="text-sm text-gray-600 font-medium">Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.</p>
          </div>
        )}

        <fieldset disabled={isView} className={`border-0 p-0 m-0 min-w-0 flex flex-col gap-4 ${isView ? "poa-readonly" : ""}`}>
          <Section title="Informações Básicas">
            <div className="flex flex-col gap-4">
              {(isView || isEdit) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatInput label="Código do Estabelecimento Agroindustrial" value={codigo} disabled />
                </div>
              )}
              <FloatInput label="Nome Comercial do Estabelecimento Agroindustrial" required value={nomeComercial} onChange={setNomeComercial} maxLength={255} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <SimNao label="Possui Isenção de Inscrição Estadual?" name="outras-isencao-ie" required value={possuiIsencaoIE} onChange={(valor) => { setPossuiIsencaoIE(valor); if (valor) setInscricaoEstadual(""); }} />
                {possuiIsencaoIE === false && <FloatInput label="Número de Inscrição Estadual" required value={inscricaoEstadual} onChange={(valor) => setInscricaoEstadual(valor.replace(/\D/g, "").slice(0, 13))} maxLength={13} />}
              </div>
            </div>
          </Section>

          <Section title="Proprietários">
            <DynamicListWrapper
              items={proprietarios} behavior="at-least-one" itemLabel="Proprietário" variant="plain" addButtonLabel="Adicionar Proprietário"
              onAddItem={() => setProprietarios((itens) => [...itens, { uid: uid("prop"), proprietario: null }])}
              onRemoveItem={(index) => setProprietarios((itens) => itens.filter((_, posicao) => posicao !== index))}
            >
              {(item) => (
                <ProprietarioInput
                  required value={item.proprietario?.nome || ""}
                  onChange={(proprietario) => setProprietarios((itens) => itens.map((atual) => atual.uid === item.uid ? { ...atual, proprietario } : atual))}
                  onEyeClick={() => item.proprietario && alert(`Visualizar: ${item.proprietario.nome}`)}
                />
              )}
            </DynamicListWrapper>
          </Section>

          <Section title="Inspeção">
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Serviço de Inspeção</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatSelect label="Tipo de Inspeção" required value={tipoInspecao} onChange={setTipoInspecao} options={toOptions(TIPOS_INSPECAO)} />
                  <FloatInput label="Código da Inspeção" required value={codigoInspecao} onChange={(valor) => setCodigoInspecao(valor.slice(0, 30))} maxLength={30} />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5 flex flex-col gap-6">
                <CheckboxGroup title="Área de Atuação" required orientation="horizontal" options={AREAS_ATUACAO.map((area) => ({ id: area, label: area }))} defaultValue={areaAtuacao} onChange={setAreaAtuacao} />

                {somenteCarne && (
                  <BlocoArea titulo="Carne" icon={<Beef size={18} />}>
                    <div className="flex flex-col gap-6">
                      <CheckboxGroup title="Classificação" required orientation="horizontal" options={CLASSIFICACOES_CARNE.map((item) => ({ id: item, label: item }))} defaultValue={classifCarne} onChange={setClassifCarne} />
                      {temAbateCarne && <ListaEspecies titulo="Espécies Abatidas no Frigorífico" dados={ESPECIES_CARNE} itens={especiesCarne} setItens={setEspeciesCarne} prefixo="esp-carne" />}
                    </div>
                  </BlocoArea>
                )}

                {somenteLeite && (
                  <BlocoArea titulo="Leite" icon={<Milk size={18} />}>
                    <CheckboxGroup title="Classificação" required orientation="horizontal" options={CLASSIFICACOES_LEITE.map((item) => ({ id: item, label: item }))} defaultValue={classifLeite} onChange={setClassifLeite} />
                  </BlocoArea>
                )}

                {somentePescado && (
                  <BlocoArea titulo="Pescado" icon={<Fish size={18} />}>
                    <div className="flex flex-col gap-6">
                      <CheckboxGroup title="Classificação" required orientation="horizontal" options={CLASSIFICACOES_PESCADO.map((item) => ({ id: item, label: item }))} defaultValue={classifPescado} onChange={setClassifPescado} />
                      {temAbatePescado && <ListaEspecies titulo="Espécies Abatidas no Frigorífico" dados={ESPECIES_PESCADO} itens={especiesPescado} setItens={setEspeciesPescado} prefixo="esp-pescado" />}
                    </div>
                  </BlocoArea>
                )}
              </div>
            </div>
          </Section>

          <Section title="Localização">
            <BlocoEnderecoFields title="Endereço do Estabelecimento" data={endereco} tipoEstado="normal" onChange={(chave, valor) => setEndereco((atual: any) => ({ ...atual, [chave]: valor }))} onSetMultipleFields={(campos) => setEndereco((atual: any) => ({ ...atual, ...campos }))} />
          </Section>

          <Section title="Contatos">
            <BlocoContatoFields data={contato} onChange={(campos) => setContato((atual: any) => ({ ...atual, ...campos }))} proprietariosDisponiveis={proprietarios.filter((item) => item.proprietario).map((item) => ({ id: item.uid, nome: item.proprietario.nome, cpf: item.proprietario.documento }))} />
          </Section>

          <Section title="Anexos">
            <div className="flex flex-col gap-5">
              {anexos.map((anexo, index) => (
                <div key={anexo.id} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-[#1A7A3C] text-white flex items-center justify-center text-xs font-semibold mt-2">{index + 1}</div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UploadField label="Documento" required fileName={anexo.nome} onSelectFile={() => setAnexos((itens) => itens.map((item, posicao) => posicao === index ? { ...item, nome: `documento_${index + 1}.pdf` } : item))} />
                    <FloatInput label="Descrição" value={anexo.descricao || ""} onChange={(valor) => setAnexos((itens) => itens.map((item, posicao) => posicao === index ? { ...item, descricao: valor } : item))} />
                  </div>
                  {anexo.nome && <button type="button" onClick={() => alert(`Download de: ${anexo.nome}`)} className="p-2 text-[#1A7A3C] mt-2"><Download size={19} /></button>}
                  <button type="button" onClick={() => setAnexos((itens) => itens.filter((item) => item.id !== anexo.id))} className="p-2 text-red-500 mt-2"><Trash2 size={19} /></button>
                </div>
              ))}
              <button type="button" onClick={() => setAnexos((itens) => [...itens, { id: uid("anexo"), nome: "", descricao: "" }])} className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition">
                <PlusCircle size={16} /> Adicionar Anexo
              </button>
            </div>
          </Section>

          <Section title="Observação">
            <LargeTextArea label="Observação" value={observacao} onChange={setObservacao} />
          </Section>
        </fieldset>
      </main>

      {sucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Estabelecimento cadastrado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">{nomeComercial ? `O estabelecimento "${nomeComercial}" foi cadastrado.` : "O estabelecimento foi cadastrado."}</p>
            <div className="flex gap-3 justify-center mt-6">
              <button type="button" onClick={() => { setSucesso(false); onNavigate("agroindustrial-outras-inspecoes"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold">Voltar</button>
              <button type="button" onClick={() => { setSucesso(false); onNavigate("visualizar-agroindustrial-outras-inspecoes", montarRegistro()); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold">Visualizar</button>
            </div>
          </div>
        </div>
      )}

      {confirmarEdicao && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Confirmar alterações</h3>
            <p className="text-sm text-gray-500 mt-1">Deseja salvar as alterações realizadas neste estabelecimento?</p>
            <div className="flex gap-3 justify-center mt-6">
              <button type="button" onClick={() => setConfirmarEdicao(false)} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold">Cancelar</button>
              <button type="button" onClick={() => { setConfirmarEdicao(false); onNavigate("visualizar-agroindustrial-outras-inspecoes", montarRegistro()); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ListaEspecies({ titulo, dados, itens, setItens, prefixo }: {
  titulo: string; dados: any[]; itens: any[]; setItens: (itens: any[]) => void; prefixo: string;
}) {
  return (
    <div className="border-t border-gray-200 pt-5">
      <h4 className="text-sm font-semibold text-gray-700 mb-4">{titulo}</h4>
      <DynamicListWrapper
        items={itens} behavior="at-least-one" itemLabel="Espécie" variant="plain" addButtonLabel="Adicionar Espécie"
        onAddItem={() => setItens([...itens, { uid: uid(prefixo), especie: null }])}
        onRemoveItem={(index) => setItens(itens.filter((_, posicao) => posicao !== index))}
      >
        {(item) => (
          <EntitySearchInput
            label="Espécie" placeholder="Buscar por nome, código ou grupo" required value={item.especie?.nome || ""}
            data={dados} searchKeys={["nome", "codigo", "grupo"]}
            columns={[{ label: "Código", key: "codigo" }, { label: "Espécie", key: "nome" }, { label: "Grupo", key: "grupo" }]}
            icon={<Dna size={18} />} title="Buscar Espécie" subtitle="Busque e selecione uma espécie cadastrada:"
            onChange={(especie) => setItens(itens.map((atual) => atual.uid === item.uid ? { ...atual, especie } : atual))}
          />
        )}
      </DynamicListWrapper>
    </div>
  );
}

function siglaEstado(estado: string) {
  const siglas: Record<string, string> = {
    Acre: "AC", Alagoas: "AL", Amapá: "AP", Amazonas: "AM", Bahia: "BA", Ceará: "CE", "Distrito Federal": "DF",
    "Espírito Santo": "ES", Goiás: "GO", Maranhão: "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS",
    "Minas Gerais": "MG", Pará: "PA", Paraíba: "PB", Paraná: "PR", Pernambuco: "PE", Piauí: "PI",
    "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN", "Rio Grande do Sul": "RS", Rondônia: "RO", Roraima: "RR",
    "Santa Catarina": "SC", "São Paulo": "SP", Sergipe: "SE", Tocantins: "TO",
  };
  return siglas[estado] || estado;
}
