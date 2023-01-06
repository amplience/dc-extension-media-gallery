import React, { useEffect, useState, useContext, ReactNode } from "react";
import { getSdk } from "./extension-sdk";
import { ContentFieldExtension } from 'dc-extensions-sdk';
import Params from "./params";

interface ExtensionContextData {
  params: Params,
  field?: any,
  sdk?: ContentFieldExtension,
  setField?: () => void
}

const defaultParams = {
  clientId: '',
  clientSecret: '',
  configPath: 'galleryConfig',
  galleryPath: 'photoGallery',
  exifMap: {}
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
      const field = await sdk.field.getValue();
      const params: Params = {
        ...defaultParams,
        ...sdk.params.installation,
        ...sdk.params.instance,
      };

      let state: ExtensionContextData = {
        ...defaultExtensionState,
        field,
        sdk,
        params
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
