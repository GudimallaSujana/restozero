import { motion } from "framer-motion";
import clsx from "clsx";
import type { ReactNode } from "react";

export default function Card({
  title,
  children,
  className
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx("glass rounded-2xl p-4 md:p-5", className)}
    >
      {title ? <h3 className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-300">{title}</h3> : null}
      {children}
    </motion.section>
  );
}
