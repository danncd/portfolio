export const THEME_KEY = "portfolio.theme.v1";
export type Theme = "light" | "dark";

// Let CSS follow the system until the visitor explicitly chooses a theme.
export const themeInitScript = `(() => {
    try {
        const theme = localStorage.getItem(${JSON.stringify(THEME_KEY)});
        if (theme === "light" || theme === "dark") {
            document.documentElement.dataset.theme = theme;
        }
    } catch {
        // The system preference still works when storage is unavailable.
    }
})();`;
