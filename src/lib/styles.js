import objectAssign from 'object-assign';
import isEqual from 'fast-deep-equal';
import {EnlargedImageOrientation} from "../prop-types/EnlargedImage";
import {ENLARGED_IMAGE_ORIENTATION} from "../constants";

export function getContainerStyle(smallImage, userSpecifiedStyle) {
    const {
        isFluidWidth: isSmallImageFluidWidth,
        width,
        height,
    } = smallImage;

    const fluidWidthContainerStyle = {
        width: 'auto',
        height: 'auto',
        fontSize: '0px',
        position: 'relative',
    };

    const fixedWidthContainerStyle = {
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
    };

    const priorityContainerStyle = isSmallImageFluidWidth
        ? fluidWidthContainerStyle
        : fixedWidthContainerStyle;

    const compositContainerStyle = objectAssign(
        {cursor: 'crosshair'},
        userSpecifiedStyle,
        priorityContainerStyle,
    );

    return compositContainerStyle;
}

export function getSmallImageStyle(smallImage, style) {
    const {
        isFluidWidth: isSmallImageFluidWidth,
        width,
        height,
    } = smallImage;

    const fluidWidthSmallImageStyle = {
        width: '100%',
        height: 'auto',
        display: 'block',
        pointerEvents: 'none',
    };

    const fixedWidthSmallImageStyle = {
        width: `${width}px`,
        height: `${height}px`,
        pointerEvents: 'none',
    };

    const prioritySmallImageStyle = isSmallImageFluidWidth
        ? fluidWidthSmallImageStyle
        : fixedWidthSmallImageStyle;

    const compositSmallImageStyle = objectAssign(
        {},
        style,
        prioritySmallImageStyle,
    );

    return compositSmallImageStyle;
}

function getPrimaryEnlargedImageContainerStyle(isInPlaceMode, isPortalRendered, orientation) {
    const baseContainerStyle = {
        overflow: 'hidden',
    };

    if (isPortalRendered) {
        return baseContainerStyle;
    }

    const sharedPositionStyle = {
        position: 'absolute',
        top: '0px',
    };

    if (isInPlaceMode) {
        return objectAssign(
            baseContainerStyle,
            sharedPositionStyle,
            {left: '0px'},
        );
    }

    const position = orientation == ENLARGED_IMAGE_ORIENTATION.right ? {
        left: '100%',
        marginLeft: '10px',
    } : {
        right: '100%',
        marginRight: '10px',
    };

    return objectAssign(
        baseContainerStyle,
        sharedPositionStyle,
        position,
        {
            border: '1px solid #d6d6d6',
        },
    );
}

function getPriorityEnlargedImageContainerStyle(params) {
    const {
        containerDimensions,
        fadeDurationInMs,
        isTransitionActive,
    } = params;

    return {
        width: containerDimensions.width,
        height: containerDimensions.height,
        opacity: isTransitionActive ? 1 : 0,
        transition: `opacity ${fadeDurationInMs}ms ease-in`,
        pointerEvents: 'none',
    };
}

const enlargedImageContainerStyleCache = {};

export function getEnlargedImageContainerStyle(params) {
    const cache = enlargedImageContainerStyleCache;

    const {
        params: memoizedParams = {},
        compositStyle: memoizedStyle,
    } = cache;

    if (isEqual(memoizedParams, params)) {
        return memoizedStyle;
    }

    const {
        containerDimensions,
        containerStyle: userSpecifiedStyle,
        fadeDurationInMs,
        isTransitionActive,
        isInPlaceMode,
        enlargedImageOrientation,
        isPortalRendered,
    } = params;

    const primaryStyle = getPrimaryEnlargedImageContainerStyle(isInPlaceMode, isPortalRendered, enlargedImageOrientation);
    const priorityStyle = getPriorityEnlargedImageContainerStyle({
        containerDimensions,
        fadeDurationInMs,
        isTransitionActive,
    });

    cache.compositStyle = objectAssign(
        {},
        primaryStyle,
        userSpecifiedStyle,
        priorityStyle,
    );
    cache.params = params;

    return cache.compositStyle;
}

export function getEnlargedImageStyle(params) {
    const {
        imageCoordinates,
        imageStyle: userSpecifiedStyle,
        largeImage,
    } = params;

    const translate = `translate(${imageCoordinates.x}px, ${imageCoordinates.y}px)`;

    const priorityStyle = {
        width: largeImage.width,
        height: largeImage.height,
        transform: translate,
        WebkitTransform: translate,
        msTransform: translate,
        pointerEvents: 'none',
    };

    const compositeImageStyle = objectAssign(
        {},
        userSpecifiedStyle,
        priorityStyle,
    );

    return compositeImageStyle;
}
