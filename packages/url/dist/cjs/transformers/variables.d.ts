import type { StringValue, Variable } from "@cld-apis/types";
export declare const convertStringValueType: (value: StringValue) => string;
export declare const computeVariable: (variable: Variable) => string;
export declare const variables: (value?: Variable | Variable[]) => string;
