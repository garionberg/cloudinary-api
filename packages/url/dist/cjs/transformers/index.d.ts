import type { Transformation } from '@cld-apis/types';
export declare const getResize: (options: any) => string;
export declare const getBorder: (options: any) => string;
export declare const getPosition: (options: any) => string;
export declare const getTransformations: (options: any) => string[];
export declare const transform: (options: any) => Transformation;
export declare const toTransformationStr: (transformations: Transformation) => string;
export default transform;
