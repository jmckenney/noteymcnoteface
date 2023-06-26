import React, { useCallback, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import ThinkingEloquently from "@/components/animations/ThinkingEloquently";
import DictationInput from "@/components/DictationInput";
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import ChatBubble from "@/components/chat-ehr/ChatBubble";

const drawerBleeding = 56;

function SwipeableEdgeDrawer(props) {
  const { window } = props;
  const [open, setOpen] = useState(false);
  const [chatPrompt, setChatPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const bubbles = useRef(null);

  const [chatHistory, setChatHistory] = useState([]);

  const chat = useCallback(() => {
    setLoading(true);
    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatPrompt,
        conversation: chatHistory,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        setChatHistory(res);
        setChatPrompt("");
      });
  }, [chatHistory, chatPrompt]);

  useEffect(() => {
    bubbles.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      {!open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: "50px",
            height: "50px",
            zIndex: 10000,
            cursor: "pointer",
          }}
          onClick={toggleDrawer(!open)}
        >
          <ThinkingEloquently
            show
            width="50px"
            height="50px"
            top="0"
            left="0"
          />
        </div>
      )}
      <SwipeableDrawer
        container={container}
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box
          sx={{
            p: 2,
            maxHeight: "400px",
            overflowZ: "auto",
            position: "relative",
          }}
        >
          <Box
            sx={{
              pb: 10,
              pb: 16,
              width: "600px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            {chatHistory.map((message, index) => {
              return (
                (message.role === "user" || message.role === "assistant") &&
                message.content && <ChatBubble key={index} message={message} />
              );
            })}
            <div ref={bubbles} />
          </Box>
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              backgroundColor: "white",
              width: "600px",
            }}
          >
            <DictationInput
              disabled={loading}
              fullWidth
              onChange={(e) => {
                setChatPrompt(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevents the addition of a new line in the input when pressing 'Enter'
                  chat();
                }
              }}
              multiline
              rows={2}
              variant="outlined"
              value={chatPrompt}
              id="chat-input"
              sx={{ maxWidth: "600px", margin: "0 auto" }}
            />

            <Button onClick={chat}>Ask Macro</Button>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

SwipeableEdgeDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default SwipeableEdgeDrawer;
