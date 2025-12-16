import React from "react";

const themeCard = () => {
  const heading = "Theme Toggle Test";
  const text =
    "This is a test page for the dark/light theme toggle functionality.";

  return (
    <div className="flex min-h-screen min-w-full flex-col items-center justify-center bg-neutral-950">
      <article className="relative w-[80%] max-w-[500px] rounded-lg border border-neutral-500 bg-neutral-900 p-8 shadow-2xl text-neutral-300">
        <h1 className="text-2xl font-bold text-primary-400">{heading}</h1>
        <p className=" py-8">{text}</p>
        <div className={"grid grid-cols-11 gap-[2px] z-50"}>
          {["neutral", "primary", "ok", "warn", "fail"].map(
            (color, colorIndex) =>
              [
                "50",
                "100",
                "200",
                "300",
                "400",
                "500",
                "600",
                "700",
                "800",
                "900",
                "950",
              ].map((tone, toneIndex) => (
                <div
                  key={`key-${colorIndex}-${toneIndex}`}
                  className={`bg-${color}-${tone} m-0 p-0 h-8`}
                ></div>
              ))
          )}
        </div>
      </article>
    </div>
  );
};

export default themeCard;
