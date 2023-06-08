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
      defaultValue: "eons8ty1ru4f7zcw1ny9b6vce3bpao0"
    },
    clientName: {
      type: "string",
      defaultValue: "Plasmic Test"
    },
    clientId: {
      type: "string",
      defaultValue: "ca7eeef8x6p75goyyd2ujbce29sq8an"
    },
    clientSecret: {
      type: "string",
      defaultValue: "a2fb4256d8e111a8ab6b42b53bfb876a9fbf6672cd91a03bd137a5b7b4f9ad0c"
    },
    channelId: {
      type: "number",
      defaultValue: 1
    },
    storeHash: {
      type: "string",
      defaultValue: "upbtcjj27c"
    },
    storeFrontApiToken: {
      type: "string",
      defaultValue: "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJjaWQiOjEsImNvcnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwIl0sImVhdCI6MTY5Njc4NDcwOCwiaWF0IjoxNjg2MjMzMjExLCJpc3MiOiJCQyIsInNpZCI6MTAwMjk1MTI3Mywic3ViIjoiY2E3ZWVlZjh4NnA3NWdveXlkMnVqYmNlMjlzcThhbiIsInN1Yl90eXBlIjoyLCJ0b2tlbl90eXBlIjoxfQ.p9o7jtDdCDBhS-gazIG2_A2U_cTN2zvmaO7N1dmcbAOc1xYphnuLRjqkWz38q1gW3rcm5dZXPhiUpP7YBS05NA",
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
