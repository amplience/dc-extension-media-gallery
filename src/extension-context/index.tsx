import React, { useEffect, useState, useContext, ReactNode } from "react";
import { getSdk } from "./extension-sdk";
import { ContentFieldExtension } from 'dc-extensions-sdk';
import Params from "./params";
import { defaultMetadataMap } from "../model/conversion";

interface ExtensionContextData {
  params: Params,
  field?: any,
  sdk?: ContentFieldExtension,
  oldConfig?: any,
  setField?: () => void
}

const defaultParams = {
  clientId: '',
  clientSecret: '',
  configPath: 'galleryConfig',
  galleryPath: 'photoGallery',
  metadataMap: defaultMetadataMap,
};

const defaultExtensionState = {
  params: {
    ...defaultParams,
  }
};

const ExtensionContext = React.createContext<ExtensionContextData>(defaultExtensionState);

export function ExtensionContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ExtensionContextData>(defaultExtensionState);

  useEffect(() => {
    getSdk().then(async (sdk) => {
      sdk.frame.startAutoResizer();
      const field: any = await sdk.field.getValue();
      const params: Params = {
        ...defaultParams,
        ...sdk.params.installation,
        ...sdk.params.instance,
      };

      const oldConfig = field[params.configPath];

      let state: ExtensionContextData = {
        ...defaultExtensionState,
        field,
        sdk,
        params,
        oldConfig: { ...oldConfig }
      };

      state.setField = () => {
        sdk.field.setValue(state.field);
      };

      setState({ ...state });
    });
  }, [setState]);

  return (
    <ExtensionContext.Provider value={state}>
      {children}
    </ExtensionContext.Provider>
  );
}

export function useExtension() {
  return useContext(ExtensionContext);
}
