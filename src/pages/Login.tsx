import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "../imports/logo.png"; // Ajuste o nome se for image-1 ou image-2

const GREEN = "#1A7A3C";
const GOV_BLUE = "#1351B4";

interface LoginProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginProps) {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);

  function formatCPF(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 11);
    return d
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaebee] px-4">
      <div className="w-full max-w-[380px] bg-white rounded-2xl shadow-md px-8 py-10 flex flex-col gap-5">
        <div className="flex justify-center mb-2">
          <img src={logo} alt="Logo IMA" className="h-20 w-auto" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">CPF <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(formatCPF(e.target.value))}
            placeholder="000.000.000-00"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#1A7A3C] focus:ring-1 focus:ring-[#1A7A3C] transition"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Senha <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showSenha ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#1A7A3C] focus:ring-1 focus:ring-[#1A7A3C] transition pr-10"
            />
            <button
              type="button"
              onClick={() => setShowSenha(!showSenha)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="text-right">
            <a href="#" className="text-xs text-gray-500 hover:underline">Esqueceu a senha?</a>
          </div>
        </div>

        <button
          onClick={onLogin}
          className="w-full py-2.5 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: GREEN }}
        >
          Entrar
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          className="w-full py-2.5 rounded-full text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: GOV_BLUE }}
        >
          Entrar com gov.br
        </button>

        <button
          className="w-full py-2 rounded-md text-sm font-semibold border transition hover:bg-gray-50"
          style={{ borderColor: GREEN, color: GREEN }}
        >
          Cadastrar
        </button>
      </div>
    </div>
  );
}