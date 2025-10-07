"use client";

import Image from "next/image";
import PropTypes from "prop-types";

import { cn } from "@/lib/utils";

/**
 * ResponsiveImage is a thin wrapper around Next.js' {@link Image} component that simplifies
 * rendering optimized images while preserving Tailwind based sizing utilities.
 * It supports both fixed-dimension and `fill` layouts so that existing CSS driven
 * layouts can keep working after migrating away from the native `<img>` element
 * required by the ESLint `@next/next/no-img-element` rule.
 *
 * @param {object} props - Component props.
 * @param {string|null|undefined} props.src - Source URL of the image. When falsy a placeholder is used.
 * @param {string} props.alt - Accessible alternative text describing the image content.
 * @param {string} [props.className] - Additional classes applied to the container when using `fill` layout or directly to the image otherwise.
 * @param {string} [props.imageClassName] - Extra classes applied to the `Image` element.
 * @param {number} [props.width=800] - Width used for the fixed layout in pixels.
 * @param {number} [props.height=600] - Height used for the fixed layout in pixels.
 * @param {boolean} [props.fill=false] - Whether the image should fill its container.
 * @param {string} [props.sizes="100vw"] - The responsive sizes attribute forwarded to Next.js.
 * @param {boolean} [props.priority=false] - Whether the image should be considered high priority by Next.js.
 * @param {boolean} [props.unoptimized=true] - Disables Next.js optimisations to support arbitrary remote hosts.
 * @param {string} [props.fallbackSrc="/images/placeholder.jpg"] - Fallback URL if `src` is not provided.
 * @returns {JSX.Element} A responsive image element leveraging Next.js optimisations when possible.
 */
export function ResponsiveImage({
  src,
  alt,
  className,
  imageClassName,
  width = 800,
  height = 600,
  fill = false,
  sizes = "100vw",
  priority = false,
  unoptimized = true,
  fallbackSrc = "/images/placeholder.jpg",
}) {
  const resolvedSrc = src || fallbackSrc;

  if (fill) {
    return (
      <div className={cn("relative", className)}>
        <Image
          src={resolvedSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={unoptimized}
          className={cn("object-cover", imageClassName)}
        />
      </div>
    );
  }

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      unoptimized={unoptimized}
      className={imageClassName ? cn(imageClassName, className) : className}
    />
  );
}

ResponsiveImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  imageClassName: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.bool,
  sizes: PropTypes.string,
  priority: PropTypes.bool,
  unoptimized: PropTypes.bool,
  fallbackSrc: PropTypes.string,
};

export default ResponsiveImage;
