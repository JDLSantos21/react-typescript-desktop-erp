import { useEffect, useReducer } from "react";
import { useNavigation } from "react-router-dom";

type ProgressAction = 
  | { type: "START" }
  | { type: "STEP"; payload: number }
  | { type: "FINISH" }
  | { type: "RESET" };

const progressReducer = (state: number, action: ProgressAction) => {
  switch (action.type) {
    case "START": return 30;
    case "STEP": return action.payload;
    case "FINISH": return 100;
    case "RESET": return 0;
    default: return state;
  }
};

export const NavigationLoader = () => {
  const navigation = useNavigation();
  const [progress, dispatch] = useReducer(progressReducer, 0);

  const isLoading = navigation.state === "loading";

  useEffect(() => {
    if (isLoading) {
      dispatch({ type: "START" });
      const timer1 = setTimeout(() => dispatch({ type: "STEP", payload: 60 }), 200);
      const timer2 = setTimeout(() => dispatch({ type: "STEP", payload: 90 }), 500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      dispatch({ type: "FINISH" });
      const timer = setTimeout(() => dispatch({ type: "RESET" }), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-border">
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
