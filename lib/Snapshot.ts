import Immutable from "immutable";

import ImmutableGraph from "./ImmutableGraph";
import Literal from "./Literal";
import Node from "./Node";

export default class Snapshot {
  clauses: Immutable.List<Array<Literal>>;
  assignments: Immutable.Map<String, Boolean>;
  unassigned: Immutable.Set<String>;
  implicationGraph: ImmutableGraph<Node>;
  level: number;

  constructor(
    clauses: Immutable.List<Array<Literal>>,
    assignments: Immutable.Map<String, Boolean>,
    unassigned: Immutable.Set<String>,
    implicationGraph: ImmutableGraph<Node>,
    level: number
  ) {
    this.clauses = clauses;
    this.assignments = assignments;
    this.unassigned = unassigned;
    this.implicationGraph = implicationGraph;
    this.level = level;
  }
}
