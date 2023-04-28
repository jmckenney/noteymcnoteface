import React, { useEffect } from "react";

import { Box, Fade } from "@mui/material";
import AiProcessing from "@/components/animations/ai.json";
import Lottie from "lottie-web";

export default function ThinkingEloquently({ show }) {
  const lottieRef = React.useRef();
  useEffect(() => {
    Lottie.loadAnimation({
      container: lottieRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: AiProcessing,
    });

    return () => {
      Lottie.destroy();
    };
  }, []);
  return (
    <Fade in={show} timeout={1000}>
      <Box
        ref={lottieRef}
        sx={{
          position: "fixed",
          top: "50%",
          right: "50%",
          transform: "translate(50%, -50%)",
          zIndex: 1000,
          width: "200px",
          height: "200px",
        }}
      />
    </Fade>
  );
}