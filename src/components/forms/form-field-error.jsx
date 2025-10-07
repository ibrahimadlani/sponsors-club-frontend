"use client";

import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";
import { XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * FormFieldError renders an animated inline error indicator optionally accompanied by a message.
 * It centralises the animation logic shared by several forms to keep the JSX focused on business rules.
 *
 * @param {object} props - Component props.
 * @param {string} [props.message] - Validation message displayed below the input.
 * @param {boolean} [props.showIcon=true] - Whether the error icon should be displayed alongside the field label.
 * @param {string} [props.className] - Additional Tailwind classes applied to the wrapper element.
* @param {string} [props.iconClassName] - Extra classes applied to the error icon container.
 * @param {boolean} [props.showMessage=true] - Whether the inline error message should accompany the icon.
 * @returns {JSX.Element|null} Animated error indicator and message.
 */
export default function FormFieldError({
  message,
  showIcon = true,
  className,
  iconClassName,
  showMessage = true,
}) {
  if (!message && !showIcon) {
    return null;
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <AnimatePresence>
        {showIcon && message ? (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.2 }}
            className={cn("flex items-center text-destructive", iconClassName)}
          >
            <XCircle className="mr-1 h-4 w-4" />
            {showMessage ? <span className="text-xs font-medium">{message}</span> : null}
          </motion.span>
        ) : null}
      </AnimatePresence>
      {!showIcon && message ? (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="text-xs font-medium text-destructive"
        >
          {message}
        </motion.p>
      ) : null}
    </div>
  );
}

FormFieldError.propTypes = {
  message: PropTypes.string,
  showIcon: PropTypes.bool,
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  showMessage: PropTypes.bool,
};
