"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.url = exports.getPathToAsset = exports.getResourceType = exports.getPrefix = exports.getSubDomain = exports.getVersion = exports.encodePublicId = exports.getSignature = exports.extractPublicId = void 0;
var constants_1 = require("./constants");
var utils_1 = require("@cld-apis/utils");
var transformers_1 = require("./transformers");
var SHARED_CDNS = ["cloudinary-a.akamaihd.net", "res.cloudinary.com"];
var CLOUDINARY_REGEX = /^.+\.cloudinary\.com\/(?:[^\/]+\/)(?:(image|video|raw)\/)?(?:(upload|fetch|private|authenticated|sprite|facebook|twitter|youtube|vimeo)\/)?(?:(?:[^_/]+_[^,/]+,?)*\/)?(?:v(\d+|\w{1,2})\/)?([^\.^\s]+)(?:\.(.+))?$/;
exports.extractPublicId = function (link) {
    if (!link)
        return '';
    var parts = CLOUDINARY_REGEX.exec(link);
    return parts && parts.length > 2 ? parts[parts.length - 2] : link;
};
exports.getSignature = function (signature) {
    if (!signature)
        return '';
    var isFormatted = signature.indexOf('s--') === 0 && signature.endsWith('--');
    return isFormatted ? signature : "s--" + signature + "--";
};
var doesPathNeedVersion = function (publicId) { return !publicId.match(/^v[0-9]+/) && !publicId.match(/^https?:\//); };
exports.encodePublicId = function (publicId) { return encodeURIComponent(publicId).replace(/%3A/g, ':').replace(/%2F/g, '/'); };
exports.getVersion = function (publicId, _a) {
    var _b = _a.forceVersion, forceVersion = _b === void 0 ? false : _b, _c = _a.version, version = _c === void 0 ? 1 : _c;
    var needVersion = doesPathNeedVersion(publicId) && forceVersion;
    return needVersion ? "v" + version : '';
};
exports.getSubDomain = function (publicId, _a) {
    var _b = _a.cdnSubdomain, cdnSubdomain = _b === void 0 ? false : _b, cname = _a.cname;
    if (!cname)
        return "res" + (cdnSubdomain ? "-" + publicId : '');
    return cdnSubdomain ? "a" + publicId + "." : '';
};
exports.getPrefix = function (publicId, _a) {
    var cloudName = _a.cloudName, _b = _a.privateCdn, privateCdn = _b === void 0 ? false : _b, _c = _a.cdnSubdomain, cdnSubdomain = _c === void 0 ? false : _c, secureDistribution = _a.secureDistribution, cname = _a.cname, _d = _a.secure, secure = _d === void 0 ? true : _d;
    var hasSecureDistribution = secure && secureDistribution && !SHARED_CDNS.includes(secureDistribution);
    var protocol = "http" + (secure ? 's' : '') + "://";
    var cdn = privateCdn && !hasSecureDistribution ? cloudName + "-" : '';
    var accountPath = privateCdn ? '' : "/" + cloudName;
    var subDomain = hasSecureDistribution ? '' : exports.getSubDomain(publicId, { cdnSubdomain: cdnSubdomain, cname: cname });
    var host = hasSecureDistribution ? secureDistribution : (cname || '.cloudinary.com');
    return "" + protocol + cdn + subDomain + host + accountPath;
};
exports.getResourceType = function (_a) {
    var _b = _a.resourceType, resourceType = _b === void 0 ? utils_1.RESOURCE_TYPES.IMAGE : _b, _c = _a.storageType, storageType = _c === void 0 ? utils_1.STORAGE_TYPES.UPLOAD : _c, urlSuffix = _a.urlSuffix, useRootPath = _a.useRootPath, shortern = _a.shortern;
    var isUploadImage = resourceType === utils_1.RESOURCE_TYPES.IMAGE && storageType === utils_1.STORAGE_TYPES.UPLOAD;
    var useRootForNonUploadedImages = useRootPath && !isUploadImage;
    var shortenForUploadedImages = shortern && isUploadImage;
    var typePath = resourceType + "/" + storageType;
    if (useRootForNonUploadedImages) {
        throw new Error("Root path only supported for image/upload");
    }
    if (useRootPath)
        return "" + (shortenForUploadedImages ? 'iu' : '');
    if (urlSuffix) {
        var seo = constants_1.SEO_TYPES[typePath];
        if (seo) {
            return seo;
        }
        throw new Error("URL Suffix only supported for " + Object.keys(constants_1.SEO_TYPES).join(', '));
    }
    return typePath;
};
var isUrl = function (str) { return str && !!str.match(/^https?:\//); };
exports.getPathToAsset = function (publicId, _a) {
    var _b = _a.urlSuffix, urlSuffix = _b === void 0 ? '' : _b;
    if (isUrl(publicId))
        return exports.encodePublicId(publicId);
    var path = [publicId, urlSuffix].filter(Boolean).join('/');
    return exports.encodePublicId(path);
};
exports.url = function (publicId, cloud, options) {
    if (cloud === void 0) { cloud = { cloudName: '' }; }
    if (!cloud.cloudName) {
        throw Error('cloudName is required!');
    }
    var _publicId = isUrl(publicId) ? exports.extractPublicId(publicId) : publicId;
    var version = exports.getVersion(_publicId, cloud);
    var prefix = exports.getPrefix(_publicId, cloud);
    var signature = exports.getSignature(cloud.signature);
    var typePath = exports.getResourceType(cloud);
    var pathToAsset = exports.getPathToAsset(_publicId, { urlSuffix: cloud.urlSuffix });
    var format = options.fetchFormat || options.format || 'auto';
    var $options = __assign(__assign({ quality: 'auto' }, options), { format: format });
    var trans = transformers_1.toTransformationStr(transformers_1.transform($options));
    return [prefix, typePath, signature, trans, version, pathToAsset].filter(Boolean).join('/').replace(' ', '%20');
};
exports.default = exports.url;
