import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  FileText,
  QrCode,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  PassaporteEquestreRegistro,
  confirmarPagamentoPassaporte,
  listarPassaportesEquestres,
  obterPassaporteEquestre,
} from "./passaporteEquestreData";

const GREEN = "#1A7A3C";
const VALOR_TAXA_PARAMETRIZADO = "R$ 150,00";

interface PageProps {
  onLogout?: () => void;
  onNavigate: (screen: string, data?: any) => void;
  dados?: Partial<PassaporteEquestreRegistro>;
}

export function PagamentoPassaporteEquestrePage({
  onLogout,
  onNavigate,
  dados,
}: PageProps) {
  const registro =
    (dados?.id ? obterPassaporteEquestre(dados.id) : undefined) ??
    (dados as PassaporteEquestreRegistro | undefined) ??
    listarPassaportesEquestres()[0];
  const [pixCopiado, setPixCopiado] = useState(false);
  const [registroPago, setRegistroPago] = useState<PassaporteEquestreRegistro | null>(null);

  const codigoPix = `SIDAGRO|PASSAPORTE|${registro.codigoMicrochip}|15000`;

  const copiarPix = async () => {
    try {
      await navigator.clipboard.writeText(codigoPix);
    } catch {
      // O protótipo continua sinalizando a ação mesmo quando o navegador bloqueia o clipboard.
    }
    setPixCopiado(true);
  };

  const pagarComPix = () => {
    const atualizado = confirmarPagamentoPassaporte(registro.id);
    if (atualizado) setRegistroPago(atualizado);
  };

  const baixarDae = () => {
    const conteudo = `
      <html lang="pt-BR">
        <head><meta charset="utf-8"><title>DAE - Passaporte Equestre</title></head>
        <body style="font-family: Arial, sans-serif; padding: 32px">
          <h1>Documento de Arrecadação Estadual</h1>
          <p><strong>Serviço:</strong> Emissão de Passaporte Equestre</p>
          <p><strong>Animal:</strong> ${registro.nomeEquino}</p>
          <p><strong>Microchip:</strong> ${registro.codigoMicrochip}</p>
          <p><strong>Produtor:</strong> ${registro.produtor.documento} - ${registro.produtor.nome}</p>
          <p><strong>Valor:</strong> ${VALOR_TAXA_PARAMETRIZADO}</p>
          <p>Documento demonstrativo gerado pelo protótipo Sidagro.</p>
        </body>
      </html>
    `;
    const url = URL.createObjectURL(new Blob([conteudo], { type: "text/html;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `DAE-passaporte-${registro.codigoMicrochip}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="passaporte"
        hideSearch
      />

      <main className="max-w-[900px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("visualizar-passaporte-equestre", registro)}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Voltar ao Passaporte Equestre
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Pagamento do Passaporte Equestre</h1>
          <p className="text-sm text-gray-500 mt-1">
            Escolha uma forma de pagamento para concluir a emissão do passaporte.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="border border-gray-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 text-[#1A7A3C] flex items-center justify-center">
                <QrCode size={21} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Pagar com PIX</h2>
                <p className="text-xs text-gray-500">Confirmação imediata no protótipo.</p>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 border border-gray-100 p-4 text-center">
              <p className="text-xs text-gray-500">Valor parametrizado</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{VALOR_TAXA_PARAMETRIZADO}</p>
            </div>

            <button
              type="button"
              onClick={copiarPix}
              className="w-full h-11 border border-[#1A7A3C] text-[#1A7A3C] rounded-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-green-50 transition"
            >
              {pixCopiado ? <Check size={17} /> : <Copy size={17} />}
              {pixCopiado ? "Código PIX copiado" : "Copiar código PIX"}
            </button>
            <button
              type="button"
              onClick={pagarComPix}
              className="w-full h-11 bg-[#1A7A3C] hover:bg-[#15612F] text-white rounded-md text-sm font-semibold transition"
            >
              Pagar com PIX
            </button>
          </div>

          <div className="border border-gray-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 text-[#1A7A3C] flex items-center justify-center">
                <FileText size={21} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Documento de Arrecadação</h2>
                <p className="text-xs text-gray-500">Gere o DAE para realizar o pagamento.</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-4">
              <p><span className="font-medium text-gray-800">Animal:</span> {registro.nomeEquino}</p>
              <p><span className="font-medium text-gray-800">Microchip:</span> {registro.codigoMicrochip}</p>
              <p><span className="font-medium text-gray-800">Valor:</span> {VALOR_TAXA_PARAMETRIZADO}</p>
            </div>

            <button
              type="button"
              onClick={baixarDae}
              className="w-full h-11 border border-[#1A7A3C] text-[#1A7A3C] rounded-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-green-50 transition"
            >
              <Download size={17} />
              Baixar DAE
            </button>
          </div>
        </div>
      </main>

      {registroPago && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 text-[#1A7A3C] flex items-center justify-center mx-auto mb-4">
              <Check size={28} strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Pagamento confirmado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">
              O passaporte está ativo e disponível para visualização.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => onNavigate("passaporte-equestre")}
                className="flex-1 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => onNavigate("visualizar-passaporte-equestre", registroPago)}
                className="flex-1 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold hover:bg-[#15612F] transition"
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
