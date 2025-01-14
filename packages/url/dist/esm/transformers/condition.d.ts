import type { Condition, ConditionExpression, Expression } from "@cld-apis/types";
export declare const computeCondition: (conditionObj: ConditionExpression) => {
    expression: string;
    transformations: string;
};
export declare const mapCharacteristic: (expression: string) => any;
export declare const computeConditionExpression: (expression: Expression) => string;
export declare const condition: (conditionObj?: Condition) => string | string[];
