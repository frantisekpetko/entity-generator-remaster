import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import * as React from "react";

const LazyImage = (
    { image }:
        {
            image: {
                alt: string,
                src: string,
                width?: number,
                height?: number
            }
        }
) => (
    <LazyLoadImage
        alt={image.alt}
        effect="blur"
        src={image.src}
        width={image.width}
        height={image.height}
    />
);

export default LazyImage;