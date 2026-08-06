import React, { useEffect, useRef } from "react";
import { Pencil } from "lucide-react";

export type CadastroVacinacaoMode = "create" | "view" | "edit";

export interface CadastroVacinacaoModeProps {
  mode?: CadastroVacinacaoMode;
  dados?: any;
}

export function preencherComExemplo<T = any>(valor: any, exemplo: any): T {
  if (valor === null || valor === undefined) return exemplo;
  if (typeof valor === "string" && valor.trim() === "") return exemplo;

  if (Array.isArray(valor) && Array.isArray(exemplo)) {
    if (valor.length === 0) return exemplo as T;
    return valor.map((item, index) => {
      const itemExemplo = exemplo[index] ?? exemplo[0];
      return itemExemplo === undefined ? item : preencherComExemplo(item, itemExemplo);
    }) as T;
  }

  if (valor !== null && exemplo !== null && typeof valor === "object" && typeof exemplo === "object" && !Array.isArray(valor) && !Array.isArray(exemplo)) {
    const resultado: Record<string, any> = {};
    const valorObjeto = valor as Record<string, any>;
    const exemploObjeto = exemplo as Record<string, any>;
    new Set([...Object.keys(exemploObjeto), ...Object.keys(valorObjeto)]).forEach((chave) => {
      resultado[chave] = preencherComExemplo(valorObjeto[chave], exemploObjeto[chave]);
    });
    return resultado as T;
  }

  return valor;
}

interface CadastroVacinacaoHeaderProps {
  mode: CadastroVacinacaoMode;
  nomeCadastro: string;
  rotaEditar: string;
  dados?: any;
  onNavigate: (screen: any, data?: any) => void;
  onSubmit: () => void;
}

const GREEN = "#1A7A3C";

export function CadastroVacinacaoHeader({
  mode,
  nomeCadastro,
  rotaEditar,
  dados,
  onNavigate,
  onSubmit,
}: CadastroVacinacaoHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== "view") return;

    const root = headerRef.current?.closest(".cadastro-vacinacao-view");
    const main = root?.querySelector("main");
    if (!main) return;

    const headerContainer = headerRef.current?.closest("main > div") ?? null;
    const regioesBloqueadas = Array.from(main.children)
      .filter((elemento): elemento is HTMLElement => elemento instanceof HTMLElement)
      .filter((elemento) => !headerContainer || elemento !== headerContainer);
    const estadosRegioes = regioesBloqueadas.map((elemento) => ({
      elemento,
      inert: elemento.hasAttribute("inert"),
      ariaDisabled: elemento.getAttribute("aria-disabled"),
    }));

    regioesBloqueadas.forEach((elemento) => {
      elemento.setAttribute("inert", "");
      elemento.setAttribute("aria-disabled", "true");
    });

    const controles = Array.from(main.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement>("input, textarea, select, button"));
    const estadosAnteriores = controles.map((controle) => ({ controle, disabled: controle.disabled }));

    controles.forEach((controle) => {
      if (!headerContainer?.contains(controle)) controle.disabled = true;
    });

    return () => {
      estadosAnteriores.forEach(({ controle, disabled }) => { controle.disabled = disabled; });
      estadosRegioes.forEach(({ elemento, inert, ariaDisabled }) => {
        if (!inert) elemento.removeAttribute("inert");
        if (ariaDisabled === null) elemento.removeAttribute("aria-disabled");
        else elemento.setAttribute("aria-disabled", ariaDisabled);
      });
    };
  }, [mode]);

  const titulo = mode === "create"
    ? `Adicionar ${nomeCadastro}`
    : mode === "edit"
      ? `Editar ${nomeCadastro}`
      : `Visualizar ${nomeCadastro}`;

  return (
    <div ref={headerRef} className="flex justify-between items-center gap-4 w-full">
      <h1 className="text-2xl font-semibold text-gray-900">{titulo}</h1>
      {mode === "view" ? (
        <button
          data-cadastro-header-action
          type="button"
          onClick={() => onNavigate(rotaEditar, dados)}
          className="px-5 h-10 text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"
          style={{ backgroundColor: GREEN }}
        >
          <Pencil size={14} /> Editar
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          className="px-5 h-10 text-white text-xs font-bold rounded-md transition shadow-sm"
          style={{ backgroundColor: GREEN }}
        >
          {mode === "edit" ? "Salvar Alterações" : "Adicionar"}
        </button>
      )}
    </div>
  );
}

export function cadastroVacinacaoPageClass(mode: CadastroVacinacaoMode, baseClass: string) {
  return `${baseClass} cadastro-vacinacao-form cadastro-vacinacao-${mode}`;
}

export function mensagemSucessoCadastro(mode: CadastroVacinacaoMode, nomeCadastro: string) {
  return mode === "edit"
    ? `${nomeCadastro} atualizado com sucesso!`
    : `${nomeCadastro} adicionado com sucesso!`;
}
