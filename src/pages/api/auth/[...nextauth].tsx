import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import Auth0Provider from "next-auth/providers/auth0";

export default NextAuth({
  providers: [
    Auth0Provider({
      clientId: "DwioiC9zjC4uTA0YDr6e39SgmSa4ipwP",
      clientSecret:
        "xhDtyiH2ZOPM51LVznYXh-nPsPa-tPaeGBaluRPvEVrhsewZ3tJ958YR3isQFzdm",
      issuer: "https://dev-krw8tp89.us.auth0.com",
    }),
  ],
});
