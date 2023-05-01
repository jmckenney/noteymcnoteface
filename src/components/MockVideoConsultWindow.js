import React, { useEffect } from "react";
import { Card } from "@mui/material";
import Draggable from "react-draggable";
import Image from "next/image";
import { useAnchorContext } from "@/hooks/AnchorProvider";

export default function DraggableDialog() {
  const { setIsDraggableVideoConsultMounted, draggableVideoConsultAnchorRef } =
    useAnchorContext();
  useEffect(() => {
    setIsDraggableVideoConsultMounted(true);
    return () => setIsDraggableVideoConsultMounted(false);
  }, [setIsDraggableVideoConsultMounted]);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <Draggable>
        <div ref={draggableVideoConsultAnchorRef}>
          <Card
            style={{
              width: "500px",
              height: "400px",
              background: "linear-gradient(180deg, #0C011E 0%, #18013E 100%)",
              color: "#ffffff",
              pointerEvents: "all",
              position: "relative",
            }}
          >
            <Image
              src="/images/man.jpg"
              alt="A description of the image"
              width={500}
              height={300}
              style={{ pointerEvents: "none" }}
            />
            <svg
              style={{ position: "absolute", right: "10px", bottom: "10px" }}
              width="100"
              viewBox="0 0 161 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="161" height="64" rx="32" fill="#9A5CFF" />
              <g clip-path="url(#clip0_1904_90000)">
                <path
                  d="M54.3926 27.9999C52.2592 27.9999 50.1926 28.3333 48.2592 28.9599V33.0933C48.2592 33.6133 47.9526 34.0799 47.5126 34.2933C46.2059 34.9466 45.0192 35.7866 43.9659 36.7599C43.7259 36.9999 43.3926 37.1333 43.0326 37.1333C42.6592 37.1333 42.3259 36.9866 42.0859 36.7466L38.7792 33.4399C38.5392 33.2133 38.3926 32.8799 38.3926 32.5066C38.3926 32.1333 38.5392 31.7999 38.7792 31.5599C42.8459 27.7066 48.3392 25.3333 54.3926 25.3333C60.4459 25.3333 65.9392 27.7066 70.0059 31.5599C70.2459 31.7999 70.3926 32.1333 70.3926 32.5066C70.3926 32.8799 70.2459 33.2133 70.0059 33.4533L66.6992 36.7599C66.4592 36.9999 66.1259 37.1466 65.7526 37.1466C65.3926 37.1466 65.0592 36.9999 64.8192 36.7733C63.7659 35.7866 62.5659 34.9599 61.2592 34.3066C60.8192 34.0933 60.5126 33.6399 60.5126 33.1066V28.9733C58.5926 28.3333 56.5259 27.9999 54.3926 27.9999Z"
                  fill="white"
                />
              </g>
              <path
                d="M97.0078 36.5586H90.6211V33.0039H96.6465V30.7383H90.6211V27.3398H97.0078V24.9082H87.6719V39H97.0078V36.5586ZM98.6926 39H101.544V32.9941C101.544 31.6367 102.355 30.6992 103.634 30.6992C104.913 30.6992 105.558 31.4805 105.558 32.8477V39H108.409V32.252C108.409 29.8008 107.101 28.3359 104.777 28.3359C103.165 28.3359 102.062 29.0977 101.505 30.3965H101.446V28.5312H98.6926V39ZM113.903 39.166C115.446 39.166 116.657 38.3555 117.164 37.2031H117.213V39H120.026V24.9082H117.174V30.3281H117.116C116.608 29.166 115.436 28.3652 113.922 28.3652C111.295 28.3652 109.635 30.4258 109.635 33.7461C109.635 37.0957 111.286 39.166 113.903 39.166ZM114.87 30.6504C116.286 30.6504 117.194 31.8613 117.194 33.7656C117.194 35.6797 116.286 36.8711 114.87 36.8711C113.434 36.8711 112.555 35.6895 112.555 33.7656C112.555 31.8516 113.434 30.6504 114.87 30.6504Z"
                fill="white"
              />
              <defs>
                <clipPath id="clip0_1904_90000">
                  <rect
                    width="32"
                    height="32"
                    fill="white"
                    transform="translate(38.3926 16)"
                  />
                </clipPath>
              </defs>
            </svg>
          </Card>
        </div>
      </Draggable>
    </div>
  );
}
