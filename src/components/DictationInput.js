import React, { useEffect } from "react";
import { TextField, IconButton, Stack, Box } from "@mui/material";
import { Mic } from "@mui/icons-material";
import HearingIcon from "@mui/icons-material/Hearing";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useDictationContext } from "@/hooks/DictationContext";

const DictationInput = ({ onChange, value, id, ...rest }) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  /**
   * Listening is a bit global. This helps determine which input
   * is the one utilizing the listener.
   */
  const { activeDictationId, setActiveDictationId } = useDictationContext();

  const isActive = activeDictationId === id;

  const handleDictation = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setActiveDictationId(null);
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setActiveDictationId(id);
    }
  };

  /**
   * When you stop listening, append the transcript to the value
   * and reset the transcript.
   */
  useEffect(() => {
    if (!listening && transcript) {
      // ToDo, get rid of this hack of using the existing event handler.
      onChange && onChange({ target: { value: value + " " + transcript } });
      resetTranscript();
    }
  }, [listening, transcript, onChange, resetTranscript, value, isActive]);

  return (
    <Stack direction="row" spacing={2} sx={{ position: "relative" }}>
      <TextField
        value={value}
        disabled={listening && isActive}
        onChange={onChange}
        {...rest}
      />
      <Box>
        <IconButton onClick={handleDictation}>
          {listening && isActive ? (
            <HearingIcon
              sx={{
                animation: "colorChange 3s linear infinite",
                "@keyframes colorChange": {
                  "0%": {
                    color: "white",
                  },
                  "50%": {
                    color: "green",
                  },
                  "100%": {
                    color: "white",
                  },
                },
              }}
            />
          ) : (
            <Mic />
          )}
        </IconButton>
      </Box>
      {isActive && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "-20px",
            height: "100%",
            width: "90%",
            p: 2,
            overflow: "auto",
            backgroundColor: "rgba(255, 255, 255, .9)",
          }}
        >
          {transcript}
        </Box>
      )}
    </Stack>
  );
};

export default DictationInput;
