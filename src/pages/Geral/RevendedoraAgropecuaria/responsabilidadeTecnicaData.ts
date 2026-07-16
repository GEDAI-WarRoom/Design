export interface ResponsabilidadeTecnica {
  id: string;
  profissionalCpf: string;
  profissionalNome: string;
  entidadeTipo: string;
  entidadeCodigo: string;
  entidadeNome: string;
  dataArt: string;
  arquivoArt: string;
  situacao: "Ativo" | "Inativo";
  atualizadoEm: string;
}

let responsabilidades: ResponsabilidadeTecnica[] = [
  {
    id: "revendedora-1-prof-1",
    profissionalCpf: "129.555.656-99",
    profissionalNome: "Messias Araujo",
    entidadeTipo: "Revendedora de Produtos Agropecuários",
    entidadeCodigo: "3100000001",
    entidadeNome: "Revendedora São José",
    dataArt: "2025-11-15",
    arquivoArt: "art-messias.pdf",
    situacao: "Ativo",
    atualizadoEm: "2026-07-10",
  },
];

export function getResponsabilidadesTecnicas(cpf: string) {
  return responsabilidades.filter((item) => item.profissionalCpf === cpf).map((item) => ({ ...item }));
}

export function salvarResponsabilidadeTecnica(item: ResponsabilidadeTecnica) {
  responsabilidades = responsabilidades.some((registro) => registro.id === item.id)
    ? responsabilidades.map((registro) => registro.id === item.id ? item : registro)
    : [...responsabilidades, item];
  return item;
}
