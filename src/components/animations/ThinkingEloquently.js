import React, { useEffect } from "react";

import { Box, Fade } from "@mui/material";
import AiProcessing from "@/components/animations/ai.json";
import Lottie from "lottie-web";

function ThinkingEloquently({
  show,
  width = "100px",
  height = "100px",
  top = "55px",
  left = "50%",
}) {
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
          position: "absolute",
          top: top,
          left: left,
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          width: width,
          height: height,
        }}
      />
    </Fade>
  );
}

export default React.memo(ThinkingEloquently, (prevProps, nextProps) => {
  return prevProps.show === nextProps.show;
});
