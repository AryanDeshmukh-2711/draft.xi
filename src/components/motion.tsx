"use client";

import { animate, motion, useMotionValue, useTransform, type Variants } from "motion/react";
import { useEffect, useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

export const riseIn: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

/** Fades and lifts into place the first time it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Wraps a list so its children arrive one after another. */
export function StaggerList({
  children,
  className,
  inView = true,
}: {
  children: React.ReactNode;
  className?: string;
  inView?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={stagger}
      initial="hidden"
      {...(inView
        ? { whileInView: "show", viewport: { once: true, margin: "-40px" } }
        : { animate: "show" })}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={riseIn}>
      {children}
    </motion.div>
  );
}

/**
 * Counts from the previous value to the new one instead of snapping.
 *
 * The motion value starts *at* the target and is only wound back to animate,
 * so a run that never finishes — a hidden tab stops firing animation frames —
 * still leaves the correct number on screen rather than a half-counted one.
 */
export function CountUp({ value, duration = 0.8 }: { value: number; duration?: number }) {
  const raw = useMotionValue(value);
  const rounded = useTransform(raw, (current) => Math.round(current));
  const previous = useRef<number | null>(null);

  useEffect(() => {
    const from = previous.current ?? 0;
    previous.current = value;

    if (from === value) return;
    if (typeof document !== "undefined" && document.hidden) {
      raw.set(value);
      return;
    }

    raw.set(from);
    const controls = animate(raw, value, { duration, ease });

    return () => {
      controls.stop();
      raw.set(value);
    };
  }, [raw, value, duration]);

  return <motion.span>{rounded}</motion.span>;
}

export { motion };
