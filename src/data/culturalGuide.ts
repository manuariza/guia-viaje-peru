import reportMarkdown from "./informe-cultural-peru.md?raw";

export type CulturalGuideSection = {
  id: string;
  dayId?: string;
  title: string;
  markdown: string;
};

const dateIds: Record<string, string> = {
  "8": "2026-09-08",
  "9": "2026-09-09",
  "10": "2026-09-10",
  "11": "2026-09-11",
  "12": "2026-09-12",
  "13": "2026-09-13",
  "14": "2026-09-14",
  "15": "2026-09-15",
  "16": "2026-09-16",
  "17": "2026-09-17",
  "18": "2026-09-18",
  "19": "2026-09-19",
  "20": "2026-09-20",
  "21": "2026-09-21",
};

const chunks = reportMarkdown.split(/(?=^# )/gm);

export const culturalGuideIntroduction = chunks[0].trim();

export const culturalGuideSections: CulturalGuideSection[] = chunks
  .slice(1)
  .map((chunk, index) => {
    const [heading = "", ...body] = chunk.split("\n");
    const title = heading.replace(/^# /, "").trim();
    const dayMatch = title.match(/^(\d{1,2}) de septiembre/);
    const dayId = dayMatch ? dateIds[dayMatch[1]] : undefined;

    return {
      id: dayId ?? `appendix-${index + 1}`,
      dayId,
      title,
      markdown: body.join("\n").trim(),
    };
  });

export const culturalDayGuides = culturalGuideSections.filter(
  (section): section is CulturalGuideSection & { dayId: string } => Boolean(section.dayId),
);

export const culturalGuideAppendices = culturalGuideSections.filter((section) => !section.dayId);

export const culturalGuideForDay = (dayId: string) =>
  culturalDayGuides.find((section) => section.dayId === dayId);

export const culturalGuideCrossChecks: Record<string, string[]> = {
  "2026-09-09": [
    "Plan vigente: Huaca Pucllana el miércoles 9 por la mañana y después vuelo a Arequipa. El Museo Larco corresponde al martes 8.",
  ],
  "2026-09-12": [
    "Para cubrir tanto el Valle Sagrado como los recintos arqueológicos de Cusco del día 18, la opción operativa recomendada sigue siendo el Boleto Turístico Integral de 10 días.",
  ],
};

export { reportMarkdown };
