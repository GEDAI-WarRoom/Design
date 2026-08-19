import type { ReactNode } from "react";
import { EntityProfessionalsView } from "../../../components/ui/EntityProfessionalsView";
import { FloatInput, FloatSelect, LargeTextArea, SimNao, UploadField } from "../../../components/ui/FormKit";
import { BlocoEnderecoFields } from "../../../components/ui/EntitySearch";

function CadastroSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="px-6 py-4">
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="border-t border-gray-100 p-6">{children}</div>
    </section>
  );
}
import {
  ESTABELECIMENTOS_INICIAIS,
  obterEstabelecimentoAgropecuario,
  obterHistoricoEstabelecimentoAgropecuario,
  type EstabelecimentoAgropecuario,
} from "./estabelecimentoAgropecuarioData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: EstabelecimentoAgropecuario;
}

export function VisualizarEstabelecimentoAgropecuarioPage({ onLogout, onNavigate, dados }: PageProps) {
  const registroExemplo = {
    id: 1,
    codigo: "51080590041",
    nome: "Fazenda Rio Verde",
    proprietarios: "José Aarão Neto - 555.009.956-40",
    zona: "Rural",
    municipioUf: "Lavras - MG",
    situacao: "Ativo",
    tipo: "Fazenda",
    cadastroProvisorio: "Não",
    estado: "Minas Gerais",
    municipio: "Lavras",
    cep: "",
    bairro: "",
    endereco: "Estrada Municipal do Rio Verde, km 4",
    numero: "",
    complemento: "Próximo ao Córrego Rio Verde",
    localidade: "Rio Verde",
    distrito: "Zona Rural",
    latitude: "-21.2453",
    longitude: "-44.9997",
    unidadeMedida: "Hectares",
    areaTotal: "185,50",
    areaProdutiva: "142,30",
    numeroCar: "MG-3138203-7A2F.91B4.C08E.45D1",
    confrontantes: "Ao norte, Córrego Rio Verde; ao sul, Fazenda Santa Clara.",
    viasAcesso: "Acesso pela BR-265, km 342, seguindo 4 km pela estrada municipal.",
    documento: "registro_estabelecimento.pdf",
    descricaoDocumento: "Registro e memorial descritivo do imóvel.",
    observacao: "Estabelecimento rural destinado à criação de bovinos e produção agrícola.",
  };
  const registroInformado = dados ?? ESTABELECIMENTOS_INICIAIS[0];
  const registroPersistido =
    obterEstabelecimentoAgropecuario(
      registroInformado.id ?? registroInformado.codigo,
    ) ?? registroInformado;
  const registro = { ...registroExemplo, ...registroPersistido };
  const partesProprietario = String(registro.proprietarios || "").split(" - ");
  const proprietarioNome = registro.proprietarioNome || partesProprietario[0] || "José Aarão Neto";
  const proprietarioDocumento = registro.proprietarioDocumento || partesProprietario.slice(1).join(" - ") || "555.009.956-40";
  const endereco = {
    zona: registro.zona || "Rural",
    estado: registro.estado || "Minas Gerais",
    cep: registro.cep || "",
    municipio: registro.municipio || "Lavras",
    bairro: registro.bairro || "",
    endereco: registro.endereco || "Estrada Municipal do Rio Verde, km 4",
    numero: registro.numero || "",
    complemento: registro.complemento || "Próximo ao Córrego Rio Verde",
    localidade: registro.localidade || "Rio Verde",
    distrito: registro.distrito || "Zona Rural",
    latitude: registro.latitude || "-21.2453",
    longitude: registro.longitude || "-44.9997",
  };
  const historico = obterHistoricoEstabelecimentoAgropecuario(registro);

  const cadastroContent = (
    <div className="flex flex-col gap-5">
      <CadastroSection title="Informações Básicas">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FloatInput label="Código do Estabelecimento" value={registro.codigo || ""} disabled />
          <FloatSelect
            label="Tipo de Estabelecimento"
            value={registro.tipo || "Fazenda"}
            onChange={() => {}}
            options={[{ value: registro.tipo || "Fazenda", label: registro.tipo || "Fazenda" }]}
            disabled
          />
          <div className="md:col-span-2">
            <FloatInput label="Nome do Estabelecimento Agropecuário" value={registro.nome || ""} disabled />
          </div>
          <SimNao
            label="Cadastro Provisório?"
            value={registro.cadastroProvisorio || "Não"}
            onChange={() => {}}
            disabled
          />
        </div>
      </CadastroSection>

      <CadastroSection title="Proprietários">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FloatInput label="Proprietário" value={proprietarioNome} disabled />
          <FloatInput label="CPF / CNPJ" value={proprietarioDocumento} disabled />
        </div>
      </CadastroSection>

      <CadastroSection title="Informações de Localização">
        <BlocoEnderecoFields
          title="Endereço"
          tipoEstado="normal"
          data={endereco}
          onChange={() => {}}
          onSetMultipleFields={() => {}}
          disabled
        />
      </CadastroSection>

      <CadastroSection title="Informações Complementares">
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-700">Áreas</h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <FloatSelect
                label="Unidade de Medida das Áreas"
                value={registro.unidadeMedida || "Hectares"}
                onChange={() => {}}
                options={[{ value: registro.unidadeMedida || "Hectares", label: registro.unidadeMedida || "Hectares" }]}
                disabled
              />
              <FloatInput label="Área Total" value={registro.areaTotal || "185,50"} disabled />
              <FloatInput label="Área Produtiva" value={registro.areaProdutiva || "142,30"} disabled />
            </div>
          </div>
          <div className="border-t border-gray-100 pt-5">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">Outras Informações</h3>
            <div className="flex flex-col gap-5">
              <div className="md:w-1/2">
                <FloatInput label="Número do CAR" value={registro.numeroCar || ""} disabled />
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <LargeTextArea label="Confrontantes" value={registro.confrontantes || ""} onChange={() => {}} disabled />
                <LargeTextArea label="Vias de Acesso" value={registro.viasAcesso || ""} onChange={() => {}} disabled />
              </div>
            </div>
          </div>
        </div>
      </CadastroSection>

      <CadastroSection title="Anexo">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <UploadField
            label="Documento"
            fileName={registro.documento || "registro_estabelecimento.pdf"}
            onSelectFile={() => {}}
            disabled
          />
          <FloatInput label="Descrição" value={registro.descricaoDocumento || ""} disabled />
        </div>
      </CadastroSection>

      <CadastroSection title="Observações">
        <LargeTextArea label="Observação" value={registro.observacao || ""} onChange={() => {}} disabled />
      </CadastroSection>
    </div>
  );

  return (
    <EntityProfessionalsView
      onLogout={onLogout}
      onNavigate={onNavigate}
      currentScreen="estabelecimento-agropecuario"
      backRoute="estabelecimento-agropecuario"
      backLabel="Todos os Estabelecimentos Agropecuários"
      title="Visualizar Estabelecimento Agropecuário"
      entityKey={`estabelecimento-agropecuario-${registro.id || registro.codigo}`}
      allowedTypes={["Responsável Técnico Animal", "Responsável Técnico Vegetal", "Habilitado para Emissão de GTA", "Habilitado para Emissão de PTV"]}
      cadastroContent={cadastroContent}
      onEditCadastro={() => onNavigate("editar-estabelecimento-agropecuario", registro)}
      historicoCadastros={historico}
      onEdit={() => onNavigate("editar-estabelecimento-agropecuario", registro)}
      fields={[
        { label: "Código do Estabelecimento", value: registro.codigo || "" },
        { label: "Nome do Estabelecimento", value: registro.nome || "" },
        { label: "Proprietários", value: registro.proprietarios || "" },
        { label: "Zona", value: registro.zona || "" },
        { label: "Município/UF", value: registro.municipioUf || "" },
        { label: "Situação", value: registro.situacao || "" },
      ]}
    />
  );
}
