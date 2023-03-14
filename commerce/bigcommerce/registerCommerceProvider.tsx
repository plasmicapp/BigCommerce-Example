import { GlobalContextMeta } from "@plasmicapp/host";
import registerGlobalContext from "@plasmicapp/host/registerGlobalContext";
import React from "react";
import { Registerable } from "./registerable";
import { getCommerceProvider } from "./bigcommerce";
import { BigCommerceCredentials } from "./provider";

interface CommerceProviderProps {
  children?: React.ReactNode;
  accessToken: string;
  clientName: string;
  clientId: string;
  clientSecret: string;
  channelId: number;
  storeHash: string;
  storeFrontApiToken: string;
}
export const commerceProviderMeta: GlobalContextMeta<CommerceProviderProps> = {
  name: "plasmic-commerce-bigcommerce-provider",
  displayName: "Bigcommerce Provider",
  props: {
    accessToken: {
      type: "string",
      defaultValue: "zyty8y66wgnjhov3xko5neimm9waqu"
    },
    clientName: {
      type: "string",
      defaultValue: "David"
    },
    clientId: {
      type: "string",
      defaultValue: "ey4rzqfy84m696cprvxhnomaarvg0nm"
    },
    clientSecret: {
      type: "string",
      defaultValue: "9bc59dd1a232bce7d4be8db37ff91d2093bf6b8dcde7d91e4f69391284ed7fc7"
    },
    channelId: {
      type: "number",
      defaultValue: 1344465
    },
    storeHash: {
      type: "string",
      defaultValue: "y9qp9pxpug"
    },
    storeFrontApiToken: {
      type: "string",
      defaultValue: "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJjaWQiOjEsImNvcnMiOlsiaHR0cHM6Ly9kZXZlbG9wZXIuYmlnY29tbWVyY2UuY29tIl0sImVhdCI6MTY3NzY3MjU0MCwiaWF0IjoxNjc3NDk5NzQwLCJpc3MiOiJCQyIsInNpZCI6MTAwMjg1OTgxNSwic3ViIjoiYmNhcHAubGlua2VyZCIsInN1Yl90eXBlIjowLCJ0b2tlbl90eXBlIjoxfQ.vxQpvMzAftRHdF4lG1U0WlDjqjpISvcRvgWNeeAKX3aZb63RhTM6t4f-r2xykt1KHbnNjBC4NiZPUwqH8Nd0_Q",
    },
  },
  description: `Get your BigCommerce Credentials from the bigcommerce admin UI under Developer > Settings > API accounts`,
  importPath: "./commerce/bigcommerce/registerCommerceProvider",
  importName: "CommerceProviderComponent",
};

export function CommerceProviderComponent(props: CommerceProviderProps) {
  const { accessToken, clientName, clientId, clientSecret, channelId, storeHash, storeFrontApiToken, children } = props
  const creds: BigCommerceCredentials = { 
    storeFrontApiUrl: `https://store-${storeHash}.mybigcommerce.com/graphql`,
    storeFrontApiToken,
    storeApiUrl: `https://api.bigcommerce.com/stores/${storeHash}`,
    storeApiToken: accessToken,
    storeApiClientId: clientId,
    storeChannelId: channelId,
    storeUrl: `https://store-${storeHash}.mybigcommerce.com`,
    storeHash,
    storeApiClientSecret: clientSecret,
    clientName
  };
  const CommerceProvider = getCommerceProvider(creds);

  return <CommerceProvider>{children}</CommerceProvider>;
}

export function registerCommerceProvider(
  loader?: Registerable,
  customCommerceProviderMeta?: GlobalContextMeta<CommerceProviderProps>
) {
  const doRegisterComponent: typeof registerGlobalContext = (...args) =>
    loader
      ? loader.registerGlobalContext(...args)
      : registerGlobalContext(...args);
  doRegisterComponent(
    CommerceProviderComponent,
    customCommerceProviderMeta ?? commerceProviderMeta
  );
}
