import { useEffect, useState } from "react";
import { useNavigation } from "react-router-dom";

export const NavigationLoader = () => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);

  const isLoading = navigation.state === "loading";

  useEffect(() => {
    if (isLoading) {
      // Simular progreso
      setProgress(30);
      const timer1 = setTimeout(() => setProgress(60), 200);
      const timer2 = setTimeout(() => setProgress(90), 500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      // Completar al 100% y luego resetear
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 300);
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
