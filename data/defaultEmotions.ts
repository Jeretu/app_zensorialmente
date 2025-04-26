export const defaultEmotionMatrix = {
  xAxis: "Placer",
  yAxis: "Energía",
  emotions: [
    // Row 0 (High Energy)
    { x: 0, y: 0, label: "Estresado", color: "#e11d48" },
    { x: 1, y: 0, label: "Enfurecido", color: "#dc2626" },
    { x: 2, y: 0, label: "Nervioso", color: "#f59e0b" },
    { x: 3, y: 0, label: "Entusiasmado", color: "#16a34a" },
    { x: 4, y: 0, label: "Eufórico", color: "#059669" },

    // Row 1
    { x: 0, y: 1, label: "Tenso", color: "#ef4444" },
    { x: 1, y: 1, label: "Irritado", color: "#f97316" },
    { x: 2, y: 1, label: "Indignado", color: "#84cc16" },
    { x: 3, y: 1, label: "Alegre", color: "#22c55e" },
    { x: 4, y: 1, label: "Encantado", color: "#10b981" },

    // Row 2 (Medium Energy)
    { x: 0, y: 2, label: "Molesto", color: "#f97316" },
    { x: 1, y: 2, label: "Confuso", color: "#eab308" },
    { x: 2, y: 2, label: "Neutral", color: "#6b7280" },
    { x: 3, y: 2, label: "Contento", color: "#3b82f6" },
    { x: 4, y: 2, label: "Feliz", color: "#06b6d4" },

    // Row 3
    { x: 0, y: 3, label: "Triste", color: "#6366f1" },
    { x: 1, y: 3, label: "Decepcionado", color: "#8b5cf6" },
    { x: 2, y: 3, label: "Desganado", color: "#0ea5e9" },
    { x: 3, y: 3, label: "Satisfecho", color: "#0284c7" },
    { x: 4, y: 3, label: "Realizado", color: "#0369a1" },

    // Row 4 (Low Energy)
    { x: 0, y: 4, label: "Deprimido", color: "#7c3aed" },
    { x: 1, y: 4, label: "Miserable", color: "#8b5cf6" },
    { x: 2, y: 4, label: "Desanimado", color: "#6366f1" },
    { x: 3, y: 4, label: "Confortable", color: "#4f46e5" },
    { x: 4, y: 4, label: "Tranquilo", color: "#4338ca" },
  ],
}
