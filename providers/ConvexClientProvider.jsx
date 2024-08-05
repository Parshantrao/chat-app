"use client";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import React from "react";
import Loader from "@/components/loader/Loader";

const ConvexClientProvider = ({ children }) => {
  const URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";
  const convex = new ConvexReactClient(URL);

  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Authenticated>
          {children}
          </Authenticated>
        <AuthLoading>
          <Loader />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

export default ConvexClientProvider;
