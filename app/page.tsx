'use client'

import { useEffect, useState } from "react";
import { executeStatements, SqlResponse } from "@/app/api";

export default function Home() {
  const [lastResponse, setLastResponse] = useState<SqlResponse>()


  useEffect(() => {
    executeStatements([
      "CREATE TABLE book (str text)",
      "INSERT INTO book (str) VALUES ('foo'), ('bar'), ('baz')",
      "SELECT * FROM book",
    ]).then(setLastResponse)
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {JSON.stringify(lastResponse, undefined, 2)}
    </main>
  );
}
