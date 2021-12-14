import Snapshot from "../lib/Snapshot";
import ImmutableGraph from "../lib/ImmutableGraph";
import Node from "../lib/Node";
import { Network, DataSet } from "vis-network/standalone";

import "vis-network/styles/vis-network.css";
import { useEffect, useRef } from "react";

interface GraphProps {
  snapshot: Snapshot;
}

const Graph = ({ snapshot }: GraphProps) => {
  const visRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visRef.current) return;

    new Network(visRef.current, toVis(snapshot.implicationGraph), {});
  }, [visRef, snapshot.implicationGraph]);

  return <div className="h-full w-full" ref={visRef} />;
};

export default Graph;

const toVis = (impGraph: ImmutableGraph<Node>) => {
  // id usage here relies on the invariant that only one node exists for each
  // proposition, which could be violated in the case of a bug.

  return {
    nodes: new DataSet(
      impGraph
        .getVertices()
        .toArray()
        .map((vertex) => ({
          id: vertex.literal.symbol,
          label: vertex.toString(),
          shape:
            vertex.isDecisionLiteral || vertex.isConflictNode
              ? "ellipse"
              : "box",
        }))
    ),
    edges: new DataSet(
      impGraph
        .getEdges()
        .toArray()
        .flatMap(([src, dsts]) =>
          dsts.toArray().map((dst) => ({
            id: `${src.literal.symbol}-${dst.literal.symbol}`,
            from: src.literal.symbol,
            to: dst.literal.symbol,
            arrows: "to",
          }))
        )
    ),
  };
};
