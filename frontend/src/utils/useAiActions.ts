import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type AiAction =
  | { action: "set_chart"; payload: { chart: string } }
  | { action: "apply_filter"; payload: { field: string; value: any } }
  | { action: "navigate"; payload: { route: string } };

export function useAiActions(handlers: {
  setChart?: (chart: string) => void;
  applyFilter?: (field: string, value: any) => void;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: any) => {
      const action = e.detail;

      switch (action.action) {
        case "set_chart":
          handlers.setChart?.(action.payload.chart);
          break;

        case "apply_filter":
          handlers.applyFilter?.(action.payload.field, action.payload.value);
          break;

        case "navigate":
          navigate(action.payload.route);
          break;
      }
    };

    window.addEventListener("ai:action", handler);

    return () => {
      window.removeEventListener("ai:action", handler);
    };
  }, []);
}
