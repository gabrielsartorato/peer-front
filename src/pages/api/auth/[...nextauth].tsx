import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId:
        "579400357447-25n5pbi22pp7j19aglhc0bng43991tth.apps.googleusercontent.com",
      clientSecret: "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",
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
});
