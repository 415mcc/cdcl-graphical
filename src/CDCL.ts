import Immutable, { Stack } from "immutable";
import ImmutableGraph from "./ImmutableGraph";
import Literal from "./Literal";
import Node from "./Node";

export default class CDCL {
    clauses: Array<Array<Literal>>;
    assignments: Map<String, Boolean>;
    unassigned: Set<String>;
    implicationGraph: ImmutableGraph<Node>;
    level: number;

    static readonly CONFLICT: boolean = true;

    constructor(clauses: Array<Array<Literal>>) {
        this.clauses = [];
        clauses.forEach(c => {
            const clause: Array<Literal> = [];
            c.forEach(literal => {
                clause.push({...literal});
                this.unassigned.add(literal.symbol);
            });
            this.clauses.push(clause);
        });
        this.assignments = new Map();
        this.level = 0;
    }

    // returns a map that is a satisfying assignment
    solve = (): Map<String, Boolean> => {
        while (this.unassigned.size > 0) {
            while (this.unitProp() === CDCL.CONFLICT) {
                if (this.level === 0) {
                    return new Map<String, Boolean>();
                } else {
                    let [b, C] = this.analyzeConflict();
                    this.clauses.push(C);
                    this.removeAllAtLevel(this.level);
                    this.level = b;
                }
            }

            this.decideLiteral();
            this.level++;
        }
        return this.assignments;
    }

    unitProp = (): boolean => {
        let [lit, ind] = this.findUnitClause();

        while (lit) {
            this.assignments.set(lit.symbol, lit.sign);
            this.unassigned.delete(lit.symbol);


            [lit, ind] = this.findUnitClause();
        }

        return CDCL.CONFLICT;
    }

    analyzeConflict = (): [number, Array<Literal>] => {
        return [0, []];
    }

    removeAllAtLevel = (level: number): void => {
        for (const vertex of this.implicationGraph.getVertices()){
            if (vertex.decisionLevel === level) {
                this.implicationGraph = this.implicationGraph.removeVertex(vertex);
            }
        }
    }

    decideLiteral = (): void => {
        let literal: string = this.unassigned.values[0];
        this.unassigned.delete(literal);
        this.assignments.set(literal, true);

    }

    findUnitClause = (): [Literal, number] => {
        let simplifiedClause: Literal = undefined;
        let clauseIndex: number = this.clauses.findIndex(clause => {
            const evaluatedClause = this.evaluateClause(clause);
            if (typeof evaluatedClause !== "boolean" && evaluatedClause.length === 1) {
                simplifiedClause = evaluatedClause[0];
                return true;
            }
        });
        return clauseIndex !== -1 ? [simplifiedClause, clauseIndex] : undefined
    }

    // evaluates a given clause, return true if it's SAT, false if UNSAT, or a clause with unassigned variables
    // if not completely evaluated
    evaluateClause = (clause: Array<Literal>): Array<Literal> | boolean => {
        let simplifiedClause: Array<Literal> = [];

        clause.forEach(lit => {
            let result: boolean | Literal = this.evaluateLiteral(lit);
            if (result === lit) {
                simplifiedClause.push(lit);
            } else if (result === true) {
                return true;
            }
        })

        return simplifiedClause.length !== 0 ? simplifiedClause : false;
    }

    evaluateLiteral = (literal: Literal): boolean | Literal => {
        return this.assignments.has(literal.symbol) ? this.assignments.get(literal.symbol) === literal.sign : literal;
    }

    // finds and returns all UIPs in the implication graph
    findAllUIPs = (): Set<Node> => {
        let vertices: Immutable.Set<Node> = this.implicationGraph.getVertices();
        let highestDecisionLiteralNode: Node = vertices.find(n => n.decisionLevel === this.level && n.isDecisionLiteral);

        let potentialUIPs: Set<Node> = new Set<Node>(vertices.toSet());
        let allPaths: Array<Set<Node>> = this.findAllPathsFromNode(highestDecisionLiteralNode);

        allPaths.forEach(path => potentialUIPs = this.intersection(potentialUIPs, path));

        return potentialUIPs;
    }

    // finds and returns all paths starting at the node
    findAllPathsFromNode = (node: Node): Array<Set<Node>> => {
        let allPaths: Array<Set<Node>> = new Array<Set<Node>>();
        let seen: Set<Node> = new Set<Node>();
        let path: Array<Node> = new Array<Node>();
        path.push(node);

        let findAllPathsHelper = (allPaths: Array<Set<Node>>, seen: Set<Node>, path: Array<Node>): void => {
            let n: Node = path[path.length - 1];

            if (seen.has(n)) {
                return;
            }

            seen.add(n);

            let neighbors: Immutable.Set<Node> = this.implicationGraph.getNeighbors(n);

            neighbors.forEach(neighbor => {
                // this is the conflict clause
                if (neighbor.literal === undefined) {
                    let pathSet: Set<Node> = new Set<Node>(path);
                    allPaths.push(pathSet);
                } else {
                    path.push(neighbor);
                    findAllPathsHelper(allPaths, seen, path);
                    path.pop();
                }
            });
        }

        findAllPathsHelper(allPaths, seen, path);

        return allPaths;
    }

    intersection = (set1: Set<Node>, set2: Set<Node>): Set<Node> => {
        let intersect: Set<Node> = new Set<Node>();

        set1.forEach(elem => set2.has(elem) ? intersect.add(elem): false);

        return intersect;
    }
}