import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ChevronsUpDown, Info,
  Paperclip, Search, Check, X, FileText, Calendar, Scale,
  Plus, Eye, PlusCircle, SquareArrowOutUpRight, MoreVertical
} from "lucide-react";

import * as Icons from "../../imports/icons";



const GREEN = "#1A7A3C";
// ==========================================
// 9. TOOLTIP (Corrigido para aceitar interações do mouse)
// ==========================================
export function FieldTooltip({ text }: { text?: string }) {
  if (!text) return null;
  return (
    /* Forçado o pointer-events-auto para anular o pointer-events-none do elemento pai */
    <div className="cursor-pointer text-gray-400 hover:text-gray-600 transition flex items-center relative group pointer-events-auto">
      <Info size={13} />
      <div className="absolute left-6 bottom-1 bg-[#e0e0e0] border border-gray-300 text-black text-[11px] py-1.5 px-3 rounded shadow-md z-[9999] pointer-events-none hidden group-hover:flex items-start gap-1.5 w-72 max-w-xs normal-case font-normal leading-relaxed">        <Info size={12} className="text-gray-600 flex-shrink-0" />
        <span className="text-xs text-black whitespace-pre-line">
          {text}
        </span>
      </div>
    </div>
  );
}

// ==========================================
// 1. FLOAT INPUT — sem forwardRef (compatível com Figma)
// ==========================================
interface FloatInputProps {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  required?: boolean;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hasTooltip?: boolean;
  tooltipText?: string;
  id?: string;
}

export function FloatInput({
  label,
  value,
  onChange,
  required,
  disabled,
  type = "text",
  placeholder,
  maxLength,
  icon,
  onClick,
  className = "",
  hasTooltip,
  tooltipText,
  id,
}: FloatInputProps) {
  const [focused, setFocused] = useState(false);
  const internalRef = useRef<HTMLInputElement>(null);

  const active =
    focused ||
    (value !== undefined && value !== null && String(value).length > 0);

  // 💡 Identifica se a intenção original é um seletor de mês/ano
  const isMonthVariant = type === "month";
  const isDateVariant = type === "date";
  const isCalendar = isMonthVariant || isDateVariant;

  // Função para aplicar a máscara numérica mm/aaaa se for do tipo month
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    if (isMonthVariant) {
      // Remove tudo que não for número
      val = val.replace(/\D/g, "");

      // Limita a 6 caracteres (2 do mês + 4 do ano)
      val = val.slice(0, 6);

      // Coloca a barra após os 2 primeiros dígitos do mês
      if (val.length > 2) {
        val = `${val.slice(0, 2)}/${val.slice(2)}`;
      }
    }

    onChange?.(val);
  };

  return (
    <div
      onClick={(e) => {
        if (disabled) return;
        if (isCalendar) {
          internalRef.current?.focus();
        } else {
          onClick?.();
        }
      }}
      className={`relative border rounded-md h-12 flex items-end px-3 pb-1.5 transition-all 
        ${disabled ? "bg-gray-50 border-gray-200 cursor-not-allowed select-none text-gray-500" : "bg-white border-gray-300"} 
        ${focused && !disabled ? "border-[#1A7A3C] ring-1 ring-[#1A7A3C]" : ""} 
        ${(onClick || isCalendar) && !disabled ? "cursor-pointer" : ""} ${className}`}
    >
      <div
        className={`absolute transition-all duration-150 flex items-center gap-1.5 pointer-events-none select-none 
          ${icon ? "left-10" : "left-3"} 
          ${active ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}
      >
        <span>
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </span>
        {hasTooltip && <FieldTooltip text={tooltipText} />}
      </div>

      {icon && (
        <div className={`absolute left-3 bottom-2.5 ${disabled ? "text-gray-300" : "text-[#1A7A3C]"}`}>
          {icon}
        </div>
      )}

      <input
        id={id}
        ref={internalRef}
        // 💡 Se for 'month', vira 'text' para podermos controlar os caracteres e exibir a barra /
        type={isMonthVariant ? "text" : type}
        value={value}
        disabled={disabled}
        // Se for month, o tamanho máximo com a barra é 7 (MM/AAAA)
        maxLength={isMonthVariant ? 7 : maxLength}
        placeholder={focused ? (placeholder || (isMonthVariant ? "mm/aaaa" : "")) : ""}
        onFocus={() => !disabled && setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleInputChange}
        readOnly={isCalendar && !isMonthVariant ? false : !!onClick}
        className={`w-full bg-transparent text-sm text-gray-800 outline-none h-6 
          ${disabled ? "text-gray-500 cursor-not-allowed" : ""} 
          ${icon ? "pl-7" : ""} 
          ${onClick && !isCalendar ? "pointer-events-none cursor-pointer" : ""}
          ${isDateVariant && !active ? "[&::-webkit-datetime-edit]:opacity-0 text-transparent" : "[&::-webkit-datetime-edit]:opacity-100 text-gray-800"}`}
      />
    </div>
  );
}


// ==========================================
// 2. CUSTOM BUTTON
// ==========================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "outlined";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function CustomButton({ variant = "filled", icon, children, className = "", ...props }: ButtonProps) {
  const baseStyle = "h-11 px-6 font-semibold text-sm rounded-lg transition shadow-sm flex items-center justify-center gap-2 select-none disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    filled: "bg-[#1A7A3C] hover:bg-[#15612F] text-white",
    outlined: "bg-white border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50/40"
  };
  return (
    <button type="button" className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

// ==========================================
// 4. FLOAT SELECT (Corrigido Z-Index do Dropdown)
// ==========================================
interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  hasTooltip?: boolean;
  tooltipText?: string;
}

export function FloatSelect({
  label, value, onChange, options, required, disabled, className = "", hasTooltip, tooltipText
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = isOpen || (value !== undefined && value !== null && String(value).length > 0);
  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={() => !disabled && setIsOpen(!isOpen)}
      className={`relative border rounded-md h-12 flex items-end px-3 pb-1.5 transition-all select-none ${className} 
        ${disabled ? "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-500" : "bg-white border-gray-300 cursor-pointer"} 
        ${isOpen && !disabled ? "border-[#1A7A3C] ring-1 ring-[#1A7A3C] z-30" : "z-10"}`}
    >
      <label className={`absolute left-3 transition-all duration-150 pointer-events-none select-none flex items-center gap-1.5 
        ${active ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}
      >
        <span>{label}{required && <span className="text-red-500 ml-0.5">*</span>}</span>
        {hasTooltip && <FieldTooltip text={tooltipText} />}
      </label>
      <div className="w-full flex items-center h-6 text-sm text-gray-800">
        <span className={`flex-1 truncate ${disabled ? "text-gray-500" : ""}`}>{selectedLabel}</span>
        {!disabled && <ChevronDown size={16} className={`text-gray-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />}
      </div>
      {isOpen && !disabled && (
        /* Definido z-[9999] absoluto e garantida a flutuação sem cortes */
        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] py-1 max-h-56 overflow-y-auto">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onChange(o.value); setIsOpen(false); }}
              className={`w-full px-4 py-2.5 text-sm text-left transition hover:bg-gray-50 text-gray-700 ${value === o.value ? "bg-gray-50 font-medium text-[#1A7A3C]" : ""}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. FLOAT COMBOBOX
// ==========================================
interface ComboboxProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  hasTooltip?: boolean;
  tooltipText?: string;
}

export function FloatCombobox({
  label, value, onChange, options = [], required, disabled, className = "", hasTooltip, tooltipText
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = focused || isOpen || (value && value.length > 0);
  const filtrados = options
    .filter((opt) => (opt ?? "").toLowerCase().includes((value ?? "").toLowerCase()))
    .sort((a, b) => (a ?? "").localeCompare(b ?? ""));
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative border rounded-md h-12 flex items-end px-3 pb-1.5 transition-all ${className} 
        ${disabled ? "bg-gray-50 border-gray-200 cursor-not-allowed" : "bg-white border-gray-300"} 
        ${focused || isOpen ? "border-[#1A7A3C] ring-1 ring-[#1A7A3C] z-30" : "z-10"}`}
    >
      <label className={`absolute left-3 transition-all duration-150 pointer-events-none select-none flex items-center gap-1.5 
        ${active ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}
      >
        <span>{label}{required && <span className="text-red-500 ml-0.5">*</span>}</span>
        {hasTooltip && <FieldTooltip text={tooltipText} />}
      </label>
      <div className="w-full flex items-center h-6 text-sm text-gray-800">
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => { onChange(e.target.value); setIsOpen(true); }}
          onFocus={() => !disabled && [setFocused(true), setIsOpen(true)]}
          onBlur={() => setFocused(false)}
          className={`w-full bg-transparent outline-none pr-5 text-sm text-gray-800 ${disabled ? "text-gray-500 cursor-not-allowed" : ""}`}
        />
        <ChevronDown size={16} onClick={() => !disabled && setIsOpen(!isOpen)} className={`text-gray-400 flex-shrink-0 cursor-pointer transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>
      {isOpen && !disabled && filtrados.length > 0 && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] py-1 max-h-48 overflow-y-auto">
          {filtrados.map((option) => (
            <button
              key={option}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onChange(option); setIsOpen(false); }}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 text-gray-700"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. CUSTOM RADIO
// ==========================================
interface RadioProps {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export function CustomRadio({ label, name, value, checked, onChange, disabled }: RadioProps) {
  return (
    <label className={`flex items-center gap-2 text-sm text-gray-700 font-medium select-none group ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
      <div className="relative flex items-center justify-center">
        <input type="radio" name={name} value={value} checked={checked} onChange={() => !disabled && onChange()} disabled={disabled} className="sr-only" />
        <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center 
          ${checked ? "border-[#1A7A3C] bg-white" : "border-gray-300 bg-white group-hover:border-gray-400"}`}
        >
          {checked && <div className="w-2 h-2 rounded-full bg-[#1A7A3C]" />}
        </div>
      </div>
      <span>{label}</span>
    </label>
  );
}

// ==========================================
// 7. UPLOAD FIELD
// ==========================================
interface UploadFieldProps {
  label: string;
  fileName: string;
  onSelectFile: () => void;
  required?: boolean;
  disabled?: boolean;
  subtitle?: string;
}

export function UploadField({ label, fileName, onSelectFile, required, disabled, subtitle = "Formatos permitidos: PNG, JPG ou PDF de até 50MB." }: UploadFieldProps) {
  return (
    <div className="w-[340px] flex flex-col gap-1">
      <div
        onClick={() => !disabled && onSelectFile()}
        className={`flex items-center gap-3 px-3 rounded-md border h-12 transition relative 
          ${disabled ? "bg-gray-50 border-gray-200 cursor-not-allowed" : "bg-white border-gray-300 cursor-pointer hover:border-[#1A7A3C]"}`}
      >
        <Paperclip size={18} className={disabled ? "text-gray-300" : "text-[#1A7A3C]"} />
        <div className="flex flex-col justify-center select-none flex-1">
          <span className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">
            {label} {required && <span className="text-red-500">*</span>}
          </span>
          <span className={`text-sm font-medium truncate max-w-[260px] ${fileName ? "text-gray-700" : "text-gray-500"}`}>
            {fileName || "Selecionar Arquivo"}
          </span>
        </div>
      </div>
      {subtitle && <span className="text-[11px] text-gray-400 pl-1">{subtitle}</span>}
    </div>
  );
}

// ==========================================
// 8. LARGE TEXT AREA
// ==========================================
interface TextAreaProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
  hasTooltip?: boolean;
  tooltipText?: string;
  required?: boolean;
}

export function LargeTextArea({ label, value, required, onChange, rows = 4, maxLength = 1500, disabled, hasTooltip, tooltipText }: TextAreaProps) {
  return (
    <div className={`relative border rounded-md p-4 transition-all 
      ${disabled ? "bg-gray-50 border-gray-200 cursor-not-allowed" : "bg-white border-gray-200 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]"}`}
    >
      <div className="flex items-center gap-1.5 text-[12px] text-gray-400 font-medium mb-1 tracking-wide relative w-fit">
        <span>{label} {required && <span className="text-red-500">*</span>}</span>
        {hasTooltip && <FieldTooltip text={tooltipText} />}

      </div>

      <textarea
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        rows={rows}
        className={`w-full bg-transparent text-sm outline-none resize-none mt-1 leading-relaxed ${disabled ? "text-gray-500 cursor-not-allowed" : "text-gray-800"}`}
      />
      <div className="text-right text-xs text-gray-400 mt-1 select-none">
        {value.length}/{maxLength}
      </div>
    </div>
  );
}



export interface SearchModalColumn<T> {
  label: string;
  key: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface SearchModalProps<T extends { id: string | number }> {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  data: T[];
  columns: SearchModalColumn<T>[];
  searchKeys: (keyof T)[];
  searchPlaceholder?: string;
  onConfirm: (selected: T) => void;
  confirmLabel?: string;
  // 🌟 Nova propriedade para embutir qualquer componente (como o FloatSelect) na mesma linha horizontal
  headerActions?: React.ReactNode;
}

export function SearchModal<T extends { id: string | number }>({
  open,
  onClose,
  title,
  subtitle = "Busque e selecione um item:",
  icon,
  data,
  columns,
  searchKeys,
  searchPlaceholder = "Digite para pesquisar...",
  onConfirm,
  confirmLabel = "Confirmar",
  headerActions, // 🌟 Recebendo a nova propriedade
}: SearchModalProps<T>) {
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState<T | null>(null);
  const [pagina, setPagina] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const PAGE_SIZE = 5;

  if (!open) return null;

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPagina(1);
  };

  const resultados = data.filter((item) =>
    searchKeys.some((key) =>
      String(item[key]).toLowerCase().includes(busca.toLowerCase())
    )
  );

  const resultadosOrdenados = [...resultados].sort((a, b) => {
    if (!sortKey) return 0;
    const va = String(a[sortKey]);
    const vb = String(b[sortKey]);
    return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const totalPaginas = Math.max(1, Math.ceil(resultadosOrdenados.length / PAGE_SIZE));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = resultadosOrdenados.length === 0 ? 0 : (paginaAtual - 1) * PAGE_SIZE + 1;
  const fim = Math.min(paginaAtual * PAGE_SIZE, resultadosOrdenados.length);
  const itensPagina = resultadosOrdenados.slice((paginaAtual - 1) * PAGE_SIZE, paginaAtual * PAGE_SIZE);

  const handleBuscaChange = (val: string) => {
    setBusca(val);
    setSelecionado(null);
    setPagina(1);
  };

  const handleConfirm = () => {
    if (selecionado) {
      onConfirm(selecionado);
      setBusca("");
      setSelecionado(null);
      setPagina(1);
    }
  };

  const handleClose = () => {
    setBusca("");
    setSelecionado(null);
    setPagina(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 flex flex-col gap-6 relative">

        <button type="button" onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
          <X size={18} />
        </button>

        <div className="flex flex-col items-center gap-2 text-center mt-2">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>

        {/* 🌟 CONTAINER COMPARTILHADO: Aqui controlamos a linha horizontal perfeita */}
        <div className="flex flex-row items-end gap-3 w-full relative">

          {/* Se houver ações ou filtros passados, eles renderizam colados à esquerda */}
          {headerActions && (
            <div className="w-[180px] flex-shrink-0 z-20">
              {headerActions}
            </div>
          )}

          {/* Input de busca flexível ocupando o restante do espaço */}
          <div className="relative flex-1 z-10">
            <input
              type="text"
              value={busca}
              onChange={(e) => handleBuscaChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full border border-gray-300 rounded-md pl-4 pr-10 h-12 text-sm outline-none focus:border-[#1A7A3C] transition-all text-gray-700"
            />
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {busca.trim().length > 0 && (
          <div className="flex flex-col w-full">
            {resultadosOrdenados.length > 0 ? (
              <>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-2 w-8" />
                      {columns.map((col) => (
                        <th
                          key={String(col.key)}
                          onClick={() => handleSort(col.key)}
                          className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide cursor-pointer select-none hover:text-gray-600 transition"
                        >
                          <div className="flex items-center gap-1">
                            {col.label}
                            <span className={`transition-opacity text-gray-400 ${sortKey === col.key ? "opacity-100" : "opacity-30"}`}>
                              {sortKey === col.key
                                ? sortDir === "desc"
                                  ? <ChevronUp size={16} />
                                  : <ChevronDown size={16} />
                                : <ChevronsUpDown size={16} />
                              }
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {itensPagina.map((item) => {
                      const isSelected = selecionado?.id === item.id;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelecionado(item)}
                          className={`border-b border-gray-50 cursor-pointer transition-colors ${isSelected ? "bg-green-50" : "hover:bg-gray-50"}`}
                        >
                          <td className="py-3 pr-2">
                            <div className="flex items-center justify-center">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "border-[#1A7A3C]" : "border-gray-300"}`}>
                                {isSelected && <div className="w-2 h-2 rounded-full bg-[#1A7A3C]" />}
                              </div>
                            </div>
                          </td>
                          {columns.map((col) => (
                            <td key={String(col.key)} className={`py-3 text-sm whitespace-pre-line ${isSelected ? "text-[#1A7A3C] font-medium" : "text-gray-700"}`}>
                              {col.render ? col.render(item[col.key], item) : String(item[col.key] ?? "")}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Itens por página: {PAGE_SIZE}</span>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>
                      Mostrando de {inicio} a {fim} de {resultadosOrdenados.length} resultado{resultadosOrdenados.length !== 1 ? "s" : ""}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPagina((p) => Math.max(1, p - 1))}
                        disabled={paginaAtual === 1}
                        className="p-0.5 text-gray-500 hover:text-[#1A7A3C] disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                        disabled={paginaAtual === totalPaginas}
                        className="p-0.5 text-gray-500 hover:text-[#1A7A3C] disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center text-sm text-gray-400 py-10">
                Nenhum resultado encontrado para "<span className="font-medium text-gray-600">{busca}</span>".
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center w-full pt-2">
          <button
            type="button"
            disabled={!selecionado}
            onClick={handleConfirm}
            className="px-10 py-2.5 rounded-md font-semibold text-sm transition-all duration-200 shadow-sm disabled:cursor-not-allowed"
            style={{
              backgroundColor: selecionado ? "#1A7A3C" : "#E2E4E8",
              color: selecionado ? "#FFFFFF" : "#A3A7AF",
            }}
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
}


// ==========================================
// MULTI SEARCH MODAL (Corrigido para evitar conflito de chaves e objetos)
// ==========================================
export interface MultiSearchModalColumn<T> {
  label: string;
  key: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface MultiSearchModalProps<T extends { id: string | number }> {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  data: T[];
  columns: MultiSearchModalColumn<T>[];
  searchKeys: (keyof T)[];
  searchPlaceholder?: string;
  selectedItems: T[];
  onConfirm: (selected: T[]) => void;
  confirmLabel?: string;
}

export function MultiSearchModal<T extends { id: string | number }>({
  open,
  onClose,
  title,
  subtitle = "Busque e selecione os itens:",
  icon,
  data = [],
  columns,
  searchKeys,
  searchPlaceholder = "Digite para pesquisar...",
  selectedItems = [],
  onConfirm,
  confirmLabel = "Confirmar",
}: MultiSearchModalProps<T>) {
  const [busca, setBusca] = useState("");
  const [tempSelected, setTempSelected] = useState<T[]>([]);
  const [pagina, setPagina] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const PAGE_SIZE = 5;

  // Garante a sincronização limpa do estado ao abrir
  useEffect(() => {
    if (open) {
      setTempSelected(Array.isArray(selectedItems) ? selectedItems : []);
      setBusca("");
      setPagina(1);
      setSortKey(null);
    }
  }, [open, selectedItems]);

  if (!open) return null;

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPagina(1);
  };

  const resultados = data.filter((item) =>
    searchKeys.some((key) =>
      String(item[key] ?? "").toLowerCase().includes(busca.toLowerCase())
    )
  );

  const resultadosOrdenados = [...resultados].sort((a, b) => {
    if (!sortKey) return 0;
    const va = String(a[sortKey] ?? "");
    const vb = String(b[sortKey] ?? "");
    return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const totalPaginas = Math.max(1, Math.ceil(resultadosOrdenados.length / PAGE_SIZE));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = resultadosOrdenados.length === 0 ? 0 : (paginaAtual - 1) * PAGE_SIZE + 1;
  const fim = Math.min(paginaAtual * PAGE_SIZE, resultadosOrdenados.length);
  const itensPagina = resultadosOrdenados.slice((paginaAtual - 1) * PAGE_SIZE, paginaAtual * PAGE_SIZE);

  const handleToggle = (item: T) => {
    const exists = tempSelected.some((selected) => selected.id === item.id);
    if (exists) {
      setTempSelected(tempSelected.filter((selected) => selected.id !== item.id));
    } else {
      setTempSelected([...tempSelected, item]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 flex flex-col gap-6 relative">

        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
          <X size={18} />
        </button>

        <div className="flex flex-col items-center gap-2 text-center mt-2">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>

        <div className="relative w-full">
          <input
            type="text"
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPagina(1); }}
            placeholder={searchPlaceholder}
            className="w-full border border-gray-300 rounded-md pl-4 pr-10 py-2.5 text-sm outline-none focus:border-[#1A7A3C] transition-all text-gray-700"
          />
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {busca.trim().length > 0 && (
          <div className="flex flex-col w-full">
            {resultadosOrdenados.length > 0 ? (
              <>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-2 w-8" />
                      {columns.map((col, index) => (
                        <th
                          key={`col-${String(col.key)}-${index}`}
                          onClick={() => handleSort(col.key)}
                          className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide cursor-pointer select-none hover:text-gray-600 transition"
                        >
                          <div className="flex items-center gap-1">
                            {col.label}
                            <span className={`transition-opacity text-gray-400 ${sortKey === col.key ? "opacity-100" : "opacity-30"}`}>
                              {sortKey === col.key
                                ? sortDir === "desc"
                                  ? <ChevronUp size={16} />
                                  : <ChevronDown size={16} />
                                : <ChevronsUpDown size={16} />
                              }
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {itensPagina.map((item) => {
                      const isChecked = tempSelected.some((selected) => selected.id === item.id);
                      return (
                        <tr
                          key={`row-${item.id}`}
                          onClick={() => handleToggle(item)}
                          className={`border-b border-gray-50 cursor-pointer transition-colors ${isChecked ? "bg-green-50/40" : "hover:bg-gray-50"}`}
                        >
                          <td className="py-3 pr-2">
                            <div className="flex items-center justify-center">
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isChecked ? "bg-[#1A7A3C] border-[#1A7A3C] text-white" : "border-gray-300 bg-white"
                                  }`}
                              >
                                {isChecked && <Check size={11} strokeWidth={3} />}
                              </div>
                            </div>
                          </td>
                          {columns.map((col, index) => (
                            <td key={`cell-${item.id}-${String(col.key)}-${index}`} className={`py-3 text-sm ${isChecked ? "text-[#1A7A3C] font-medium" : "text-gray-700"}`}>
                              {col.render ? col.render(item[col.key], item) : String(item[col.key] ?? "")}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Itens por página: {PAGE_SIZE}</span>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>
                      Mostrando de {inicio} a {fim} de {resultadosOrdenados.length} resultado{resultadosOrdenados.length !== 1 ? "s" : ""}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPagina((p) => Math.max(1, p - 1))}
                        disabled={paginaAtual === 1}
                        className="p-0.5 text-gray-500 hover:text-[#1A7A3C] disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                        disabled={paginaAtual === totalPaginas}
                        className="p-0.5 text-gray-500 hover:text-[#1A7A3C] disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center text-sm text-gray-400 py-10">
                Nenhum resultado encontrado para "<span className="font-medium text-gray-600">{busca}</span>".
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center w-full pt-2">
          <button
            type="button"
            onClick={() => { onConfirm(tempSelected); onClose(); }}
            className="px-10 py-2.5 rounded-md font-semibold text-sm transition-all duration-200 shadow-sm"
            style={{ backgroundColor: "#1A7A3C", color: "#FFFFFF" }}
          >
            {confirmLabel} ({tempSelected.length})
          </button>
        </div>

      </div>
    </div>
  );
}



//----------------------------
// SELEÇÃO MÚLTIPLA (COMPLETO)
//----------------------------


interface CheckboxOption {
  id?: string;
  value?: string;
  label: string;
  tooltipText?: string; // Suporta tooltip individual por opção
}

interface CheckboxGroupProps {
  title: string;
  actionLabel?: string;
  options: CheckboxOption[];
  defaultValue?: string[];
  onChange?: (selectedIds: string[]) => void;
  orientation?: "horizontal" | "vertical" | "grid";
  required?: boolean;
}

export function CheckboxGroup({
  title,
  actionLabel = "",
  options = [],
  defaultValue = [],
  onChange,
  orientation = "vertical",
  required,
}: CheckboxGroupProps) {
  const [selected, setSelected] = useState<string[]>(defaultValue);

  const handleToggle = (id: string) => {
    const updated = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];

    setSelected(updated);
    if (onChange) onChange(updated);
  };

  return (
    <div className="flex flex-col gap-3 font-sans select-none w-full">
      {/* Cabeçalho */}
      <div className="flex items-center gap-2 text-sm font-normal">
        <span className="text-gray-800">
          {title}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </span>
        {actionLabel && (
          <span className="text-[#1A7A3C] font-bold cursor-pointer hover:underline">
            {actionLabel}
          </span>
        )}
      </div>

      {/* Grid / Flex dinâmico baseado na orientação escolhida */}
      <div
        className={
          orientation === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 w-full"
            : orientation === "horizontal"
              ? "flex flex-wrap items-center gap-x-6 gap-y-3 w-full"
              : "flex flex-col gap-3 w-full"
        }
      >
        {options.map((option, index) => {
          const currentId = option.value || option.id || String(index);
          const isChecked = selected.includes(currentId);

          return (
            <div
              key={currentId}
              className={`flex items-start gap-1.5 ${orientation === "grid" ? "w-full" : "w-fit"
                }`}
            >
              {/* O label mantém a estrutura flex original do grupo */}
              <label className="inline-flex items-center gap-3 cursor-pointer group w-full">
                <div className="relative flex items-center justify-center flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle(currentId)}
                    className="peer appearance-none w-5 h-5 border border-gray-300 rounded bg-white 
                               checked:bg-[#1A7A3C] checked:border-[#1A7A3C] 
                               focus:outline-none
                               transition-all duration-150"
                  />

                  <svg
                    className="absolute w-3 h-3 text-white pointer-events-none hidden peer-checked:block stroke-[3]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors break-words">
                  {option.label}
                </span>
              </label>

              {/* Renderiza o Tooltip na frente da opção se existir */}
              {option.tooltipText && (
                <div className="mt-1 flex-shrink-0">
                  <FieldTooltip text={option.tooltipText} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


// BUSCA DE ENTIDADE
export function EntitySelector({ label, data, columns, value, onChange, searchKeys, icon }: EntitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="w-full cursor-pointer" onClick={() => setIsOpen(true)}>
        <div className="pointer-events-none">
          <FloatInput label={label} value={value} readOnly icon={icon} required />
        </div>
      </div>

      <SearchModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Buscar ${label}`}
        data={data}
        columns={columns}
        searchKeys={searchKeys}
        onConfirm={(itemSelecionado) => {
          onChange(itemSelecionado); // Devolve o objeto para a página de forma limpa
          setIsOpen(false);
        }}
      />
    </>
  );
}

// ==========================================
// COMPONENTE SIM/NÃO (Com suporte a Tooltip)
// ==========================================
interface SimNaoProps {
  label: string;
  name: string;
  value: boolean | string;
  onChange: (v: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  hasTooltip?: boolean;
  tooltipText?: string;
}

export function SimNao({
  label,
  name,
  value,
  onChange,
  required,
  disabled,
  hasTooltip,
  tooltipText,
}: SimNaoProps) {
  // Converte strings ou booleanos para garantir consistência no check
  const isSim = value === true || value === "Sim";
  const isNao = value === false || value === "Não";

  return (
    <div className="flex flex-col gap-3 font-sans select-none w-full">
      {/* Rótulo com suporte a Tooltip */}
      <div className="flex items-center gap-1.5 text-sm font-normal text-gray-800">
        <span>
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </span>
        {hasTooltip && <FieldTooltip text={tooltipText} />}
      </div>

      {/* Opções de rádio alinhadas lado a lado */}
      <div className="flex items-center gap-6 h-6">
        <label className={`flex items-center gap-2 text-sm text-gray-700 font-medium ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer group"}`}>
          <div className="relative flex items-center justify-center">
            <input
              type="radio"
              name={name}
              checked={isSim}
              disabled={disabled}
              onChange={() => !disabled && onChange(true)}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${isSim ? "border-[#1A7A3C] bg-white" : "border-gray-300 bg-white group-hover:border-gray-400"}`}>
              {isSim && <div className="w-2 h-2 rounded-full bg-[#1A7A3C]" />}
            </div>
          </div>
          <span>Sim</span>
        </label>

        <label className={`flex items-center gap-2 text-sm text-gray-700 font-medium ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer group"}`}>
          <div className="relative flex items-center justify-center">
            <input
              type="radio"
              name={name}
              checked={isNao}
              disabled={disabled}
              onChange={() => !disabled && onChange(false)}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${isNao ? "border-[#1A7A3C] bg-white" : "border-gray-300 bg-white group-hover:border-gray-400"}`}>
              {isNao && <div className="w-2 h-2 rounded-full bg-[#1A7A3C]" />}
            </div>
          </div>
          <span>Não</span>
        </label>
      </div>
    </div>
  );
}


// FLOATMULTI SELECT

export function FloatMultiSelect({
  label,
  value = [],
  onChange,
  options,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown se o usuário clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  // LÓGICA DE EXIBIÇÃO: Junta as opções por vírgula e trunca se necessário
  let labelExibicao = "";
  if (value.length > 0) {
    const textoCompleto = value.join(", ");
    // Se o texto for muito longo, trunca e adiciona as reticências (...)
    labelExibicao = textoCompleto.length > 35
      ? `${textoCompleto.substring(0, 35)}...`
      : textoCompleto;
  }

  return (
    <div ref={containerRef} className="relative w-full text-left">
      {/* Botão Gatilho / Input Estilizado */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-200 rounded-md px-3 h-12 relative flex items-end pb-1.5 cursor-pointer focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C] transition-all"
      >
        <label
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${isOpen || value.length > 0
            ? "top-1 text-[10px] text-gray-400 font-medium"
            : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
            }`}
        >
          {label}
        </label>

        <div className="flex items-center justify-between w-full pr-1">
          <span className="text-sm text-gray-800 truncate h-6 block leading-6 pr-4">
            {labelExibicao}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Dropdown com os Checkboxes */}
      {/* Dropdown com os Checkboxes */}
      {isOpen && (
        <div className="absolute left-0 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg z-[999] py-1 animate-fadeIn">
          {options.map((option) => {
            const isChecked = value.includes(option);
            return (
              <label
                key={option}
                className={`flex items-start gap-3 px-3 py-2 cursor-pointer select-none transition-colors group ${isChecked ? "bg-gray-100/70" : "hover:bg-gray-50"
                  }`}
              >
                {/* CHECKBOX TOTALMENTE CUSTOMIZADO (Sem o preto nativo do navegador) */}
                <div className="relative flex items-center h-5 mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleOption(option)}
                    className="sr-only peer" /* Esconde o checkbox nativo preto */
                  />

                  {/* Quadrado customizado: Fundo cinza bem claro por padrão e borda suave */}
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded transition-all peer-checked:bg-[#1A7A3C] peer-checked:border-[#1A7A3C] flex items-center justify-center group-hover:border-gray-400 peer-focus-visible:ring-2 peer-focus-visible:ring-[#1A7A3C]/30">
                    {/* Ícone de Check (Seta branca) — Só aparece se peer-checked estiver ativo */}
                    <svg
                      className={`w-2.5 h-2.5 text-white stroke-[3] transition-opacity ${isChecked ? "opacity-100" : "opacity-0"
                        }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <span className={`text-sm leading-normal break-words pr-2 transition-colors ${isChecked ? "text-gray-900 font-medium" : "text-gray-700"
                  }`}>
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      )}

    </div>
  );
}

// ABAS

// ─── Componente: Tabs (CORRIGIDO PARA SUPORTAR FUNÇÃO DINÂMICA) ───────────────
interface Tab {
  id: string;
  label: string;
  icon: (isActive: boolean) => React.ReactNode; // Tipo alterado para função
}

interface TabsProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  tabs: Tab[];
}

export function Tabs({ activeTab, setActiveTab, tabs }: TabsProps) {
  return (
    <div className="w-full border-b border-gray-200 mt-4 mb-2">
      <div className="flex justify-around md:justify-start md:gap-10 max-w-5xl mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 pb-3 px-2 transition-all duration-200 relative
                text-sm font-medium cursor-pointer
                ${isActive ? "text-[#1A7A3C]" : "text-gray-500 hover:text-gray-700"}
              `}
            >
              <span className={isActive ? "text-[#1A7A3C]" : "text-gray-400"}>
                {/* MODIFICADO AQUI: Executa a função passando se o estado está ativo */}
                {tab.icon(isActive)}
              </span>
              {tab.label}

              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full"
                  style={{ backgroundColor: GREEN }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}



// CARD

interface AccordionCardGroupProps {
  title: string;
  activeCountText: string;
  onAddClick?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode; // Cards ativos (ActiveCard/EvaluationActiveCard)
  variant?: "com-vinculacao" | "sem-vinculacao";
  grid?: "unico" | "normal";
  historicoTitle?: string;
  historicoChildren?: React.ReactNode; // Cards de histórico (HistoryCard)
}

export function AccordionCardGroup({
  title,
  activeCountText,
  onAddClick,
  icon,
  children,
  variant = "com-vinculacao",
  grid = "normal",
  historicoTitle,
  historicoChildren,
}: AccordionCardGroupProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  const hasActiveChildren = React.Children.count(children) > 0;
  const hasHistoryChildren = React.Children.count(historicoChildren) > 0;

  // Define se o layout dos vigentes será um card único grande ou grid de 3 colunas
  const activeContainerClass = grid === "unico"
    ? "w-full max-w-xl mx-auto grid grid-cols-1 gap-4 py-2"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full py-2";

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

      {/* ─── CABEÇALHO DO ACCORDION ─── */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#fdfcfb] flex items-center justify-between p-5 border-b border-gray-100 cursor-pointer select-none transition hover:bg-gray-50"
      >
        <div className="flex gap-3 items-center">
          {icon && (
            <div className="flex items-center justify-center p-2 rounded-lg bg-gradient-to-br from-[#32C47F] to-[#129356] text-white">
              {icon}
            </div>
          )}

          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-bold text-gray-800">{title}</span>
            <div className="flex gap-2 items-center text-sm">
              {onAddClick && variant === "com-vinculacao" && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onAddClick(); }}
                  className="flex gap-1.5 items-center text-xs font-medium text-[#008446] hover:underline cursor-pointer"
                >
                  <PlusCircle size={14} />
                  Adicionar Vinculação
                </button>
              )}
              {onAddClick && variant === "com-vinculacao" && <span className="text-gray-300">•</span>}
              <span className="text-xs text-gray-500">{activeCountText}</span>
            </div>
          </div>
        </div>

        <div className={`text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDown size={24} />
        </div>
      </div>

      {/* ─── CORPO DO ACCORDION ─── */}
      {isOpen && (
        <div className="flex flex-col gap-6 p-5 bg-white w-full">

          {/* 1. Secção de Vigentes */}
          {hasActiveChildren ? (
            <div className={activeContainerClass}>
              {children}
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-4 text-center w-full">
              Nenhuma medida de biosseguridade vigente nesta exploração.
            </p>
          )}

          {/* 🟢 2. Rodapé/Paginação dos Cards Vigentes (Posicionado ANTES do Histórico) */}
          <div className="flex flex-wrap items-center justify-between pt-4 w-full text-sm text-gray-500 px-2 ">
            <div>
              <span>Itens por página: 6</span>
            </div>

            <div className="flex gap-6 items-center">
              <div className="flex gap-2 items-center">
                <span>1 - 10 de 60</span>
                <button type="button" className="text-[#008446] disabled:opacity-40 cursor-pointer">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" className="text-[#008446] disabled:opacity-40 cursor-pointer">
                  <ChevronRight size={18} />
                </button>
              </div>

              {variant === "com-vinculacao" && (
                <button type="button" className="flex gap-1.5 items-center text-[#008446] font-medium hover:underline cursor-pointer">
                  <SquareArrowOutUpRight size={16} />
                  Ver todas vinculadas
                </button>
              )}
            </div>
          </div>

          {/* ─── 3. Secção do Histórico Colapsável ─── */}
          {historicoTitle && (
            <>
              <hr className="w-full border-gray-100 my-2" />

              <div className="w-full flex flex-col gap-4">
                <div
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-[#1A7A3C] px-2 cursor-pointer select-none hover:opacity-80 w-fit transition-opacity"
                >
                  <ChevronUp
                    size={16}
                    className={`stroke-[2.5] transition-transform duration-200 ${isHistoryOpen ? "" : "rotate-180"}`}
                  />
                  <span>{historicoTitle}</span>
                </div>

                {isHistoryOpen && (
                  hasHistoryChildren ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                      {historicoChildren}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 py-4 text-center w-full">
                      Nenhum registro no histórico.
                    </p>
                  )
                )}
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
}

interface GenericHistoryCardProps {
  label: string;
  subLabel: string;
  topBarSvgPath: string;
  icon?: React.ReactNode;
  actionIcon?: React.ReactNode; // 🟢 Usamos apenas esta agora!
  onActionClick?: () => void;
  customColor?: string;
  variant?: "com-historico" | "sem-historico";
}
export function HistoryCard({
  label,
  subLabel,
  topBarSvgPath,
  icon,
  actionIcon, // 🟢 Renderizado aqui
  onActionClick,
  customColor,
  variant = "com-historico"
}: GenericHistoryCardProps) {
  const color = customColor || DEFAULT_VULN_COLORS[label] || "#008446";
  const exibirDetalhes = variant !== "sem-historico";

  return (
    <div
      className="bg-white flex flex-1 flex-col items-start min-w-0 rounded-[8px] relative transition-all hover:shadow-md w-full"
      style={{
        boxShadow: "0px 1px 2px rgba(0,0,0,0.08)",
        border: "1px solid rgba(210,210,210,0.4)"
      }}
    >
      <div className="h-[7px] w-full rounded-t-[8px] overflow-hidden">
        <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 286 7">
          <path d={topBarSvgPath} fill={color} fillOpacity="0.6" />
        </svg>
      </div>

      <div className="h-[60px] w-full flex items-center justify-between px-[12px]">
        <div className="flex gap-[12px] items-center min-w-0 w-full">
          {icon && (
            <div className="bg-[#eff3f8] flex items-center justify-center p-[10px] rounded-[50px] size-[40px] shrink-0">
              {icon}
            </div>
          )}
          <div className="flex flex-col gap-[2px] items-start min-w-0 flex-1">
            <span className="text-[13px] font-semibold text-[#1d1d1f] truncate w-full">{label}</span>
            {exibirDetalhes && (
              <span className="text-[10px] font-normal text-gray-500 truncate w-full">{subLabel}</span>
            )}
          </div>
        </div>

        {/* 🟢 Botão de ação simplificado com o componente Lucide */}
        {exibirDetalhes && actionIcon && (
          <button
            onClick={onActionClick}
            type="button"
            className="flex items-center justify-center p-[6px] rounded-full cursor-pointer bg-white transition border border-gray-200 text-[#008446] hover:bg-[#eff8f3] hover:border-[#eff8f3] shrink-0"          >
            {actionIcon}
          </button>
        )}
      </div>
    </div>
  );
}


// MODAL
const LAT = { fontFamily: "sans-serif" }; // Caso seu LAT original seja diferente, ajuste aqui

interface ModalBaseProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  width?: string;
  children: React.ReactNode;
  cancelText?: string;
  onCancel?: () => void;
  saveText?: string;
  onSave?: () => void;
}

export function ModalBase({
  open,
  onClose,
  title,
  subtitle,
  icon,
  width = "1000px",
  children,
  cancelText = "Cancelar",
  onCancel,
  saveText = "Salvar",
  onSave,
}: ModalBaseProps) {
  if (!open) return null;
  const handleCancel = onCancel || onClose;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-hidden">

      <div
        className="bg-white rounded-[15px] flex flex-col gap-[12px] items-center px-[45px] py-[40px] overflow-y-auto overflow-x-hidden w-full max-w-[95vw] no-scrollbar"
        style={{
          border: "1px solid #d6d6d6",
          maxHeight: "90vh",
          width: width.includes("px") || width.includes("%") ? width : undefined
        }}
      >
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
          .no-scrollbar {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
        `}</style>

        {/* Botão de Fechar Corrigido */}
        <div className="flex items-center justify-end w-full">
          <button
            type="button"
            className="cursor-pointer hover:opacity-70 transition flex items-center justify-center size-[24px]"
            onClick={onClose}
          >
            <X size={24} color={GREEN} />
          </button>
        </div>

        {/* Título com Ícone */}
        <div className="flex gap-[12px] items-center justify-center w-full">
          {icon && (
            <div className="text-[#1A7A3C] flex items-center justify-center shrink-0 size-[24px]">
              {icon}
            </div>
          )}
          <div className="flex h-[61px] items-center justify-center py-[16px]">
            <span style={{ ...LAT, fontSize: 24, fontWeight: 700, color: "#1d1d1f", whiteSpace: "nowrap" }}>
              {title}
            </span>
          </div>
        </div>

        {/* Subtítulo */}
        {subtitle && (
          <div className="flex items-center justify-center text-center">
            <span style={{ ...LAT, fontSize: 14, fontWeight: 400, color: "#1d1d1f" }}>
              {subtitle}
            </span>
          </div>
        )}

        {/* Divisor */}
        <div className="flex flex-col items-center justify-center py-[18px] w-full">
          <div className="h-0 w-full relative">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block w-full" style={{ height: 1 }} fill="none" viewBox="0 0 910 1" preserveAspectRatio="none">
                <line stroke="#D2D2D7" strokeOpacity="0.6" strokeLinecap="round" x1="0.5" x2="909.5" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Conteúdo do Formulário */}
        <div className="w-full flex flex-col gap-5 mt-2">
          {children}
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-[12px] items-center justify-center pb-[24px] pt-[50px] w-full">
          <button
            type="button"
            onClick={handleCancel}
            className="flex h-[43px] items-center justify-center px-[21px] py-[8px] rounded-[4px] cursor-pointer bg-white transition hover:bg-gray-50"
            style={{ border: `1px solid ${GREEN}` }}
          >
            <span style={{ ...LAT, fontSize: 15, fontWeight: 700, color: GREEN }}>{cancelText}</span>
          </button>

          {onSave && (
            <button
              type="button"
              onClick={onSave}
              className="bg-[#1A7A3C] hover:bg-[#15612F] flex h-[43px] items-center justify-center px-[21px] py-[8px] rounded-[4px] cursor-pointer transition shadow-sm"
            >
              <span style={{ ...LAT, fontSize: 15, fontWeight: 700, color: "white" }}>{saveText}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


// CARD COM COR

// Mapeamento padrão de cores (pode ser customizado ou estendido via prop se necessário)
const DEFAULT_VULN_COLORS: Record<string, string> = {
  "Bem Protegida": "#008446",
  "Baixa": "#1976D2",
  "Moderada": "#F9A825",
  "Alta": "#C94141",
};

// ─── 1. HISTORY CARD GENÉRICO ──────────────────────────────────────────────────
interface GenericHistoryCardProps {
  label: string;
  subLabel: string;
  // Permite passar qualquer Path de SVG para a faixa do topo
  topBarSvgPath: string;
  // Permite passar qualquer componente de Ícone (ex: Lucide, SVG interno, etc.)
  icon?: React.ReactNode;
  // O path do ícone do botão de ação (Olho)
  actionIconPath: string;
  onActionClick?: () => void;
  // Cor customizada opcional para sobrescrever o padrão
  customColor?: string;
}


// ─── 2. ACTIVE CARD GENÉRICO ───────────────────────────────────────────────────
interface ActiveCardProps {
  dateLabel: string;
  statusLabel: string;
  statusColor?: string;
  topBarSvgPath: string;
  titlePrimary: string;
  subtitlePrimary: string;
  captionPrimary?: string;
  iconPrimarySvgPath: string;
  titleSecondary: string;
  subtitleSecondary: string;
  iconSecondarySvgPath: string;
  buttonText: string;
  onButtonClick?: () => void;
  moreActionsIconPath: string;
  onMoreActionsClick?: () => void;
}

export function ActiveCard({
  dateLabel,
  statusLabel,
  statusColor = "#1976D2",
  topBarSvgPath,
  titlePrimary,
  subtitlePrimary,
  captionPrimary,
  iconPrimarySvgPath,
  titleSecondary,
  subtitleSecondary,
  iconSecondarySvgPath,
  buttonText,
  onButtonClick,
  moreActionsIconPath,
  onMoreActionsClick
}: ActiveCardProps) {

  // Limpa prefixos manuais para tratar o texto de forma padronizada
  const cleanDate = dateLabel.replace(/^[Aa]tualizada:\s*/, "");

  return (
    <div
      className="bg-white rounded-[3px] relative w-full max-w-[552px] h-[193px] flex flex-col justify-between overflow-hidden"
      style={{ boxShadow: "0px 2px 2px rgba(0,0,0,0.15)" }}
    >
      {/* Faixa Superior de 7px */}
      <div className="absolute left-0 top-0 w-full h-[7px] overflow-hidden z-10">
        <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 383 7">
          <path d={topBarSvgPath} fill={statusColor} />
        </svg>
      </div>

      {/* Conteúdo Principal com espaçamento garantido para descolar da barra superior */}
      <div className="flex-1 flex flex-col pt-[24px] pb-[8px] px-[20px] gap-[10px]">

        {/* Cabeçalho do Card */}
        <div className="flex items-center justify-between w-full px-[5px]">
          {/* Layout estruturado para dar o respiro correto entre o texto fixo e a variável */}
          <div className="text-[11px] font-normal text-gray-500 flex gap-1">
            <span className="text-gray-800 font-medium">Atualizado:</span>
            <span className="text-gray-700 font-medium">{cleanDate}</span>
          </div>
          {/* Status como texto normal (sem uppercase forçado pelo componente) */}
          <span className="text-[12px] ">
            {statusLabel}
          </span>
        </div>

        {/* Bloco de Informação Primária */}
        <div className="flex gap-[12px] items-start pb-[8px] px-[5px] border-b border-gray-100">
          <div className="overflow-clip relative shrink-0 size-[22px] mt-0.5">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <path d={iconPrimarySvgPath} fill="#008446" />
            </svg>
          </div>
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="text-[13px] font-semibold text-[#1d1d1f] truncate w-full">{titlePrimary}</span>
            <span className="text-[11px] font-normal text-gray-500 truncate w-full">{subtitlePrimary}</span>
            {captionPrimary && <span className="text-[10px] font-normal text-gray-400 mt-0.5">{captionPrimary}</span>}
          </div>
        </div>

        {/* Bloco de Informação Secundária */}
        <div className="flex gap-[12px] items-start px-[5px]">
          <div className="overflow-clip relative shrink-0 size-[22px] mt-0.5">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <path d={iconSecondarySvgPath} fill="#008446" />
            </svg>
          </div>
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="text-[13px] font-semibold text-[#1d1d1f] truncate w-full">{titleSecondary}</span>
            <span className="text-[10px] font-normal text-gray-400 uppercase tracking-wider">{subtitleSecondary}</span>
          </div>
        </div>
      </div>

      {/* Rodapé fixado na base do Card pelo flex-col */}
      <div className="flex items-center justify-end pb-[14px] px-[25px] w-full bg-white z-10">
        <div className="flex gap-[10px] items-center">
          <button
            onClick={onButtonClick}
            type="button"
            className="bg-[#008446] hover:bg-green-700 transition flex h-[34px] items-center justify-center px-[21px] rounded-[4px] min-w-[114px] cursor-pointer shadow-sm"
          >
            <span className="text-[14px] font-bold text-white">{buttonText}</span>
          </button>

          <button
            onClick={onMoreActionsClick}
            type="button"
            className="overflow-clip relative shrink-0 size-[24px] cursor-pointer hover:bg-gray-100 rounded p-0.5 transition flex items-center justify-center"
          >
            <svg className="absolute block inset-0 size-full p-0.5" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <path d={moreActionsIconPath} fill="#666666" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}



interface EvaluationActiveCardProps {
  updatedAt: string;
  statusLabel: string;
  score: string | number;
  level: string;
  vulnerability: string;
  evaluatorName: string;
  evaluatorDoc: string;
  evaluatorRole: string;
  onViewClick?: () => void;
  onMenuClick?: () => void;
  topBarColor?: string; // Permite mudar a cor da barra azul do topo se necessário
}

export function EvaluationActiveCard({
  updatedAt,
  statusLabel = "Ativo",
  score,
  level,
  vulnerability,
  evaluatorName,
  evaluatorDoc,
  evaluatorRole,
  onViewClick,
  onMenuClick,
  topBarColor = "#1570EF", // Azul padrão da barra superior do print
}: EvaluationActiveCardProps) {
  return (
    <div className="w-full bg-white border border-gray-200 shadow-sm flex flex-col relative rounded-xl overflow-hidden">      <div className="h-[6px] w-full" style={{ backgroundColor: topBarColor }} />

      {/* ─── CABEÇALHO DO CARD ─── */}
      <div className="flex justify-between items-center px-5 pt-4 pb-2">
        <span className="text-xs font-semibold text-gray-700">
          Atualizado em: <span className="font-normal text-gray-600">{updatedAt}</span>
        </span>
        <span className="text-xs font-medium text-gray-500">
          {statusLabel}
        </span>
      </div>

      {/* ─── CORPO PRINCIPAL ─── */}
      <div className="flex flex-col md:flex-row gap-6 items-center px-5 pb-5 pt-2">

        {/* Bloco de Métricas (Destaque Cinza da Esquerda) */}
        <div className="bg-[#f3f4f6]/70 rounded-2xl p-4 flex items-center gap-5 w-full md:w-auto shrink-0 border border-gray-100">
          {/* Ícone de Alvo Verde */}
          <div className="shrink-0">
            <img
              src={Icons.iconePontuacaoUrl}
              alt="Pontuação"
              className="w-12 h-12 object-contain"
            />
          </div>

          {/* Dados */}
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-400 tracking-wider">Pontuação</span>
              <span className="text-base font-bold text-gray-800">{score}</span>
            </div>
            <div className="flex flex-col  pl-4">
              <span className="text-[10px] font-semibold text-gray-400 tracking-wider">Nível</span>
              <span className="text-base font-bold text-gray-800">{level}</span>
            </div>
            <div className="flex flex-col  pl-4">
              <span className="text-[10px] font-semibold text-gray-400 tracking-wider">Vulnerabilidade</span>
              <span className="text-base font-bold text-gray-800">{vulnerability}</span>
            </div>
          </div>
        </div>

        {/* Informações do Avaliador (Direita) */}
        <div className="flex items-start gap-2 w-full md:flex-1 min-w-0">

          {/* 🟢 Ícone do Profissional Animal usando a URL de imagem mapeada no Icons */}
          <div className="  p-2 shrink-0 flex items-center justify-center">
            <img
              src={Icons.iconeProfissionalAnimalUrl} // Substitua pelo nome exato da sua constante de ícone
              alt="Profissional Animal"
              className="w-6 h-6 object-contain"
            />
          </div>

          {/* Textos de identificação */}
          <div className="flex flex-col min-w-0">
            <span className="text-base font-medium text-gray-800 truncate">{evaluatorName}</span>
            <span className="text-xs text-gray-400 mt-0.5">{evaluatorDoc}</span>
            <span className="text-xs text-gray-400 mt-0.5">{evaluatorRole}</span>
          </div>
        </div>


      </div>

      {/* ─── RODAPÉ DE AÇÕES ─── */}
      <div className="flex justify-end items-center gap-3 px-5 py-3  border-t border-gray-100">
        <button
          onClick={onViewClick}
          type="button"
          className="bg-[#008446] hover:bg-[#006e3a] text-white font-bold text-sm px-6 py-2 rounded-lg transition duration-200 cursor-pointer shadow-sm"        >
          Visualizar
        </button>

        {onMenuClick && (
          <button
            onClick={onMenuClick}
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            <MoreVertical size={20} />
          </button>
        )}
      </div>

    </div>
  );
}
// MODAL GENÉRICO

interface GenericFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  subtitle?: string;
  saveLabel?: string;
  cancelLabel?: string;
  children: React.ReactNode;
  maxWidth?: string; // Permite customizar a largura se necessário
}

export function GenericFormModal({
  open,
  onClose,
  onSave,
  title,
  subtitle,
  saveLabel = "Salvar",
  cancelLabel = "Cancelar",
  children,
  maxWidth = "1000px",
}: GenericFormModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const LAT = { fontFamily: "'Lato', sans-serif" } as const;

  // Fecha o modal ao pressionar ESC
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className="bg-white rounded-[15px] flex flex-col gap-[12px] items-center px-[45px] py-[40px] overflow-x-clip overflow-y-auto w-full shadow-xl"
        style={{ border: "1px solid #d6d6d6", maxHeight: "90vh", maxWidth: maxWidth }}
      >
        {/* Botão Superior Fechar (X) */}
        <div className="flex items-center justify-end w-full">
          <button
            className="cursor-pointer text-xl text-[#008446] font-bold hover:opacity-80 transition"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Título Principal */}
        <div className="flex gap-[12px] items-center justify-center w-full">
          <div className="flex h-[40px] items-center justify-center">
            <span style={{ ...LAT, fontSize: 24, fontWeight: 700, color: "#1d1d1f", textAlign: "center" }}>
              {title}
            </span>
          </div>
        </div>

        {/* Subtítulo Opcional */}
        {subtitle && (
          <div className="flex items-center justify-center text-center">
            <span style={{ ...LAT, fontSize: 14, fontWeight: 400, color: "#1d1d1f" }}>
              {subtitle}
            </span>
          </div>
        )}

        {/* Linha Divisória de Estilo */}
        <div className="flex flex-col items-center justify-center py-[12px] w-full">
          <div className="h-[1px] w-full bg-[#D2D2D7]/60" />
        </div>

        {/* Conteúdo Dinâmico do Formulário */}
        <div className="w-full flex flex-col items-start gap-[16px]">
          {children}
        </div>

        {/* Rodapé: Botões de Ação */}
        <div className="flex gap-[12px] items-center justify-center pb-[10px] pt-[40px] w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[43px] items-center justify-center px-[24px] py-[8px] rounded-[4px] cursor-pointer transition hover:bg-gray-50 bg-white"
            style={{ border: "1px solid #008446" }}
          >
            <span style={{ ...LAT, fontSize: 15, fontWeight: 700, color: "#008446" }}>
              {cancelLabel}
            </span>
          </button>

          <button
            type="button"
            onClick={onSave}
            className="bg-[#008446] hover:bg-[#006b38] flex h-[43px] items-center justify-center px-[24px] py-[8px] rounded-[4px] cursor-pointer transition shadow-sm"
          >
            <span style={{ ...LAT, fontSize: 15, fontWeight: 700, color: "white" }}>
              {saveLabel}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}