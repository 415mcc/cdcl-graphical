import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import { useMemo } from "react";

import Button from "../components/Button";
import Graph from "../components/Graph";

import CDCL from "../lib/CDCL";
import Literal from "../lib/Literal";
import ImmutableGraph from "../lib/ImmutableGraph";
import Node from "../lib/Node";
import { Network, DataSet } from "vis-network/standalone";

function solveExample1_4() {
  const cdcl = new CDCL([
    [
      new Literal(false, "p1"),
      new Literal(true, "p2"),
      new Literal(false, "p4"),
    ],
    [
      new Literal(false, "p1"),
      new Literal(false, "p2"),
      new Literal(true, "p3"),
    ],
    [new Literal(false, "p3"), new Literal(false, "p4")],
    [new Literal(true, "p4"), new Literal(true, "p5"), new Literal(true, "p6")],
    [new Literal(false, "p5"), new Literal(true, "p7")],
    [
      new Literal(false, "p6"),
      new Literal(true, "p7"),
      new Literal(false, "p8"),
    ],
  ]);

  console.log(cdcl.solve());
  console.log(cdcl.history);
}

const Home: NextPage = () => {
  const cdcl = useMemo(() => {
    const cdcl = new CDCL([
      [
        new Literal(false, "p1"),
        new Literal(true, "p2"),
        new Literal(false, "p4"),
      ],
      [
        new Literal(false, "p1"),
        new Literal(false, "p2"),
        new Literal(true, "p3"),
      ],
      [new Literal(false, "p3"), new Literal(false, "p4")],
      [
        new Literal(true, "p4"),
        new Literal(true, "p5"),
        new Literal(true, "p6"),
      ],
      [new Literal(false, "p5"), new Literal(true, "p7")],
      [
        new Literal(false, "p6"),
        new Literal(true, "p7"),
        new Literal(false, "p8"),
      ],
      [
        new Literal(false, "p1"),
        new Literal(false, "p8"),
        new Literal(false, "p2"),
        new Literal(false, "p7"),
        new Literal(false, "p6"),
        new Literal(false, "p5"),
        new Literal(false, "p3"),
        new Literal(true, "p4"),
      ],
      [
        new Literal(false, "p1"),
        new Literal(false, "p8"),
        new Literal(true, "p2"),
        new Literal(false, "p7"),
        new Literal(false, "p6"),
        new Literal(false, "p5"),
        new Literal(false, "p3"),
        new Literal(true, "p4"),
      ],
      [
        new Literal(false, "p1"),
        new Literal(false, "p8"),
        new Literal(true, "p2"),
        new Literal(false, "p7"),
        new Literal(false, "p6"),
        new Literal(false, "p5"),
        new Literal(true, "p3"),
        new Literal(true, "p4"),
      ],
      [
        new Literal(false, "p1"),
        new Literal(false, "p8"),
        new Literal(false, "p2"),
        new Literal(false, "p7"),
        new Literal(false, "p6"),
        new Literal(true, "p5"),
        new Literal(false, "p3"),
        new Literal(true, "p4"),
      ],
    ]);

    cdcl.solve();

    return cdcl;
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {cdcl.history.map((snap, idx) => (
        <Graph key={idx} snapshot={snap} />
      ))}

      {/* <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a className="text-blue-600" href="https://nextjs.org">
            Next.js!
          </a>
        </h1>

        <Button title="hello" onClick={solveExample1_4} />

        <p className="mt-3 text-2xl">
          Get started by editing{" "}
          <code className="p-3 font-mono text-lg bg-gray-100 rounded-md">
            pages/index.js
          </code>
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <a
            href="https://nextjs.org/docs"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Documentation &rarr;</h3>
            <p className="mt-4 text-xl">
              Find in-depth information about Next.js features and API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Learn &rarr;</h3>
            <p className="mt-4 text-xl">
              Learn about Next.js in an interactive course with quizzes!
            </p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Examples &rarr;</h3>
            <p className="mt-4 text-xl">
              Discover and deploy boilerplate example Next.js projects.
            </p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Deploy &rarr;</h3>
            <p className="mt-4 text-xl">
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  );
};

export default Home;
