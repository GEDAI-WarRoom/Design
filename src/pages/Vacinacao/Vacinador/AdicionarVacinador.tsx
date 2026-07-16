import React, { useState } from "react";
import { ArrowLeft, Check, User, FileText, Briefcase } from "lucide-react";
import { FloatInput, FloatSelect, SimNao, CheckboxGroup } from "../../../components/ui/FormKit";
import { EntitySearchInput, DynamicListWrapper } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";


const GREEN = "#1A7A3C";

// Mocks de dados exigidos pelas especificações da US069
const PROFISSIONAIS_RESPONSAVEIS_MOCK = [
  { id: 1, nome: "Dr. Roberto Silva (CRV-MG 1234)", uf: "MG" },
  { id: 2, nome: "Dra. Maria Carmo (CRV-MG 5678)", uf: "MG" },
];

const AUXILIARES_MOCK = [
  { id: 1, cpf: "111.222.333-44", nome: "Carlos Andrade" },
  { id: 2, cpf: "555.666.777-88", nome: "Pedro Souza" },
];

export  function AdicionarVacinadorPage({ onNavigate }: { onNavigate: (tela: string) => void }) {
  // --- Estados do Formulário ---
  const [vinculo, setVinculo] = useState<"Produtor" | "Veterinário Cadastrado" | "Auxiliar" | "">("");
  const [aderidoPasa, setAderidoPasa] = useState<"Sim" | "Não" | "">("");
  const [profissionalResponsavel, setProfissionalResponsavel] = useState<any>(null);
  
  // Dados do Vacinador (Carregados via EntitySearch se for Produtor/Auxiliar ou digitados)
  const [vacinadorSelecionado, setVacinadorSelecionado] = useState<any>(null);
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  
  // Lista Dinâmica de Auxiliares (Apenas se o Vínculo for Veterinário Cadastrado)
  const [auxiliares, setAuxiliares] = useState<Array<{ uid: string; profissional: any }>>([]);

  const [isSucesso, setIsSucesso] = useState(false);

  // --- Funções Auxiliares de Modificação da Lista ---
  const addAuxiliar = () => {
    setAuxiliares([...auxiliares, { uid: crypto.randomUUID(), profissional: null }]);
  };

  const removeAuxiliar = (uid: string) => {
    setAuxiliares(auxiliares.filter((item) => item.uid !== uid));
  };

  const patchAuxiliar = (uid: string, changes: any) => {
    setAuxiliares(auxiliares.map((item) => (item.uid === uid ? { ...item, ...changes } : item)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de validação e salvamento...
    setIsSucesso(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-900">
      {/* Header Padrão */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => onNavigate("vacinador-listagem")}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Brucelose</span>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Adicionar Vacinador</h1>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 lg:p-8 flex flex-col gap-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col gap-6 p-6">
          
          {/* Seção 1: Dados do Vínculo */}
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
              <Briefcase size={18} className="text-[#1A7A3C]" /> Dados do Vínculo
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FloatSelect
                label="Tipo de Vínculo"
                required
                value={vinculo}
                onChange={(v: string) => {
                  setVinculo(v as any);
                  setVacinadorSelecionado(null);
                  setCpf("");
                  setNome("");
                  if (v !== "Veterinário Cadastrado") setAuxiliares([]);
                }}
                options={[
                  { value: "Produtor", label: "Produtor" },
                  { value: "Veterinário Cadastrado", label: "Veterinário Cadastrado" },
                  { value: "Auxiliar", label: "Auxiliar" }
                ]}
              />

              <SimNao
                label="É Aderido ao PASA?"
                required
                name="aderidoPasa"
                value={aderidoPasa}
                onChange={(bool: boolean) => setAderidoPasa(bool ? "Sim" : "Não")}
              />
            </div>

            {/* Condicional: Profissional Responsável (Apenas se aderido ao PASA ou se for Auxiliar) */}
            {(aderidoPasa === "Sim" || vinculo === "Auxiliar") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <EntitySearchInput
                  label="Profissional Responsável"
                  required
                  placeholder="Buscar profissional."
                  value={profissionalResponsavel ? profissionalResponsavel.nome : ""}
                  data={PROFISSIONAIS_RESPONSAVEIS_MOCK}
                  searchKeys={["nome"]}
                  columns={[{ label: "Nome do Profissional", key: "nome" }]}
                   icon={<img src={Icons.iconeProfissionalAnimalUrl} alt="Médico Veterinário" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}              
                  title="Selecionar Profissional Responsável"
                  subtitle="Busque pelo profissional habilitado:"
                  onChange={(ent: any) => setProfissionalResponsavel(ent)}
                />
              </div>
            )}
          </div>

          {/* Seção 2: Identificação do Vacinador */}
          <div className="flex flex-col gap-4 border-t border-gray-100 pt-4">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
              <User size={18} className="text-[#1A7A3C]" /> Identificação do Vacinador
            </h2>

            {/* Se o vínculo for Produtor ou Auxiliar, busca de entidade cadastrada */}
            {(vinculo === "Produtor" || vinculo === "Auxiliar") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EntitySearchInput
                  label={vinculo === "Produtor" ? "Buscar Produtor" : "Buscar Auxiliar"}
                  required
                  placeholder="Digite o nome ou CPF..."
                  value={vacinadorSelecionado ? vacinadorSelecionado.nome : ""}
                  data={AUXILIARES_MOCK}
                  searchKeys={["nome", "cpf"]}
                  columns={[
                    { label: "CPF", key: "cpf" },
                    { label: "Nome", key: "nome" }
                  ]}
                  icon={<User size={18} color={GREEN} />}
                  title={`Selecionar ${vinculo}`}
                  subtitle={`Busque por um ${vinculo?.toLowerCase()} ativo:`}
                  onChange={(ent: any) => {
                    setVacinadorSelecionado(ent);
                    setCpf(ent?.cpf || "");
                    setNome(ent?.nome || "");
                  }}
                />
              </div>
            )}

            {/* Campos de leitura/escrita baseados na seleção */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FloatInput
                label="CPF"
                required
                disabled={vinculo === "Produtor" || vinculo === "Auxiliar"}
                value={cpf}
                onChange={(v) => setCpf(v)}
                mask="999.999.999-99"
              />
              <FloatInput
                label="Nome Completo"
                required
                disabled={vinculo === "Produtor" || vinculo === "Auxiliar"}
                value={nome}
                onChange={(v) => setNome(v)}
                maxLength={255}
              />
            </div>
          </div>

          {/* Seção Condicional 3: Vínculo de Auxiliares (Apenas para Veterinário Cadastrado) */}
          {vinculo === "Veterinário Cadastrado" && (
            <div className="flex flex-col gap-4 border-t border-gray-100 pt-4">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
                <FileText size={18} className="text-[#1A7A3C]" /> Auxiliares Vinculados
              </h2>

              <DynamicListWrapper
                items={auxiliares}
                behavior="optional"
                addButtonLabel="Vincular Auxiliar"
                itemLabel="Auxiliar"
                onAddItem={addAuxiliar}
                onRemoveItem={(index: number) => {
                  const target = auxiliares[index];
                  if (target) removeAuxiliar(target.uid);
                }}
                showCounter={true}
              >
                {(item: any) => (
                  <div className="w-full mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <EntitySearchInput
                        label="Selecionar Auxiliar"
                        required
                        placeholder="Buscar por nome ou CPF..."
                        value={item.profissional ? item.profissional.nome : ""}
                        data={AUXILIARES_MOCK}
                        searchKeys={["nome", "cpf"]}
                        columns={[
                          { label: "CPF", key: "cpf" },
                          { label: "Nome", key: "nome" }
                        ]}
                        icon={<User size={18} color={GREEN} />}
                        title="Vincular Auxiliar"
                        subtitle="Busque por um auxiliar habilitado:"
                        onChange={(ent: any) => patchAuxiliar(item.uid, { profissional: ent })}
                      />
                    </div>
                  </div>
                )}
              </DynamicListWrapper>
            </div>
          )}

          {/* Barra de Ações Inferior */}
          <div className="flex justify-end items-center gap-3 border-t border-gray-100 pt-4 mt-4">
            <button
              type="button"
              onClick={() => onNavigate("vacinador-listagem")}
              className="h-11 px-5 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-11 px-6 rounded-md text-sm font-semibold text-white hover:bg-opacity-90 transition shadow-sm"
              style={{ backgroundColor: GREEN }}
            >
              Salvar Vacinador
            </button>
          </div>
        </form>
      </main>

      {/* Modal de Sucesso Customizado (Igual ao AdicionarVenda) */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Vacinador salvo com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">
              O registro do vacinador contra brucelose foi inserido no sistema.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button 
                onClick={() => { setIsSucesso(false); onNavigate("vacinador-listagem"); }} 
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Ir para Listagem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}