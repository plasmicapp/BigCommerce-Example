import * as React from 'react';
import { PlasmicCanvasHost } from '@plasmicapp/loader-nextjs';
import { PLASMIC } from 'plasmic-init';
import { registerAll } from "@plasmicpkgs/commerce"
import { registerCommerceProvider } from '@/commerce/shopify';
import { registerCommerceProvider as registerBigCommerce } from '@/commerce/bigcommerce';
export default function PlasmicHost() {
  return PLASMIC && <PlasmicCanvasHost />;
}

registerAll(PLASMIC);
// registerCommerceProvider(PLASMIC);
registerBigCommerce(PLASMIC);

