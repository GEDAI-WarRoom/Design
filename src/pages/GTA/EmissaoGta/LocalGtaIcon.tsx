import { Building2, GraduationCap, MapPinned, TowerControl, Weight } from "lucide-react";

type LocalGtaIconProps = {
  tipo?: string;
  size?: number;
  className?: string;
};

/** Ícone contextual para os tipos de local usados na emissão da GTA. */
export function LocalGtaIcon({ tipo, size = 18, className }: LocalGtaIconProps) {
  const Icon =
    tipo === "Instituição de Ensino e Pesquisa"
      ? GraduationCap
      : tipo === "Unidade de Vigilância Agropecuária"
          ? TowerControl
        : tipo === "Local de Pesagem"
          ? Weight
        : tipo === "Local de Realização de Exame"
            ? MapPinned
            : Building2;

  return <Icon size={size} className={className} />;
}
