import * as React from 'react';
import { PlasmicCanvasHost } from '@plasmicapp/host';
import { registerAll } from "@plasmicpkgs/commerce"
import { registerCommerceProvider as registerBigCommerce } from '@/commerce/bigcommerce';
export default function PlasmicHost() {
  return <PlasmicCanvasHost />;
}

registerAll();
registerBigCommerce();

