export default function Footer() {
  return (
    <footer className="w-full text-center py-4 text-sm">
      Made by{" "}
      <a
        href="https://github.com/nikirack"
        className="underline"
      >
        nikirack
      </a>
      {" · "}
      This project is open source{" "}
      <a
        href="#"
        className="underline"
      >code</a>
      {" · "}
      <a
        href="/tos"
        className="underline"
      >Terms of Service</a>
    </footer>
  )
}