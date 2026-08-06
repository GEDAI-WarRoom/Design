import { useState } from "react";
import { PlusCircle, X } from "lucide-react";
import { MultiSearchModal } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
import {
  DOENCAS_ATESTADO_EXAME,
  type DoencaAtestadoExame,
} from "./atestadoExameData";

export function DoencasAtestadoField({
  value,
  onChange,
  disabled = false,
  error,
}: {
  value: DoencaAtestadoExame[];
  onChange: (value: DoencaAtestadoExame[]) => void;
  disabled?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`w-full overflow-hidden rounded-xl border bg-gray-50/50 ${error ? "border-red-400" : "border-gray-200"
          }`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500">
              Doenças <span className="text-red-500">*</span>
            </span>
            {value.length > 0 && (
              <span className="rounded-full bg-[#E6F4EA] px-2.5 py-1 text-xs font-bold text-[#1A7A3C]">
                {value.length} {value.length === 1 ? "selecionada" : "selecionadas"}
              </span>
            )}
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex items-center gap-1.5 rounded-md border border-[#1A7A3C] px-3 py-1.5 text-xs font-bold text-[#1A7A3C] transition hover:bg-green-50"
            >
              <PlusCircle size={14} /> Selecionar doenças
            </button>
          )}
        </div>

        <div className="flex min-h-16 flex-wrap gap-3 p-5">
          {value.length === 0 ? (
            <p className="text-xs italic text-gray-400">Nenhuma doença selecionada.</p>
          ) : (
            value.map((doenca) => (
              <div
                key={doenca.id}
                className="flex min-w-[220px] items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
              >
                <span className="text-sm font-semibold text-[#1A7A3C]">{doenca.nome}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => onChange(value.filter((item) => item.id !== doenca.id))}
                    className="rounded p-0.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    aria-label={`Remover ${doenca.nome}`}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
        {error && <p className="px-5 pb-3 text-xs font-medium text-red-500">{error}</p>}
      </div>

      <MultiSearchModal<DoencaAtestadoExame>
        open={open}
        onClose={() => setOpen(false)}
        title="Buscar Doenças"
        subtitle="Selecione uma ou mais doenças cadastradas no sistema:"
        icon={<img src={Icons.iconeDoencaUrl} alt="Doença" className="h-5 w-5 object-contain" />}
        data={DOENCAS_ATESTADO_EXAME}
        columns={[
          { label: "Doença", key: "nome" },
        ]}
        searchKeys={["nome"]}
        searchPlaceholder="Buscar por nome da doença"
        selectedItems={value}
        onConfirm={onChange}
        confirmLabel="Selecionar"
        showResultsOnOpen
      />
    </>
  );
}
