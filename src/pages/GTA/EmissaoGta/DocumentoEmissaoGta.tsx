import { ArrowLeft, Download } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import logoIma from "../../../imports/logo.png";
import {
  formatarDataGta,
  formatarMoedaGta,
  obterEmissaoGta,
  totalAnimaisGta,
  type DestinoGta,
  type EmissaoGta,
  type LocalGta,
} from "./emissaoGtaData";

const NUMEROS_EXTENSO: Record<number, string> = {
  0: "ZERO",
  1: "UM",
  2: "DOIS",
  3: "TRÊS",
  4: "QUATRO",
  5: "CINCO",
  6: "SEIS",
  7: "SETE",
  8: "OITO",
  9: "NOVE",
  10: "DEZ",
  11: "ONZE",
  12: "DOZE",
  13: "TREZE",
  14: "QUATORZE",
  15: "QUINZE",
  16: "DEZESSEIS",
  17: "DEZESSETE",
  18: "DEZOITO",
  19: "DEZENOVE",
  20: "VINTE",
};

function quantidadePorExtenso(valor: number) {
  return NUMEROS_EXTENSO[valor] ?? String(valor);
}

function moedaPorExtenso(valor: number) {
  const inteiro = Math.floor(valor);
  const centavos = Math.round((valor - inteiro) * 100);
  const reais = NUMEROS_EXTENSO[inteiro] ?? String(inteiro);
  const centavosTexto = NUMEROS_EXTENSO[centavos] ?? String(centavos);
  if (!centavos) return reais + (inteiro === 1 ? " REAL" : " REAIS");
  return (
    reais +
    (inteiro === 1 ? " REAL E " : " REAIS E ") +
    centavosTexto +
    (centavos === 1 ? " CENTAVO" : " CENTAVOS")
  );
}

function separarMunicipioUf(valor?: string) {
  const partes = (valor ?? "").split(" - ");
  return {
    municipio: partes[0] || "-",
    uf: partes[1] || "MG",
  };
}

function entidadeLocal(local: LocalGta) {
  return (
    local.estabelecimento ??
    local.frigorifico ??
    local.evento ??
    local.revendedora ??
    local.aeroporto ??
    null
  );
}

interface DadosLocalDocumento {
  documento: string;
  responsavel: string;
  estabelecimento: string;
  codigoEstabelecimento: string;
  codigoExploracao: string;
  codigoNucleo: string;
  nomeNucleo: string;
  municipio: string;
  uf: string;
}

function dadosLocal(local: LocalGta | DestinoGta): DadosLocalDocumento {
  const destino = "dentroEstado" in local ? local : null;
  if (destino?.dentroEstado === "Não") {
    const estabelecimento =
      destino.estabelecimentoExterno ||
      destino.frigorificoExterno ||
      destino.eventoExterno ||
      destino.revendedoraExterna ||
      destino.aeroportoExterno ||
      "-";
    return {
      documento: destino.documentoResponsavelExterno || "-",
      responsavel: destino.responsavelExterno || "-",
      estabelecimento,
      codigoEstabelecimento:
        destino.codigoEstabelecimentoExterno ||
        destino.codigoFrigorificoExterno ||
        destino.estabelecimentoEventoExterno ||
        destino.codigoRevendedoraExterna ||
        "-",
      codigoExploracao: destino.codigoExploracaoExterna || "-",
      codigoNucleo: destino.codigoNucleoExterno || "-",
      nomeNucleo: destino.nucleoExterno || "-",
      municipio: destino.municipio || "-",
      uf: destino.estado || "-",
    };
  }

  const entidade = entidadeLocal(local);
  const localidade = separarMunicipioUf(entidade?.municipio);
  return {
    documento: local.responsavel?.documento || "-",
    responsavel: local.responsavel?.nome || "-",
    estabelecimento: entidade?.nome || "-",
    codigoEstabelecimento: entidade?.codigo || "-",
    codigoExploracao: local.exploracao?.codigo || "-",
    codigoNucleo: local.nucleo?.codigo || "-",
    nomeNucleo: local.nucleo?.nome || "-",
    municipio: localidade.municipio,
    uf: localidade.uf,
  };
}

function bitQr(codigo: string, x: number, y: number) {
  const finder = (origemX: number, origemY: number) => {
    const dx = x - origemX;
    const dy = y - origemY;
    if (dx < 0 || dx > 6 || dy < 0 || dy > 6) return null;
    return (
      dx === 0 ||
      dx === 6 ||
      dy === 0 ||
      dy === 6 ||
      (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)
    );
  };
  const padrao =
    finder(0, 0) ??
    finder(14, 0) ??
    finder(0, 14);
  if (padrao !== null) return padrao;
  const caractere = codigo.charCodeAt((x * 7 + y * 11) % Math.max(codigo.length, 1)) || 31;
  return (caractere + x * 13 + y * 17 + x * y) % 5 < 2;
}

function QrDocumento({ codigo }: { codigo: string }) {
  return (
    <div
      aria-label="Código de autenticação visual"
      className="grid h-[116px] w-[116px] bg-white p-1"
      style={{ gridTemplateColumns: "repeat(21, minmax(0, 1fr))" }}
    >
      {Array.from({ length: 441 }, (_, index) => {
        const x = index % 21;
        const y = Math.floor(index / 21);
        return (
          <span
            key={index}
            className={bitQr(codigo, x, y) ? "bg-black" : "bg-white"}
          />
        );
      })}
    </div>
  );
}

function CodigoBarras({ codigo }: { codigo: string }) {
  return (
    <div className="flex h-12 items-stretch gap-px overflow-hidden bg-white px-2 py-1">
      {Array.from({ length: 95 }, (_, index) => {
        const caractere = codigo.charCodeAt(index % Math.max(codigo.length, 1)) || 31;
        const largura = ((caractere + index) % 3) + 1;
        return (
          <span
            key={index}
            className={index % 4 === 3 ? "bg-white" : "bg-black"}
            style={{ width: largura }}
          />
        );
      })}
    </div>
  );
}

function CampoLocal({
  titulo,
  dados,
}: {
  titulo: string;
  dados: DadosLocalDocumento;
}) {
  return (
    <section className="min-w-0 flex-1 border border-black p-1.5">
      <h3 className="text-[10px] font-bold">{titulo}:</h3>
      <p><strong>CPF/CNPJ:</strong> {dados.documento}</p>
      <p><strong>Nome:</strong> {dados.responsavel}</p>
      <p><strong>Estabelecimento:</strong> {dados.estabelecimento}</p>
      <div className="grid grid-cols-2 gap-x-2">
        <p><strong>Cód. Estabelecimento:</strong> {dados.codigoEstabelecimento}</p>
        <p><strong>Cód. Exploração:</strong> {dados.codigoExploracao}</p>
      </div>
      <p><strong>Cód. Núcleo:</strong> {dados.codigoNucleo}</p>
      <p><strong>Nome Núcleo:</strong> {dados.nomeNucleo}</p>
      <div className="flex justify-between gap-2">
        <p><strong>Município:</strong> {dados.municipio}</p>
        <p><strong>UF:</strong> {dados.uf}</p>
      </div>
    </section>
  );
}

const PRINT_CSS =
  "@media print {" +
  "@page { size: A4 portrait; margin: 0; }" +
  "body { background: white !important; }" +
  ".gta-print-hide { display: none !important; }" +
  "#documento-gta { width: 210mm !important; min-height: 297mm !important;" +
  "margin: 0 !important; box-shadow: none !important; border: 0 !important; }" +
  "}";

export function DocumentoEmissaoGtaPage({
  dados,
  onLogout,
  onNavigate,
}: {
  dados?: EmissaoGta | null;
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}) {
  const emissao = obterEmissaoGta(dados?.id) ?? dados ?? obterEmissaoGta(null);
  if (!emissao) return null;

  const procedencia = dadosLocal(emissao.procedencia);
  const destino = dadosLocal(emissao.destino);
  const faixas = emissao.faixasAnimais.filter((item) => item.animaisGta > 0);
  const total = totalAnimaisGta(emissao);
  const totalMachos = faixas
    .filter((item) => item.sexo === "Machos")
    .reduce((soma, item) => soma + item.animaisGta, 0);
  const totalFemeas = faixas
    .filter((item) => item.sexo === "Fêmeas")
    .reduce((soma, item) => soma + item.animaisGta, 0);
  const partesNumero = emissao.serieNumero.split("-").map((item) => item.trim());
  const uf = partesNumero[0] || "MG";
  const numero = partesNumero[1] || String(emissao.id).padStart(6, "0");
  const codigo =
    emissao.codigoAutenticidade ||
    "31" + String(emissao.id).padStart(8, "0") + emissao.dataEmissao.replace(/\D/g, "");
  const valorDocumento = emissao.motivoIsencaoTaxa ? 0 : emissao.valorGta;
  const especie = emissao.especie?.nome?.toUpperCase() || "ANIMAIS";

  const imprimir = () => {
    const tituloAnterior = document.title;
    document.title = "GTA_" + uf + "_" + numero;
    window.print();
    window.setTimeout(() => {
      document.title = tituloAnterior;
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#e7e8ea]">
      <style>{PRINT_CSS}</style>
      <div className="gta-print-hide">
        <Navbar
          onLogout={onLogout}
          onNavigate={onNavigate}
          currentScreen="emissao-gta"
          hideSearch
        />
        <div className="mx-auto w-[210mm] max-w-[calc(100%-2rem)] py-5">
          <button
            type="button"
            onClick={() => onNavigate("visualizar-emissao-gta", emissao)}
            className="flex items-center gap-1 text-sm font-semibold text-[#1A7A3C]"
          >
            <ArrowLeft size={15} /> Visualizar GTA
          </button>
          <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Documento da GTA</h1>
              <p className="text-xs text-gray-500">
                GTA emitida. Confira o documento e salve uma cópia em PDF.
              </p>
            </div>
            <button
              type="button"
              onClick={imprimir}
              className="flex h-10 items-center gap-2 rounded-md bg-[#1A7A3C] px-5 text-xs font-bold text-white hover:bg-[#15612F]"
            >
              <Download size={16} /> Baixar GTA
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto px-4 pb-10">
        <article
          id="documento-gta"
          className="relative mx-auto box-border min-h-[297mm] w-[210mm] overflow-hidden bg-white p-[7mm] font-sans text-[8.5px] leading-[1.35] text-black shadow-xl"
        >
          <div className="pointer-events-none absolute inset-0 z-0 flex -rotate-[35deg] items-center justify-center text-[54px] font-black text-gray-200/70">
            DOCUMENTO DE DEMONSTRAÇÃO
          </div>
          <div className="relative z-10">
            <header className="grid grid-cols-[1.25fr_2.2fr_1.1fr] border border-black">
              <div className="flex items-center justify-center border-r border-black p-2">
                <img src={logoIma} alt="Instituto Mineiro de Agropecuária" className="w-full" />
              </div>
              <div className="flex flex-col items-center justify-center border-r border-black p-2 text-center">
                <h2 className="text-[17px] font-black">GUIA DE TRÂNSITO ANIMAL (GTA)</h2>
                <p className="mt-1 text-[10px]">VÁLIDA EM TODO TERRITÓRIO NACIONAL</p>
              </div>
              <div className="grid grid-cols-3 text-center">
                {[
                  ["UF", uf],
                  ["Série", "R"],
                  ["Número", numero],
                ].map(([rotulo, valor], index) => (
                  <div key={rotulo} className={index < 2 ? "border-r border-black" : ""}>
                    <p className="py-2 text-[9px]">{rotulo}</p>
                    <p className="py-2 text-[13px]">{valor}</p>
                  </div>
                ))}
              </div>
            </header>

            <section className="mt-0.5 border border-black p-1">
              <h3 className="text-[9px]">Estratificação</h3>
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-dotted border-black">
                    <th className="px-2 py-0.5 font-normal">Espécie</th>
                    <th className="px-2 py-0.5 font-normal">Faixa etária</th>
                    <th className="px-2 py-0.5 font-normal">Sexo</th>
                    <th className="px-2 py-0.5 text-right font-normal">Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {(faixas.length ? faixas : [{
                    id: "vazio",
                    faixaEtaria: "-",
                    sexo: "Animais" as const,
                    existente: 0,
                    animaisGta: 0,
                  }]).map((faixa) => (
                    <tr key={faixa.id}>
                      <td className="px-2 py-0.5">{especie}</td>
                      <td className="px-2 py-0.5">{faixa.faixaEtaria}</td>
                      <td className="px-2 py-0.5">
                        {faixa.sexo === "Fêmeas"
                          ? "Fêmea"
                          : faixa.sexo === "Machos"
                            ? "Macho"
                            : "Animais"}
                      </td>
                      <td className="px-2 py-0.5 text-right">{faixa.animaisGta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-1 grid grid-cols-3 border-t border-dotted border-black pt-1 text-center">
                <span>Total Macho: <strong>{totalMachos}</strong></span>
                <span>Total Fêmea: <strong>{totalFemeas}</strong></span>
                <span>Total de Animais: <strong>{total}</strong></span>
              </div>
            </section>

            <div className="mt-0.5 border border-black px-1.5 py-0.5 text-[11px]">
              {quantidadePorExtenso(total)} {especie}(S)
            </div>

            <div className="mt-0.5 flex">
              <CampoLocal titulo="PROCEDÊNCIA" dados={procedencia} />
              <CampoLocal titulo="DESTINO" dados={destino} />
            </div>

            <div className="mt-0.5 grid grid-cols-[1.35fr_1.15fr_.65fr] border border-black px-1.5 py-1 text-[9px]">
              <p><strong>FINALIDADE:</strong> {emissao.finalidade?.nome?.toUpperCase() || "-"}</p>
              <p><strong>MEIO DE TRANSPORTE:</strong> {emissao.meiosTransporte.join(", ").toUpperCase() || "-"}</p>
              <p><strong>PLACA VEÍCULO:</strong> -</p>
            </div>

            <section className="mt-0.5 min-h-[55px] border border-black p-1.5">
              <h3 className="text-[9px] font-bold">CERTIFICADOS:</h3>
              {emissao.atestadosExame.length ? (
                emissao.atestadosExame.map((atestado) => (
                  <div key={atestado.id} className="grid grid-cols-[1fr_1fr] gap-2">
                    <p><strong>Tipo:</strong> {atestado.tipo?.nome || "-"}</p>
                    <p><strong>Número/Arquivo:</strong> {atestado.arquivo || "-"}</p>
                  </div>
                ))
              ) : (
                <>
                  <p><strong>Tipo:</strong> Atestado sanitário</p>
                  <p><strong>Número/Arquivo:</strong> {emissao.atestadoSanitario || "-"}</p>
                </>
              )}
            </section>

            <section className="mt-0.5 border border-black p-1.5">
              <h3 className="text-[9px] font-bold">VACINAS:</h3>
              <div className="mt-1 grid grid-cols-3 gap-3">
                <div>
                  <p>Data Vacinação (1ª Etapa de Febre Aftosa)</p>
                  <p className="mt-2">{formatarDataGta(emissao.dataRaivaPrimeiraEtapa)}</p>
                </div>
                <div>
                  <p>Data Vacinação (2ª Etapa de Febre Aftosa)</p>
                  <p className="mt-2">{formatarDataGta(emissao.dataRaivaSegundaEtapa)}</p>
                </div>
                <div>
                  <p>Data de Vacinação de Brucelose</p>
                  <p className="mt-2">{formatarDataGta(emissao.dataBrucelose)}</p>
                </div>
              </div>
            </section>

            <section className="mt-0.5 grid min-h-[175px] grid-cols-[1fr_135px] border border-black">
              <div className="border-r border-black p-1.5">
                <h3 className="text-[9px] font-bold">OBSERVAÇÕES:</h3>
                <p className="mt-1 whitespace-pre-wrap">{emissao.observacoes || "-"}</p>
                {emissao.justificativaValidade && (
                  <p className="mt-2">
                    <strong>Justificativa da validade:</strong> {emissao.justificativaValidade}
                  </p>
                )}
                {emissao.motivoIsencaoTaxa && (
                  <p className="mt-2">
                    <strong>Isenção:</strong> {emissao.motivoIsencaoTaxa.nome}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-center">
                <QrDocumento codigo={codigo} />
              </div>
            </section>

            <div className="mt-0.5 grid grid-cols-2">
              <section className="min-h-[58px] border border-black p-1.5">
                <h3 className="text-[9px] font-bold">EMITENTE:</h3>
                <p className="mt-3 text-center">Médico Veterinário</p>
              </section>
              <section className="min-h-[58px] border border-black p-1.5">
                <h3 className="text-[9px] font-bold">EMISSÃO:</h3>
                <div className="mt-1 grid grid-cols-2 gap-x-2">
                  <p><strong>Local:</strong> MINAS GERAIS</p>
                  <p><strong>Fone:</strong> -</p>
                  <p><strong>Data:</strong> {formatarDataGta(emissao.dataEmissao)}</p>
                  <p><strong>Hora:</strong> {emissao.horaEmissao || "-"}</p>
                  <p className="col-span-2"><strong>Validade:</strong> {formatarDataGta(emissao.dataValidade)}</p>
                </div>
              </section>
            </div>

            <div className="mt-0.5 grid grid-cols-2">
              <section className="min-h-[76px] border border-black p-1.5">
                <h3 className="text-[9px] font-bold">IDENTIFICAÇÃO DO EMITENTE:</h3>
                <div className="mx-auto mt-8 w-4/5 border-t border-black pt-1 text-center">
                  USUÁRIO DO SISTEMA SIDAGRO
                </div>
                <p className="mt-1 text-center">Médico Veterinário</p>
              </section>
              <section className="border border-black">
                <CodigoBarras codigo={codigo} />
                <p className="border-t border-black py-1 text-center text-[10px] tracking-wider">
                  {codigo}
                </p>
              </section>
            </div>

            <div className="mt-0.5 grid grid-cols-[1fr_1fr] border border-black px-1.5 py-1">
              <p className="text-[11px]">
                VALOR DO DOCUMENTO: ({formatarMoedaGta(valorDocumento)})
              </p>
              <p className="self-center text-center text-[7px]">
                {moedaPorExtenso(valorDocumento)}
              </p>
            </div>

            <footer className="px-0.5 pt-1 text-[7.5px] leading-tight">
              <p>GTA eletrônica, em atendimento à Instrução Normativa Nº 19 de 2011 e Nº 35 de 2014.</p>
              <p>Documento demonstrativo gerado pelo protótipo Sidagro.</p>
              <p>
                Documento emitido eletronicamente em {formatarDataGta(emissao.dataEmissao)},
                às {emissao.horaEmissao || "-"}.
              </p>
            </footer>
          </div>
        </article>
      </div>
    </div>
  );
}
