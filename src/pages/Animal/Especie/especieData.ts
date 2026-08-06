import {
  listarColecaoMock,
  proximoIdNumerico,
  salvarColecaoMock,
} from "../../../mocks/mockDatabase";

export type RespostaSimNao = "Sim" | "Não";

export interface Especie {
  id: number;
  codigo: string;
  nome: string;
  nomeCientifico: string;
  codigoMapa: string;
  grupo: string;
  maxAnimaisGta: string;
  controleRebanhoNucleo: RespostaSimNao;
  sexoDefinido: RespostaSimNao;
  emissaoGtaHabilitado: RespostaSimNao;
  utilizaFormularioGta: RespostaSimNao;
  faixasEtarias: string[];
  situacao: "Ativo" | "Inativo";
}

const COLECAO = "especies";

const ESPECIES_INICIAIS: Especie[] = [
  { id: 1, codigo: "ESP-001", nome: "Bovino", nomeCientifico: "Bos taurus", codigoMapa: "1.1", grupo: "Bovídeos", maxAnimaisGta: "500", controleRebanhoNucleo: "Não", sexoDefinido: "Sim", emissaoGtaHabilitado: "Sim", utilizaFormularioGta: "Não", faixasEtarias: ["De 0 a 12 meses", "De 13 a 24 meses", "Acima de 24 meses"], situacao: "Ativo" },
  { id: 2, codigo: "ESP-002", nome: "Bubalino", nomeCientifico: "Bubalus bubalis", codigoMapa: "1.2", grupo: "Bovídeos", maxAnimaisGta: "500", controleRebanhoNucleo: "Não", sexoDefinido: "Sim", emissaoGtaHabilitado: "Sim", utilizaFormularioGta: "Não", faixasEtarias: ["De 0 a 12 meses", "Acima de 12 meses"], situacao: "Ativo" },
  { id: 3, codigo: "ESP-003", nome: "Equino", nomeCientifico: "Equus caballus", codigoMapa: "3.1", grupo: "Equídeos", maxAnimaisGta: "100", controleRebanhoNucleo: "Não", sexoDefinido: "Sim", emissaoGtaHabilitado: "Sim", utilizaFormularioGta: "Não", faixasEtarias: ["De 0 a 12 meses", "Acima de 12 meses"], situacao: "Ativo" },
  { id: 4, codigo: "ESP-004", nome: "Suíno", nomeCientifico: "Sus scrofa domesticus", codigoMapa: "2.1", grupo: "Suídeos", maxAnimaisGta: "200", controleRebanhoNucleo: "Sim", sexoDefinido: "Sim", emissaoGtaHabilitado: "Sim", utilizaFormularioGta: "Não", faixasEtarias: ["Leitões", "Recria", "Adultos"], situacao: "Ativo" },
  { id: 5, codigo: "ESP-005", nome: "Galinha", nomeCientifico: "Gallus gallus domesticus", codigoMapa: "5.1", grupo: "Aves", maxAnimaisGta: "10000", controleRebanhoNucleo: "Sim", sexoDefinido: "Sim", emissaoGtaHabilitado: "Sim", utilizaFormularioGta: "Não", faixasEtarias: ["Pintos de 1 dia", "Jovens", "Adultas"], situacao: "Ativo" },
  { id: 6, codigo: "ESP-006", nome: "Abelha com Ferrão", nomeCientifico: "Apis mellifera", codigoMapa: "6.1", grupo: "Abelhas", maxAnimaisGta: "", controleRebanhoNucleo: "Sim", sexoDefinido: "Não", emissaoGtaHabilitado: "Sim", utilizaFormularioGta: "Não", faixasEtarias: ["Colmeias"], situacao: "Ativo" },
  { id: 7, codigo: "ESP-007", nome: "Tilápia", nomeCientifico: "Oreochromis niloticus", codigoMapa: "7.1", grupo: "Peixes", maxAnimaisGta: "", controleRebanhoNucleo: "Não", sexoDefinido: "Não", emissaoGtaHabilitado: "Sim", utilizaFormularioGta: "Não", faixasEtarias: ["Animais"], situacao: "Ativo" },
];

export function listarEspecies() {
  return listarColecaoMock(COLECAO, ESPECIES_INICIAIS);
}

export function obterEspecie(id?: number | null) {
  const especies = listarEspecies();
  if (id == null) return especies[0] ?? null;
  return especies.find((item) => item.id === id) ?? null;
}

export function salvarEspecie(dados: Omit<Especie, "id" | "codigo"> & { id?: number; codigo?: string }) {
  const atuais = listarEspecies();
  const id = dados.id ?? proximoIdNumerico(atuais);
  const especie: Especie = {
    ...dados,
    id,
    codigo: dados.codigo ?? `ESP-${String(id).padStart(3, "0")}`,
  };
  salvarColecaoMock(
    COLECAO,
    atuais.some((item) => item.id === id)
      ? atuais.map((item) => (item.id === id ? especie : item))
      : [especie, ...atuais],
  );
  return especie;
}

export function listarEspeciesParaGta() {
  return listarEspecies()
    .filter((item) => item.situacao === "Ativo")
    .map((item) => ({
      id: item.id,
      codigo: item.codigo,
      nome: item.nome,
      grupo: item.grupo,
      possuiSexoDefinido: item.sexoDefinido === "Sim",
      possuiNucleo: item.controleRebanhoNucleo === "Sim",
      faixasEtarias: item.faixasEtarias,
    }));
}
