import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-4">GhostHosting</h1>
        <p className="text-lg">Sistema de Hospedagem de Arquivos</p>
        <div className="mt-8 space-y-4">
          <Link href="/image-host" className="block w-full max-w-md mx-auto bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition text-center">
            Upload de Arquivos
          </Link>
          <Link href="/gallery" className="block w-full max-w-md mx-auto bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition text-center">
            Galeria
          </Link>
        </div>
      </div>
    </main>
  );
}
