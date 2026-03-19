import React, { lazy } from "react";

export const DESIGN_REGISTRY: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  "avant-garde": lazy(() => import("./avant-garde")),
  "swiss-grid": lazy(() => import("./swiss-grid")),
  "fintech": lazy(() => import("./fintech")),
  "geometric": lazy(() => import("./geometric")),
  "architect": lazy(() => import("./architect")),
  "creator": lazy(() => import("./creator")),
  "watercolor": lazy(() => import("./watercolor")),
  "oil-portrait": lazy(() => import("./oil-portrait")),
  "ink-fusion": lazy(() => import("./ink-fusion")),
};
