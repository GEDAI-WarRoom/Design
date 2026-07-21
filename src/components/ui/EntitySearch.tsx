import React, { useState, useEffect } from "react";
import { Eye, PlusCircle, Trash2, Store, Info, ViewIcon, Map, MapPin, UserRound, X, ChevronUp, ChevronDown, UserRoundCheck } from "lucide-react";
import { FloatInput, SearchModal, FloatSelect, FloatCombobox, CheckboxGroup, LargeTextArea, CustomRadio, MultiSearchModal, FieldTooltip, SimNao } from "../../components/ui/FormKit"; // Centralizado em uma única importação

// Importação dos Ícones Padrão do Projeto

import * as Icons from "../../imports/icons";


const GREEN = "#1A7A3C";

// ==========================================================
// 1. MOCKS DE DADOS EXTRAÍDOS DO PROJETO
// ==========================================================
export const EXPLORACOES_MOCK = [
  {
    id: 1,
    codigo: "310010400050003",
    especie: "Codorna",
    grupo: "Aves",
    estabCodigo: "10234567891",
    estabNome: "Fazenda do Rio",
    produtores: [{ nome: "José Aarão Neto", documento: "555.009.956-40" }],
    estabelecimentoFormatado: "10234567891\n- Fazenda do Rio",
    grupoEspecieFormatado: "Aves\n - Codorna",
    produtoresFormatado: "555.009.956-40\n- José Aarão Neto",
  },
  {
    id: 2,
    codigo: "310010400060012",
    especie: "Suínos",
    grupo: "Suídeos",
    estabCodigo: "20345678902",
    estabNome: "Granja Vale Verde",
    produtores: [{ nome: "Maria Silva Mendes", documento: "444.111.222-33" }],
    estabelecimentoFormatado: "20345678902\n- Granja Vale Verde",
    grupoEspecieFormatado: "Suídeos\n - Suínos",
    produtoresFormatado: "444.111.222-33\n- Maria Silva Mendes",
  },
  {
    id: 3,
    codigo: "310010400070088",
    especie: "Abelha com Ferrão",
    grupo: "Abelhas",
    estabCodigo: "30456789013",
    estabNome: "Sítio Mel Dourado",
    produtores: [{ nome: "Carlos Henrique Souza", documento: "333.888.777-11" }],
    estabelecimentoFormatado: "30456789013\n- Sítio Mel Dourado",
    grupoEspecieFormatado: "Abelhas\n - Abelha com Ferrão",
    produtoresFormatado: "333.888.777-11\n- Carlos Henrique Souza",
  },
  {
    id: 4,
    codigo: "540010400070088",
    especie: "Bovinos",
    grupo: "Bovíveos",
    estabCodigo: "30456789013",
    estabNome: "Sítio Abençoado",
    produtores: [{ nome: "Carlos Henrique Souza", documento: "333.888.777-11" }],
    estabelecimentoFormatado: "30456789013\n- Sítio Abençoado",
    grupoEspecieFormatado: "Bovídeos\n - Bovino",
    produtoresFormatado: "333.888.777-11\n- Carlos Henrique Souza",
  }
];


export const ESTABELECIMENTOS_MOCK = [
  {
    id: 1,
    codigo: "10234567891",
    nome: "Fazenda do Rio",
    municipio: "Lavras",
    proprietario: "333.888.777-11\n- Carlos Henrique Souza",
    areaProdutivaHa: 1000, areaProdutivaM2: 10000000
  },
  {
    id: 2,
    codigo: "20345678902",
    nome: "Granja Vale Verde",
    municipio: "Uberlândia",
    proprietario: "444.111.222-33\n- Maria Silva Mendes",
    areaProdutivaHa: 500, areaProdutivaM2: 5000000
  }
];

export const PRODUTORES_MOCK = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "PF" },
  { id: 2, nome: "Maria Silva Mendes", documento: "444.111.222-33", tipo: "PF" },
  { id: 3, nome: "Agro Pecuária Vale Verde Ltda", documento: "12.345.678/0001-99", tipo: "PJ" }
];


export const REVENDEDORAS_MOCK = [
  { id: 1, codigo: "3120938028", nome: "Comercial AgroVat", uf: "MG" },
  { id: 2, codigo: "3120938045", nome: "Agropecuária Vale Verde", uf: "MG" },
  { id: 3, codigo: "3120938090", nome: "Casa do Produtor Lavras", uf: "MG" },
];

export const FORNECEDORES_VACINA_MOCK = [
  {
    id: 1,
    codigo: "3251987753",
    nome: "Laboratório BioMed Brasil Ltda",
    tipo: "Laboratório",
    uf: "SP"
  },
  {
    id: 2,
    codigo: "3190987753",
    nome: "Vacinas Imunotech S.A.",
    tipo: "Laboratório",
    uf: "RJ"
  },
  {
    id: 3,
    codigo: "4510938999",
    nome: "Agro Comercial Sul do País",
    tipo: "Revendedora",
    uf: "PR"
  },
  {
    id: 4,
    codigo: "8546938777",
    nome: "Distribuidora de Vacinas Pantanal",
    tipo: "Revendedora",
    uf: "MS"
  },
];

export const DOENCAS_MOCK = [
  { id: 1, codigo: "D01", nome: "Febre Aftosa" },
  { id: 2, codigo: "D02", nome: "Brucelose" },
  { id: 3, codigo: "D03", nome: "Tuberculose Bovina" },
  { id: 4, codigo: "D04", nome: "Raiva dos Herbívoros" },
  { id: 5, codigo: "D05", nome: "Anemia Infecciosa Equina (AIE)" },
];



// Componente utilitário interno do olho de visualização (Padrão do Projeto)
function EyeAction({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title="Visualizar"
      className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed self-end h-12 mt-1"
    >
      <Eye size={20} />
    </button>
  );
}

// ==========================================================
// 2. BARRAMENTO GENÉRICO DE ENTRADA (ENTITY SEARCH INPUT)
// ==========================================================
interface EntitySearchInputProps {
  label: string;
  placeholder: string;
  value: string;
  data: any[];
  searchKeys: string[];
  columns: { label: string; key: string }[];
  icon: React.ReactNode;
  onChange: (entidade: any) => void;
  required?: boolean;
  hasTooltip?: boolean;
  tooltipText?: string;


  // Proriedades para customização dinâmica do modal interno
  title?: string;
  subtitle?: string;
  confirmLabel?: string;
  className?: string;
  headerActions?: React.ReactNode;
  especiesPermitidas?: any[];
}

export function EntitySearchInput({
  label,
  placeholder,
  value,
  data,
  searchKeys,
  columns,
  icon,
  onChange,
  required,
  title,
  subtitle,
  confirmLabel = "Confirmar",
  className,
  headerActions,
  hasTooltip,
  tooltipText,
  especiesPermitidas,
}: EntitySearchInputProps) {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <div className="w-full cursor-pointer" onClick={() => setModalAberto(true)}>
        <div className="pointer-events-none">
          <FloatInput
            label={label}
            required={required}
            value={value}
            onChange={() => { }}
            hasTooltip={hasTooltip}
            tooltipText={tooltipText}
            icon={icon}
            placeholder={placeholder}
            className="w-full"
            readOnly
          />
        </div>
      </div>

      <SearchModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        title={title || `Buscar ${label}`}
        subtitle={subtitle || `Busque por ${label.toLowerCase()} cadastradas:`}
        icon={icon}
        data={data}
        columns={columns}
        searchKeys={searchKeys}
        searchPlaceholder={placeholder}
        confirmLabel={confirmLabel}
        className={className}
        headerActions={headerActions} // 🔥 Repassa o nó de ações/filtros para o SearchModal real da biblioteca
        onConfirm={(entidadeSelecionada) => {
          onChange(entidadeSelecionada);
          setModalAberto(false);
        }}
      />
    </>
  );
}

// ==========================================================
// 3. WRAPPER DE LISTAS DINÂMICAS COM COMPORTAMENTO INTELIGENTE
// ==========================================================

// ==================================================================================
// GUIA DE INICIALIZAÇÃO DE ESTADO (PARA NÃO ESQUECER):
//
// ➡️ CASO A: Começar TOTALMENTE VAZIO (Zero ou mais itens - "zero-or-more")
//    Use quando o preenchimento for opcional ou o usuário decidir quando criar a 1ª linha.
//    Exemplo na Página: const [exploracao, setExploracao] = useState<any[]>([]);
//
// ➡️ CASO B: Começar OBRIGATÓRIO (Pelo menos um item - "at-least-one")
//    Use quando a tela JÁ DEVE ABRIR com a primeira linha de inputs desenhada e pronta.
//     Exemplo na Página: 
//       const [exploracao, setExploracao] = useState<any[]>([
//         { id: String(Date.now()), codigo: "", especie: "" }
//       ]);
// ==================================================================================

interface DynamicListWrapperProps {
  items: any[];
  behavior?: "at-least-one" | "zero-or-more";
  addButtonLabel: string;
  itemLabel?: string;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  showCounter?: boolean;
  renderHeaderBadge?: (item: any) => React.ReactNode;
  variant?: "default" | "plain";
  smallCounter?: boolean; // 💡 Controla o tamanho reduzido do contador exclusivamente para o lote card
  disabled?: boolean;
  children: (item: any, index: number) => React.ReactNode;
}

export function DynamicListWrapper({
  items,
  behavior = "at-least-one",
  addButtonLabel,
  itemLabel = "Item",
  onAddItem,
  onRemoveItem,
  showCounter = true,
  renderHeaderBadge,
  variant = "default",
  smallCounter = false, // Por padrão, mantém o contador normal
  disabled = false,
  children,
}: DynamicListWrapperProps) {
  // Estado para controlar quais índices estão minimizados (usado no layout padrão "default")
  const [minimizados, setMinimizados] = useState<{ [key: number]: boolean }>({});

  const toggleMinimizar = (index: number) => {
    setMinimizados((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // =========================================================================
  // 1. CASO DE VARIANTE "PLAIN" (Ex: Apresentações dentro do Lote Card)
  // =========================================================================
  if (variant === "plain") {
    return (
      <div className="w-full flex flex-col gap-5">
        <div className="flex flex-col gap-3 w-full">
          {items.map((item, index) => (
            <div key={item.uid || item.id || index} className="flex items-center gap-3 w-full">

              {showCounter && (
                /* 💡 Se 'smallCounter' for true, aplica o círculo pequeno, opaco e alinhado */
                smallCounter ? (
                  <div className="w-5 h-5 rounded-full bg-[#32C47F] text-white flex items-center justify-center flex-shrink-0 font-sans select-none mt-4">
                    <span className="text-[10px] font-bold">{index + 1}</span>
                  </div>
                ) : (
                  /* Mantém o círculo verde grande padrão do plain caso contrário */
                  <div className="w-7 h-7 rounded-full bg-[#1A7A3C] flex items-center justify-center shadow-sm flex-shrink-0 mt-4">
                    <span className="text-white text-xs font-bold font-sans">{index + 1}</span>
                  </div>
                )
              )}

              {/* Renderiza os campos de input de formulário */}
              <div className="flex-1 min-w-0">
                {children(item, index)}
              </div>

              {/* Botão de excluir inline à direita dos campos */}
              {!disabled && !(behavior === "at-least-one" && items.length === 1) && (
                <button
                  type="button"
                  onClick={() => onRemoveItem(index)}
                  /* 🔴 Vermelho fixo em todas as possibilidades para a variante default */
                  className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition flex items-center justify-center cursor-pointer"
                  title={`Remover ${itemLabel}`}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Botão de Adicionar à esquerda menor */}
        {!disabled && <div className="w-full flex justify-start">
          <button
            type="button"
            onClick={onAddItem}
            className="mt-1 flex items-center gap-1.5 text-xs font-semibold px-3 py-3 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 transition cursor-pointer"
          >
            <PlusCircle size={18} />
            {addButtonLabel}
          </button>
        </div>}
      </div>
    );
  }

  // =========================================================================
  // 2. CASO DE VARIANTE PADRÃO "DEFAULT" (Ex: O Lote completo da Nota Fiscal)
  // =========================================================================
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-4 w-full  ">
        {items.map((item, index) => {
          const isMinimizado = !!minimizados[index];

          return (
            <div
              key={item.uid || item.id || index}
              className="border-l-4 border-l-[#1A7A3C] rounded-r-xl rounded-l-md bg-gray-50/40 border border-gray-100 flex flex-col w-full px-3 relative transition-all"
            >
              {/* Cabeçalho Único sem a borda cinza divisória */}
              <div className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Círculo indicador verde grande do card principal */}
                  <div className="w-7 h-7 rounded-full bg-[#1A7A3C] flex items-center justify-center shadow-sm flex-shrink-0">
                    <span className="text-white text-xs font-bold font-sans">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-600 tracking-wide">
                    {itemLabel}
                  </span>

                  {renderHeaderBadge && renderHeaderBadge(item)}
                </div>

                {/* Área de ações do cabeçalho (minimizar + lixeira) */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleMinimizar(index)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition flex items-center justify-center cursor-pointer"
                  >
                    {isMinimizado ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </button>

                  {!disabled && !(behavior === "at-least-one" && items.length === 1) && (
                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      /* 🔴 Vermelho fixo em todas as possibilidades para a variante plain */
                      className="p-1.5 rounded-lg transition mt-4 cursor-pointer flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Corpo do Conteúdo do Card Grande */}
              {!isMinimizado && (
                <div className="p-4 -pt-2 flex flex-col gap-5 w-full animate-fadeIn">
                  {children(item, index)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Botão de Adicionar padrão à esquerda */}
      {!disabled && <div className="w-full flex justify-start">
        <button
          type="button"
          onClick={onAddItem}
          className="mt-2 flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 transition cursor-pointer"
        >
          <PlusCircle size={16} />
          {addButtonLabel}
        </button>
      </div>}
    </div>
  );
}
// ==========================================================
// 4. COMPONENTES DE DOMÍNIO ESPECIALISTAS
// ==========================================================
interface DomainInputProps {
  value: any; // Aceita tanto string quanto array de objetos agora
  onChange: (entidade: any) => void;
  onEyeClick?: (entidade?: any) => void;
  required?: boolean;

  // Repassando as novas propriedades para o componente especialista
  isMulti?: boolean;
  behavior?: "at-least-one" | "zero-or-more";
  addButtonLabel?: string;
}


// MODAL EXPLORAÇÃO
export function ExploracaoPecuariaInput({ value, onChange, onEyeClick, required = false }: DomainInputProps) {
  // Encontra a entidade selecionada no mock para extrair os campos reboque (Espécie)
  const entidadeSelecionada = EXPLORACOES_MOCK.find((x) => x.codigo === value);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className={value ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full" : "w-full"}>

        {/* Input Genérico configurado com as regras exatas do seu Modal */}
        <EntitySearchInput
          label="Exploração Pecuária"
          placeholder="Buscar por código, estabelecimento, espécie ou produtor."
          required={required}
          value={value || ""}
          data={EXPLORACOES_MOCK}

          // 🔥 Configurações de exibição exatas passadas por você:
          title="Buscar Exploração Pecuária"
          subtitle="Busque por uma exploração pecuária cadastrada:"
          icon={<img src={Icons.iconeExploracaoUrl} alt="Exploração" className="w-5 h-5 object-contain" />}
          columns={[
            { label: "Código", key: "codigo" },
            { label: "Estabelecimento", key: "estabelecimentoFormatado" },
            { label: "Grupo - Espécie", key: "grupoEspecieFormatado" },
            { label: "Produtores", key: "produtoresFormatado" }, // Coluna de produtores adicionada
          ]}
          searchKeys={["codigo", "estabelecimentoFormatado", "grupoEspecieFormatado", "produtoresFormatado"]}
          searchPlaceholder="Buscar por código, estabelecimento, espécie ou produtor."
          confirmLabel="Confirmar"
          className="[&_td]:whitespace-pre-line" // Garante a quebra de linha correta do \n na tabela

          onChange={onChange}
        />

        {/* Campo Extra reboque: Espécie Explorada */}
        {value && entidadeSelecionada && (
          <div className="flex items-center gap-2 animate-fadeIn w-full">
            <div className="flex-1">
              <FloatInput
                label="Espécie Explorada"
                required={required}
                value={entidadeSelecionada.especie}
                onChange={() => { }}
                disabled
                className="w-full"
              />
            </div>
            <EyeAction onClick={onEyeClick} />
          </div>
        )}
      </div>
    </div>
  );
}


// MODAL ESTABELECIMENTO
export function EstabelecimentoAgropecuarioInput({ value, onChange, onEyeClick, required = false }: DomainInputProps) {
  // Encontra pelo nome ou código no mock original para preencher o campo cinza reboque ao lado
  const entidadeSelecionada = ESTABELECIMENTOS_MOCK.find((x) => x.nome === value || x.codigo === value);

  // 🔥 Transforma os dados injetando o "proprietarioFormatado" exatamente como o seu modal fazia na página!
  const dadosFormatadosParaModal = ESTABELECIMENTOS_MOCK.map(estab => ({
    ...estab,

  }));

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className={value ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full" : "w-full"}>

        {/* Barramento genérico parametrizado com as regras passadas por você */}
        <EntitySearchInput
          label="Estabelecimento Agropecuário"
          placeholder="Buscar pelo nome do estabelecimento."
          required={required}
          value={entidadeSelecionada?.nome || ""} // Passa o nome para exibição amigável no input
          data={dadosFormatadosParaModal}         // Passa os dados injetados com a string formatada

          // 🔥 Suas propriedades exatas de tela:
          title="Buscar Estabelecimento Agropecuário"
          subtitle="Busque por um estabelecimento agropecuário cadastrado:"
          icon={<img src={Icons.iconeEstabelecimentoUrl} alt="Estabelecimento" className="w-5 h-5 object-contain" />}
          columns={[
            { label: "Código", key: "codigo" },
            { label: "Estabelecimento", key: "nome" },
            { label: "Município", key: "municipio" },
            { label: "Proprietário", key: "proprietario" },
          ]}
          searchKeys={["codigo", "nome", "municipio", "proprietario"]}
          searchPlaceholder="Buscar por código, nome, município ou proprietário."
          confirmLabel="Confirmar"

          onChange={onChange}
        />

        {/* Campo Extra reboque: Código do Estabelecimento */}
        {value && entidadeSelecionada && (
          <div className="flex items-center gap-2 animate-fadeIn w-full">
            <div className="flex-1">
              <FloatInput
                label="Código do Estabelecimento Agropecuário"
                required={required}
                value={entidadeSelecionada.codigo}
                onChange={() => { }}
                disabled
                className="w-full"
              />
            </div>
            <EyeAction onClick={onEyeClick} />
          </div>
        )}
      </div>
    </div>
  );
}

// MODAL PRODUTOR
export function ProdutorInput({ value, onChange, onEyeClick, required = false }: DomainInputProps) {
  // Estado local para o filtro que antes ficava na página
  const [tipoPessoa, setTipoPessoa] = useState<string>("");

  // Encontra o produtor selecionado para exibir no campo reboque se necessário
  const entidadeSelecionada = PRODUTORES_MOCK.find((x) => x.nome === value || x.documento === value);

  const databaseFiltrada = tipoPessoa
    ? PRODUTORES_MOCK.filter(p => p.tipo === tipoPessoa)
    : PRODUTORES_MOCK;

  // 💡 Correção aqui: Define dinamicamente o Nome e o Documento com base no tipo escolhido
  const colunasModal = [
    {
      label: tipoPessoa === "PF" ? "Nome" : tipoPessoa === "PJ" ? "Razão Social" : "Nome / Razão Social",
      key: "nome"
    },
    {
      label: tipoPessoa === "PJ" ? "CNPJ" : tipoPessoa === "PF" ? "CPF" : "CPF / CNPJ",
      key: "documento"
    }
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className={value ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full" : "w-full"}>

        <EntitySearchInput
          label="Produtor"
          placeholder="Buscar pelo produtor."
          required={required}
          value={entidadeSelecionada?.nome || ""} // Exibe o nome amigável no input
          data={databaseFiltrada}                 // Passa os dados filtrados dinamicamente

          // 🔥 Suas propriedades exatas de tela:
          title="Buscar Produtor"
          subtitle="Busque por um produtor cadastrado no sistema:"
          icon={<img src={Icons.iconeProdutorUrl} alt="Produtor" className="w-5 h-5 object-contain" />}
          columns={colunasModal}
          searchKeys={["nome", "documento"]}
          searchPlaceholder="Buscar Proprietário"
          confirmLabel="Confirmar"

          // Intercepta e reseta o filtro do tipo de pessoa ao fechar/confirmar se o EntitySearchInput permitir customização
          onChange={(p) => {
            onChange(p);
            setTipoPessoa(""); // Reseta o select
          }}

          // 🔥 Injeta o FloatSelect customizado direto nas ações do cabeçalho do modal base
          headerActions={
            <div className="w-48 !mr-4 pr-1 relative z-10 flex-shrink-0">
              <FloatSelect
                label="Tipo de Pessoa"
                required
                value={tipoPessoa}
                onChange={(v) => setTipoPessoa(v)}
                options={[
                  { value: "PF", label: "Pessoa Física" },
                  { value: "PJ", label: "Pessoa Jurídica" },
                ]}
              />
            </div>
          }
        />

        {/* Campo Extra reboque: CPF/CNPJ do Produtor */}
        {value && entidadeSelecionada && (
          <div className="flex items-center gap-2 animate-fadeIn w-full">
            <div className="flex-1">
              <FloatInput
                label={entidadeSelecionada.tipo === "PJ" ? "CNPJ" : "CPF"}
                required={required}
                value={entidadeSelecionada.documento}
                onChange={() => { }}
                disabled
                className="w-full"
              />
            </div>
            <EyeAction onClick={onEyeClick} />
          </div>
        )}
      </div>
    </div>
  );
}




// ==========================================================
// MODAL REVENDEDORA (ATUALIZADO COM PROP DATA)
// ==========================================================
interface RevendedoraInputProps {
  value: string;
  onChange: (entidade: any) => void;
  onEyeClick?: (entidade: any) => void;
  required?: boolean;
  data?: any[]; // <-- Adicionado
}

export function RevendedoraInput({ value, onChange, onEyeClick, required = false, data = REVENDEDORAS_MOCK }: RevendedoraInputProps) {
  // Busca a entidade baseando-se no array fornecido por propriedade ou pelo mock padrão interno
  const entidadeSelecionada = data.find((x) => x.codigo === value);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className={value ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full" : "w-full"}>
        <EntitySearchInput
          label="Revendedora de Produtos Agropecuários"
          placeholder="Buscar por código ou nome."
          required={required}
          value={entidadeSelecionada?.nome || ""}
          data={data} // <-- Passando a lista correta
          searchKeys={["codigo", "nome"]}
          title="Buscar Revendedora"
          subtitle="Busque por uma revendedora de produtos agropecuários cadastrada:"
          icon={<Store size={20} color={GREEN} />}
          columns={[
            { label: "Código", key: "codigo" },
            { label: "Nome", key: "nome" },
          ]}
          confirmLabel="Confirmar"
          onChange={onChange}
        />

        {value && entidadeSelecionada && (
          <div className="flex items-center gap-2 animate-fadeIn w-full">
            <div className="flex-1">
              <FloatInput
                label="Código"
                required={required}
                value={entidadeSelecionada.codigo}
                onChange={() => { }}
                disabled
                className="w-full"
              />
            </div>
            <EyeAction onClick={onEyeClick} />
          </div>
        )}
      </div>
    </div>
  );
}


// MODAL FORNECEDOR DE VACINA
interface FornecedorVacinaInputProps {
  value: string;
  onChange: (entidade: any) => void;
  onEyeClick?: (entidade: any) => void;
  required?: boolean;
  tooltipText?: string;
  data?: any[]; // <-- Recebe os dados de fora de forma limpa
}

export function FornecedorVacinaInput({
  value,
  onChange,
  onEyeClick,
  required = false,
  tooltipText,
  data = FORNECEDORES_VACINA_MOCK // <-- Fallback usando o mock local se nenhum dado for passado
}: FornecedorVacinaInputProps) {

  const entidadeSelecionada = data.find((x: any) => x.codigo === value);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className={value ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full" : "w-full"}>

        {/* 1. Campo de Busca Principal com Tooltip nativo */}
        <div className="w-full">
          <EntitySearchInput
            label="Fornecedor"
            placeholder="Buscar por nome..."
            required={required}
            value={entidadeSelecionada?.nome || ""}
            data={data}
            searchKeys={["codigo", "nome", "tipo"]}
            title="Buscar Fornecedor de Vacina"
            subtitle="Busque por laboratórios ou revendedoras cadastrados:"
            icon={<img src={Icons.iconeFornecedorUrl} alt="Fornecedor" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}
            columns={[
              { label: "Tipo", key: "tipo" },
              { label: "Nome", key: "nome" },
              { label: "Código", key: "codigo" },
              { label: "UF", key: "uf" },
            ]}
            confirmLabel="Confirmar"
            onChange={onChange}

            // 🔥 Vinculado ao comportamento padrão do seu FormKit!
            hasTooltip={!!tooltipText}
            tooltipText={tooltipText}
          />
        </div>

        {/* 2. Campo Extra Lateral (Código desabilitado + Olhinho) */}
        {value && entidadeSelecionada && (
          <div className="flex items-center gap-2 animate-fadeIn w-full">
            <div className="flex-1">
              <FloatInput
                label="Código do Fornecedor"
                required={required}
                value={entidadeSelecionada.codigo}
                onChange={() => { }}
                disabled
                className="w-full"
              />
            </div>

            <EyeAction onClick={onEyeClick} />

          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================================
// MODAL DOENÇA (ATUALIZADO)
// ==========================================================
interface DoencaInputProps {
  value: string;
  onChange: (entidade: any) => void;
  onEyeClick?: (entidade: any) => void;
  required?: boolean;
  tooltipText?: string;
  data?: any[];
  apenasVacinaveis?: boolean; // 👈 Adicionado aqui para resolver o erro de tipagem
}

export function DoencaInput({
  value,
  onChange,
  onEyeClick,
  required = false,
  tooltipText,
  data = DOENCAS_MOCK,
  apenasVacinaveis = false, // 👈 Inicializa como false por padrão
}: DoencaInputProps) {

  // 💡 Se 'apenasVacinaveis' for true, você pode filtrar os dados aqui se o seu mock tiver esse campo,
  // ou apenas repassar a lista completa por enquanto.
  const dadosFiltrados = apenasVacinaveis
    ? data.filter((d: any) => d.vacinavel !== false) // Exemplo caso seu mock tenha essa flag
    : data;

  const BlacklistedOuSelecionada = dadosFiltrados.find((x: any) => x.nome === value || x.codigo === value);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Mudamos de grid para flex para permitir que o input ocupe 100% da largura útil */}
      <div className="flex items-end gap-2 w-full">

        {/* O container do input agora ganha 'flex-1' para empurrar o olho para o canto */}
        <div className="flex-1 w-full">
          <EntitySearchInput
            label="Doença"
            placeholder="Buscar por nome da doença."
            required={required}
            value={BlacklistedOuSelecionada?.nome || ""}
            data={dadosFiltrados}
            searchKeys={["nome"]}
            title="Buscar Doença"
            subtitle={apenasVacinaveis ? "Busque por uma doença cadastrada:" : "Busque por uma doença cadastrada:"}
            icon={<img src={Icons.iconeDoencaUrl} alt="Doença" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}
            columns={[
              { label: "Doença", key: "nome" },
            ]}
            confirmLabel="Confirmar"
            onChange={onChange}
            hasTooltip={!!tooltipText}
            tooltipText={tooltipText}
          />
        </div>

        {value && BlacklistedOuSelecionada && (
          <EyeAction onClick={onEyeClick} />
        )}
      </div>
    </div>
  );
}



// ==========================================================
// MODAL PROPRIETÁRIO (CORRIGIDO)
// ==========================================================
export function ProprietarioInput({ value, onChange, onEyeClick, required = false }: DomainInputProps) {
  const [tipoPessoa, setTipoPessoa] = useState<string>("");

  const entidadeSelecionada = PRODUTORES_MOCK.find((x) => x.nome === value || x.documento === value);

  const databaseFiltrada = tipoPessoa
    ? PRODUTORES_MOCK.filter(p => p.tipo === tipoPessoa)
    : PRODUTORES_MOCK;

  // Definição estrita das colunas baseada no estado atual
  const colunasModal = [
    {
      label: tipoPessoa === "PF" ? "Nome" : tipoPessoa === "PJ" ? "Razão Social" : "Nome / Razão Social",
      key: "nome"
    },
    {
      label: tipoPessoa === "PJ" ? "CNPJ" : tipoPessoa === "PF" ? "CPF" : "CPF / CNPJ",
      key: "documento"
    }
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className={value ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full" : "w-full"}>

        <EntitySearchInput
          label="Proprietário"
          placeholder="Buscar pelo nome do proprietário."
          required={required}
          value={entidadeSelecionada?.nome || ""}
          data={databaseFiltrada}
          title="Buscar Proprietário"
          subtitle="Busque por um proprietário cadastrado:"
          icon={<img src={Icons.iconeProdutorUrl} alt="Proprietário" className="w-5 h-5 object-contain" />}
          columns={colunasModal}
          searchKeys={["nome", "documento"]}
          searchPlaceholder="Buscar Proprietário"
          confirmLabel="Confirmar"

          // 💡 APENAS repassa a entidade sem resetar o estado prematuramente aqui
          onChange={onChange}

          headerActions={
            <div className="w-48 !mr-4 pr-1 relative z-10 flex-shrink-0">
              <FloatSelect
                label="Tipo de Pessoa"
                required
                value={tipoPessoa}
                onChange={(v) => setTipoPessoa(v)}
                options={[
                  { value: "PF", label: "Pessoa Física" },
                  { value: "PJ", label: "Pessoa Jurídica" },
                ]}
              />
            </div>
          }
        />

        {/* Campo Extra reboque */}
        {value && entidadeSelecionada && (
          <div className="flex items-center gap-2 animate-fadeIn w-full">
            <div className="flex-1">
              <FloatInput
                label={entidadeSelecionada.tipo === "PJ" ? "CNPJ" : "CPF"}
                required={required}
                value={entidadeSelecionada.documento}
                onChange={() => { }}
                disabled
                className="w-full"
              />
            </div>
            <EyeAction onClick={onEyeClick} />
          </div>
        )}
      </div>
    </div>
  );
}



interface DomainInputProps {
  label: string;
  value: string; // Nome selecionado
  documento?: string; // Documento selecionado (CPF/CNPJ)
  required?: boolean;
  onChange: (selectedEntity: any) => void;
  onEyeClick?: () => void;
}

// ==========================================================
// COMPONENTE: FornecedorInput
// ==========================================================
export function FornecedorInput({ value, onChange, onEyeClick, required = false }: DomainInputProps) {
  const [tipoPessoa, setTipoPessoa] = useState<string>("");

  // Encontra a entidade selecionada para exibir no campo reboque
  const entidadeSelecionada = PRODUTORES_MOCK.find((x) => x.nome === value || x.documento === value);

  const databaseFiltrada = tipoPessoa
    ? PRODUTORES_MOCK.filter(p => p.tipo === tipoPessoa)
    : PRODUTORES_MOCK;

  const colunasModal = [
    {
      label: tipoPessoa === "PF" ? "Nome" : tipoPessoa === "PJ" ? "Razão Social" : "Nome / Razão Social",
      key: "nome"
    },
    {
      label: tipoPessoa === "PJ" ? "CNPJ" : tipoPessoa === "PF" ? "CPF" : "CPF / CNPJ",
      key: "documento"
    }
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className={value ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full" : "w-full"}>

        <EntitySearchInput
          label="Fornecedor"
          placeholder="Buscar pelo fornecedor."
          required={required}
          value={entidadeSelecionada?.nome || ""}
          data={databaseFiltrada}
          title="Buscar Fornecedor"
          subtitle="Busque por um fornecedor cadastrado no sistema:"
          icon={<img src={Icons.iconeFornecedorUrl} alt="Fornecedor" className="w-5 h-5 object-contain" />}
          columns={colunasModal}
          searchKeys={["nome", "documento"]}
          searchPlaceholder="Buscar Fornecedor"
          confirmLabel="Confirmar"
          onChange={(p) => {
            onChange(p);
            setTipoPessoa("");
          }}
          headerActions={
            <div className="w-48 !mr-4 pr-1 relative z-10 flex-shrink-0">
              <FloatSelect
                label="Tipo de Pessoa"
                required
                value={tipoPessoa}
                onChange={(v) => setTipoPessoa(v)}
                options={[
                  { value: "PF", label: "Pessoa Física" },
                  { value: "PJ", label: "Pessoa Jurídica" },
                ]}
              />
            </div>
          }
        />

        {/* Campo Extra reboque: CPF/CNPJ + Olhinho lado a lado */}
        {value && entidadeSelecionada && (
          <div className="flex items-center gap-2 animate-fadeIn w-full">
            <div className="flex-1">
              <FloatInput
                label={entidadeSelecionada.tipo === "PJ" ? "CNPJ" : "CPF"}
                required={required}
                value={entidadeSelecionada.documento}
                onChange={() => { }}
                disabled
                className="w-full"
              />
            </div>
            <EyeAction onClick={onEyeClick} />
          </div>
        )}
      </div>
    </div>
  );
}


// ==========================================================
// COMPONENTE: FornecedorInput
// ==========================================================
export function DestinatarioInput({ value, onChange, onEyeClick, required = false }: DomainInputProps) {
  const [tipoPessoa, setTipoPessoa] = useState<string>("");

  // Encontra a entidade selecionada para exibir no campo reboque
  const entidadeSelecionada = PRODUTORES_MOCK.find((x) => x.nome === value || x.documento === value);

  const databaseFiltrada = tipoPessoa
    ? PRODUTORES_MOCK.filter(p => p.tipo === tipoPessoa)
    : PRODUTORES_MOCK;

  const colunasModal = [
    {
      label: tipoPessoa === "PF" ? "Nome" : tipoPessoa === "PJ" ? "Razão Social" : "Nome / Razão Social",
      key: "nome"
    },
    {
      label: tipoPessoa === "PJ" ? "CNPJ" : tipoPessoa === "PF" ? "CPF" : "CPF / CNPJ",
      key: "documento"
    }
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className={value ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full" : "w-full"}>

        <EntitySearchInput
          label="Destinatário"
          placeholder="Buscar pelo destinatário."
          required={required}
          value={entidadeSelecionada?.nome || ""}
          data={databaseFiltrada}
          title="Buscar Destinatário"
          subtitle="Busque por um destinatário cadastrado no sistema:"
          icon={<img src={Icons.iconeFornecedorUrl} alt="Destinatário" className="w-5 h-5 object-contain" />}
          columns={colunasModal}
          searchKeys={["nome", "documento"]}
          searchPlaceholder="Buscar Destinatário"
          confirmLabel="Confirmar"
          onChange={(p) => {
            onChange(p);
            setTipoPessoa("");
          }}
          headerActions={
            <div className="w-48 !mr-4 pr-1 relative z-10 flex-shrink-0">
              <FloatSelect
                label="Tipo de Pessoa"
                required
                value={tipoPessoa}
                onChange={(v) => setTipoPessoa(v)}
                options={[
                  { value: "PF", label: "Pessoa Física" },
                  { value: "PJ", label: "Pessoa Jurídica" },
                ]}
              />
            </div>
          }
        />

        {/* Campo Extra reboque: CPF/CNPJ + Olhinho lado a lado */}
        {value && entidadeSelecionada && (
          <div className="flex items-center gap-2 animate-fadeIn w-full">
            <div className="flex-1">
              <FloatInput
                label={entidadeSelecionada.tipo === "PJ" ? "CNPJ" : "CPF"}
                required={required}
                value={entidadeSelecionada.documento}
                onChange={() => { }}
                disabled
                className="w-full"
              />
            </div>
            <EyeAction onClick={onEyeClick} />
          </div>
        )}
      </div>
    </div>
  );
}


// Mocks importados do seu padrão de projeto
const MUNICIPIOS_MOCK = ["Lavras", "Belo Horizonte", "Abaeté", "Abadia dos Dourados", "Passos", "Uberlândia"];
const LOCALIDADES_MOCK = ["Centro", "Floresta", "Serrinha", "Vale do Sul"];
const DISTRITOS_MOCK = ["Abadia dos Dourados", "Abaeté", "Distrito de Campos do Meio", "Vale do Norte"];


const aplicarMascaraDMS = (value: string, direcaoPadrao: "S" | "W") => {
  const apenasNumeros = value.replace(/\D/g, "");
  if (!apenasNumeros) return "";

  const g = apenasNumeros.slice(0, 2);
  const m = apenasNumeros.slice(2, 4);
  let s = apenasNumeros.slice(4, 7);

  if (s.length === 3) {
    s = `${s.slice(0, 2)}.${s.slice(2)}`;
  }

  if (g && !m) return `${g}°`;
  if (g && m && !s) return `${g}° ${m}'`;
  return `${g}° ${m}' ${s}" ${direcaoPadrao}`;
};

// =========================================================
// SUBCOMPONENTE INTERNO: MAPMODAL (Totalmente corrigido)
// =========================================================
interface MapModalProps {
  onClose: () => void;
  onConfirm: (lat: string, lng: string) => void;
  initialLat?: string;
  initialLng?: string;
}

function MapModal({ onClose, onConfirm, initialLat, initialLng }: MapModalProps) {
  const [mapType, setMapType] = useState<"mapa" | "satelite">("mapa");
  const [formatType, setFormatType] = useState<"dms" | "decimal">("dms");

  const [latDecimal, setLatDecimal] = useState(initialLat || "-21.233481");
  const [lngDecimal, setLngDecimal] = useState(initialLng || "-44.991278");

  const [latDMS, setLatDMS] = useState("");
  const [lngDMS, setLngDMS] = useState("");

  const aplicarMascaraDMS = (value: string, direcaoPadrao: "S" | "W") => {
    const apenasNumeros = value.replace(/\D/g, "");
    if (!apenasNumeros) return "";
    const g = apenasNumeros.slice(0, 2);
    const m = apenasNumeros.slice(2, 4);
    let s = apenasNumeros.slice(4, 7);
    if (s.length === 3) s = `${s.slice(0, 2)}.${s.slice(2)}`;
    if (g && !m) return `${g}°`;
    if (g && m && !s) return `${g}° ${m}'`;
    return `${g}° ${m}' ${s}" ${direcaoPadrao}`;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 flex flex-col gap-6 relative font-sans text-gray-800 animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg font-bold transition p-1"
        >
          ✕
        </button>

        <div className="flex flex-col items-center gap-2 text-center mt-2">
          <div className="flex items-center gap-2">
            <Map size={26} className="text-[#1A7A3C]" />
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Buscar no Mapa</h2>
          </div>
          <p className="text-sm text-gray-600 font-medium mt-1">Selecione a localização no mapa:</p>
        </div>

        {/* Simulador visual do mapa */}
        <div className="w-full h-[240px] rounded-xl border border-gray-200 overflow-hidden relative bg-gray-100 flex items-center justify-center">
          <div className="absolute top-3 right-3 z-10 bg-white rounded-lg shadow-sm border border-gray-200 p-0.5 flex gap-0.5">
            <button
              type="button"
              onClick={() => setMapType("mapa")}
              className={`text-[10px] font-bold px-3 py-1.5 rounded transition ${mapType === "mapa" ? "bg-[#1A7A3C] text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Mapa
            </button>
            <button
              type="button"
              onClick={() => setMapType("satelite")}
              className={`text-[10px] font-bold px-3 py-1.5 rounded transition ${mapType === "satelite" ? "bg-[#1A7A3C] text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Satélite
            </button>
          </div>

          <div className="relative z-20 flex flex-col items-center">
            <MapPin size={34} className="text-[#1A7A3C] fill-[#1A7A3C] drop-shadow-md animate-bounce" />
          </div>
          <div className="absolute inset-0 bg-[#ccece6] opacity-40 pattern-grid" />
        </div>

        {/* Inputs de Formato */}
        <div className="grid grid-cols-12 gap-4 items-end text-left w-full">
          <div className="col-span-4">
            <FloatSelect
              label="Formato"
              required
              value={formatType}
              onChange={(v) => setFormatType(v as "dms" | "decimal")}
              options={[
                { value: "dms", label: "DMS (Graus, Minutos, Segundos)" },
                { value: "decimal", label: "DD (Decimal)" }
              ]}
            />
          </div>

          {formatType === "dms" ? (
            <>
              <div className="col-span-4">
                <FloatInput label="Latitude" required placeholder={'__° __\' __._"S'} value={latDMS} onChange={(v) => setLatDMS(aplicarMascaraDMS(v, "S"))} />
              </div>
              <div className="col-span-4">
                <FloatInput label="Longitude" required placeholder={'__° __\' __._"W'} value={lngDMS} onChange={(v) => setLngDMS(aplicarMascaraDMS(v, "W"))} />
              </div>
            </>
          ) : (
            <>
              <div className="col-span-4">
                <FloatInput label="Latitude" required value={latDecimal} onChange={setLatDecimal} />
              </div>
              <div className="col-span-4">
                <FloatInput label="Longitude" required value={lngDecimal} onChange={setLngDecimal} />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center items-center gap-3 w-full pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-10 py-2.5 bg-white text-[#1A7A3C] text-sm font-semibold rounded-md border border-[#1A7A3C] hover:bg-gray-50 shadow-sm transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => formatType === "decimal" ? onConfirm(latDecimal, lngDecimal) : onConfirm(latDMS, lngDMS)}
            className="px-10 py-2.5 text-white text-sm font-semibold rounded-md shadow-sm bg-[#1A7A3C] hover:bg-[#15612F] transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================================
// COMPONENTE PRINCIPAL EXPORTADO: BLOCO ENDEREÇO FIELDS
// =========================================================

interface EnderecoState {
  zona: string;
  cep: string;
  estado: string;
  municipio: string;
  bairro: string;
  endereco: string;
  numero: string;
  complemento: string;
  localidade: string;
  distrito: string;
  latitude?: string;
  longitude?: string;
}

interface BlocoEnderecoFieldsProps {
  title: string;
  data: EnderecoState;
  tipoEstado: "travado" | "normal";
  onChange: (key: keyof EnderecoState, value: string) => void;
  onSetMultipleFields: (fields: Partial<EnderecoState>) => void;
}

export function BlocoEnderecoFields({
  title,
  data,
  tipoEstado,
  onChange,
  onSetMultipleFields,
}: BlocoEnderecoFieldsProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado interno para controlar a pergunta de geolocalização herdada
  const [mesmaGeoEstab, setMesmaGeoEstab] = useState<boolean | "">("");

  const isGlobalDisabled = tipoEstado === "travado";
  const isRural = data.zona === "Rural";

  // Efeito para tratar o preenchimento automático das coordenadas se marcar "Sim"
  useEffect(() => {
    if (isGlobalDisabled && mesmaGeoEstab === true) {
      onSetMultipleFields({
        latitude: "-19.165827",
        longitude: "-44.362871"
      });
    } else if (isGlobalDisabled && mesmaGeoEstab === false) {
      onSetMultipleFields({
        latitude: "",
        longitude: ""
      });
    }
  }, [mesmaGeoEstab, isGlobalDisabled]);

  const aplicarMascaraCEP = (value: string) => {
    return value.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9);
  };

  const handleZonaChange = (novaZona: string) => {
    if (isGlobalDisabled) return;
    if (novaZona === "Rural") {
      onSetMultipleFields({
        zona: "Rural",
        estado: tipoEstado === "travado" ? "Minas Gerais" : (data.estado || "Minas Gerais"),
        cep: "", bairro: "", numero: "", complemento: "",
      });
    } else {
      onChange("zona", novaZona);
    }
  };

  const handleCepChange = async (val: string) => {
    if (isGlobalDisabled) return;
    const formatado = aplicarMascaraCEP(val);
    onChange("cep", formatado);
    const apenasNumeros = formatado.replace(/\D/g, "");

    if (apenasNumeros.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${apenasNumeros}/json/`);
        const json = await response.json();
        if (!json.erro) {
          const estadoApi = json.uf === "MG" ? "Minas Gerais" : json.uf === "SP" ? "São Paulo" : json.uf === "RJ" ? "Rio de Janeiro" : json.uf || "";
          onSetMultipleFields({
            cep: formatado,
            estado: tipoEstado === "travado" ? "Minas Gerais" : estadoApi,
            municipio: json.localidade || "",
            bairro: json.bairro || "",
            endereco: json.logradouro || "",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const MUNICIPIOS_MOCK = ["Lavras", "Belo Horizonte", "Abaeté", "Passos", "Uberlândia"];
  const LOCALIDADES_MOCK = ["Centro", "Floresta", "Serrinha"];
  const DISTRITOS_MOCK = ["Abadia dos Dourados", "Abaeté"];

  return (
    <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 first:border-0 first:pt-0">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>

      {/* Grid de campos básicos de Endereço */}
      <div className={`grid grid-cols-1 gap-3 ${isRural ? "md:grid-cols-3" : "md:grid-cols-5"}`}>
        <FloatSelect label="Zona" required value={data.zona} onChange={handleZonaChange} disabled={isGlobalDisabled} options={[{ value: "Urbana", label: "Urbana" }, { value: "Rural", label: "Rural" }]} />
        {!isRural && <FloatInput label="CEP" required value={data.cep} onChange={handleCepChange} maxLength={9} disabled={isGlobalDisabled} />}
        <FloatSelect label="Estado" required value={data.estado} disabled={isGlobalDisabled} onChange={(v) => onChange("estado", v)} options={[{ value: "Minas Gerais", label: "Minas Gerais" }, { value: "São Paulo", label: "São Paulo" }, { value: "Rio de Janeiro", label: "Rio de Janeiro" }]} />
        <FloatCombobox label="Município" required value={data.municipio} onChange={(v) => onChange("municipio", v)} options={MUNICIPIOS_MOCK} disabled={isGlobalDisabled} />
        {!isRural && <FloatInput label="Bairro" required value={data.bairro} onChange={(v) => onChange("bairro", v)} disabled={isGlobalDisabled} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className={`relative hover:z-30 focus-within:z-30 ${isRural ? "md:col-span-12" : "md:col-span-7"}`}>
          <FloatInput label="Endereço" required value={data.endereco} onChange={(v) => onChange("endereco", v)} className="w-full" hasTooltip={isRural} tooltipText="Nome da estrada e o quilômetro de referência." disabled={isGlobalDisabled} />
        </div>
        {!isRural && (
          <>
            <FloatInput label="Número" required value={data.numero} onChange={(v) => onChange("numero", v)} className="md:col-span-2" disabled={isGlobalDisabled} />
            <FloatInput label="Complemento" value={data.complemento} onChange={(v) => onChange("complemento", v)} className="md:col-span-3" disabled={isGlobalDisabled} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FloatCombobox label="Localidade" value={data.localidade} onChange={(v) => onChange("localidade", v)} options={LOCALIDADES_MOCK} disabled={isGlobalDisabled} />
        <FloatCombobox label="Distrito" value={data.distrito} onChange={(v) => onChange("distrito", v)} options={DISTRITOS_MOCK} disabled={isGlobalDisabled} />
      </div>

      {/* =========================================================
          SUBSTITUIÇÃO: SEÇÃO DE COORDENADAS REESTRUTURADA 
         ========================================================= */}
      <hr className="border-gray-100 my-1" />

      {/* Se o cadastro for do IMA (travado), exibe a pergunta de geolocalização espelhada */}
      {isGlobalDisabled && (
        <div className="flex flex-col gap-3">
          <SimNao
            label="Possui a Mesma Geolocalização do Estabelecimento Agropecuário?"
            name="mesma-geo-interna"
            required
            value={mesmaGeoEstab}
            onChange={setMesmaGeoEstab}
          />

        </div>
      )}

      {/* Renderização dos campos de Latitude e Longitude baseados na escolha */}
      {isGlobalDisabled ? (
        // Se for do IMA, mostra os campos direto em formato de Grid com base no Sim/Não
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
          <FloatInput
            label="Latitude"
            value={data.latitude}
            onChange={(v) => onChange("latitude", v)}
            disabled={mesmaGeoEstab === true || mesmaGeoEstab === ""}
            placeholder="-19.165827"
          />
          <FloatInput
            label="Longitude"
            value={data.longitude}
            onChange={(v) => onChange("longitude", v)}
            disabled={mesmaGeoEstab === true || mesmaGeoEstab === ""}
            placeholder="-44.362871"
          />
        </div>
      ) : (
        // Fluxo Normal (Se não for IMA, mantém o botão original que abre o mapa)
        <div className="w-full">
          {!(data.latitude && data.longitude) ? (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}
              className="w-full flex items-center justify-center gap-2 border border-[#1A7A3C] rounded-md h-11 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50 transition shadow-sm cursor-pointer"
            >
              <Map size={16} /> Adicionar Coordenadas
            </button>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end animate-fade-in">
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}
                  className="w-full flex items-center justify-center border border-[#1A7A3C] rounded-md h-11 bg-white hover:bg-green-50/30 text-[#1A7A3C] transition cursor-pointer"
                >
                  <Map size={18} />
                </button>
              </div>
              <div className="md:col-span-5">
                <FloatInput label="Latitude" value={data.latitude} onChange={(v) => onChange("latitude", v)} disabled={true} />
              </div>
              <div className="md:col-span-5">
                <FloatInput label="Longitude" value={data.longitude} onChange={(v) => onChange("longitude", v)} disabled={true} />
              </div>
            </div>
          )}
        </div>
      )}

      {isModalOpen && !isGlobalDisabled && (
        <MapModal
          onClose={() => setIsModalOpen(false)}
          onConfirm={(lat, lng) => {
            onSetMultipleFields({ latitude: lat, longitude: lng });
            setIsModalOpen(false);
          }}
          initialLat={data.latitude}
          initialLng={data.longitude}
        />
      )}
    </div>
  );
}


// INFORMAÇÕES DE CONTATO

export interface ContatoAdicional {
  id: string;
  tipo: "E-mail" | "Telefone";
  email: string;
  telefone: string;
  observacao: string;
}

interface ContatoState {
  utilizarContatoProprietario: "Sim" | "Não";
  proprietariosSelecionados: string[]; // Guarda os IDs selecionados
  emailFixo: string;
  emailFixoObs: string;
  telefoneFixo: string;
  telefoneFixoObs: string;
  contatosAdicionais: any[]; // Substitua por sua interface de contatos adicionais se houver
}

interface BlocoContatoFieldsProps {
  data: ContatoState;
  onChange: (updatedData: Partial<ContatoState>) => void;
  // Certifique-se de passar essa lista preenchida na chamada do componente na página pai
  proprietariosDisponiveis: Array<{ id: string; nome: string; cpf: string; email?: string; telefone?: string; observacao?: string }>;
}

export function BlocoContatoFields({
  data,
  onChange,
  proprietariosDisponiveis = [] // Certifique-se de passar esta propriedade preenchida na tela pai!
}: BlocoContatoFieldsProps) {
  const [modalProprietariosOpen, setModalProprietariosOpen] = useState(false);

  const aplicarMascaraTelefone = (value: string) => {
    const num = value.replace(/\D/g, "");
    if (num.length <= 10) {
      return num.replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2").slice(0, 14);
    }
    return num.replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 15);
  };

  const handleFieldChange = (key: keyof ContatoState, value: any) => {
    onChange({ [key]: value });
  };

  const removerProprietario = (id: string) => {
    handleFieldChange("proprietariosSelecionados", data.proprietariosSelecionados.filter(pId => String(pId) !== String(id)));
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Pergunta Condicional Principal */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-600 block">
          Utilizar Contato de Proprietários? <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6 mt-1">
          <CustomRadio
            label="Sim"
            name="utilizarContatoProprietario"
            value="Sim"
            checked={data.utilizarContatoProprietario === "Sim"}
            onChange={() => onChange({ utilizarContatoProprietario: "Sim", proprietariosSelecionados: [], contatosAdicionais: data.contatosAdicionais || [] })}
          />
          <CustomRadio
            label="Não"
            name="utilizarContatoProprietario"
            value="Não"
            checked={data.utilizarContatoProprietario === "Não"}
            onChange={() => onChange({ utilizarContatoProprietario: "Não", proprietariosSelecionados: [], contatosAdicionais: data.contatosAdicionais || [] })}
          />
        </div>
      </div>

      {/* CASO SIM: Contato de Proprietários */}
      {data.utilizarContatoProprietario === "Sim" && (
        <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Contato de Proprietários</h3>
            <button
              type="button"
              onClick={() => setModalProprietariosOpen(true)}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition cursor-pointer"
            >
              <PlusCircle size={16} /> Adicionar Contato
            </button>
          </div>

          {/* LISTAGEM DOS CARDS EXATAMENTE IGUAL AO CONTACTCARD (EMAIL, TELEFONE E OBSERVAÇÕES) */}
          {(!data.proprietariosSelecionados || data.proprietariosSelecionados.length === 0) ? (
            <p className="text-xs text-gray-400 italic">Nenhum proprietário selecionado para contato.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {(proprietariosDisponiveis && proprietariosDisponiveis.length > 0
                ? proprietariosDisponiveis
                : [
                  { id: "prop-1", nome: "Carlos Henrique Silva", email: "carlos.silva@email.com", telefone: "(11) 98888-7777", observacoes: "Contato principal da fazenda" },
                  { id: "prop-2", nome: "Maria Fernanda Oliveira", email: "maria.fernanda@email.com", telefone: "(21) 99999-8888" },
                  { id: "prop-3", nome: "Antônio Marcos de Souza", email: "antonio.marcos@email.com", telefone: "(31) 97777-6666" },
                  { id: "prop-4", nome: "Juliana Costa Rezende", email: "juliana.costa@email.com", telefone: "(61) 96666-5555" }
                ]
              )
                .filter((p) => data.proprietariosSelecionados.map(String).includes(String(p.id)))
                .map((p, index) => (
                  <div
                    key={p.id}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 flex flex-col gap-1.5"
                  >
                    {/* Header row */}
                    <div className="flex items-center gap-3">
                      {/* Badge */}
                      <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>

                      {/* Icon + name */}
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <img src={Icons.iconeProdutorUrl} alt="Proprietário" className="w-5 h-5 object-contain" />
                        <span className="text-sm font-semibold text-gray-800 truncate">
                          {p.nome}
                        </span>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => {
                          const listaFiltrada = data.proprietariosSelecionados.filter((id: any) => String(id) !== String(p.id));
                          handleFieldChange("proprietariosSelecionados", listaFiltrada);
                        }}
                        className="p-1 rounded hover:bg-red-50 hover:text-red-500 transition-colors text-red-400 flex-shrink-0 cursor-pointer"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    {/* Details (Email, Telefone na primeira linha e Observação se houver na próxima) */}
                    <div className="pl-9 flex flex-col gap-0.5">
                      <div className="flex flex-wrap gap-x-8 gap-y-0.5">
                        <span className="text-xs text-gray-600">
                          <span className="text-gray-400">Email: </span>
                          {(p as any).email || "Não informado"}
                        </span>
                        <span className="text-xs text-gray-600">
                          <span className="text-gray-400">Telefone: </span>
                          {(p as any).telefone || "Não informado"}
                        </span>
                      </div>

                      {/* Linha adicional para observações com checagem segura contra o erro de tipo */}
                      {((p as any).observacoes || (p as any).observacao || (p as any).obs) && (
                        <span className="text-xs text-gray-600">
                          <span className="text-gray-400">Observações: </span>
                          {(p as any).observacoes || (p as any).observacao || (p as any).obs}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* MultiSearchModal com os fallbacks completos */}
          <MultiSearchModal
            open={modalProprietariosOpen}
            onClose={() => setModalProprietariosOpen(false)}
            title="Contato de Proprietários"
            subtitle="Selecione os proprietários para vincular as informações de contato:"
            icon={<img src={Icons.iconeProdutorUrl} alt="Proprietário" className="w-8 h-8 object-contain" />}
            data={proprietariosDisponiveis && proprietariosDisponiveis.length > 0
              ? proprietariosDisponiveis.map((p: any) => ({ id: p.id, nome: p.nome }))
              : [
                { id: "prop-1", nome: "Carlos Henrique Silva" },
                { id: "prop-2", nome: "Maria Fernanda Oliveira" },
                { id: "prop-3", nome: "Antônio Marcos de Souza" },
                { id: "prop-4", nome: "Juliana Costa Rezende" }
              ]
            }
            searchKeys={["nome"]}
            searchPlaceholder="Busque pelo nome do proprietário."
            columns={[
              { label: "Nome do Proprietário", key: "nome" }
            ]}
            selectedItems={(proprietariosDisponiveis.length > 0 ? proprietariosDisponiveis : [
              { id: "prop-1", nome: "Carlos Henrique Silva" },
              { id: "prop-2", nome: "Maria Fernanda Oliveira" },
              { id: "prop-3", nome: "Antônio Marcos de Souza" },
              { id: "prop-4", nome: "Juliana Costa Rezende" }
            ]).filter((p: any) => data.proprietariosSelecionados?.map(String).includes(String(p.id)))}
            onConfirm={(itensSelecionados: any[]) => {
              const listaIds = itensSelecionados.map(item => item.id);
              handleFieldChange("proprietariosSelecionados", listaIds);
            }}
            confirmLabel="Vincular Selecionados"
          />
        </div>
      )}


      {/* CASO NÃO: Campos Fixos Obrigatórios */}
      {data.utilizarContatoProprietario === "Não" && (
        <div className="flex flex-col gap-4 border-t border-dashed border-gray-100 pt-4 animate-in fade-in duration-200">
          {/* E-mail Fixo */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <div className="md:col-span-2"><FloatInput label="Tipo de Contato" value="E-mail" disabled required /></div>
            <div className="md:col-span-4"><FloatInput label="E-mail" required placeholder="nome@exemplo.com" value={data.emailFixo || ""} onChange={(v) => handleFieldChange("emailFixo", v)} /></div>
            <div className="md:col-span-6">
              <div className="relative border border-gray-300 rounded-md p-3 bg-white">
                <label className="block text-[10px] text-gray-400 font-medium mb-1">Observação</label>
                <textarea
                  value={data.emailFixoObs || ""}
                  onChange={(e) => handleFieldChange("emailFixoObs", e.target.value.slice(0, 1500))}
                  rows={3}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none resize-none"
                />
                <div className="text-right text-xs text-gray-400 mt-1">{(data.emailFixoObs || "").length}/1500</div>
              </div>
            </div>
          </div>

          {/* Telefone Fixo */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <div className="md:col-span-2"><FloatInput label="Tipo de Contato" value="Telefone" disabled required /></div>
            <div className="md:col-span-4"><FloatInput label="Número" required placeholder="(00) 00000-0000" value={data.telefoneFixo || ""} onChange={(v) => handleFieldChange("telefoneFixo", aplicarMascaraTelefone(v))} maxLength={15} /></div>
            <div className="md:col-span-6">
              <div className="relative border border-gray-300 rounded-md p-3 bg-white">
                <label className="block text-[10px] text-gray-400 font-medium mb-1">Observação</label>
                <textarea
                  value={data.telefoneFixoObs || ""}
                  onChange={(e) => handleFieldChange("telefoneFixoObs", e.target.value.slice(0, 1500))}
                  rows={3}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none resize-none"
                />
                <div className="text-right text-xs text-gray-400 mt-1">{(data.telefoneFixoObs || "").length}/1500</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-gray-100 pt-4 mt-2">

        <div className="flex items-center gap-1.5 mb-3 select-none">
          <span className="text-sm font-semibold text-gray-700">Outros Contatos</span>
          <FieldTooltip text="Além do contato principal, você também pode adicionar outros contatos opcionais" />
        </div>

        <DynamicListWrapper
          title=""
          items={data.contatosAdicionais || []}
          behavior="zero-or-more"
          variant="plain"
          addButtonLabel="Adicionar Contato"
          onAddItem={() => {
            const novo: ContatoAdicional = { id: String(Date.now()), tipo: "E-mail", email: "", telefone: "", observacao: "" };
            handleFieldChange("contatosAdicionais", [...(data.contatosAdicionais || []), novo]);
          }}
          onRemoveItem={(index: number) => {
            const list = data.contatosAdicionais.filter((_, i) => i !== index);
            handleFieldChange("contatosAdicionais", list);
          }}
        >
          {(cont: ContatoAdicional, index: number) => (
            <div key={cont.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start relative animate-in slide-in-from-top-2 duration-150 w-full mb-4">
              <div className="md:col-span-2">
                <FloatSelect
                  label="Tipo"
                  required
                  value={cont.tipo}
                  onChange={(v) => {
                    const list = data.contatosAdicionais.map((c, i) => i === index ? { ...c, tipo: v as "E-mail" | "Telefone", email: "", telefone: "" } : c);
                    handleFieldChange("contatosAdicionais", list);
                  }}
                  options={[{ value: "E-mail", label: "E-mail" }, { value: "Telefone", label: "Telefone" }]}
                />
              </div>

              {cont.tipo === "E-mail" ? (
                <div className="md:col-span-4">
                  <FloatInput label="E-mail" required value={cont.email} onChange={(v) => {
                    const list = data.contatosAdicionais.map((c, i) => i === index ? { ...c, email: v } : c);
                    handleFieldChange("contatosAdicionais", list);
                  }} />
                </div>
              ) : (
                <div className="md:col-span-4">
                  <FloatInput label="Número" required placeholder="(00) 00000-0000" value={cont.telefone} onChange={(v) => {
                    const list = data.contatosAdicionais.map((c, i) => i === index ? { ...c, telefone: aplicarMascaraTelefone(v) } : c);
                    handleFieldChange("contatosAdicionais", list);
                  }} maxLength={15} />
                </div>
              )}

              <div className="md:col-span-6">
                <div className="relative border border-gray-300 rounded-md p-3 bg-white">
                  <label className="block text-[10px] text-gray-400 font-medium mb-1">Observação</label>
                  <textarea
                    value={cont.observacao || ""}
                    onChange={(e) => {
                      const list = data.contatosAdicionais.map((c, i) => i === index ? { ...c, observacao: e.target.value.slice(0, 1500) } : c);
                      handleFieldChange("contatosAdicionais", list);
                    }}
                    rows={3}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none resize-none"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">{(cont.observacao || "").length}/1500</div>
                </div>
              </div>
            </div>
          )}
        </DynamicListWrapper>
      </div>
    </div>
  );
}


// SELECT CHIP



interface SelectedChipsContainerProps {
  title: string;
  // 💡 Estendemos o item para opcionalmente receber uma lista de sub-itens (como faixas etárias)
  items: Array<{
    id: string | number;
    label: string;
    subItems?: string[];
  }>;
  onRemoveItem: (id: any) => void;
  emptyText?: string;
}

export function SelectedChipsContainer({
  title,
  items,
  onRemoveItem,
  emptyText = "Nenhum item selecionado."
}: SelectedChipsContainerProps) {
  return (
    <div className="w-full border border-gray-200 rounded-xl bg-[#f9fafb]/50 overflow-hidden">
      {/* Header do Box */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white">
        <span className="text-sm font-semibold text-gray-500">{title}</span>
        {items.length > 0 && (
          <span className="text-xs font-bold bg-[#E6F4EA] text-[#1A7A3C] px-2.5 py-1 rounded-full">
            {items.length} {items.length === 1 ? "Selecionada" : "Selecionadas"}
          </span>
        )}
      </div>

      {/* Conteúdo / Grid dos Chips */}
      <div className="p-5 flex flex-wrap gap-4">
        {items.length === 0 ? (
          <p className="text-xs text-gray-400 italic">{emptyText}</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              // 💡 Ajustado para flex-col se houver sub-itens, permitindo que a lista quebre para baixo perfeitamente
              className="flex flex-col bg-white border border-gray-200 rounded-xl p-2.5 min-w-[180px] shadow-sm transition hover:border-gray-300 relative group"            >
              {/* Topo do Card: Título da Espécie e Botão de Remover */}
              <div className="flex items-center justify-between gap-4 w-full mb-1">
                <span className="text-sm font-bold text-[#1A7A3C]">{item.label}</span>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded-md hover:bg-gray-50 cursor-pointer"                >
                  <X size={16} />
                </button>
              </div>

              {/* 💡 Lista de Faixas Etárias (Aparece apenas se existirem subItems) */}
              {item.subItems && item.subItems.length > 0 && (
                <ul className="flex flex-col gap-1 text-xs text-gray-600 font-medium list-disc pl-4">
                  {item.subItems.map((sub, idx) => (
                    <li key={idx} className="marker:text-gray-400">
                      {sub}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}


// NÚCLEO
// ==========================================================
// MOCK DE NÚCLEOS DE PRODUÇÃO (Global)
// ==========================================================
export const NUCLEOS_MOCK = [
  { id: 1, codigo: "310010400050003", nome: "Núcleo Alvorada" },
  { id: 2, codigo: "250010400050003", nome: "Núcleo Recanto" },
  { id: 3, codigo: "450010400050003", nome: "Núcleo Central" },
];

// ==========================================================
// COMPONENTE: NucleoInput
// ==========================================================
export function NucleoInput({ value, onChange, onEyeClick, required = false }: DomainInputProps) {

  // Encontra a entidade selecionada para carregar e exibir o código no campo extra
  const entidadeSelecionada = NUCLEOS_MOCK.find((x) => x.nome === value || x.codigo === value);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Se houver valor selecionado, vira grid de 2 colunas para colocar o código + olhinho do lado */}
      <div className={value ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full" : "w-full"}>

        <EntitySearchInput
          label="Núcleo de Produção"
          placeholder="Buscar por nome ou código"
          required={required}
          value={entidadeSelecionada?.nome || ""}
          data={NUCLEOS_MOCK}
          title="Buscar Núcleo de Produção"
          subtitle="Busque por um núcleo de produção cadastrado:"
          icon={<img src={Icons.iconeNucleoProducaoUrl} alt="Núcleo de Produção" className="w-5 h-5 object-contain" />}
          columns={[
            { label: "Código", key: "codigo" },
            { label: "Nome do Núcleo", key: "nome" },
          ]}
          searchKeys={["nome", "codigo"]}
          searchPlaceholder="Buscar por nome ou código"
          confirmLabel="Confirmar"
          onChange={(n) => {
            onChange(n);
          }}
        />

        {/* Campo Extra reboque: Código do Estabelecimento */}
        {value && entidadeSelecionada && (
          <div className="flex items-center gap-2 animate-fadeIn w-full">
            <div className="flex-1">
              <FloatInput
                label="Código do Núcleo"
                required={required}
                value={entidadeSelecionada.codigo}
                onChange={() => { }}
                disabled
                className="w-full"
              />
            </div>
            <EyeAction onClick={onEyeClick} />
          </div>
        )}
      </div>
    </div>
  );
}


// ==========================================================
// MOCK DE MÉDICOS VETERINÁRIOS (Global)
// ==========================================================
export const VETERINARIOS_MOCK = [
  { id: 1, nome: "Dr. Carlos Eduardo Silva", cpf: "123.456.789-00" },
  { id: 2, nome: "Dra. Mariana Costa Alencar", cpf: "987.654.321-11" },
  { id: 3, nome: "Dr. Roberto Antunes Vieira", cpf: "456.789.123-22" },
];

interface MedicoVeterinarioInputProps {
  value: string;
  onChange: (entidade: any) => void;
  onEyeClick?: () => void;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  data?: any[];
}

export const MedicoVeterinarioInput: React.FC<MedicoVeterinarioInputProps> = ({
  value,
  onChange,
  onEyeClick,
  error,
  disabled,
  required = false,
  data = VETERINARIOS_MOCK,
}) => {

  // Encontra a entidade selecionada no array para capturar o CPF
  const entidadeSelecionada = data.find((item) => item.nome === value);

  return (
    /* 💡 Grid Inteligente: Se houver valor selecionado, vira 2 colunas horizontais, senão fica 1 coluna full */
    <div className={`grid grid-cols-1 ${value && entidadeSelecionada ? "md:grid-cols-2" : "w-full"} gap-4 items-end w-full`}>

      {/* Coluna 1: Barra de Busca Principal */}
      <div className="w-full">
        <EntitySearchInput
          label="Médico Veterinário"
          placeholder="Buscar por nome ou CPF"
          required={required}
          disabled={disabled}
          value={value}
          data={data}
          searchKeys={["nome", "cpf"]}
          columns={[
            { label: "Nome", key: "nome" },
            { label: "CPF", key: "cpf" },
          ]}
          icon={<img src={Icons.iconeProfissionalAnimalUrl} alt="Médico Veterinário" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}
          title="Buscar Médico Veterinário"
          subtitle="Busque por um médico veterinário cadastrado no sistema:"
          onChange={onChange}
          error={error}
        />
      </div>

      {/* Coluna 2: Campos do Reboque e Olho alinhados lado a lado horizontalmente */}
      {value && entidadeSelecionada && (
        <div className="flex items-center gap-2 animate-fadeIn w-full">
          <div className="flex-1">
            <FloatInput
              label="CPF do Veterinário"
              required={required}
              value={entidadeSelecionada.cpf}
              onChange={() => { }}
              disabled
              className="w-full"
            />
          </div>
          <EyeAction onClick={onEyeClick} />
        </div>
      )}

    </div>
  );
};


// ==========================================================
// MOCK DE VACINADORES CONTRA BRUCELOSE (Global)
// ==========================================================
export const VACINADORES_BRUCELOSE_MOCK = [
  { id: 1, nome: "João da Silva", documento: "111.222.333-44" },
  { id: 2, nome: "Antônio Alves", documento: "555.666.777-88" },
  { id: 3, nome: "Francisco Oliveira", documento: "999.888.777-66" },
];

interface VacinadorBruceloseInputProps {
  value: string;
  onChange: (entidade: any) => void;
  onEyeClick?: () => void;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  data?: any[];
}

export const VacinadorBruceloseInput: React.FC<VacinadorBruceloseInputProps> = ({
  value,
  onChange,
  onEyeClick,
  error,
  disabled,
  required = false,
  data = VACINADORES_BRUCELOSE_MOCK,
}) => {

  // Encontra a entidade selecionada no array para capturar o CPF/Documento
  const entidadeSelecionada = data.find((item) => item.nome === value);

  return (
    /* 💡 Grid Inteligente: Se houver valor selecionado, vira 2 colunas horizontais, senão fica 1 coluna full */
    <div className={`grid grid-cols-1 ${value && entidadeSelecionada ? "md:grid-cols-2" : "w-full"} gap-4 items-end w-full`}>

      {/* Coluna 1: Barra de Busca Principal */}
      <div className="w-full">
        <EntitySearchInput
          label="Vacinador Contra Brucelose"
          placeholder="Buscar por nome ou CPF"
          required={required}
          disabled={disabled}
          value={value}
          data={data}
          searchKeys={["nome", "documento"]}
          columns={[
            { label: "Nome", key: "nome" },
            { label: "CPF", key: "documento" },
          ]}
          icon={<img src={Icons.iconeProdutorUrl || Icons.iconeProdutorUrl} alt="Vacinador Brucelose" className="w-5 h-5 object-contain" />}
          title="Buscar Vacinador Contra Brucelose"
          subtitle="Busque por um vacinador associado ao médico veterinário responsável:"
          onChange={onChange}
          error={error}
        />
      </div>

      {/* Coluna 2: Campos do Reboque e Olho alinhados lado a lado horizontalmente */}
      {value && entidadeSelecionada && (
        <div className="flex items-center gap-2 animate-fadeIn w-full">
          <div className="flex-1">
            <FloatInput
              label="CPF do Vacinador"
              required={required}
              value={entidadeSelecionada.documento}
              onChange={() => { }}
              disabled
              className="w-full"
            />
          </div>
          <EyeAction onClick={onEyeClick} />
        </div>
      )}

    </div>
  );
};



// ==========================================================
// MOCK DE PROFISSIONAIS DA ÁREA ANIMAL (Baseado no seu VacinadorPage)
// ==========================================================
export const PROFISSIONAIS_AREA_ANIMAL_MOCK = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", oficial: true },
  { id: 2, nome: "Joaquim da Silva", documento: "444.009.956-40", oficial: true },
  { id: 3, nome: "Marina Couto Dias", documento: "333.221.115-09", oficial: false },
  { id: 4, nome: "Carlos Henrique Reis", documento: "222.114.558-70", oficial: false },
];

interface ProfissionalAreaAnimalInputProps {
  value: string;
  onChange: (entidade: any) => void;
  onEyeClick?: () => void;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  data?: any[];
}

export const ProfissionalAnimalInput: React.FC<ProfissionalAreaAnimalInputProps> = ({
  value,
  onChange,
  onEyeClick,
  error,
  disabled,
  required = false,
  data = PROFISSIONAIS_AREA_ANIMAL_MOCK,
}) => {

  // Encontra a entidade selecionada no array para capturar o CPF (chave 'documento')
  const entidadeSelecionada = data.find((item) => item.nome === value);

  return (
    /* 💡 Grid Inteligente: Se houver valor selecionado, vira 2 colunas horizontais, senão fica 1 coluna full */
    <div className={`grid grid-cols-1 ${value && entidadeSelecionada ? "md:grid-cols-2" : "w-full"} gap-4 items-end w-full`}>

      {/* Coluna 1: Barra de Busca Principal */}
      <div className="w-full">
        <EntitySearchInput
          label="Profissional Responsável"
          placeholder="Buscar por nome ou CPF"
          required={required}
          disabled={disabled}
          value={value}
          data={data}
          searchKeys={["nome", "documento"]}
          columns={[
            { label: "Nome", key: "nome" },
            { label: "CPF", key: "documento" },
          ]}
          icon={<img src={Icons.iconeProfissionalAnimalUrl} alt="Profissional da Área Animal" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}
          title="Buscar Profissional Responsável"
          subtitle="Busque por um profissional da área animal cadastrado:"
          onChange={onChange}
          error={error}
        />
      </div>

      {/* Coluna 2: Campos do Reboque e Olho alinhados lado a lado horizontalmente */}
      {value && entidadeSelecionada && (
        <div className="flex items-center gap-2 animate-fadeIn w-full">
          <div className="flex-1">
            <FloatInput
              label="CPF do Profissional"
              required={required}
              value={entidadeSelecionada.documento} // Mapeado para utilizar a chave 'documento' do mock
              onChange={() => { }}
              disabled
              className="w-full"
            />
          </div>
          <EyeAction onClick={onEyeClick} />
        </div>
      )}

    </div>
  );
};


// ==========================================================
// MOCK DE EXEMPLO (Substituir pela sua lista global se necessário)
// ==========================================================
export const PESSOAS_FISICAS_MOCK = [
  { id: 1, nome: "Josephina Arantes", documento: "444.009.956-40" },
  { id: 2, nome: "Pedro Alves Moraes", documento: "222.114.558-70" },
  { id: 3, nome: "Carla Menezes Rocha", documento: "111.998.775-30" },
];

interface PessoaFisicaInputProps {
  value: string;
  onChange: (entidade: any) => void;
  onEyeClick?: () => void;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  data?: any[];
}

export function PessoaFisicaInput({
  value,
  onChange,
  onEyeClick,
  required = false,
  disabled = false,
  error = false,
  data = PESSOAS_FISICAS_MOCK
}: PessoaFisicaInputProps) {

  // Encontra a entidade selecionada para exibir no campo reboque se necessário
  const entidadeSelecionada = data.find((x) => x.nome === value || x.documento === value);

  // Colunas fixas já parametrizadas para Pessoa Física (Nome e CPF)
  const colunasModal = [
    { label: "Nome", key: "nome" },
    { label: "CPF", key: "documento" }
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 💡 Grid Inteligente: Vira 2 colunas se tiver valor selecionado, senão fica 1 coluna full */}
      <div className={value && entidadeSelecionada ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full" : "w-full"}>

        {/* Coluna 1: Input de Busca com Modal Acoplado */}
        <div className="w-full">
          <EntitySearchInput
            label="Pessoa Física"
            placeholder="Buscar por nome ou CPF."
            required={required}
            disabled={disabled}

            error={error}
            value={entidadeSelecionada?.nome || ""} // Exibe o nome amigável no input principal
            data={data}

            // Configurações do Cabeçalho e comportamento do Modal
            title="Buscar Pessoa Física"
            subtitle="Busque por uma pessoa física cadstrada:"
            icon={<UserRound size={18} />}
            columns={colunasModal}
            searchKeys={["nome", "documento"]}
            searchPlaceholder="Buscar por nome ou CPF..."
            confirmLabel="Confirmar"

            onChange={onChange}
          />
        </div>

        {/* Coluna 2: Campo Extra reboque: CPF fixo (Apenas se houver seleção) */}
        {value && entidadeSelecionada && (
          <div className="flex items-center gap-2 animate-fadeIn w-full">
            <div className="flex-1">
              <FloatInput
                label="CPF"
                required={required}
                value={entidadeSelecionada.documento}
                onChange={() => { }}
                disabled
                className="w-full"
              />
            </div>
            <EyeAction onClick={onEyeClick} />
          </div>
        )}
      </div>
    </div>
  );
}



// ─── MOCK DE EXEMPLO ──────────────────────────────────────────────────────────
export const PESSOAS_JURIDICAS_MOCK = [
  { id: 1, nome: "Agropecuária Vale Verde Ltda", documento: "12.345.678/0001-90" },
  { id: 2, nome: "Nutrição Animal Planalto S.A.", documento: "98.765.432/0001-10" },
  { id: 3, nome: "Cooperativa de Produtores Unidos", documento: "55.444.333/0002-22" },
];

interface PessoaJuridicaInputProps {
  value: string;
  onChange: (entidade: any) => void;
  onEyeClick?: () => void;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  data?: any[];
}

export function PessoaJuridicaInput({
  value,
  onChange,
  onEyeClick,
  required = false,
  disabled = false,
  error = false,
  data = PESSOAS_JURIDICAS_MOCK,
}: PessoaJuridicaInputProps) {

  // Encontra a empresa selecionada para exibir no campo reboque
  const entidadeSelecionada = data.find(
    (x) => x.nome === value || x.documento === value
  );

  // Colunas parametrizadas para Pessoa Jurídica (Razão Social/Nome e CNPJ)
  const colunasModal = [
    { label: "Razão Social / Nome", key: "nome" },
    { label: "CNPJ", key: "documento" },
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 💡 Grid Inteligente: Vira 2 colunas se tiver valor selecionado, senão fica 1 coluna full */}
      <div
        className={
          value && entidadeSelecionada
            ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full"
            : "w-full"
        }
      >
        {/* Coluna 1: Input de Busca com Modal Acoplado */}
        <div className="w-full">
          <EntitySearchInput
            label="Pessoa Jurídica"
            placeholder="Buscar por nome ou CNPJ."
            required={required}
            disabled={disabled}
            error={error}
            value={entidadeSelecionada?.nome || ""} // Exibe o nome amigável no input principal
            data={data}

            // Configurações do Cabeçalho e comportamento do Modal
            title="Buscar Pessoa Jurídica"
            subtitle="Busque por uma pessoa jurídica cadastrada:"
            icon={
              Icons.iconeUnidadeAdministrativaUrl ? (
                <img src={Icons.iconePessoaJuridicaUrl} alt="Pessoa Juridica" className="w-5 h-5 object-contain" />
              ) : undefined
            }
            columns={colunasModal}
            searchKeys={["nome", "documento"]}
            searchPlaceholder="Buscar por razão social ou CNPJ..."
            confirmLabel="Confirmar"
            onChange={onChange}
          />
        </div>

        {/* Coluna 2: Campo Extra reboque: CNPJ fixo (Apenas se houver seleção) */}
        {value && entidadeSelecionada && (
          <div className="flex items-center gap-2 animate-fadeIn w-full">
            <div className="flex-1">
              <FloatInput
                label="CNPJ"
                required={required}
                value={entidadeSelecionada.documento}
                onChange={() => { }}
                disabled
                className="w-full"
              />
            </div>
            <EyeAction onClick={onEyeClick} />
          </div>
        )}
      </div>
    </div>
  );
}


// ==========================================================
// COMPONENTE DE BUSCA DE UNIDADE ADMINISTRATIVA (US064)
// ==========================================================
const UNIDADES_ADMINISTRATIVAS_DATA = [
  { id: 1, nome: "Coordenadoria Regional de Belo Horizonte" },
  { id: 2, nome: "Coordenadoria Regional de Lavras" },
  { id: 3, nome: "Coordenadoria Regional de Uberlândia" },
  { id: 4, nome: "Escritório Local de Juiz de Fora" },
];
export function UnidadeAdministrativaInput({ value, onChange, onEyeClick, required = false }: DomainInputProps) {

  // Procura a unidade selecionada pelo nome ou id para manter o estado síncrono
  const entidadeSelecionada = UNIDADES_ADMINISTRATIVAS_DATA.find(
    (x) => x.nome === value || String(x.id) === String(value)
  );

  // Colunas da tabela de listagem interna do modal (apenas o Nome)
  const colunasModal = [
    { label: "Nome da Unidade Administrativa", key: "nome" }
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 💡 Se houver valor selecionado, o grid ganha 2 colunas para acomodar o botão visualizador ao lado */}
      <div className={value ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full" : "w-full"}>

        {/* Usando o EntitySearchInput padrão do seu arquivo */}
        <EntitySearchInput
          label="Unidade Administrativa"
          placeholder="Buscar unidade administrativa."
          required={required}
          value={entidadeSelecionada?.nome || ""} // Nome amigável no input
          data={UNIDADES_ADMINISTRATIVAS_DATA}     // Base de dados mockada

          title="Buscar Unidade Administrativa"
          subtitle="Busque por uma unidade administrativa cadastrada no sistema:"
          icon={
            Icons.iconeUnidadeAdministrativaUrl ? (
              <img src={Icons.iconeUnidadeAdministrativaUrl} alt="Unidade" className="w-5 h-5 object-contain" />
            ) : undefined
          }
          columns={colunasModal}
          searchKeys={["nome"]}
          searchPlaceholder="Digite o nome para pesquisar..."
          confirmLabel="Confirmar"

          onChange={(unidadeSelecionada) => {
            // Retorna o objeto completo selecionado para a página
            onChange(unidadeSelecionada);
          }}
        />

        {/* Botão de visualização rápida em reboque (Lupa/Olho) se houver seleção */}
        {value && entidadeSelecionada && (
          <div className="flex items-center gap-2 animate-fadeIn w-full md:mt-6">
            <EyeAction onClick={onEyeClick} />
          </div>
        )}
      </div>
    </div>
  );
}



// ==========================================================
// MOCK DE RESPONSÁVEIS TÉCNICOS (Baseado no seu PROFISSIONAIS_MOCK)
// ==========================================================
export const RESPONSAVEIS_TECNICOS_MOCK = [
  { id: 1, nome: "José Teixeira Sabino", documento: "444.009.956-40", habilitadoGta: true },
  { id: 2, nome: "Marina Couto Dias", documento: "333.221.115-09", habilitadoGta: true },
  { id: 3, nome: "Carlos Henrique Reis", documento: "222.114.558-70", habilitadoGta: false },
];


interface ResponsavelTecnicoInputProps {
  value: string;
  onChange: (entidade: any) => void;
  onEyeClick?: () => void;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  data?: any[];
}

export const ResponsavelTecnicoInput: React.FC<ResponsavelTecnicoInputProps> = ({
  value,
  onChange,
  onEyeClick,
  error,
  disabled,
  required = false,
  data = RESPONSAVEIS_TECNICOS_MOCK,
}) => {

  // Encontra a entidade selecionada no array para capturar o Documento (CPF)
  const entidadeSelecionada = data.find((item) => item.nome === value);

  return (
    /* 💡 Grid Inteligente: Se houver valor selecionado, vira 2 colunas horizontais, senão fica 1 coluna full */
    <div className={`grid grid-cols-1 ${value && entidadeSelecionada ? "md:grid-cols-2" : "w-full"} gap-4 items-end w-full`}>

      {/* Coluna 1: Barra de Busca Principal */}
      <div className="w-full">
        <EntitySearchInput
          label="Responsável Técnico"
          placeholder="Buscar por nome ou CPF"
          required={required}
          disabled={disabled}
          value={value}
          data={data}
          searchKeys={["nome", "documento"]}
          columns={[
            { label: "Nome", key: "nome" },
            { label: "CPF", key: "documento" },
          ]}
          icon={<UserRoundCheck size={18} color={GREEN} className="mr-2 -ml-1 flex-shrink-0" />}
          title="Buscar Responsável Técnico"
          subtitle="Busque por um profissional responsável técnico cadastrado:"
          onChange={onChange}
          error={error}
        />
      </div>

      {/* Coluna 2: CPF do Responsável Técnico e Botão Olho alinhados lado a lado horizontalmente */}
      {value && entidadeSelecionada && (
        <div className="flex items-center gap-2 animate-fadeIn w-full">
          <div className="flex-1">
            <FloatInput
              label="CPF do Responsável"
              required={required}
              value={entidadeSelecionada.documento} // 💡 Mapeado para .documento conforme seu mock
              onChange={() => { }}
              disabled
              className="w-full"
            />
          </div>
          <EyeAction onClick={onEyeClick} />
        </div>
      )}

    </div>
  );
};




// ==========================================================
// MOCK DE CERTIFICADORAS SISBOV (Baseado no seu CERTIFICADORAS_MOCK)
// ==========================================================
export const CERTIFICADORAS_INPUT_MOCK = [
  { id: 1, nome: "Rastro de Boi", proprietario: "72.375.545/0001-93 - Rastro de Boi Certificação", responsavel: "555.009.956-40 - Gustavo de Souza Sobrinho", status: "Regular", municipio: "Lavras", uf: "MG", estado: "Minas Gerais", situacao: "Ativo" },
  { id: 2, nome: "Certificadora Condão", proprietario: "45.221.118/0001-40 - Rastreabilidade Sul Ltda.", responsavel: "333.221.115-09 - Marina Couto Dias", status: "Bloqueada", municipio: "Uberaba", uf: "MG", estado: "Minas Gerais", situacao: "Inativo" },
  { id: 3, nome: "Boi Certo Rastreamento", proprietario: "72.375.545/0001-93 - Rastro de Boi Certificação", responsavel: "555.009.956-40 - Gustavo de Souza Sobrinho", status: "Acesso regular via liminar", municipio: "Barretos", uf: "SP", estado: "São Paulo", situacao: "Ativo" },
];


interface CertificadoraInputProps {
  value: string;
  onChange: (entidade: any) => void;
  onEyeClick?: () => void;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  data?: any[];
}

export const CertificadoraInput: React.FC<CertificadoraInputProps> = ({
  value,
  onChange,
  onEyeClick,
  error,
  disabled,
  required = false,
  data = CERTIFICADORAS_INPUT_MOCK,
}) => {

  // Encontra a entidade selecionada no array para capturar as informações adicionais (ex: Proprietário ou Status)
  const entidadeSelecionada = data.find((item) => item.nome === value);

  return (
    /* 💡 Grid Inteligente: Se houver valor selecionado, vira 2 colunas horizontais, senão fica 1 coluna full */
    <div className={`grid grid-cols-1 ${value && entidadeSelecionada ? "md:grid-cols-2" : "w-full"} gap-4 items-end w-full`}>

      {/* Coluna 1: Barra de Busca Principal */}
      <div className="w-full">
        <EntitySearchInput
          label="Certificadora SISBOV"
          placeholder="Buscar por nome da certificadora"
          required={required}
          disabled={disabled}
          value={value}
          data={data}
          searchKeys={["nome", "proprietario"]}
          columns={[
            { label: "Nome", key: "nome" },

          ]}
          icon={
            Icons.iconeUnidadeAdministrativaUrl ? (
              <img src={Icons.iconeCertificadoraUrl} alt="Certificadora SISBOV" className="w-5 h-5 object-contain" />
            ) : undefined
          }
          title="Buscar Certificadora SISBOV"
          subtitle="Busque por uma certificadora cadastrada no sistema:"
          onChange={onChange}
          error={error}
        />
      </div>

      {/* Coluna 2: Informação complementar (Proprietário/CNPJ) e Botão Olho lado a lado */}
      {value && entidadeSelecionada && (
        <div className="flex items-center gap-2 animate-fadeIn w-full">

          <EyeAction onClick={onEyeClick} />
        </div>
      )}

    </div>
  );
};
