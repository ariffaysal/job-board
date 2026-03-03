export default function Footer() {
  return (
    <footer className="footer footer-center p-4 bg-gray-800 text-white mt-auto">
      <div>
        <p className="font-semibold">
          Agency Management System © {new Date().getFullYear()}
        </p>
        <p className="text-sm text-gray-400">
          All rights reserved | Built with Next.js & NestJS
        </p>
      </div>
    </footer>
  );
}

