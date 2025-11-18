"use client";

import { useEffect, useState } from "react";
import { HelloResponse } from "@monorepo/shared";

export default function Home(): JSX.Element {
  const [data, setData] = useState<HelloResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await fetch("http://localhost:3001/hello");
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const result: HelloResponse = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Monorepo Web App
        </h1>
        {loading && <p className="text-center">Loading...</p>}
        {error && (
          <p className="text-center text-red-500">Error: {error}</p>
        )}
        {data && (
          <p className="text-center text-2xl text-green-600">
            {data.message}
          </p>
        )}
      </div>
    </main>
  );
}

