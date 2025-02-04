import type { CloudConfig, TransformerOption, TransformerVideoOption, ResourceType, StorageType } from '@cld-apis/types';
export declare const extractPublicId: (link: string) => string;
export declare const getSignature: (signature?: string) => string;
export declare const encodePublicId: (publicId: string) => string;
export declare const getVersion: (publicId: string, { forceVersion, version }: {
    forceVersion?: boolean;
    version?: string | number;
}) => string;
export declare const getSubDomain: (publicId: string, { cdnSubdomain, cname }: {
    cdnSubdomain?: boolean;
    cname?: string;
}) => string;
export declare const getPrefix: (publicId: string, { cloudName, privateCdn, cdnSubdomain, secureDistribution, cname, secure, }: CloudConfig) => string;
export declare const getResourceType: ({ resourceType, storageType, urlSuffix, useRootPath, shortern }: {
    resourceType?: ResourceType;
    storageType?: StorageType;
    urlSuffix?: string;
    useRootPath?: boolean;
    shortern?: boolean;
}) => string;
export declare const getPathToAsset: (publicId: string, { urlSuffix }: {
    urlSuffix?: string;
}) => string;
export declare const url: (publicId: string, cloud?: CloudConfig, options?: TransformerOption | TransformerVideoOption) => string;
export default url;
