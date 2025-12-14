export type UIAction =
  | { type: "set_chart"; chart: "pie" | "bar" | "line" }
  | { type: "apply_filter"; filter: string }
  | { type: "reset_view" };

export function handleUIAction(
  action: UIAction,
  handlers: {
    setChart?: (chart: string) => void;
    applyFilter?: (filter: string) => void;
    resetView?: () => void;
  }
) {
  switch (action.type) {
    case "set_chart":
      handlers.setChart?.(action.chart);
      break;

    case "apply_filter":
      handlers.applyFilter?.(action.filter);
      break;

    case "reset_view":
      handlers.resetView?.();
      break;

    default:
      console.warn("Unknown UI action:", action);
  }
}
