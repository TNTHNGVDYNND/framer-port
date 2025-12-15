import { useState, useLayoutEffect } from "react";

const APPLICATION_NAME = "color-theme-toggle";

// Inline SVG so we can take advantage of currentColor (text-color)
const SvgImage = ({ src }) => {
  const svgContent = atob(src.split(",")[1]);
  return <div dangerouslySetInnerHTML={{ __html: svgContent }} />;
};

const ThemeToggle = () => {
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

  const lightIcon =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgogICAgPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNSI+PC9jaXJjbGU+CiAgICA8bGluZSB4MT0iMTIiIHkxPSIxIiB4Mj0iMTIiIHkyPSIzIj48L2xpbmU+CiAgICA8bGluZSB4MT0iMTIiIHkxPSIyMSIgeDI9IjEyIiB5Mj0iMjMiPjwvbGluZT4KICAgIDxsaW5lIHgxPSI0LjIyIiB5MT0iNC4yMiIgeDI9IjUuNjQiIHkyPSI1LjY0Ij48L2xpbmU+CiAgICA8bGluZSB4MT0iMTguMzYiIHkxPSIxOC4zNiIgeDI9IjE5Ljc4IiB5Mj0iMTkuNzgiPjwvbGluZT4KICAgIDxsaW5lIHgxPSIxIiB5MT0iMTIiIHgyPSIzIiB5Mj0iMTIiPjwvbGluZT4KICAgIDxsaW5lIHgxPSIyMSIgeTE9IjEyIiB4Mj0iMjMiIHkyPSIxMiI+PC9saW5lPgogICAgPGxpbmUgeDE9IjQuMjIiIHkxPSIxOS43OCIgeDI9IjUuNjQiIHkyPSIxOC4zNiI+PC9saW5lPgogICAgPGxpbmUgeDE9IjE4LjM2IiB5MT0iNS42NCIgeDI9IjE5Ljc4IiB5Mj0iNC4yMiI+PC9saW5lPgo8L3N2Zz4=";
  const darkIcon =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgogICAgPHBhdGggZD0iTTIxIDEyLjc5QTkgOSAwIDEgMSAxMS4yMSAzIDcgNyAwIDAgMCAyMSAxMi43OXoiPjwvcGF0aD4KPC9zdmc+";
  const icons = { dark: lightIcon, light: darkIcon };

  return (
    <div
      onClick={toggleTheme}
      className="w-6 h-6 cursor-pointer border border-neutral-500 bg-ok-500"
    >
      <SvgImage src={icons[theme]} />
    </div>
  );
};

export default ThemeToggle;
