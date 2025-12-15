import { useLayoutEffect, useState } from "react";

const APPLICATION_NAME = "color-theme-toggle";

// Inline SVG so we can take advantage of currentColor (text-color)
const SvgImage = ({ src }) => {
  const svgContent = atob(src.split(",")[1]);
  return <div dangerouslySetInnerHTML={{ __html: svgContent }} />;
};

const themeCard = () => {
  const lightTheme = "light";
  const darkTheme = "dark";

  const getDataTheme = (theme) =>
    theme === darkTheme ? darkTheme : lightTheme;
  const getToggledTheme = (theme) =>
    theme === darkTheme ? lightTheme : darkTheme;

  const initialTheme = localStorage.getItem(APPLICATION_NAME) || lightTheme;
  const [theme, setTheme] = useState(initialTheme);

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", getDataTheme(theme));
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = getToggledTheme(theme);
    setTheme(newTheme);
    localStorage.setItem(APPLICATION_NAME, getDataTheme(newTheme));
  };

  const heading = "Theme Toggle Test";
  const text =
    "This is a test page for the dark/light theme toggle functionality.";
  const lightIcon =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgogICAgPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNSI+PC9jaXJjbGU+CiAgICA8bGluZSB4MT0iMTIiIHkxPSIxIiB4Mj0iMTIiIHkyPSIzIj48L2xpbmU+CiAgICA8bGluZSB4MT0iMTIiIHkxPSIyMSIgeDI9IjEyIiB5Mj0iMjMiPjwvbGluZT4KICAgIDxsaW5lIHgxPSI0LjIyIiB5MT0iNC4yMiIgeDI9IjUuNjQiIHkyPSI1LjY0Ij48L2xpbmU+CiAgICA8bGluZSB4MT0iMTguMzYiIHkxPSIxOC4zNiIgeDI9IjE5Ljc4IiB5Mj0iMTkuNzgiPjwvbGluZT4KICAgIDxsaW5lIHgxPSIxIiB5MT0iMTIiIHgyPSIzIiB5Mj0iMTIiPjwvbGluZT4KICAgIDxsaW5lIHgxPSIyMSIgeTE9IjEyIiB4Mj0iMjMiIHkyPSIxMiI+PC9saW5lPgogICAgPGxpbmUgeDE9IjQuMjIiIHkxPSIxOS43OCIgeDI9IjUuNjQiIHkyPSIxOC4zNiI+PC9saW5lPgogICAgPGxpbmUgeDE9IjE4LjM2IiB5MT0iNS42NCIgeDI9IjE5Ljc4IiB5Mj0iNC4yMiI+PC9saW5lPgo8L3N2Zz4=";
  const darkIcon =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgogICAgPHBhdGggZD0iTTIxIDEyLjc5QTkgOSAwIDEgMSAxMS4yMSAzIDcgNyAwIDAgMCAyMSAxMi43OXoiPjwvcGF0aD4KPC9zdmc+";
  const icons = { dark: lightIcon, light: darkIcon };

  return (
    <div className="flex min-h-screen min-w-full flex-col items-center justify-center">
      <article className="relative w-[80%] max-w-[500px] rounded-lg border border-neutral-500 bg-neutral-900 p-8 shadow-2xl text-neutral-300">
        <div
          onClick={toggleTheme}
          className="absolute top-0 right-0 mr-8 mt-8 cursor-pointer w-6 h-6"
        >
          <SvgImage src={icons[theme]} />
        </div>
        <h1 className="bg-green-400 text-2xl font-bold text-primary-400">
          {heading}
        </h1>
        <p className="bg-red-500 py-8">{text}</p>
        <div className={"grid grid-cols-11 gap-[2px]"}>
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
