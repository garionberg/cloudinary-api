"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTransformationStr = exports.transform = exports.getTransformations = exports.getPosition = exports.getBorder = exports.getResize = void 0;
var constants_1 = require("../constants");
var arithmetic_1 = require("../constants/arithmetic");
var condition_1 = require("./condition");
var effect_1 = require("./effect");
var expression_1 = require("./expression");
var flags_1 = require("./flags");
var rawTransformation_1 = require("./rawTransformation");
var variables_1 = require("./variables");
var fps_1 = require("./video/fps");
var offset_1 = require("./video/offset");
var resize_1 = require("./resize");
var border_1 = require("./border");
var position_1 = require("./position");
exports.getResize = function (options) {
    var hasResize = options.resize || options.width || options.height || options.aspectRatio;
    if (!hasResize)
        return '';
    return resize_1.resize(options.resize || { width: options.width, height: options.height, type: options.crop, aspectRatio: options.aspectRatio });
};
exports.getBorder = function (options) {
    if (!options.border)
        return '';
    var borderModification = (typeof options.border === 'string') ? "bo_" + options.border : border_1.border(options.border);
    return borderModification;
};
exports.getPosition = function (options) {
    if (!options.x && !options.y && !options.position)
        return '';
    return position_1.position(options.position || { x: options.x, y: options.y });
};
exports.getTransformations = function (options) {
    var result = [];
    result.push(variables_1.variables(options.variables));
    result.push(exports.getResize(options));
    result.push(exports.getBorder(options));
    result.push(exports.getPosition(options));
    result.push(fps_1.fps(options.fps));
    result.push(offset_1.offset(options.offset));
    for (var modifier in options) {
        var value = options[modifier];
        var mapping = constants_1.TRANSFORMERS[modifier];
        if (!mapping || !value)
            continue;
        var isAcceptedNumberic = arithmetic_1.AcceptNumbericVars.includes(modifier);
        result.push(mapping + "_" + (isAcceptedNumberic ? expression_1.formatValue(value) : value));
    }
    result.push(effect_1.effect(options.effect));
    result.push(flags_1.flags(options.flags));
    result.push(rawTransformation_1.rawTransformation(options.rawTransformation));
    result.push(condition_1.condition(options.condition));
    return result.filter(Boolean);
};
exports.transform = function (options) {
    var transformations = exports.getTransformations(options);
    var chainedTransformations = options.transformation || options.chaining;
    if (chainedTransformations && Array.isArray(chainedTransformations)) {
        chainedTransformations.forEach(function (chained) {
            var chainedTransformation = exports.getTransformations(chained);
            chainedTransformation.length > 0 && transformations.push(chainedTransformation);
        });
    }
    return transformations.filter(Boolean);
};
exports.toTransformationStr = function (transformations) { return transformations.reduce(function (str, transformation) {
    var isChained = Array.isArray(transformation);
    var separation = isChained ? '/' : ',';
    return "" + str + (str ? separation : '') + transformation.toString();
}, ''); };
exports.default = exports.transform;
