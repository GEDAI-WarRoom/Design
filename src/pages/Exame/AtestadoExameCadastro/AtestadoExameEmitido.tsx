import { useState } from "react";
import { Download, X } from "lucide-react";
import logoImaUrl from "../../../imports/logo.png";
import { type AtestadoExameCadastro } from "./atestadoExameCadastroData";

function dataBr(data?: string) {
  if (!data) return "—";
  const [ano, mes, dia] = data.split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : data;
}

function adicionarDias(data: string, dias: number) {
  if (!data) return "";
  const valor = new Date(`${data}T12:00:00`);
  valor.setDate(valor.getDate() + dias);
  return valor.toISOString().slice(0, 10);
}

function resultadoPorDoenca(resultados: Record<string, string>, doenca: string) {
  const termos = doenca === "Brucelose" ? ["antígeno", "brucel"] : ["tuberculina", "tubercul"];
  return Object.entries(resultados)
    .filter(([tipo]) => termos.some((termo) => tipo.toLocaleLowerCase("pt-BR").includes(termo)))
    .map(([, resultado]) => resultado)
    .filter(Boolean)
    .join(" / ") || "—";
}

function LinhaInfo({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex min-h-7 items-end gap-1 border-b border-black px-1 pb-0.5">
      <span className="whitespace-nowrap text-[9px] font-bold uppercase text-black">{label}:</span>
      <span className="min-w-0 flex-1 text-[10px] text-black">{value || "—"}</span>
    </div>
  );
}

export function AtestadoExameEmitido({ value }: { value: AtestadoExameCadastro }) {
  const [modalAberto, setModalAberto] = useState(false);
  const municipio = value.estabelecimento?.municipio ?? "";
  const [cidade, uf] = municipio.split(" - ");
  const validade = adicionarDias(value.dataEmissao, value.tipoAtestado?.diasValidade ?? 60);

  const baixar = () => {
    const tituloAnterior = document.title;
    document.title = `Atestado-${value.numero.replaceAll("/", "-") || "exame"}`;
    window.print();
    window.setTimeout(() => { document.title = tituloAnterior; }, 500);
  };

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 8mm; }
          body * { visibility: hidden !important; }
          #atestado-exame-emitido, #atestado-exame-emitido * { visibility: visible !important; }
          #atestado-exame-emitido { position: absolute !important; inset: 0 auto auto 0 !important; width: 194mm !important; margin: 0 !important; box-shadow: none !important; border: 0 !important; }
          .nao-imprimir { display: none !important; }
        }
      `}</style>
      <button type="button" onClick={() => setModalAberto(true)} className="nao-imprimir flex h-10 items-center gap-2 rounded-md border border-[#1A7A3C] px-4 text-xs font-bold text-[#1A7A3C] hover:bg-green-50">
        <Download size={16} /> Baixar Atestado
      </button>

      {modalAberto && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={() => setModalAberto(false)}>
          <div className="flex max-h-[94vh] w-full max-w-[940px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="nao-imprimir flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-gray-800">Atestado de realização de exames</h2>
                <p className="mt-0.5 text-xs text-gray-500">Confira o documento antes de salvar em PDF.</p>
              </div>
              <button type="button" onClick={() => setModalAberto(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Fechar atestado">
                <X size={19} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-gray-200 p-5">
      <article id="atestado-exame-emitido" className="mx-auto w-[794px] border border-black bg-white p-6 font-['Times_New_Roman'] text-black shadow-md">
        <header className="grid grid-cols-[120px_1fr_92px] items-center gap-3 border-b border-black pb-2">
          <img src={logoImaUrl} alt="Instituto Mineiro de Agropecuária" className="h-auto w-[115px]" />
          <div className="text-center">
            <h1 className="text-[13px] font-bold leading-tight">ATESTADO DE REALIZAÇÃO DE EXAMES DE<br />BRUCELOSE E/OU TUBERCULOSE</h1>
            <p className="mt-1 text-[8px]">(Adaptação modelo anexo III, IN n.º 30/2006, Coordenação PNCEBT/GDA/IMA)</p>
          </div>
          <div className="border border-black p-2 text-center">
            <p className="text-[8px] font-bold uppercase">Nº do atestado</p>
            <p className="mt-1 text-[10px] font-bold">{value.numero || "—"}</p>
          </div>
        </header>

        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5">
          <LinhaInfo label="Proprietário" value={value.produtor?.nome} />
          <LinhaInfo label="Código proprietário no IMA" value={value.produtor?.documento} />
          <LinhaInfo label="Inscr. Estadual" value="—" />
          <LinhaInfo label="CPF/CNPJ" value={value.produtor?.documento} />
          <LinhaInfo label="Propriedade" value={value.estabelecimento?.nome} />
          <LinhaInfo label="Cód. propriedade no IMA" value={value.estabelecimento?.codigo} />
          <LinhaInfo label="Município" value={cidade || municipio} />
          <LinhaInfo label="Estado" value={uf} />
          <LinhaInfo label="Certificado de propriedade livre" value={value.certificadoPropriedadeLivre} />
          <LinhaInfo label="Regime de criação" value="—" />
          <LinhaInfo label="Espécie animal" value={value.exploracao?.especie} />
          <LinhaInfo label="Total de animais examinados" value={value.animais.length} />
        </div>

        <div className="mt-2 border border-black p-1.5 text-[8px]">
          <span className="font-bold">Motivo do teste: </span>
          {["Trânsito", "Aglomeração", "Certificação de propriedade livre", "Teste confirmatório (para tuberculose)", "Outro"].map((motivo) => (
            <span key={motivo} className="mr-3 whitespace-nowrap">{value.motivoExame === motivo ? "☒" : "☐"} {motivo}{motivo === "Outro" && value.outroMotivo ? `: ${value.outroMotivo}` : ""}</span>
          ))}
        </div>

        <section className="mt-2 border border-black">
          <h2 className="border-b border-black px-2 py-1 text-center text-[9px] font-bold uppercase">Dados dos exames</h2>
          <div className="grid grid-cols-2 gap-x-4 p-2">
            <div>
              <p className="mb-1 text-[9px] font-bold uppercase">Brucelose</p>
              <LinhaInfo label="Nº de testes" value={value.numeroTestesBrucelose} />
              <LinhaInfo label="Data da colheita" value={dataBr(value.dataColheita)} />
              <LinhaInfo label="Data do teste" value={dataBr(value.dataTeste)} />
            </div>
            <div>
              <p className="mb-1 text-[9px] font-bold uppercase">Tuberculose</p>
              <LinhaInfo label="Nº de testes" value={value.numeroTestesTuberculose} />
              <LinhaInfo label="Data de inoculação" value={dataBr(value.dataInoculacao)} />
              <LinhaInfo label="Data de leitura" value={dataBr(value.dataLeitura)} />
            </div>
          </div>
        </section>

        <section className="mt-3">
          <h2 className="border border-black px-2 py-1 text-center text-[9px] font-bold uppercase">Insumos utilizados</h2>
          <table className="w-full table-fixed border-collapse text-[8px]">
            <thead><tr><th className="border border-black p-1">Insumo</th><th className="border border-black p-1">Partida</th><th className="border border-black p-1">Validade</th><th className="border border-black p-1">Doses adquiridas</th></tr></thead>
            <tbody>
              {value.lotes.map((lote) => <tr key={lote.id}><td className="border border-black p-1">{lote.tipoInsumo}</td><td className="border border-black p-1 text-center">{lote.codigo}</td><td className="border border-black p-1 text-center">{dataBr(lote.validade)}</td><td className="border border-black p-1 text-center">{lote.quantidadeAdquirida ?? 0}</td></tr>)}
              {!value.lotes.length && <tr><td colSpan={4} className="border border-black p-2 text-center">—</td></tr>}
            </tbody>
          </table>
        </section>

        <section className="mt-3">
          <h2 className="border border-black px-2 py-1 text-center text-[9px] font-bold uppercase">Animais examinados</h2>
          <table className="w-full table-fixed border-collapse text-[7px]">
            <thead><tr><th className="w-[20%] border border-black p-1">Número de identificação individual do animal</th><th className="w-[8%] border border-black p-1">Sexo</th><th className="w-[15%] border border-black p-1">Idade (categoria ou em meses)</th><th className="w-[14%] border border-black p-1">Resultado brucelose</th><th className="w-[14%] border border-black p-1">Resultado tuberculose</th><th className="border border-black p-1">Destino dos reagentes</th></tr></thead>
            <tbody>{value.animais.map((animal) => <tr key={animal.id}><td className="border border-black p-1">{animal.identificacao || "—"}</td><td className="border border-black p-1 text-center">{animal.sexo || "—"}</td><td className="border border-black p-1">{animal.faixaEtaria || "—"}</td><td className="border border-black p-1 text-center">{resultadoPorDoenca(animal.resultados, "Brucelose")}</td><td className="border border-black p-1 text-center">{resultadoPorDoenca(animal.resultados, "Tuberculose")}</td><td className="border border-black p-1">{animal.destinoReagentes || "—"}</td></tr>)}</tbody>
          </table>
          <p className="mt-1 text-[7px]">TCS¹ – Teste cervical simples &nbsp;&nbsp; TCC² – Teste cervical comparativo &nbsp;&nbsp; TPC³ – Teste da prega caudal</p>
        </section>

        <footer className="mt-5 grid grid-cols-2 gap-8 text-[9px]">
          <div>
            <LinhaInfo label="Local e data de emissão" value={`${cidade || municipio || "—"}, ${dataBr(value.dataEmissao)}`} />
            <LinhaInfo label="Exame válido até" value={dataBr(validade)} />
          </div>
          <div className="pt-7 text-center">
            <div className="border-t border-black pt-1">Assinatura e carimbo do médico veterinário habilitado</div>
            <p className="mt-1 font-bold">{value.veterinario?.nome || "—"}</p>
            <p>CRMV MG nº __________ &nbsp; Habilitação PNCEBT/MG nº __________</p>
          </div>
        </footer>

        <p className="mt-4 border-t border-black pt-1 text-justify text-[7px]">
          *Modelo proposto pela Coordenação do PNCEBT MG (SISA-MG e GDA-IMA), adaptado do anexo III, IN n.º 30/2006; atualização 2023.
        </p>
      </article>
            </div>
            <div className="nao-imprimir flex shrink-0 justify-end gap-3 border-t border-gray-200 px-5 py-4">
              <button type="button" onClick={() => setModalAberto(false)} className="h-10 rounded-md border border-gray-300 px-5 text-xs font-bold text-gray-600 hover:bg-gray-50">
                Fechar
              </button>
              <button type="button" onClick={baixar} className="flex h-10 items-center gap-2 rounded-md bg-[#1A7A3C] px-5 text-xs font-bold text-white hover:bg-[#15612F]">
                <Download size={16} /> Salvar em PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
