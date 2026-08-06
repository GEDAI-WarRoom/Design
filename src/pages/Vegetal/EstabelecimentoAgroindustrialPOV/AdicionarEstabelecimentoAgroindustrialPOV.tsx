import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Info,
  Pencil,
  PlusCircle,
  ShoppingCart,
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
  EstabelecimentoAgropecuarioInput,
  PRODUTORES_MOCK,
  ResponsavelTecnicoInput,
} from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const ATIVIDADES = [
  "Produtor ou Fabricante",
  "Padronizador",
  "Envasilhador ou Engarrafador",
  "Atacadista",
  "Exportador",
  "Importador",
  "Comércio",
  "Outro",
];
const PRODUTOS_VEGETAIS = [
  { id: 1, nome: "Açaí", tipo: "Vegetal" },
  { id: 2, nome: "Café Torrado", tipo: "Vegetal" },
  { id: 3, nome: "Cachaça", tipo: "Vegetal" },
  { id: 4, nome: "Polpa de Frutas", tipo: "Vegetal" },
  { id: 5, nome: "Suco de Uva Integral", tipo: "Vegetal" },
];
const RESPONSAVEIS_VEGETAIS = [
  { id: 1, nome: "Joaquim da Silva", documento: "444.009.956-40" },
  { id: 2, nome: "Mariana Alves Costa", documento: "333.221.115-09" },
];
const ENDERECOS_ESTABELECIMENTO: Record<number, any> = {
  1: { zona: "Rural", cep: "", estado: "Minas Gerais", municipio: "Lavras", bairro: "", endereco: "Estrada da Fazenda do Rio, km 12", numero: "", complemento: "", localidade: "Serrinha", distrito: "", latitude: "-21.2451", longitude: "-45.0012" },
  2: { zona: "Rural", cep: "", estado: "Minas Gerais", municipio: "Uberlândia", bairro: "", endereco: "Rodovia Municipal 455, km 8", numero: "", complemento: "", localidade: "Floresta", distrito: "", latitude: "-18.9186", longitude: "-48.2772" },
};
const UF_DADOS: Record<string, { codigo: string; sigla: string }> = {
  Acre: { codigo: "12", sigla: "AC" }, Alagoas: { codigo: "27", sigla: "AL" }, Amapá: { codigo: "16", sigla: "AP" }, Amazonas: { codigo: "13", sigla: "AM" },
  Bahia: { codigo: "29", sigla: "BA" }, Ceará: { codigo: "23", sigla: "CE" }, "Distrito Federal": { codigo: "53", sigla: "DF" }, "Espírito Santo": { codigo: "32", sigla: "ES" },
  Goiás: { codigo: "52", sigla: "GO" }, Maranhão: { codigo: "21", sigla: "MA" }, "Mato Grosso": { codigo: "51", sigla: "MT" }, "Mato Grosso do Sul": { codigo: "50", sigla: "MS" },
  "Minas Gerais": { codigo: "31", sigla: "MG" }, Pará: { codigo: "15", sigla: "PA" }, Paraíba: { codigo: "25", sigla: "PB" }, Paraná: { codigo: "41", sigla: "PR" },
  Pernambuco: { codigo: "26", sigla: "PE" }, Piauí: { codigo: "22", sigla: "PI" }, "Rio de Janeiro": { codigo: "33", sigla: "RJ" }, "Rio Grande do Norte": { codigo: "24", sigla: "RN" },
  "Rio Grande do Sul": { codigo: "43", sigla: "RS" }, Rondônia: { codigo: "11", sigla: "RO" }, Roraima: { codigo: "14", sigla: "RR" }, "Santa Catarina": { codigo: "42", sigla: "SC" },
  "São Paulo": { codigo: "35", sigla: "SP" }, Sergipe: { codigo: "28", sigla: "SE" }, Tocantins: { codigo: "17", sigla: "TO" },
};

const uid = (prefixo: string) => `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
let sequencialPov = 2;

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

export const EXEMPLO_ESTABELECIMENTO_AGROINDUSTRIAL_POV = {
  id: 1,
  codigo: "3100000001",
  situacao: "Ativo",
  usuarioAlteracao: "Lucas Pedro Conte",
  dataHoraModificacao: "14/04/2026 07:29",
  nomeComercial: "Unidade Vegetal Campo Verde",
  possuiIsencaoIE: false,
  inscricaoEstadual: "1453705800094",
  proprietarios: [{ uid: "prop-pov-exemplo", tipoPessoa: "PF", proprietario: PRODUTORES_MOCK[0] }],
  numeroRegistroFederal: "MAPA-17126",
  validadeRegistro: "2027-12-05",
  atividades: ["Produtor ou Fabricante", "Atacadista"],
  produtos: [{ uid: "produto-pov-exemplo", produto: PRODUTOS_VEGETAIS[1] }],
  responsavelTecnico: RESPONSAVEIS_VEGETAIS[0],
  localizadoEmEstabelecimento: false,
  estabelecimentoAgropecuario: null,
  endereco: { zona: "Rural", cep: "", estado: "Minas Gerais", municipio: "Lavras", bairro: "", endereco: "Estrada do Campo Verde, km 10", numero: "", complemento: "", localidade: "Campo Verde", distrito: "", latitude: "-21.2450", longitude: "-45.0001" },
  contato: { utilizarContatoProprietario: "Sim", proprietariosSelecionados: ["prop-pov-exemplo"], emailFixo: "contato@campoverde.com.br", emailFixoObs: "Comercial", telefoneFixo: "(35) 99999-1111", telefoneFixoObs: "Recepção", contatosAdicionais: [] },
  anexos: [{ id: "anexo-pov-exemplo", nome: "registro_federal.pdf", descricao: "Registro federal do estabelecimento" }],
  observacao: "Estabelecimento produtor e atacadista de produtos vegetais.",
};

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
  modo?: "adicionar" | "visualizar" | "editar";
}

export function AdicionarEstabelecimentoAgroindustrialPOVPage({ onLogout, onNavigate, dados, modo = "adicionar" }: PageProps) {
  const isView = modo === "visualizar";
  const isEdit = modo === "editar";
  const inicial: any = modo === "adicionar" ? {} : { ...EXEMPLO_ESTABELECIMENTO_AGROINDUSTRIAL_POV, ...(dados || {}) };

  const [codigo, setCodigo] = useState(inicial.codigo || "");
  const situacao = inicial.situacao || "Ativo";
  const [nomeComercial, setNomeComercial] = useState(inicial.nomeComercial || inicial.nome || "");
  const [possuiIsencaoIE, setPossuiIsencaoIE] = useState<boolean | "">(inicial.possuiIsencaoIE ?? false);
  const [inscricaoEstadual, setInscricaoEstadual] = useState(inicial.inscricaoEstadual || "");
  const [proprietarios, setProprietarios] = useState<any[]>(inicial.proprietarios || [{ uid: uid("prop-pov"), tipoPessoa: "PF", proprietario: null }]);
  const [numeroRegistroFederal, setNumeroRegistroFederal] = useState(inicial.numeroRegistroFederal || "");
  const [validadeRegistro, setValidadeRegistro] = useState(inicial.validadeRegistro || "");
  const [atividades, setAtividades] = useState<string[]>(inicial.atividades || []);
  const [produtos, setProdutos] = useState<any[]>(inicial.produtos || [{ uid: uid("produto-pov"), produto: null }]);
  const [responsavelTecnico, setResponsavelTecnico] = useState<any>(inicial.responsavelTecnico || null);
  const [localizadoEmEstabelecimento, setLocalizadoEmEstabelecimento] = useState<boolean | "">(inicial.localizadoEmEstabelecimento ?? false);
  const [estabelecimentoAgropecuario, setEstabelecimentoAgropecuario] = useState<any>(inicial.estabelecimentoAgropecuario || null);
  const [endereco, setEndereco] = useState<any>(inicial.endereco || { zona: "Rural", cep: "", estado: "Minas Gerais", municipio: "", bairro: "", endereco: "", numero: "", complemento: "", localidade: "", distrito: "", latitude: "", longitude: "" });
  const [contato, setContato] = useState<any>(inicial.contato || { utilizarContatoProprietario: "Sim", proprietariosSelecionados: [], emailFixo: "", emailFixoObs: "", telefoneFixo: "", telefoneFixoObs: "", contatosAdicionais: [] });
  const [anexos, setAnexos] = useState<any[]>(inicial.anexos || []);
  const [observacao, setObservacao] = useState(inicial.observacao || "");
  const [sucesso, setSucesso] = useState(false);
  const [confirmarEdicao, setConfirmarEdicao] = useState(false);

  const montarRegistro = (codigoGerado = codigo) => ({
    id: dados?.id || codigoGerado || Date.now(), codigo: codigoGerado, situacao,
    usuarioAlteracao: inicial.usuarioAlteracao || "Usuário Demonstrativo",
    dataHoraModificacao: new Date().toLocaleString("pt-BR"), nome: nomeComercial, nomeComercial,
    possuiIsencaoIE, inscricaoEstadual, proprietarios, numeroRegistroFederal, validadeRegistro,
    atividades, produtos, responsavelTecnico, localizadoEmEstabelecimento,
    estabelecimentoAgropecuario, endereco,
    municipioUf: endereco.municipio ? `${endereco.municipio} - ${UF_DADOS[endereco.estado]?.sigla || ""}` : "",
    contato, anexos, observacao,
  });

  const concluir = () => {
    const prefixoUf = UF_DADOS[endereco.estado]?.codigo || "31";
    const codigoGerado = codigo || `${prefixoUf}${String(sequencialPov++).padStart(8, "0")}`;
    if (!codigo) setCodigo(codigoGerado);
    if (isEdit) {
      setConfirmarEdicao(true);
      return;
    }
    setSucesso(true);
  };

  const selecionarEstabelecimento = (estabelecimento: any) => {
    setEstabelecimentoAgropecuario(estabelecimento);
    setEndereco(ENDERECOS_ESTABELECIMENTO[estabelecimento.id] || endereco);
  };

  const titulo = isView ? "Visualizar Estabelecimento Agroindustrial POV" : isEdit ? "Editar Estabelecimento Agroindustrial POV" : "Adicionar Estabelecimento Agroindustrial POV";

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="agroindustrial-pov" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <header>
          <button type="button" onClick={() => onNavigate("agroindustrial-pov")} className="flex items-center gap-1 text-sm mb-3 text-[#1A7A3C] hover:opacity-70"><ArrowLeft size={15} /> Todos os Estabelecimentos Agroindustriais Vegetais</button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">{titulo}</h1>
            {isView ? (
              <button type="button" onClick={() => onNavigate("editar-agroindustrial-pov", montarRegistro())} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold rounded-md flex items-center gap-2"><Pencil size={16} /> Editar</button>
            ) : (
              <button type="button" onClick={concluir} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold rounded-md">{isEdit ? "Salvar" : "Adicionar"}</button>
            )}
          </div>
        </header>

        {!isView && <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-2"><Info size={20} className="text-gray-500" /><p className="text-sm text-gray-600 font-medium">Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.</p></div>}

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
                <SimNao label="Possui Isenção de Inscrição Estadual?" name="pov-isencao-ie" required value={possuiIsencaoIE} onChange={(valor) => { setPossuiIsencaoIE(valor); if (valor) setInscricaoEstadual(""); }} />
                {possuiIsencaoIE === false && <FloatInput label="Número de Inscrição Estadual" required value={inscricaoEstadual} onChange={(valor) => setInscricaoEstadual(valor.replace(/\D/g, "").slice(0, 13))} maxLength={13} />}
              </div>
            </div>
          </Section>

          <Section title="Proprietários">
            <DynamicListWrapper items={proprietarios} behavior="at-least-one" itemLabel="Proprietário" variant="plain" addButtonLabel="Adicionar Proprietário" onAddItem={() => setProprietarios((itens) => [...itens, { uid: uid("prop-pov"), tipoPessoa: "PF", proprietario: null }])} onRemoveItem={(index) => setProprietarios((itens) => itens.filter((_, posicao) => posicao !== index))}>
              {(item) => {
                const pessoas = PRODUTORES_MOCK.filter((pessoa) => pessoa.tipo === item.tipoPessoa);
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <FloatSelect label="Tipo de Pessoa" required value={item.tipoPessoa} onChange={(tipoPessoa) => setProprietarios((itens) => itens.map((atual) => atual.uid === item.uid ? { ...atual, tipoPessoa, proprietario: null } : atual))} options={[{ value: "PF", label: "Pessoa Física" }, { value: "PJ", label: "Pessoa Jurídica" }]} />
                    <EntitySearchInput label={item.tipoPessoa === "PJ" ? "Razão Social" : "Nome"} placeholder="Buscar por nome ou CPF/CNPJ" required value={item.proprietario?.nome || ""} data={pessoas} searchKeys={["nome", "documento"]} columns={[{ label: item.tipoPessoa === "PJ" ? "Razão Social" : "Nome", key: "nome" }, { label: item.tipoPessoa === "PJ" ? "CNPJ" : "CPF", key: "documento" }]} icon={<img src={Icons.iconeProdutorUrl} alt="Proprietário" className="w-5 h-5 object-contain" />} title="Buscar Proprietário" onChange={(proprietario) => setProprietarios((itens) => itens.map((atual) => atual.uid === item.uid ? { ...atual, proprietario } : atual))} />
                    <FloatInput label={item.tipoPessoa === "PJ" ? "CNPJ" : "CPF"} required value={item.proprietario?.documento || ""} disabled />
                  </div>
                );
              }}
            </DynamicListWrapper>
          </Section>

          <Section title="Inspeção">
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Serviço de Inspeção</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatInput label="Número de Registro Federal" required value={numeroRegistroFederal} onChange={(valor) => setNumeroRegistroFederal(valor.slice(0, 30))} maxLength={30} />
                  <FloatInput label="Data de Vencimento do Registro" required type="date" value={validadeRegistro} onChange={setValidadeRegistro} />
                </div>
              </div>
              <div className="border-t border-gray-100 pt-5"><CheckboxGroup title="Atividade Desenvolvida" required orientation="horizontal" options={ATIVIDADES.map((atividade) => ({ id: atividade, label: atividade }))} defaultValue={atividades} onChange={setAtividades} /></div>
              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Produtos</h3>
                <DynamicListWrapper items={produtos} behavior="at-least-one" itemLabel="Produto" variant="plain" addButtonLabel="Adicionar Produto" onAddItem={() => setProdutos((itens) => [...itens, { uid: uid("produto-pov"), produto: null }])} onRemoveItem={(index) => setProdutos((itens) => itens.filter((_, posicao) => posicao !== index))}>
                  {(item) => <EntitySearchInput label="Produto" placeholder="Buscar pelo nome do produto" required value={item.produto?.nome || ""} data={PRODUTOS_VEGETAIS} searchKeys={["nome"]} columns={[{ label: "Nome do Produto", key: "nome" }]} icon={<ShoppingCart size={18} />} title="Buscar Produto" subtitle="Busque e selecione um produto de origem vegetal:" onChange={(produto) => setProdutos((itens) => itens.map((atual) => atual.uid === item.uid ? { ...atual, produto } : atual))} />}
                </DynamicListWrapper>
              </div>
              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Responsável Técnico</h3>
                <ResponsavelTecnicoInput required value={responsavelTecnico?.nome || ""} data={RESPONSAVEIS_VEGETAIS} icon={<img src={Icons.iconeProfissionalVegetalUrl} alt="Profissional Vegetal" className="w-5 h-5 object-contain" />} onChange={setResponsavelTecnico} onEyeClick={() => responsavelTecnico && alert(`Visualizar: ${responsavelTecnico.nome}`)} />
              </div>
            </div>
          </Section>

          <Section title="Estabelecimento Agropecuário">
            <div className="flex flex-col gap-5">
              <SimNao label="Estabelecimento Agroindustrial Localizado em um Estabelecimento Agropecuário Cadastrado no IMA?" name="pov-localizado-estabelecimento" required value={localizadoEmEstabelecimento} onChange={(valor) => { setLocalizadoEmEstabelecimento(valor); if (!valor) setEstabelecimentoAgropecuario(null); }} />
              {localizadoEmEstabelecimento === true && (
                <EstabelecimentoAgropecuarioInput required value={estabelecimentoAgropecuario?.nome || ""} onChange={selecionarEstabelecimento} onEyeClick={() => estabelecimentoAgropecuario && alert(`Visualizar: ${estabelecimentoAgropecuario.nome}`)} />
              )}
            </div>
          </Section>

          <Section title="Informações de Localização">
            <BlocoEnderecoFields title="Endereço" data={endereco} tipoEstado={localizadoEmEstabelecimento === true ? "travado" : "normal"} onChange={(chave, valor) => setEndereco((atual: any) => ({ ...atual, [chave]: valor }))} onSetMultipleFields={(campos) => setEndereco((atual: any) => ({ ...atual, ...campos }))} />
          </Section>

          <Section title="Informações de Contato">
            <BlocoContatoFields data={contato} onChange={(campos) => setContato((atual: any) => ({ ...atual, ...campos }))} proprietariosDisponiveis={proprietarios.filter((item) => item.proprietario).map((item) => ({ id: item.uid, nome: item.proprietario.nome, cpf: item.proprietario.documento }))} />
          </Section>

          <Section title="Anexos">
            <div className="flex flex-col gap-5">
              {anexos.map((anexo, index) => (
                <div key={anexo.id} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-[#1A7A3C] text-white flex items-center justify-center text-xs font-semibold mt-2">{index + 1}</div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4"><UploadField label="Documento" required fileName={anexo.nome} onSelectFile={() => setAnexos((itens) => itens.map((atual, posicao) => posicao === index ? { ...atual, nome: `documento_${index + 1}.pdf` } : atual))} /><FloatInput label="Descrição" value={anexo.descricao || ""} onChange={(valor) => setAnexos((itens) => itens.map((atual, posicao) => posicao === index ? { ...atual, descricao: valor.slice(0, 255) } : atual))} maxLength={255} /></div>
                  {anexo.nome && <button type="button" onClick={() => alert(`Download de: ${anexo.nome}`)} className="p-2 text-[#1A7A3C] mt-2"><Download size={19} /></button>}
                  <button type="button" onClick={() => setAnexos((itens) => itens.filter((atual) => atual.id !== anexo.id))} className="p-2 text-red-500 mt-2"><Trash2 size={19} /></button>
                </div>
              ))}
              <button type="button" onClick={() => setAnexos((itens) => [...itens, { id: uid("anexo-pov"), nome: "", descricao: "" }])} className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start"><PlusCircle size={16} /> Adicionar Anexo</button>
            </div>
          </Section>

          <Section title="Observações"><LargeTextArea label="Observação" value={observacao} onChange={setObservacao} maxLength={1500} /></Section>
        </fieldset>
      </main>

      {sucesso && <ModalConfirmacao titulo="Estabelecimento cadastrado com sucesso!" descricao={nomeComercial ? `O estabelecimento "${nomeComercial}" foi cadastrado.` : "O estabelecimento foi cadastrado."} cancelarLabel="Voltar" confirmarLabel="Visualizar" onCancelar={() => { setSucesso(false); onNavigate("agroindustrial-pov"); }} onConfirmar={() => { setSucesso(false); onNavigate("visualizar-agroindustrial-pov", montarRegistro()); }} />}
      {confirmarEdicao && <ModalConfirmacao titulo="Confirmar alterações" descricao="Deseja salvar as alterações realizadas neste estabelecimento?" cancelarLabel="Cancelar" confirmarLabel="Salvar" onCancelar={() => setConfirmarEdicao(false)} onConfirmar={() => { setConfirmarEdicao(false); onNavigate("visualizar-agroindustrial-pov", montarRegistro()); }} />}
    </div>
  );
}

function ModalConfirmacao({ titulo, descricao, cancelarLabel, confirmarLabel, onCancelar, onConfirmar }: { titulo: string; descricao: string; cancelarLabel: string; confirmarLabel: string; onCancelar: () => void; onConfirmar: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
        <h3 className="text-lg font-bold text-gray-900">{titulo}</h3><p className="text-sm text-gray-500 mt-1">{descricao}</p>
        <div className="flex gap-3 justify-center mt-6"><button type="button" onClick={onCancelar} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold">{cancelarLabel}</button><button type="button" onClick={onConfirmar} className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold">{confirmarLabel}</button></div>
      </div>
    </div>
  );
}
