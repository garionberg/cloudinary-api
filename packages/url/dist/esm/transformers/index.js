import { TRANSFORMERS } from '../constants';
import { AcceptNumbericVars } from '../constants/arithmetic';
import { condition } from './condition';
import { effect } from './effect';
import { formatValue } from './expression';
import { flags } from './flags';
import { rawTransformation } from './rawTransformation';
import { variables } from './variables';
import { fps } from './video/fps';
import { offset } from './video/offset';
import { resize } from './resize';
import { border } from './border';
import { position } from './position';
export var getResize = function (options) {
    var hasResize = options.resize || options.width || options.height || options.aspectRatio;
    if (!hasResize)
        return '';
    return resize(options.resize || { width: options.width, height: options.height, type: options.crop, aspectRatio: options.aspectRatio });
};
export var getBorder = function (options) {
    if (!options.border)
        return '';
    var borderModification = (typeof options.border === 'string') ? "bo_" + options.border : border(options.border);
    return borderModification;
};
export var getPosition = function (options) {
    if (!options.x && !options.y && !options.position)
        return '';
    return position(options.position || { x: options.x, y: options.y });
};
export var getTransformations = function (options) {
    var result = [];
    result.push(variables(options.variables));
    result.push(getResize(options));
    result.push(getBorder(options));
    result.push(getPosition(options));
    result.push(fps(options.fps));
    result.push(offset(options.offset));
    for (var modifier in options) {
        var value = options[modifier];
        var mapping = TRANSFORMERS[modifier];
        if (!mapping || !value)
            continue;
        var isAcceptedNumberic = AcceptNumbericVars.includes(modifier);
        result.push(mapping + "_" + (isAcceptedNumberic ? formatValue(value) : value));
    }
    result.push(effect(options.effect));
    result.push(flags(options.flags));
    result.push(rawTransformation(options.rawTransformation));
    result.push(condition(options.condition));
    return result.filter(Boolean);
};
export var transform = function (options) {
    var transformations = getTransformations(options);
    var chainedTransformations = options.transformation || options.chaining;
    if (chainedTransformations && Array.isArray(chainedTransformations)) {
        chainedTransformations.forEach(function (chained) {
            var chainedTransformation = getTransformations(chained);
            chainedTransformation.length > 0 && transformations.push(chainedTransformation);
        });
    }
    return transformations.filter(Boolean);
};
export var toTransformationStr = function (transformations) { return transformations.reduce(function (str, transformation) {
    var isChained = Array.isArray(transformation);
    var separation = isChained ? '/' : ',';
    return "" + str + (str ? separation : '') + transformation.toString();
}, ''); };
export default transform;
