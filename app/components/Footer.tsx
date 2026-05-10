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
      <a
        href="https://github.com/nikirack/E2EBin"
        className="underline"
      >This project is open source</a>
      {" · "}
      <a
        href="/tos"
        className="underline"
      >Terms of Service</a>
    </footer>
  )
}