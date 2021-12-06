import Literal from "./Literal";

export default class Node {
  decisionLevel: number;
  literal: Literal;
  clause: number;
  isDecisionLiteral: boolean;
  isConflictNode: boolean;

  constructor(
    decisionLevel: number,
    literal: Literal,
    clause: number,
    isDecisionLiteral: boolean,
    isConflictNode: boolean = false
  ) {
    this.decisionLevel = decisionLevel;
    this.literal = literal;
    this.clause = clause;
    this.isDecisionLiteral = isDecisionLiteral;
    this.isConflictNode = isConflictNode;
  }

  // taken from here: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
  //   hashCode = (): number => {
  //     let stringified: string = JSON.stringify(this);
  //     var hash = 0,
  //       i,
  //       chr;
  //     if (stringified.length === 0) return hash;
  //     for (i = 0; i < stringified.length; i++) {
  //       chr = stringified.charCodeAt(i);
  //       hash = (hash << 5) - hash + chr;
  //       hash |= 0; // Convert to 32bit integer
  //     }
  //     return hash;
  //   };

  getLabel = (): string => {
    if (this.isConflictNode) {
      return `K : C_${this.clause + 1}`;
    }

    return `${this.literal.sign ? "" : "not "}${this.literal.symbol}@${
      this.decisionLevel
    }${this.isDecisionLiteral ? "" : ` : ${this.clause + 1}`}`;
  };
}
