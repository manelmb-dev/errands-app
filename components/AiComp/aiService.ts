import type { AiDraft } from "./types";

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function generateDraftFromPrompt(
  prompt: string,
): Promise<AiDraft> {
  await new Promise((r) => setTimeout(r, 500));

  const p = prompt.toLowerCase();

  if (p.includes("crea una tarea") || p.includes("creame una tarea")) {
    return {
      type: "task",
      task: {
        id: uid(),
        title: "Traer los zapatos",
        assignedName: "Laura Ortega",
        dateErrand: tomorrowISO(),
        timeErrand: "18:00",
        priority: "medium",
        description: "",
      },
    };
  }

  if (p.includes("londres") || p.includes("london")) {
    return {
      type: "list",
      list: { title: "Viaje a Londres", icon: "airplane", color: "blue" },
      tasks: [
        { id: uid(), title: "Comprar billetes de avión", priority: "high" },
        { id: uid(), title: "Reservar alojamiento", priority: "high" },
        { id: uid(), title: "Revisar pasaporte (vigencia)", priority: "high" },
        { id: uid(), title: "Solicitar ETA (si aplica)", priority: "high" },
        { id: uid(), title: "Contratar seguro de viaje", priority: "medium" },
        {
          id: uid(),
          title: "Planificar itinerario (museos / barrios)",
          priority: "medium",
        },
        {
          id: uid(),
          title: "Preparar maleta (ropa + adaptador UK)",
          priority: "medium",
        },
        {
          id: uid(),
          title: "Cambiar/organizar libras o tarjeta sin comisiones",
          priority: "medium",
        },
      ],
    };
  }

  if (p.includes("cumple") || p.includes("fiesta") || p.includes("birthday")) {
    return {
      type: "list",
      list: {
        title: "Cumple de mamá (fiesta en casa)",
        icon: "gift",
        color: "pink",
      },
      tasks: [
        { id: uid(), title: "Definir lista de invitados", priority: "high" },
        {
          id: uid(),
          title: "Enviar invitaciones y confirmar asistencia",
          priority: "high",
        },
        {
          id: uid(),
          title: "Comprar decoración (globos, guirnaldas)",
          priority: "medium",
        },
        { id: uid(), title: "Encargar o comprar pastel", priority: "high" },
        { id: uid(), title: "Planificar comida y bebidas", priority: "high" },
        {
          id: uid(),
          title: "Preparar música/altavoz y ambiente",
          priority: "medium",
        },
        {
          id: uid(),
          title: "Limpiar y preparar la casa",
          priority: "medium",
        },
        {
          id: uid(),
          title: "Comprar velas y menaje (platos/vasos)",
          priority: "medium",
        },
      ],
    };
  }

    return {
      type: "list",
      list: { title: "Nueva lista", icon: "list", color: "green" },
      tasks: [
        { id: uid(), title: "Definir objetivos", priority: "medium" },
        { id: uid(), title: "Hacer checklist de tareas", priority: "medium" },
        { id: uid(), title: "Asignar responsables", priority: "low" },
      ],
    };
}
