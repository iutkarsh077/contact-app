export default function manifest() {
  return {
    name: "Constituency Contact Desk — MLA Office",
    short_name: "Contact Desk",
    description:
      "Centralized MLA office contact management, citizen developmental requests, appointments, and volunteer coordination platform.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f766e",
    orientation: "portrait",
    categories: ["government", "productivity", "utilities"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
