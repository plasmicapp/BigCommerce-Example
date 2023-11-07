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
      defaultValue: "2g9y8o40j64hdw0pnll2akjl264cq4x"
    },
    clientName: {
      type: "string",
      defaultValue: "Plasmic Test"
    },
    clientId: {
      type: "string",
      defaultValue: "evwct4703bdbwku1j6fyxgybm4gzad4"
    },
    clientSecret: {
      type: "string",
      defaultValue: "e879e6799b619c624e0dfa2a08fc6b107926c76149905aa3b2c4d52175127cd9"
    },
    channelId: {
      type: "number",
      defaultValue: 1
    },
    storeHash: {
      type: "string",
      defaultValue: "dxrfetqrff"
    },
    storeFrontApiToken: {
      type: "string",
      defaultValue: "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJjaWQiOjEsImNvcnMiOlsiaHR0cHM6Ly9sb2NhbGhvc3QiXSwiZWF0IjoxNjk5OTY1NzQwLCJpYXQiOjE2OTkzNjA5NDEsImlzcyI6IkJDIiwic2lkIjoxMDAyNDM5Nzc1LCJzdWIiOiJldndjdDQ3MDNiZGJ3a3UxajZmeXhneWJtNGd6YWQ0Iiwic3ViX3R5cGUiOjIsInRva2VuX3R5cGUiOjF9.KKQBcrMpqsoF3fNoDv7QSTmbbzovFUXH7kLHVX4M-1ni2uzBTu_Z6xg5FdNLsrXytWYLuZuB5CfziFQp2xEv4g",
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
