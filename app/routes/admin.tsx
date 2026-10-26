import { Studio } from "sanity";
import type { MetaFunction } from "@remix-run/node";
import sanityConfig from "../sanity.config";

export const meta: MetaFunction = () => [
  { title: "Sanity Studio — Impervious Generation" },
];

export default function Admin() {
  return <Studio config={sanityConfig} />;
}
