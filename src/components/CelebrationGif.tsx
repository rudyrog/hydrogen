import React from "react";

const gifImages = [
  "https://media.giphy.com/media/wfL3NerAPqa8g1FPdV/giphy.gif",
  "https://media.giphy.com/media/maJfaPl0JNswFJvfoR/giphy.gif",
  "https://media.giphy.com/media/DDivDbGelclQjBtQ59/giphy.gif",
  "https://media.giphy.com/media/hryis7A55UXZNCUTNA/giphy.gif",
  "https://media.giphy.com/media/xT1XGVp95GDPgFYmUE/giphy.gif",
  "https://media.giphy.com/media/idFxmiV2dayJEqzXaW/giphy.gif",
  "https://media.giphy.com/media/Y9pvW54NNPRacOKg2D/giphy.gif",
  "https://media.giphy.com/media/hEIuLmpW9DmGA/giphy.gif",
];

export default function CelebrationGif() {
  // Randomly select a GIF from the array
  const randomGif = gifImages[Math.floor(Math.random() * gifImages.length)];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      <img
        src={randomGif}
        alt="Celebration GIF"
        className="my-5"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
        }}
      />
    </div>
  );
}
